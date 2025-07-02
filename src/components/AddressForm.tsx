import React from 'react';
import { Address } from '../types';

interface AddressFormProps {
  address: Address;
  onChange: (address: Address) => void;
  readonly?: boolean;
  title: string;
}

const AddressForm: React.FC<AddressFormProps> = ({ address, onChange, readonly = false, title }) => {
  const handleChange = (field: keyof Address, value: string) => {
    if (!readonly) {
      onChange({ ...address, [field]: value });
    }
  };

  const inputClassName = `
    mt-1 block w-full rounded-lg border px-3 py-2 text-sm transition-colors duration-200
    ${readonly 
      ? 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed' 
      : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none'
    }
  `;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Street Address</label>
          <input
            type="text"
            value={address.street}
            onChange={(e) => handleChange('street', e.target.value)}
            className={inputClassName}
            readOnly={readonly}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            value={address.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className={inputClassName}
            readOnly={readonly}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">State</label>
          <input
            type="text"
            value={address.state}
            onChange={(e) => handleChange('state', e.target.value)}
            className={inputClassName}
            readOnly={readonly}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
          <input
            type="text"
            value={address.zipCode}
            onChange={(e) => handleChange('zipCode', e.target.value)}
            className={inputClassName}
            readOnly={readonly}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Country</label>
          <input
            type="text"
            value={address.country}
            onChange={(e) => handleChange('country', e.target.value)}
            className={inputClassName}
            readOnly={readonly}
          />
        </div>
      </div>
    </div>
  );
};

export default AddressForm;