import pytest
from mpt_api_client.models.meta import Pagination
from mpt_extension_sdk.api.context import APIContext, AuthenticatedRequestContext
from mpt_extension_sdk.services.mpt_api_service import MPTAPIService
from mpt_extension_sdk.services.mpt_api_service.agreement import AgreementService


@pytest.fixture
def mpt_api_service_factory(mocker):
    def factory():
        service = mocker.create_autospec(MPTAPIService, instance=True)
        service.agreements = mocker.create_autospec(AgreementService, instance=True)
        return service

    return factory


@pytest.fixture
def mpt_api_service(mpt_api_service_factory):
    return mpt_api_service_factory()


@pytest.fixture
def vendor_mpt_api_service(mpt_api_service_factory):
    return mpt_api_service_factory()


@pytest.fixture
def api_context_factory(mocker, mpt_api_service, vendor_mpt_api_service):
    def factory(*, task=None, offset=0, limit=10):
        ctx = mocker.create_autospec(APIContext, instance=True)
        ctx.mpt_api_service = mpt_api_service
        ctx.vendor_mpt_api_service = vendor_mpt_api_service
        ctx.task = task
        ctx.request = mocker.create_autospec(AuthenticatedRequestContext, instance=True)
        ctx.request.pagination = Pagination(offset=offset, limit=limit)
        return ctx

    return factory


@pytest.fixture
def agreement_id(agreement_payload):
    return agreement_payload["id"]


@pytest.fixture
def vendor_external_id():
    return "ABC-2023-C07-dbeee0b302c0"
