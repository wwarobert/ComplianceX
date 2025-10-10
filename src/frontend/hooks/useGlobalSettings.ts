import { useState, useEffect } from 'react';
import * as SDK from 'azure-devops-extension-sdk';
import { IExtensionDataService } from 'azure-devops-extension-api';

interface GlobalSettings {
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

export const useGlobalSettings = () => {
  const [settings, setSettings] = useState<GlobalSettings>({
    defaultComplianceLevel: 'medium',
    defaultAutoFix: false,
    defaultScanSchedule: '0 0 * * *',
    notificationSettings: {
      emailEnabled: false,
      webhookEnabled: false,
      emailRecipients: '',
      webhookUrl: ''
    },
    retentionSettings: {
      enabled: true,
      retentionDays: 30
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const extensionData = await SDK.getService<IExtensionDataService>('ms.vss-features.extension-data-service');
      const response = await fetch('/api/v1/settings/global');
      
      if (!response.ok) {
        throw new Error('Failed to fetch global settings');
      }

      const settingsData = await response.json();
      setSettings(settingsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: GlobalSettings) => {
    try {
      setError(null);
      const response = await fetch('/api/v1/settings/global', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings)
      });

      if (!response.ok) {
        throw new Error('Failed to update global settings');
      }

      setSettings(newSettings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    updateSettings,
    isLoading,
    error
  };
};