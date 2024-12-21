import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3,
  Table,
  FileDown,
  AlertTriangle,
  ScatterChart,
  BoxSelect,
  Database,
  Filter,
  Search,
  Settings,
  RefreshCw,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
    try {
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
      
      toast.success("Data exported successfully!");
    } catch (error) {
      toast.error("Failed to export data. Please try again.");
    }
  };

  return (
    <div className="space-y-6 p-4 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Database className="h-6 w-6 text-insight-600" />
          <h2 className="text-3xl font-bold text-insight-800 dark:text-insight-200">
            Exploratory Data Analysis
          </h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search in dataset..."
              className="w-full pl-10 pr-4 py-2 border rounded-md"
            />
          </div>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
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
          <Card>
            <CardHeader>
              <CardTitle>Data Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <DataPreview data={data} columns={columns} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EDADashboard;