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
    if (!data || !column) {
      return [];
    }

    const values = data
      .map(row => row[column])
      .filter(val => val !== null && val !== undefined);

    if (values.length === 0) {
      return [];
    }

    const numericValues = values.map(v => Number(v)).filter(v => !isNaN(v));
    
    if (numericValues.length > 0) {
      const min = Math.min(...numericValues);
      const max = Math.max(...numericValues);
      
      // Handle edge case where min equals max
      if (min === max) {
        return [{ range: min.toString(), count: numericValues.length }];
      }

      const binCount = 10;
      const binSize = (max - min) / binCount;
      
      // Initialize bins with proper typing
      const bins = Array.from({ length: binCount }, (_, i) => ({
        range: `${(min + i * binSize).toFixed(2)} - ${(min + (i + 1) * binSize).toFixed(2)}`,
        count: 0
      }));
      
      // Safely count values into bins
      numericValues.forEach(value => {
        const binIndex = Math.min(
          Math.floor((value - min) / binSize),
          binCount - 1
        );
        if (binIndex >= 0 && binIndex < bins.length) {
          bins[binIndex].count++;
        }
      });
      
      return bins;
    }
    
    // For categorical data
    const frequencies: Record<string, number> = {};
    values.forEach(value => {
      const key = String(value);
      frequencies[key] = (frequencies[key] || 0) + 1;
    });
    
    return Object.entries(frequencies)
      .map(([range, count]) => ({ range, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Limit to top 10 categories
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