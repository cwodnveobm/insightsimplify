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

const DataSummary: React.FC<DataSummaryProps> = ({ data, columns }) => {
  const calculateSummary = () => {
    const summary = columns.map(column => {
      const values = data.map(row => row[column]);
      const numericValues = values.filter(v => !isNaN(Number(v)));
      
      const stats = {
        name: column,
        type: numericValues.length === values.length ? 'numeric' : 'categorical',
        missing: values.filter(v => v === null || v === undefined || v === '').length,
        unique: new Set(values).size,
      };

      if (stats.type === 'numeric') {
        const sortedValues = numericValues.sort((a, b) => Number(a) - Number(b));
        const sum = numericValues.reduce((acc, val) => acc + Number(val), 0);
        const mean = sum / numericValues.length;
        const median = sortedValues[Math.floor(sortedValues.length / 2)];
        
        // Calculate standard deviation
        const squareDiffs = numericValues.map(value => {
          const diff = Number(value) - mean;
          return diff * diff;
        });
        const avgSquareDiff = squareDiffs.reduce((acc, val) => acc + val, 0) / numericValues.length;
        const stdDev = Math.sqrt(avgSquareDiff);

        return {
          ...stats,
          min: Math.min(...numericValues),
          max: Math.max(...numericValues),
          mean: mean,
          median: median,
          stdDev: stdDev,
        };
      }

      return stats;
    });

    return summary;
  };

  const summary = calculateSummary();

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
                    <dd className="text-sm font-medium">{col.min?.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Max:</dt>
                    <dd className="text-sm font-medium">{col.max?.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Mean:</dt>
                    <dd className="text-sm font-medium">{col.mean?.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Median:</dt>
                    <dd className="text-sm font-medium">{col.median?.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Std Dev:</dt>
                    <dd className="text-sm font-medium">{col.stdDev?.toFixed(2)}</dd>
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