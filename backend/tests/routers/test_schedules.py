import datetime as dt
from logging import Logger

import pytest
from mpt_extension_sdk.models import Agreement
from mpt_extension_sdk.pipeline import ScheduleContext, ScheduleMetadata, ScheduleTaskHandle
from mpt_extension_sdk.services.mpt_api_service.base import PaginatedCollection

from mpt_extension_python_template.routers.schedules.agreement import (
    AGREEMENTS_PAGE_SIZE,
    FULL_PROGRESS,
    sync_agreements,
)

HALFWAY_PROGRESS = 50.0
ENQUEUE_TIME = dt.datetime.fromisoformat("2026-01-01T00:00:00Z")


@pytest.fixture
def schedule_context_factory(mocker, mpt_api_service, vendor_mpt_api_service):
    def factory(agreement_ids):
        agreements = [
            mocker.Mock(spec=Agreement, id=agreement_id) for agreement_id in agreement_ids
        ]
        ctx = mocker.create_autospec(ScheduleContext, instance=True)
        ctx.logger = mocker.create_autospec(Logger, instance=True)
        ctx.meta = ScheduleMetadata(
            enqueue_time=ENQUEUE_TIME,
            event_id="EVT-1111-1111",
            schedule_id="agreements.sync",
            task_id="TSK-1111-1111",
        )
        ctx.task = mocker.create_autospec(ScheduleTaskHandle, instance=True)
        ctx.mpt_api_service = mpt_api_service
        ctx.vendor_mpt_api_service = vendor_mpt_api_service
        vendor_mpt_api_service.agreements.get_all.return_value = PaginatedCollection(
            limit=AGREEMENTS_PAGE_SIZE, offset=0, resources=agreements, total=len(agreements)
        )
        return ctx

    return factory


async def test_sync_reads_the_vendor_agreements(schedule_context_factory):
    ctx = schedule_context_factory(["AGR-1"])

    await sync_agreements(ctx)  # act

    ctx.vendor_mpt_api_service.agreements.get_all.assert_awaited_once_with(
        limit=AGREEMENTS_PAGE_SIZE
    )


async def test_sync_ignores_the_calling_account(schedule_context_factory):
    ctx = schedule_context_factory(["AGR-1"])

    await sync_agreements(ctx)  # act

    ctx.mpt_api_service.agreements.get_all.assert_not_awaited()


async def test_sync_reports_progress_per_agreement(mocker, schedule_context_factory):
    ctx = schedule_context_factory(["AGR-1", "AGR-2"])

    await sync_agreements(ctx)  # act

    assert ctx.task.progress.await_args_list == [
        mocker.call(HALFWAY_PROGRESS),
        mocker.call(FULL_PROGRESS),
    ]


async def test_sync_logs_each_synchronized_agreement(schedule_context_factory):
    ctx = schedule_context_factory(["AGR-1"])

    await sync_agreements(ctx)  # act

    ctx.logger.info.assert_any_call("%s - Example vendor agreement synchronized.", "AGR-1")


async def test_sync_without_agreements(schedule_context_factory):
    ctx = schedule_context_factory([])

    await sync_agreements(ctx)  # act

    ctx.task.progress.assert_awaited_once_with(FULL_PROGRESS)
