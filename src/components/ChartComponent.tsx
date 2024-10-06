import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { restClient } from '@polygon.io/client-js';

import 'chart.js/auto'; // Required for Chart.js to work in TypeScript
const apiKey = process.env.REACT_APP_POLYGON_API_KEY;
const polygonClient = restClient(apiKey);

// Define types for props
interface ChartComponentProps {
  symbol: string;
  title: string;
  label: string;
  startDate: Date;
  endDate: Date;
}

// Define types for the data
interface Dataset {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    fill: boolean;
  }>;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ symbol, title, label, startDate, endDate }) => {
  const [chartData, setChartData] = useState<Dataset | null>(null);
  
  // Helper function to format data for charts
  const formatDataForChart = (data: any[], label: string): Dataset => {
    return {
      labels: data.map((item) => item.date),
      datasets: [
        {
          label: label,
          data: data.map((item) => item.value),
          borderColor: 'rgba(75, 192, 192, 1)',
          fill: false,
        },
      ],
    };
  };

  // Helper function to safely get results from API response
  const getSafeResults = (response: any): any[] => {
    return response && response.results ? response.results : [];
  };

  // Format dates to YYYY-MM-DD for API calls
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    // Fetch data for the chart
    const fetchData = async () => {
      try {
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);
  
        const response = await polygonClient.stocks.aggregates(symbol, 1, 'day', formattedStartDate, formattedEndDate);
        const results = getSafeResults(response);
  
        if (results.length) {
          const data = results.map((item: any) => ({
            date: new Date(item.t).toLocaleDateString(),
            value: item.c,
          }));
  
          setChartData(formatDataForChart(data, label));
        }
      } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
      }
    };
  
    fetchData(); // Fetch data when component mounts or dates change
  }, [startDate, endDate]);

  return (
    <div className="chart-container">
      <h2>{title}</h2>
      {chartData && <Line data={chartData} /> }
    </div>
  );
};

export default ChartComponent;
