import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DataSummaryProps {
  data: Array<Record<string, any>>;
  columns: string[];
}

interface BaseColumnStats {
  name: string;
  type: 'numeric' | 'categorical';
  missing: number;
  unique: number;
}

interface NumericColumnStats extends BaseColumnStats {
  type: 'numeric';
  min: number;
  max: number;
  mean: number;
  median: number;
  stdDev: number;
}

interface CategoricalColumnStats extends BaseColumnStats {
  type: 'categorical';
}

type ColumnStats = NumericColumnStats | CategoricalColumnStats;

const DataSummary: React.FC<DataSummaryProps> = ({ data, columns }) => {
  const calculateSummary = (): ColumnStats[] => {
    if (!data.length || !columns.length) {
      return [];
    }

    return columns.map(column => {
      const values = data.map(row => row[column]);
      const numericValues = values
        .filter(v => v !== null && v !== undefined && v !== '')
        .filter(v => !isNaN(Number(v)))
        .map(Number);
      
      const baseStats: BaseColumnStats = {
        name: column,
        type: numericValues.length === values.filter(v => v !== null && v !== undefined && v !== '').length ? 'numeric' : 'categorical',
        missing: values.filter(v => v === null || v === undefined || v === '').length,
        unique: new Set(values.filter(v => v !== null && v !== undefined && v !== '')).size,
      };

      if (baseStats.type === 'numeric' && numericValues.length > 0) {
        const sortedValues = [...numericValues].sort((a, b) => a - b);
        const sum = numericValues.reduce((acc, val) => acc + val, 0);
        const mean = numericValues.length ? sum / numericValues.length : 0;
        const median = sortedValues.length % 2 === 0
          ? (sortedValues[sortedValues.length / 2 - 1] + sortedValues[sortedValues.length / 2]) / 2
          : sortedValues[Math.floor(sortedValues.length / 2)];
        
        // Calculate standard deviation with safeguards
        const squareDiffs = numericValues.map(value => {
          const diff = value - mean;
          return diff * diff;
        });
        const avgSquareDiff = squareDiffs.length ? squareDiffs.reduce((acc, val) => acc + val, 0) / squareDiffs.length : 0;
        const stdDev = Math.sqrt(avgSquareDiff);

        return {
          ...baseStats,
          type: 'numeric' as const,
          min: Math.min(...numericValues),
          max: Math.max(...numericValues),
          mean,
          median,
          stdDev,
        };
      }

      return {
        ...baseStats,
        type: 'categorical' as const,
      };
    });
  };

  const summary = calculateSummary();

  if (!summary.length) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">No data available for analysis</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
      {summary.map((col) => (
        <Card key={col.name} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold truncate">
              {col.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Type:</dt>
                <dd className="text-sm font-medium">{col.type}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Missing Values:</dt>
                <dd className="text-sm font-medium">{col.missing}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Unique Values:</dt>
                <dd className="text-sm font-medium">{col.unique}</dd>
              </div>
              {col.type === 'numeric' && (
                <>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Min:</dt>
                    <dd className="text-sm font-medium">{col.min.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Max:</dt>
                    <dd className="text-sm font-medium">{col.max.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Mean:</dt>
                    <dd className="text-sm font-medium">{col.mean.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Median:</dt>
                    <dd className="text-sm font-medium">{col.median.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Std Dev:</dt>
                    <dd className="text-sm font-medium">{col.stdDev.toFixed(2)}</dd>
                  </div>
                </>
              )}
            </dl>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DataSummary;