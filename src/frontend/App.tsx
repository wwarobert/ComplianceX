import React, { useEffect, useState } from 'react';
import { Page } from 'azure-devops-extension-api';
import { ComplianceDashboard } from './components/dashboard/ComplianceDashboard';
import { Header } from './components/shared/Header';

const App: React.FC = () => {
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const init = async () => {
            // Initialize Azure DevOps Extension SDK
            // SDK.init() would go here
            setIsInitialized(true);
        };
        init();
    }, []);

    if (!isInitialized) {
        return <div>Loading...</div>;
    }

    return (
        <Page className="compliance-page">
            <Header />
            <ComplianceDashboard />
        </Page>
    );
};

export default App;