import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import EDADashboard from '@/components/EDADashboard';
import Papa from 'papaparse';

const Index = () => {
  const [data, setData] = useState<Array<Record<string, any>>>([]);
  const [columns, setColumns] = useState<string[]>([]);

  const handleFileUpload = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setData(results.data);
        if (results.data.length > 0) {
          setColumns(Object.keys(results.data[0]));
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-insight-600 to-purple-600 bg-clip-text text-transparent">
          InsightForge
        </h1>
        
        {data.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <FileUpload onFileUpload={handleFileUpload} />
          </div>
        ) : (
          <EDADashboard data={data} columns={columns} />
        )}
      </div>
    </div>
  );
};

export default Index;