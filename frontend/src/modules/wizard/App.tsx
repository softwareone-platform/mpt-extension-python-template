import { useMPTContext, useMPTModal } from '@mpt-extension/sdk-react';
import { RegularText } from '@softwareone-platform/sdk-react-ui-v0/text';
import { StepProps, Wizard, WizardContextProps } from '@softwareone-platform/sdk-react-ui-v0/wizard';

import '../../shared/components/ActionModal.scss';

const steps: StepProps[] = [
  { title: 'Intro', secondaryTitle: 'About this wizard' },
  { title: 'Context', secondaryTitle: 'What the opener sent' },
];

export default function App() {
  const context = useMPTContext();
  const { close } = useMPTModal();

  return (
    <div className="wizard-container">
      <Wizard
        stepsProps={steps}
        onClose={() => close({ completed: false })}
        onSave={() => close({ completed: true })}
        navigation={{ next: 'Next', back: 'Back', close: 'Close', finish: 'Done' }}
      >
        <Wizard.Header isToShowCloseButton>Extension example wizard</Wizard.Header>
        <Wizard.Content>
          <Wizard.Content.Steps />
          <Wizard.Content.StepContent>
            {({ activeStepIndex }: WizardContextProps) => (
              <>
                {activeStepIndex === 0 && (
                  <div className="template__section">
                    <RegularText as="h2" size={4} className="template__section-title">
                      Intro
                    </RegularText>
                    <RegularText as="p" size={2}>
                      This wizard has no socket: it was opened by id with useMPTModal().open() and
                      reports back to the opener when it finishes.
                    </RegularText>
                  </div>
                )}
                {activeStepIndex === 1 && (
                  <div className="action-modal__content action-modal__content--wizard">
                    <RegularText as="p" size={2}>
                      Context received from the opener:
                    </RegularText>
                    <pre>
                      <code>{JSON.stringify(context ?? {}, null, 2)}</code>
                    </pre>
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
