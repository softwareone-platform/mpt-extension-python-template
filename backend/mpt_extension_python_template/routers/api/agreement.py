from mpt_extension_sdk.api import APIResponse, PaginatedResult
from mpt_extension_sdk.api.context import APIContext
from mpt_extension_sdk.routing import APIRouter

agreements_router = APIRouter(prefix="/api/v2/agreements")


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
    agreement = await ctx.mpt_api_service.agreements.get_by_id(agreement_id)
    return APIResponse.ok(payload=agreement.to_dict())


@agreements_router.post(path="/{agreement_id}/sync", name="agreements-sync")
async def sync_agreement(agreement_id: str, ctx: APIContext) -> APIResponse:
    """Synchronize an agreement view with the current Marketplace data."""
    agreement = await ctx.mpt_api_service.agreements.get_by_id(agreement_id)
    return APIResponse.ok(payload=agreement.to_dict())
