import { useState, useEffect } from 'react';
import * as SDK from 'azure-devops-extension-sdk';
import { IExtensionDataService } from 'azure-devops-extension-api';

interface ProjectContext {
  id: string;
  name: string;
}

export const useProjectContext = () => {
  const [project, setProject] = useState<ProjectContext | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeContext = async () => {
      try {
        setIsLoading(true);
        setError(null);

        await SDK.init();
        const project = SDK.getProject();

        if (!project) {
          throw new Error('No project context found');
        }

        setProject({
          id: project.id,
          name: project.name
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    initializeContext();
  }, []);

  return {
    project,
    isLoading,
    error
  };
};