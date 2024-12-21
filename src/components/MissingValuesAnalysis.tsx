import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface MissingValuesAnalysisProps {
  data: Array<Record<string, any>>;
  columns: string[];
}

export const MissingValuesAnalysis: React.FC<MissingValuesAnalysisProps> = ({ data, columns }) => {
  const missingStats = columns.map(column => {
    const missingCount = data.filter(row => 
      row[column] === null || row[column] === undefined || row[column] === ''
    ).length;
    
    return {
      column,
      missing: missingCount,
      percentage: (missingCount / data.length) * 100
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Missing Values Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={missingStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="column" 
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis label={{ value: 'Missing Values (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="percentage" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};