from http import HTTPStatus

import pytest
from mpt_api_client.exceptions import MPTAPIError
from mpt_api_client.models.meta import Pagination
from mpt_extension_sdk.api.context import APIContext, AuthenticatedRequestContext
from mpt_extension_sdk.api.errors import NotFoundError
from mpt_extension_sdk.models import Agreement
from mpt_extension_sdk.models.external_id import ExternalIds
from mpt_extension_sdk.services.mpt_api_service.base import PaginatedCollection

from mpt_extension_python_template.routers.api.agreement import (
    get_agreement,
    get_agreements,
    sync_agreement,
)


async def test_get_reads_marketplace(mocker, agreement_payload, mpt_api_service):
    agreement = mocker.Mock(spec=Agreement)
    agreement.to_dict.return_value = agreement_payload
    ctx = mocker.create_autospec(APIContext, instance=True)
    ctx.mpt_api_service = mpt_api_service
    mpt_api_service.agreements.get_by_id.return_value = agreement

    result = await get_agreement("AGR-1234-5678", ctx)

    mpt_api_service.agreements.get_by_id.assert_awaited_once_with("AGR-1234-5678")
    assert result.payload == agreement_payload


async def test_get_maps_marketplace_not_found(mocker, mpt_api_service):
    ctx = mocker.create_autospec(APIContext, instance=True)
    ctx.mpt_api_service = mpt_api_service
    mpt_api_service.agreements.get_by_id.side_effect = MPTAPIError(
        HTTPStatus.NOT_FOUND, "Not Found", {"detail": "Entity for given id not-found not found"}
    )

    with pytest.raises(NotFoundError):
        await get_agreement("not-found", ctx)


async def test_sync_writes_back_as_the_vendor(
    mocker, agreement_payload, mpt_api_service, vendor_mpt_api_service
):
    agreement = mocker.Mock(spec=Agreement)
    agreement.to_dict.return_value = agreement_payload
    agreement.external_ids = ExternalIds(vendor="ABC-2023-C07-dbeee0b302c0")
    ctx = mocker.create_autospec(APIContext, instance=True)
    ctx.mpt_api_service = mpt_api_service
    ctx.vendor_mpt_api_service = vendor_mpt_api_service
    mpt_api_service.agreements.get_by_id.return_value = agreement

    result = await sync_agreement("AGR-1234-5678", ctx)

    mpt_api_service.agreements.get_by_id.assert_awaited_once_with("AGR-1234-5678")
    vendor_mpt_api_service.agreements.update.assert_awaited_once_with(
        "AGR-1234-5678", {"externalIds": {"vendor": "ABC-2023-C07-dbeee0b302c0"}}
    )
    mpt_api_service.agreements.update.assert_not_awaited()
    assert result.payload == agreement_payload


async def test_get_agreements_paginated(mocker, agreement_payload, mpt_api_service):
    page = mocker.Mock(spec=PaginatedCollection, resources=[agreement_payload], total=1)
    ctx = mocker.create_autospec(APIContext, instance=True)
    ctx.request = mocker.create_autospec(AuthenticatedRequestContext, instance=True)
    ctx.request.pagination = mocker.Mock(spec=Pagination, offset=0, limit=10)
    ctx.mpt_api_service = mpt_api_service
    mpt_api_service.agreements.get_all.return_value = page

    result = await get_agreements(ctx)

    mpt_api_service.agreements.get_all.assert_awaited_once_with(offset=0, limit=10)
    assert result.payload == [agreement_payload]
    assert result.paginated_result.total == 1
    assert result.paginated_result.offset == 0
    assert result.paginated_result.limit == 10
