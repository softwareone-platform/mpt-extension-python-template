from mpt_extension_sdk.pipeline import ScheduleContext
from mpt_extension_sdk.routing import ScheduleRouter

AGREEMENTS_PAGE_SIZE = 50
FULL_PROGRESS = 100.0

agreements_router = ScheduleRouter(prefix="/schedules/v1/agreements")


@agreements_router.task(
    path="/sync",
    id="agreements.sync",
    name="agreements-sync-schedule",
    description="Read the agreements owned by the extension vendor and report progress.",
    cron="*/15 * * * *",
)
async def sync_agreements(ctx: ScheduleContext) -> None:
    """Walk the vendor agreements on every cron occurrence.

    Only the first page is read, since this is an example. Must stay idempotent:
    a delivery that re-claims the task runs this handler again from the
    beginning.
    """
    ctx.logger.info("Processing schedule id=%s task_id=%s", ctx.meta.schedule_id, ctx.meta.task_id)
    page = await ctx.vendor_mpt_api_service.agreements.get_all(limit=AGREEMENTS_PAGE_SIZE)
    agreements = page.resources
    if not agreements:
        ctx.logger.info("No vendor agreement to synchronize.")
        await ctx.task.progress(FULL_PROGRESS)
        return

    total = len(agreements)
    for position, agreement in enumerate(agreements, start=1):
        ctx.logger.info("%s - Example vendor agreement synchronized.", agreement.id)
        await ctx.task.progress(position / total * FULL_PROGRESS)  # noqa: WPS476
