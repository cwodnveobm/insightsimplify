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
      
      return {
        name: column,
        type: numericValues.length === values.length ? 'numeric' : 'categorical',
        missing: values.filter(v => v === null || v === undefined || v === '').length,
        unique: new Set(values).size,
      };
    });

    return summary;
  };

  const summary = calculateSummary();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
      {summary.map((col) => (
        <Card key={col.name}>
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
            </dl>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DataSummary;