import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ComplianceDashboard } from '../../src/frontend/components/dashboard/ComplianceDashboard';

describe('ComplianceDashboard', () => {
    it('shows loading state initially', () => {
        render(<ComplianceDashboard />);
        expect(screen.getByText('Loading compliance status...')).toBeInTheDocument();
    });

    it('displays dashboard content after loading', async () => {
        render(<ComplianceDashboard />);
        await waitFor(() => {
            expect(screen.getByText('Compliance Dashboard')).toBeInTheDocument();
        });
    });
});