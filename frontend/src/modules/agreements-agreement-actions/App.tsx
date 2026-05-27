import { useMPTModal } from '@mpt-extension/sdk-react';
import { RegularText } from '@softwareone-platform/sdk-react-ui-v0/text';
import { StepProps, Wizard, WizardContextProps } from '@softwareone-platform/sdk-react-ui-v0/wizard';

import { useAgreement } from '../../shared/hooks/useAgreement';
import { useAgreementId } from '../../shared/hooks/useAgreementId';
import { AgreementDetailsList } from '../../shared/components/AgreementDetailsList';
import '../../shared/components/AgreementActionModal.scss';

const steps: StepProps[] = [
  { title: 'Intro', secondaryTitle: 'About this wizard' },
  { title: 'Details', secondaryTitle: 'Current agreement' },
];

export default function App() {
  const agreementId = useAgreementId();
  const { agreement, status } = useAgreement(agreementId);
  const { close } = useMPTModal();

  return (
    <div className="wizard-container">
      <Wizard
        stepsProps={steps}
        onClose={() => close()}
        onSave={() => close()}
        navigation={{ next: 'Next', back: 'Back', close: 'Close', finish: 'Done' }}
      >
        <Wizard.Header isToShowCloseButton>Agreement extension playground</Wizard.Header>
        <Wizard.Content>
          <Wizard.Content.Steps />
          <Wizard.Content.StepContent>
            {({ activeStepIndex }: WizardContextProps) => (
              <>
                {activeStepIndex === 0 && (
                  <div className="playground__section">
                    <RegularText as="h2" size={4} className="playground__section-title">
                      Intro
                    </RegularText>
                    <RegularText as="p" size={2}>
                      This is an example wizard that only displays the current agreement
                      information. No changes will be made.
                    </RegularText>
                  </div>
                )}
                {activeStepIndex === 1 && (
                  <div className="agreement-action-modal__content agreement-action-modal__content--wizard">
                    <AgreementDetailsList agreement={agreement} status={status} />
                  </div>
                )}
              </>
            )}
          </Wizard.Content.StepContent>
        </Wizard.Content>
        <Wizard.Actions />
      </Wizard>
    </div>
  );
}
