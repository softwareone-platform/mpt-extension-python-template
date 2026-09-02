import pytest
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
