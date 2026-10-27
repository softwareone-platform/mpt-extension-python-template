import asyncio
from http import HTTPStatus

from mpt_api_client.exceptions import MPTHttpError
from mpt_extension_sdk import TaskTimeouts
from mpt_extension_sdk.api import APIResponse, PaginatedResult, TaskResult
from mpt_extension_sdk.api.context import APIContext
from mpt_extension_sdk.api.errors import NotFoundError
from mpt_extension_sdk.models import Agreement
from mpt_extension_sdk.routing import APIRouter
from mpt_extension_sdk.schemas import BaseSchema
from mpt_extension_sdk.tasks import TaskHandle
from pydantic import Field

agreements_router = APIRouter(prefix="/api/v2/agreements")

# The deferred sync reports progress one step per percent while it waits, and 100 % once
# it has synced. The wait is long on purpose: it outlasts the 300-second Delay the SDK
# answers the first delivery with, so the Extension Service delivers the task again while
# the handler is still processing.
PROGRESS_INTERVAL_SECONDS = 4
FULL_PROGRESS = 100
# The whole handler must fit in this budget, declared on the route. The platform finalizes
# a task that runs longer, and the SDK keeps 60 of these seconds as its own safety margin
# before that deadline, so the sync itself gets the rest.
SYNC_HEADROOM_SECONDS = 120
DEFERRED_SYNC_MAX_PROCESSING_SECONDS = (
    PROGRESS_INTERVAL_SECONDS * (FULL_PROGRESS - 1) + SYNC_HEADROOM_SECONDS
)


class SyncAgreementPayload(BaseSchema):
    """Body of the sync call: a deferrable route cannot take the id in the path.

    The id is a path segment of every Marketplace call the handler makes, and the
    API client does not escape it, so the pattern keeps separators out of it.
    """

    agreement_id: str = Field(alias="agreementId", min_length=1, pattern=r"^[A-Za-z0-9-]+$")


@agreements_router.get("/", name="agreements-list")
async def get_agreements(ctx: APIContext) -> APIResponse:
    """Return paginated mock agreements."""
    pagination = ctx.request.pagination
    page = await ctx.mpt_api_service.agreements.get_all(
        offset=pagination.offset, limit=pagination.limit
    )
    result = PaginatedResult.from_pagination(pagination, payload=page.resources, total=page.total)
    return APIResponse.paginated(result)


@agreements_router.get(path="/{agreement_id}", name="agreements-get")
async def get_agreement(agreement_id: str, ctx: APIContext) -> APIResponse:
    """Return the current Marketplace data for a single agreement."""
    try:
        agreement = await ctx.mpt_api_service.agreements.get_by_id(agreement_id)
    except MPTHttpError as error:
        if error.status_code != HTTPStatus.NOT_FOUND:
            raise
        raise NotFoundError(f"Agreement {agreement_id} not found") from error
    return APIResponse.ok(payload=agreement.to_dict())


@agreements_router.post(
    path="/sync",
    name="agreements-sync",
    body_validator=SyncAgreementPayload,
    deferrable=True,
    timeouts=TaskTimeouts(max_task_processing=DEFERRED_SYNC_MAX_PROCESSING_SECONDS),
)
async def sync_agreement(
    payload: SyncAgreementPayload, ctx: APIContext
) -> APIResponse | TaskResult:
    """Synchronize an agreement view with the current Marketplace data.

    Writes `externalIds.vendor` as the vendor, the only agreement key a client or
    operations account cannot touch. It writes back the value already there, so the
    example changes no data.

    The route is deferrable. A plain call syncs and answers with the agreement.
    A call with `MPT-Async: true` runs as a platform Task: it sleeps, reporting
    progress, syncs at the end and returns a result pointing at the agreement.
    The sleep is deliberate — it lasts long enough for the Extension Service to
    deliver the same task again while this execution is still running, which is
    the redelivery an extension has to tolerate.
    """
    agreement_id = payload.agreement_id
    if ctx.task is None:
        agreement = await _sync_vendor_external_id(ctx, agreement_id)
        return APIResponse.ok(payload=agreement.to_dict())

    await ctx.task.log(
        "Agreement sync for {{AgreementId}} waits for the redelivery before it runs",
        parameters={"AgreementId": agreement_id},
    )
    await _wait_reporting_progress(ctx.task)
    await _sync_vendor_external_id(ctx, agreement_id)
    await ctx.task.progress(FULL_PROGRESS)
    return TaskResult.reference(f"/public/v1/commerce/agreements/{agreement_id}")


async def _sync_vendor_external_id(ctx: APIContext, agreement_id: str) -> Agreement:
    agreement = await ctx.mpt_api_service.agreements.get_by_id(agreement_id)
    await ctx.vendor_mpt_api_service.agreements.update(
        agreement_id, {"externalIds": {"vendor": agreement.external_ids.vendor}}
    )
    return agreement


async def _wait_reporting_progress(task: TaskHandle) -> None:
    for progress in range(1, FULL_PROGRESS):
        await asyncio.sleep(PROGRESS_INTERVAL_SECONDS)  # noqa: WPS476
        await task.progress(progress)  # noqa: WPS476
