import { useState, useEffect } from 'react';
import * as SDK from 'azure-devops-extension-sdk';
import { IExtensionDataService } from 'azure-devops-extension-api';

interface ProjectSettings {
  complianceLevel: string;
  autoFix: boolean;
  scanSchedule: string;
  enableNotifications: boolean;
  notificationEmails: string;
}

export const useProjectSettings = () => {
  const [settings, setSettings] = useState<ProjectSettings>({
    complianceLevel: 'medium',
    autoFix: false,
    scanSchedule: '0 0 * * *',
    enableNotifications: false,
    notificationEmails: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const extensionData = await SDK.getService<IExtensionDataService>('ms.vss-features.extension-data-service');
      const projectId = SDK.getProject()?.id;

      if (!projectId) {
        throw new Error('No project context found');
      }

      const response = await fetch(`/api/v1/settings/project/${projectId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch project settings');
      }

      const settingsData = await response.json();
      setSettings(settingsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: ProjectSettings) => {
    try {
      setError(null);
      const projectId = SDK.getProject()?.id;

      if (!projectId) {
        throw new Error('No project context found');
      }

      const response = await fetch(`/api/v1/settings/project/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings)
      });

      if (!response.ok) {
        throw new Error('Failed to update project settings');
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