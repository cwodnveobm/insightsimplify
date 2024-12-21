import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DistributionPlotProps {
  data: Array<Record<string, any>>;
  columns: string[];
}

export const DistributionPlot: React.FC<DistributionPlotProps> = ({ data, columns }) => {
  const [selectedColumn, setSelectedColumn] = useState(columns[0]);

  const calculateDistribution = (column: string) => {
    const values = data.map(row => row[column]).filter(val => val !== null && val !== undefined);
    const numericValues = values.map(v => Number(v)).filter(v => !isNaN(v));
    
    if (numericValues.length > 0) {
      const min = Math.min(...numericValues);
      const max = Math.max(...numericValues);
      const binCount = 10;
      const binSize = (max - min) / binCount;
      
      const bins = Array.from({ length: binCount }, (_, i) => ({
        range: `${(min + i * binSize).toFixed(2)} - ${(min + (i + 1) * binSize).toFixed(2)}`,
        count: 0
      }));
      
      numericValues.forEach(value => {
        const binIndex = Math.min(Math.floor((value - min) / binSize), binCount - 1);
        bins[binIndex].count++;
      });
      
      return bins;
    }
    
    // For categorical data
    const frequencies: Record<string, number> = {};
    values.forEach(value => {
      frequencies[value] = (frequencies[value] || 0) + 1;
    });
    
    return Object.entries(frequencies).map(([range, count]) => ({ range, count }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribution Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Select
          value={selectedColumn}
          onValueChange={setSelectedColumn}
        >
          <SelectTrigger className="w-[200px] mb-4">
            <SelectValue placeholder="Select column" />
          </SelectTrigger>
          <SelectContent>
            {columns.map(column => (
              <SelectItem key={column} value={column}>
                {column}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={calculateDistribution(selectedColumn)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="range" 
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="count" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};