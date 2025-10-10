import React, { useState } from 'react';
import {
  Stack,
  TextField,
  PrimaryButton,
  DefaultButton,
  Toggle,
  Label,
  MessageBar,
  MessageBarType,
  Pivot,
  PivotItem
} from '@fluentui/react';
import { useGlobalSettings } from '../../hooks/useGlobalSettings';

interface GlobalSettingsState {
  defaultComplianceLevel: string;
  defaultAutoFix: boolean;
  defaultScanSchedule: string;
  notificationSettings: {
    emailEnabled: boolean;
    webhookEnabled: boolean;
    emailRecipients: string;
    webhookUrl: string;
  };
  retentionSettings: {
    enabled: boolean;
    retentionDays: number;
  };
}

export const GlobalSettings: React.FC = () => {
  const { settings, updateSettings, isLoading, error } = useGlobalSettings();
  const [localSettings, setLocalSettings] = useState<GlobalSettingsState>(settings);

  const handleSave = async () => {
    await updateSettings(localSettings);
  };

  const handleReset = () => {
    setLocalSettings(settings);
  };

  if (isLoading) {
    return <div>Loading global settings...</div>;
  }

  return (
    <Stack tokens={{ childrenGap: 15 }} styles={{ root: { maxWidth: 800 } }}>
      <Label>Global Compliance Settings</Label>

      {error && (
        <MessageBar messageBarType={MessageBarType.error}>
          {error}
        </MessageBar>
      )}

      <Pivot>
        <PivotItem headerText="Default Settings">
          <Stack tokens={{ childrenGap: 10 }} styles={{ root: { padding: 10 } }}>
            <TextField
              label="Default Compliance Level"
              value={localSettings.defaultComplianceLevel}
              onChange={(_, value) => 
                setLocalSettings({
                  ...localSettings,
                  defaultComplianceLevel: value || ''
                })
              }
            />

            <Toggle
              label="Default Auto-fix Setting"
              checked={localSettings.defaultAutoFix}
              onChange={(_, checked) => 
                setLocalSettings({
                  ...localSettings,
                  defaultAutoFix: checked || false
                })
              }
            />

            <TextField
              label="Default Scan Schedule"
              value={localSettings.defaultScanSchedule}
              onChange={(_, value) => 
                setLocalSettings({
                  ...localSettings,
                  defaultScanSchedule: value || ''
                })
              }
            />
          </Stack>
        </PivotItem>

        <PivotItem headerText="Notifications">
          <Stack tokens={{ childrenGap: 10 }} styles={{ root: { padding: 10 } }}>
            <Toggle
              label="Enable Email Notifications"
              checked={localSettings.notificationSettings.emailEnabled}
              onChange={(_, checked) => 
                setLocalSettings({
                  ...localSettings,
                  notificationSettings: {
                    ...localSettings.notificationSettings,
                    emailEnabled: checked || false
                  }
                })
              }
            />

            <TextField
              label="Email Recipients"
              value={localSettings.notificationSettings.emailRecipients}
              onChange={(_, value) => 
                setLocalSettings({
                  ...localSettings,
                  notificationSettings: {
                    ...localSettings.notificationSettings,
                    emailRecipients: value || ''
                  }
                })
              }
            />

            <Toggle
              label="Enable Webhook Notifications"
              checked={localSettings.notificationSettings.webhookEnabled}
              onChange={(_, checked) => 
                setLocalSettings({
                  ...localSettings,
                  notificationSettings: {
                    ...localSettings.notificationSettings,
                    webhookEnabled: checked || false
                  }
                })
              }
            />

            <TextField
              label="Webhook URL"
              value={localSettings.notificationSettings.webhookUrl}
              onChange={(_, value) => 
                setLocalSettings({
                  ...localSettings,
                  notificationSettings: {
                    ...localSettings.notificationSettings,
                    webhookUrl: value || ''
                  }
                })
              }
            />
          </Stack>
        </PivotItem>

        <PivotItem headerText="Data Retention">
          <Stack tokens={{ childrenGap: 10 }} styles={{ root: { padding: 10 } }}>
            <Toggle
              label="Enable Data Retention"
              checked={localSettings.retentionSettings.enabled}
              onChange={(_, checked) => 
                setLocalSettings({
                  ...localSettings,
                  retentionSettings: {
                    ...localSettings.retentionSettings,
                    enabled: checked || false
                  }
                })
              }
            />

            <TextField
              label="Retention Period (days)"
              type="number"
              value={localSettings.retentionSettings.retentionDays.toString()}
              onChange={(_, value) => 
                setLocalSettings({
                  ...localSettings,
                  retentionSettings: {
                    ...localSettings.retentionSettings,
                    retentionDays: parseInt(value || '30')
                  }
                })
              }
            />
          </Stack>
        </PivotItem>
      </Pivot>

      <Stack horizontal tokens={{ childrenGap: 10 }}>
        <PrimaryButton text="Save Changes" onClick={handleSave} />
        <DefaultButton text="Reset" onClick={handleReset} />
      </Stack>
    </Stack>
  );
};