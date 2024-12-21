import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartBar, Table, FileDown, AlertTriangle, BarChart3, ScatterChart, BoxSelect } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataSummary from './DataSummary';
import DataPreview from './DataPreview';
import { MissingValuesAnalysis } from './MissingValuesAnalysis';
import { DistributionPlot } from './DistributionPlot';
import { CorrelationMatrix } from './CorrelationMatrix';

interface EDADashboardProps {
  data: Array<Record<string, any>>;
  columns: string[];
}

const EDADashboard: React.FC<EDADashboardProps> = ({ data, columns }) => {
  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      columns.join(",") + "\n" +
      data.map(row => columns.map(col => row[col]).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "processed_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 p-4 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-insight-800 dark:text-insight-200">
          Exploratory Data Analysis
        </h2>
        <Button onClick={handleExport} className="flex items-center gap-2">
          <FileDown className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList className="grid grid-cols-5 gap-4 bg-muted p-1">
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <Table className="h-4 w-4" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="missing" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Missing Values
          </TabsTrigger>
          <TabsTrigger value="distribution" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Distribution
          </TabsTrigger>
          <TabsTrigger value="correlation" className="flex items-center gap-2">
            <ScatterChart className="h-4 w-4" />
            Correlation
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <BoxSelect className="h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <DataSummary data={data} columns={columns} />
        </TabsContent>

        <TabsContent value="missing" className="space-y-4">
          <MissingValuesAnalysis data={data} columns={columns} />
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <DistributionPlot data={data} columns={columns} />
        </TabsContent>

        <TabsContent value="correlation" className="space-y-4">
          <CorrelationMatrix data={data} columns={columns} />
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <DataPreview data={data} columns={columns} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EDADashboard;