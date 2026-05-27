import { Button } from '@softwareone-platform/sdk-react-ui-v0/button';
import { Chip } from '@softwareone-platform/sdk-react-ui-v0/chip';
import { Divider } from '@softwareone-platform/sdk-react-ui-v0/divider';
import { InPageHighlight } from '@softwareone-platform/sdk-react-ui-v0/in-page-highlight';
import { InlineNotification } from '@softwareone-platform/sdk-react-ui-v0/notification';
import { BoldText, RegularText } from '@softwareone-platform/sdk-react-ui-v0/text';
import { DesignSystemOptionsProvider } from '@softwareone-platform/sdk-react-ui-v0/utils';

import { useAgreementId } from '../../shared/hooks/useAgreementId';
import { Status, useAgreementSync } from '../../shared/hooks/useAgreementSync';
import { ExtensionNavigation } from '../../shared/components/ExtensionNavigation';

const STATUS_LABEL: Record<Status, string> = {
  idle: 'Idle',
  loading: 'Synchronising',
  success: 'Success',
  error: 'Error',
};

const STATUS_COLOR: Record<Status, 'gray' | 'primary' | 'success' | 'danger'> = {
  idle: 'gray',
  loading: 'primary',
  success: 'success',
  error: 'danger',
};

export default function App() {
  const agreementId = useAgreementId();
  const { error, lastCompleted, lastStatus, status, syncAgreement } = useAgreementSync(agreementId);

  return (
    <DesignSystemOptionsProvider
      value={{
        dateFormat: 'dd MMM yyyy',
        inputDateFormat: 'P',
        languageCode: 'en-GB',
        timeFormat: 'HH:mm',
      }}
    >
      <div className="playground">
        <ExtensionNavigation
          ariaLabel="Playground sections"
          heading="Manage account"
          items={[{ href: '#sync-account', isActive: true, label: 'Sync account' }]}
        />

        <section className="playground__content" id="sync-account">
          <header className="playground__content-header">
            <BoldText as="h2" size={4} className="playground__content-title">
              Sync account
            </BoldText>
            <RegularText as="p" size={2} color="grey-5">
              The details of this customer&apos;s synchronisation status are below.
            </RegularText>
          </header>

          {!agreementId && (
            <InlineNotification status="warning" isStandalone>
              Agreement context was not provided by Marketplace.
            </InlineNotification>
          )}

          <InlineNotification
            status="info"
            isStandalone
            isToShowCloseButton={false}
            messageText="If agreement synchronisation fails, please create a Helpdesk case."
            link={{ linkText: 'Create helpdesk case', linkAddress: '#' }}
          />

          <section className="playground__section">
            <BoldText as="h3" size={3} className="playground__section-title">
              Synchronisation status
            </BoldText>
            <InPageHighlight style="inline" mode="sparse" direction="vertical">
              <InPageHighlight.Item title="Current status">
                <Chip color={STATUS_COLOR[status]} label={STATUS_LABEL[status]} />
              </InPageHighlight.Item>
              <InPageHighlight.Item title="Last sync status">
                {lastStatus ? STATUS_LABEL[lastStatus] : '—'}
              </InPageHighlight.Item>
              <InPageHighlight.Item title="Last sync completed">
                {lastCompleted ?? '—'}
              </InPageHighlight.Item>
              <InPageHighlight.Item title="Next sync available">
                Now
              </InPageHighlight.Item>
            </InPageHighlight>
          </section>

          <Divider />

          <section className="playground__section">
            <BoldText as="h3" size={3} className="playground__section-title">
              Synchronise now
            </BoldText>
            <RegularText as="p" size={2} color="grey-5">
              To request a sync, click the &ldquo;Sync now&rdquo; button below.
            </RegularText>
            <Button
              isBusy={status === 'loading'}
              isDisabled={!agreementId}
              onClick={syncAgreement}
              color="primary"
              type="outline"
            >
              Sync now
            </Button>
          </section>

          {status === 'error' && (
            <InlineNotification status="error" isStandalone>
              {error}
            </InlineNotification>
          )}
          {status === 'success' && (
            <InlineNotification status="warning" isStandalone>
              This is a demo playground. The agreement was not modified.
            </InlineNotification>
          )}
        </section>
      </div>
    </DesignSystemOptionsProvider>
  );
}
