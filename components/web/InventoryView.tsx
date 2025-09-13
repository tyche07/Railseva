
import React, { useState } from 'react';
import { Fitting, ComponentType } from '../../types';

const mockInventory: Fitting[] = [
  { uid: 'ERC-VA-L45-001', type: ComponentType.ERC, vendor: 'Vendor Alpha', lotNumber: 'L45', installDate: '2024-01-20', warrantyEndDate: '2029-01-19', inspectionCert: 'CERT-A45', sleeperUid: 'SL-ZA-K25-010' },
  { uid: 'PAD-VB-L12-002', type: ComponentType.PAD, vendor: 'Vendor Beta', lotNumber: 'L12', installDate: '2024-02-10', warrantyEndDate: '2028-02-09', inspectionCert: 'CERT-B12', sleeperUid: 'SL-ZA-K25-010' },
  { uid: 'LIN-VC-L88-003', type: ComponentType.LINER, vendor: 'Vendor Charlie', lotNumber: 'L88', installDate: '2023-11-05', warrantyEndDate: '2027-11-04', inspectionCert: 'CERT-C88', sleeperUid: 'SL-ZA-K25-011' },
  { uid: 'ERC-VA-L45-004', type: ComponentType.ERC, vendor: 'Vendor Alpha', lotNumber: 'L45', installDate: '2024-01-20', warrantyEndDate: '2029-01-19', inspectionCert: 'CERT-A45', sleeperUid: 'SL-ZA-K25-011' },
  { uid: 'SLP-VD-L01-005', type: ComponentType.SLEEPER, vendor: 'Vendor Delta', lotNumber: 'L01', installDate: '2023-09-01', warrantyEndDate: '2033-08-31', inspectionCert: 'CERT-D01' },
];

const InventoryView: React.FC = () => {
    const [filter, setFilter] = useState('');
    const filteredInventory = mockInventory.filter(item => 
        item.uid.toLowerCase().includes(filter.toLowerCase()) ||
        item.vendor.toLowerCase().includes(filter.toLowerCase()) ||
        item.lotNumber.toLowerCase().includes(filter.toLowerCase())
    );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Fittings Inventory</h2>
      
      <div className="mb-4">
        <input 
          type="text"
          placeholder="Filter by UID, Vendor, Lot No..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full max-w-sm p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lot No.</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warranty End</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sleeper UID</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInventory.map((item) => (
              <tr key={item.uid} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.uid}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.vendor}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.lotNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.warrantyEndDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.sleeperUid || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryView;
