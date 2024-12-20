import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import DataPreview from '@/components/DataPreview';
import DataSummary from '@/components/DataSummary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
          <Tabs defaultValue="preview" className="space-y-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="preview">Data Preview</TabsTrigger>
              <TabsTrigger value="summary">Data Summary</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview" className="animate-fadeIn">
              <DataPreview data={data} columns={columns} />
            </TabsContent>
            
            <TabsContent value="summary" className="animate-fadeIn">
              <DataSummary data={data} columns={columns} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Index;