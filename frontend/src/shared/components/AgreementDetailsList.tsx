import { RegularText } from '@softwareone-platform/sdk-react-ui-v0/text';

import {
  AgreementSyncResult,
  formatCollectionCount,
  formatParameterValue,
  formatReference,
} from '../model';
import { AgreementLoadState } from '../hooks/useAgreement';
import './AgreementDetailsList.scss';

interface AgreementDetailsListProps {
  agreement: AgreementSyncResult | null;
  status: AgreementLoadState;
}

interface DetailRow {
  id: string;
  property: string;
  value: string;
}

function buildBasicRows(agreement: AgreementSyncResult): DetailRow[] {
  const items: { property: string; value: string }[] = [
    { property: 'Order', value: formatReference(agreement.order) },
    { property: 'Licensee', value: formatReference(agreement.licensee ?? agreement.client) },
    { property: 'Buyer', value: formatReference(agreement.buyer) },
    { property: 'Seller', value: formatReference(agreement.seller) },
  ];
  return items.map((item, index) => ({ ...item, id: `basic-${index}` }));
}

function buildSummaryRows(agreement: AgreementSyncResult): DetailRow[] {
  return [
    { id: 'summary-assets', property: 'Assets', value: formatCollectionCount(agreement.assets) },
    {
      id: 'summary-subscriptions',
      property: 'Subscriptions',
      value: formatCollectionCount(agreement.subscriptions),
    },
    { id: 'summary-lines', property: 'Lines', value: formatCollectionCount(agreement.lines) },
    { id: 'summary-currency', property: 'Currency', value: agreement.currency ?? '—' },
  ];
}

function buildParameterRows(agreement: AgreementSyncResult): DetailRow[] {
  const parameters = [
    ...(agreement.parameters?.ordering ?? []),
    ...(agreement.parameters?.fulfillment ?? []),
  ];
  return parameters.map((parameter, index) => ({
    id: `param-${index}-${parameter.externalId ?? parameter.name ?? 'param'}`,
    property: parameter.name ?? parameter.externalId ?? 'Parameter',
    value: formatParameterValue(parameter.value),
  }));
}

function DetailRows({ rows }: { rows: DetailRow[] }) {
  return (
    <dl className="agreement-details-list__rows">
      {rows.map((row) => (
        <div className="agreement-details-list__row" key={row.id}>
          <RegularText as="dt" size={2} className="agreement-details-list__property">
            {row.property}
          </RegularText>
          <RegularText as="dd" size={2} className="agreement-details-list__value">
            {row.value}
          </RegularText>
        </div>
      ))}
    </dl>
  );
}

export function AgreementDetailsList({ agreement, status }: AgreementDetailsListProps) {
  if (status === 'error') {
    return <RegularText as="p" size={2}>Agreement details could not be loaded.</RegularText>;
  }

  if (status === 'loading') {
    return <RegularText as="p" size={2}>Loading agreement details…</RegularText>;
  }

  if (!agreement) {
    return <RegularText as="p" size={2}>Agreement details could not be loaded.</RegularText>;
  }

  const basicRows = buildBasicRows(agreement);
  const parameterRows = buildParameterRows(agreement);
  const summaryRows = buildSummaryRows(agreement);

  return (
    <div className="agreement-details-list">
      <div className="agreement-details-list__section">
        <RegularText as="h3" size={3} className="agreement-details-list__heading">
          Basic information
        </RegularText>
        <DetailRows rows={basicRows} />
      </div>

      <div className="agreement-details-list__section">
        <RegularText as="h3" size={3} className="agreement-details-list__heading">
          Summary
        </RegularText>
        <DetailRows rows={summaryRows} />
      </div>

      <div className="agreement-details-list__section">
        <RegularText as="h3" size={3} className="agreement-details-list__heading">
          Parameters
        </RegularText>
        {parameterRows.length === 0 ? (
          <RegularText as="p" size={2}>No parameters are defined for this agreement.</RegularText>
        ) : (
          <DetailRows rows={parameterRows} />
        )}
      </div>
    </div>
  );
}
