from http import HTTPStatus

import pytest
from mpt_api_client.exceptions import MPTAPIError
from mpt_extension_sdk.api import TaskResult
from mpt_extension_sdk.api.errors import NotFoundError
from mpt_extension_sdk.models import Agreement
from mpt_extension_sdk.models.external_id import ExternalIds
from mpt_extension_sdk.services.mpt_api_service.base import PaginatedCollection
from mpt_extension_sdk.tasks import TaskHandle
from pydantic import ValidationError

from mpt_extension_python_template.routers.api.agreement import (
    FULL_PROGRESS,
    SyncAgreementPayload,
    get_agreement,
    get_agreements,
    sync_agreement,
)


@pytest.fixture
def agreement_in_mpt(mocker, agreement_payload, vendor_external_id, mpt_api_service):
    agreement = mocker.create_autospec(Agreement, instance=True)
    agreement.to_dict.return_value = agreement_payload
    agreement.external_ids = ExternalIds(vendor=vendor_external_id)
    mpt_api_service.agreements.get_by_id.return_value = agreement
    return agreement


@pytest.fixture
def deferred_context(mocker, api_context_factory):
    return api_context_factory(task=mocker.create_autospec(TaskHandle, instance=True))


@pytest.fixture
def mock_sleep(mocker):
    return mocker.patch(
        "mpt_extension_python_template.routers.api.agreement.asyncio.sleep", autospec=True
    )


async def test_get_reads_marketplace(
    api_context_factory, agreement_id, agreement_in_mpt, agreement_payload
):
    result = await get_agreement(agreement_id, api_context_factory())

    assert result.payload == agreement_payload


async def test_get_maps_marketplace_not_found(api_context_factory, mpt_api_service):
    ctx = api_context_factory()
    mpt_api_service.agreements.get_by_id.side_effect = MPTAPIError(
        HTTPStatus.NOT_FOUND, "Not Found", {"detail": "Entity for given id not-found not found"}
    )

    with pytest.raises(NotFoundError):
        await get_agreement("not-found", ctx)


async def test_get_agreements_paginated(api_context_factory, agreement_payload):
    page = PaginatedCollection(limit=10, offset=0, resources=[agreement_payload], total=2)
    ctx = api_context_factory(offset=0, limit=10)
    ctx.mpt_api_service.agreements.get_all.return_value = page

    result = await get_agreements(ctx)

    ctx.mpt_api_service.agreements.get_all.assert_awaited_once_with(offset=0, limit=10)
    assert result.payload == [agreement_payload]
    assert result.paginated_result.total == 2
    assert result.paginated_result.offset == 0
    assert result.paginated_result.limit == 10


async def test_sync_answers_with_the_agreement(
    api_context_factory, agreement_id, agreement_in_mpt, agreement_payload
):
    result = await sync_agreement(
        SyncAgreementPayload(agreement_id=agreement_id), api_context_factory()
    )

    assert result.payload == agreement_payload


async def test_sync_writes_back_as_the_vendor(
    api_context_factory, agreement_id, agreement_in_mpt, vendor_external_id
):
    ctx = api_context_factory()

    await sync_agreement(SyncAgreementPayload(agreement_id=agreement_id), ctx)  # act

    ctx.vendor_mpt_api_service.agreements.update.assert_awaited_once_with(
        agreement_id, {"externalIds": {"vendor": vendor_external_id}}
    )
    ctx.mpt_api_service.agreements.update.assert_not_awaited()


async def test_sync_deferred_returns_task_result(
    deferred_context, agreement_id, agreement_in_mpt, mock_sleep
):
    result = await sync_agreement(SyncAgreementPayload(agreement_id=agreement_id), deferred_context)

    assert result == TaskResult.reference(f"/public/v1/commerce/agreements/{agreement_id}")


async def test_sync_deferred_logs_the_wait(
    deferred_context, agreement_id, agreement_in_mpt, mock_sleep
):
    await sync_agreement(  # act
        SyncAgreementPayload(agreement_id=agreement_id), deferred_context
    )

    deferred_context.task.log.assert_awaited_once_with(
        "Agreement sync for {{AgreementId}} waits for the redelivery before it runs",
        parameters={"AgreementId": agreement_id},
    )


async def test_sync_deferred_reports_progress(
    deferred_context, agreement_id, agreement_in_mpt, mock_sleep
):
    await sync_agreement(  # act
        SyncAgreementPayload(agreement_id=agreement_id), deferred_context
    )

    reported = [call.args[0] for call in deferred_context.task.progress.await_args_list]
    assert reported == list(range(1, FULL_PROGRESS + 1))
    assert mock_sleep.await_count == FULL_PROGRESS - 1


@pytest.mark.parametrize("unsafe_id", ["", "AGR-1/../other", "AGR 1", "AGR-1/sync"])
def test_sync_payload_rejects_an_unsafe_id(unsafe_id):
    with pytest.raises(ValidationError):
        SyncAgreementPayload(agreement_id=unsafe_id)
