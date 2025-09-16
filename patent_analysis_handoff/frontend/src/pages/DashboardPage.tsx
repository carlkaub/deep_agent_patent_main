
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { InventorDashboard } from '../components/dashboard/InventorDashboard';
import { CorporateRDDashboard } from '../components/dashboard/CorporateRDDashboard';
import { PatentAttorneyDashboard } from '../components/dashboard/PatentAttorneyDashboard';
import { BusinessStrategistDashboard } from '../components/dashboard/BusinessStrategistDashboard';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.personaType) {
      case 'inventor':
        return <InventorDashboard />;
      case 'corporate_rd':
        return <CorporateRDDashboard />;
      case 'patent_attorney':
        return <PatentAttorneyDashboard />;
      case 'business_strategist':
        return <BusinessStrategistDashboard />;
      default:
        return <InventorDashboard />; // Default fallback
    }
  };

  return <>{renderDashboard()}</>;
};
