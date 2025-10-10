import React, { useState } from 'react';
import {
  Stack,
  TextField,
  PrimaryButton,
  DefaultButton,
  Toggle,
  Label,
  Dropdown,
  IDropdownOption,
  MessageBar,
  MessageBarType
} from '@fluentui/react';
import { useProjectSettings } from '../../hooks/useProjectSettings';

const complianceLevels: IDropdownOption[] = [
  { key: 'low', text: 'Low' },
  { key: 'medium', text: 'Medium' },
  { key: 'high', text: 'High' },
  { key: 'critical', text: 'Critical' }
];

export const ProjectSettings: React.FC = () => {
  const { settings, updateSettings, isLoading, error } = useProjectSettings();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = async () => {
    await updateSettings(localSettings);
  };

  const handleReset = () => {
    setLocalSettings(settings);
  };

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  return (
    <Stack tokens={{ childrenGap: 15 }} styles={{ root: { maxWidth: 800 } }}>
      <Label>Project Compliance Settings</Label>

      {error && (
        <MessageBar messageBarType={MessageBarType.error}>
          {error}
        </MessageBar>
      )}

      <Dropdown
        label="Required Compliance Level"
        selectedKey={localSettings.complianceLevel}
        options={complianceLevels}
        onChange={(_, option) => 
          setLocalSettings({
            ...localSettings,
            complianceLevel: option?.key as string
          })
        }
      />

      <Toggle
        label="Auto-fix Issues"
        checked={localSettings.autoFix}
        onChange={(_, checked) => 
          setLocalSettings({
            ...localSettings,
            autoFix: checked
          })
        }
      />

      <TextField
        label="Scan Schedule (cron expression)"
        value={localSettings.scanSchedule}
        onChange={(_, value) => 
          setLocalSettings({
            ...localSettings,
            scanSchedule: value || ''
          })
        }
      />

      <Toggle
        label="Enable Notifications"
        checked={localSettings.enableNotifications}
        onChange={(_, checked) => 
          setLocalSettings({
            ...localSettings,
            enableNotifications: checked
          })
        }
      />

      <TextField
        label="Notification Email(s)"
        value={localSettings.notificationEmails}
        onChange={(_, value) => 
          setLocalSettings({
            ...localSettings,
            notificationEmails: value || ''
          })
        }
      />

      <Stack horizontal tokens={{ childrenGap: 10 }}>
        <PrimaryButton text="Save Changes" onClick={handleSave} />
        <DefaultButton text="Reset" onClick={handleReset} />
      </Stack>
    </Stack>
  );
};