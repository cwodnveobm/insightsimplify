import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CorrelationMatrixProps {
  data: Array<Record<string, any>>;
  columns: string[];
}

export const CorrelationMatrix: React.FC<CorrelationMatrixProps> = ({ data, columns }) => {
  const calculateCorrelation = (col1: string, col2: string) => {
    const pairs = data
      .map(row => [Number(row[col1]), Number(row[col2])])
      .filter(([a, b]) => !isNaN(a) && !isNaN(b));

    if (pairs.length === 0) return null;

    const n = pairs.length;
    const sum1 = pairs.reduce((acc, [a]) => acc + a, 0);
    const sum2 = pairs.reduce((acc, [_, b]) => acc + b, 0);
    const sum1Sq = pairs.reduce((acc, [a]) => acc + a * a, 0);
    const sum2Sq = pairs.reduce((acc, [_, b]) => acc + b * b, 0);
    const pSum = pairs.reduce((acc, [a, b]) => acc + a * b, 0);

    const num = pSum - (sum1 * sum2 / n);
    const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));

    return den === 0 ? 0 : num / den;
  };

  const numericColumns = columns.filter(col => {
    const firstValue = data[0]?.[col];
    return !isNaN(Number(firstValue));
  });

  const correlationData = numericColumns.map(col1 => 
    numericColumns.map(col2 => calculateCorrelation(col1, col2))
  );

  const getCorrelationColor = (value: number | null) => {
    if (value === null) return 'bg-gray-100';
    const intensity = Math.abs(value);
    return value > 0 
      ? `bg-blue-${Math.round(intensity * 500)}`
      : `bg-red-${Math.round(intensity * 500)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Correlation Matrix</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="min-w-max">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2"></th>
                {numericColumns.map(col => (
                  <th key={col} className="p-2 text-sm font-medium text-left rotate-45">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {numericColumns.map((row, i) => (
                <tr key={row}>
                  <td className="p-2 text-sm font-medium">{row}</td>
                  {correlationData[i].map((value, j) => (
                    <td 
                      key={`${i}-${j}`}
                      className={`p-2 text-sm ${getCorrelationColor(value)}`}
                      title={value !== null ? value.toFixed(2) : 'N/A'}
                    >
                      {value !== null ? value.toFixed(2) : 'N/A'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};