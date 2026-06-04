from mpt_api_client.models.meta import Pagination
from mpt_api_client.resources.commerce.agreements import Agreement
from mpt_extension_sdk.api.context import APIContext
from mpt_extension_sdk.services.mpt_api_service.base import PaginatedCollection

from swo_playground.routers.api.agreement import (
    get_agreement,
    get_agreements,
    sync_agreement,
)


async def test_get_reads_marketplace(mocker, agreement_payload):
    agreement = mocker.Mock(spec=Agreement)
    agreement.to_dict.return_value = agreement_payload
    get_by_id = mocker.AsyncMock(return_value=agreement)
    ctx = mocker.Mock(spec=APIContext)
    ctx.mpt_api_service = mocker.Mock(agreements=mocker.Mock(get_by_id=get_by_id))

    result = await get_agreement("AGR-1234-5678", ctx)

    get_by_id.assert_awaited_once_with("AGR-1234-5678")
    assert result.payload == agreement_payload


async def test_sync_reads_marketplace(mocker, agreement_payload):
    agreement = mocker.Mock(spec=Agreement)
    agreement.to_dict.return_value = agreement_payload
    get_by_id = mocker.AsyncMock(return_value=agreement)
    ctx = mocker.Mock(spec=APIContext)
    ctx.mpt_api_service = mocker.Mock(agreements=mocker.Mock(get_by_id=get_by_id))

    result = await sync_agreement("AGR-1234-5678", ctx)

    get_by_id.assert_awaited_once_with("AGR-1234-5678")
    assert result.payload == agreement_payload


async def test_get_agreements_paginated(mocker, agreement_payload):
    page = mocker.Mock(spec=PaginatedCollection, resources=[agreement_payload], total=1)
    get_all = mocker.AsyncMock(return_value=page)
    pagination = mocker.Mock(spec=Pagination, offset=0, limit=10)
    ctx = mocker.Mock(spec=APIContext)
    ctx.request = mocker.Mock(pagination=pagination)
    ctx.mpt_api_service = mocker.Mock(agreements=mocker.Mock(get_all=get_all))

    result = await get_agreements(ctx)  # act

    get_all.assert_awaited_once_with(offset=0, limit=10)
    assert result.payload == [agreement_payload]
    assert result.paginated_result.total == 1
    assert result.paginated_result.offset == 0
    assert result.paginated_result.limit == 10
