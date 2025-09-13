
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Vendor Alpha', failures: 12, color: '#3b82f6' },
  { name: 'Vendor Beta', failures: 25, color: '#ef4444' },
  { name: 'Vendor Charlie', failures: 8, color: '#22c55e' },
  { name: 'Vendor Delta', failures: 5, color: '#f59e0b' },
];

const VendorFailureChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="failures" fill="#1e3a8a" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default VendorFailureChart;
