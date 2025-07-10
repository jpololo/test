import React from 'react';
import { mockCompany } from '../data/mockCompanyData';
import CompanyDetailsView from '../components/CompanyDetailsView';

const CompanyView: React.FC = () => {
  const handleEdit = () => {
    console.log('Edit company details');
  };

  return (
    <CompanyDetailsView 
      company={mockCompany}
      onEdit={handleEdit}
      isEditable={true}
    />
  );
};

export default CompanyView;