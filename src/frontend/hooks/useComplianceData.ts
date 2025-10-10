import { useState, useEffect } from 'react';
import * as SDK from 'azure-devops-extension-sdk';
import { IExtensionDataService } from 'azure-devops-extension-api';

interface ComplianceRule {
  ruleName: string;
  status: 'compliant' | 'non-compliant' | 'warning';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  lastScanned: string;
}

interface ChartData {
  category: string;
  count: number;
}

interface ComplianceData {
  overallScore: number;
  rules: ComplianceRule[];
  chartData: ChartData[];
  lastScanDate: string;
}

export const useComplianceData = () => {
  const [data, setData] = useState<ComplianceData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const extensionData = await SDK.getService<IExtensionDataService>('ms.vss-features.extension-data-service');
      const projectId = SDK.getProject()?.id;

      if (!projectId) {
        throw new Error('No project context found');
      }

      // Fetch compliance data from your backend API
      const response = await fetch(`/api/v1/compliance/${projectId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch compliance data');
      }

      const complianceData = await response.json();
      setData(complianceData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData
  };
};