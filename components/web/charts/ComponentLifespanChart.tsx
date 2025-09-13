
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { type: 'ERC', actual: 8, predicted: 8.5 },
  { type: 'Pad', actual: 5, predicted: 5.2 },
  { type: 'Liner', actual: 7, predicted: 6.8 },
  { type: 'Sleeper', actual: 35, predicted: 40 },
];

const ComponentLifespanChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="type" />
        <YAxis label={{ value: 'Years', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="actual" stroke="#1e3a8a" strokeWidth={2} name="Actual Lifespan" />
        <Line type="monotone" dataKey="predicted" stroke="#f59e0b" strokeWidth={2} name="AI Predicted Lifespan" strokeDasharray="5 5"/>
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ComponentLifespanChart;
