import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { restClient } from '@polygon.io/client-js';
import 'chart.js/auto'; // Required for Chart.js to work in TypeScript
import './Dashboard.css';

const apiKey = process.env.REACT_APP_POLYGON_API_KEY;
const polygonClient = restClient(apiKey);

// Types for the Polygon.io data
interface ChartData {
  date: string;
  value: number;
}

interface Dataset {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    fill: boolean;
  }>;
}

const Dashboard: React.FC = () => {
  const [treasurySpreadData, setTreasurySpreadData] = useState<Dataset | null>(null);
  const [sp500Data, setSp500Data] = useState<Dataset | null>(null);
  const [dowData, setDowData] = useState<Dataset | null>(null);
  const [nasdaqData, setNasdaqData] = useState<Dataset | null>(null);

  // Helper function to format data for charts
  const formatDataForChart = (data: ChartData[], label: string): Dataset => {
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

  // Fetch 2Y/5Y Treasury Spread data
  const fetchTreasurySpread = async () => {
    try {
        // Fetch 2-year and 5-year Treasury data using Polygon.io
        const twoYear = await polygonClient.stocks.aggregates('BIL', 1, 'day', '2020-01-01', '2024-12-31');
        const fiveYear = await polygonClient.stocks.aggregates('IEI', 1, 'day', '2020-01-01', '2024-12-31');
        
        const twoYrResults = twoYear.results;
        const fiveYrResults = fiveYear.results;
        if (!twoYrResults?.length || !fiveYrResults?.length) {
          throw new Error('No data found');
        }
        
      // Compute spread
      const spread = twoYrResults.map((item: any, index: number) => ({
        date: new Date(item.t).toLocaleDateString(),
        value: fiveYrResults[index] && (item.c - (fiveYrResults[index].c || 0) ),
      }));

      setTreasurySpreadData(formatDataForChart(spread, '2Y/5Y Treasury Spread'));
    } catch (error) {
      console.error('Error fetching Treasury spread data:', error);
    }
  };

  // Fetch S&P 500 data
  const fetchSp500Data = async () => {
    try {
      const sp500 = await polygonClient.stocks.aggregates('SPY', 1, 'day', '2020-01-01', '2024-12-31');
      const results = sp500.results;

      const data = results && results.map((item: any) => ({
        date: new Date(item.t).toLocaleDateString(),
        value: item.c,
      }));

      data && setSp500Data(formatDataForChart(data, 'S&P 500'));
    } catch (error) {
      console.error('Error fetching S&P 500 data:', error);
    }
  };

  // Fetch DOW data
  const fetchDowData = async () => {
    try {
      const dow = await polygonClient.stocks.aggregates('DIA', 1, 'day', '2020-01-01', '2024-12-31');
      const results = dow.results;
    
      const data = results && results.map((item: any) => ({
        date: new Date(item.t).toLocaleDateString(),
        value: item.c,
      }));

      data && setDowData(formatDataForChart(data, 'DOW'));
    } catch (error) {
      console.error('Error fetching DOW data:', error);
    }
  };

  // Fetch Nasdaq data
  const fetchNasdaqData = async () => {
    try {
      const nasdaq = await polygonClient.stocks.aggregates('QQQ', 1, 'day', '2020-01-01', '2024-12-31');
        const results = nasdaq.results;
    
      const data =results && results.map((item: any) => ({
        date: new Date(item.t).toLocaleDateString(),
        value: item.c,
      }));

      data && setNasdaqData(formatDataForChart(data, 'Nasdaq'));
    } catch (error) {
      console.error('Error fetching Nasdaq data:', error);
    }
  };

  useEffect(() => {
    // Fetch all data on component mount
    fetchTreasurySpread();
    fetchSp500Data();
    fetchDowData();
    fetchNasdaqData();

    // Set interval to update data every minute
    const interval = setInterval(() => {
      fetchTreasurySpread();
      fetchSp500Data();
      fetchDowData();
      fetchNasdaqData();
    }, 60000); // 1-minute intervals for real-time updates

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div>
      <h1>Economic Dashboard</h1>

      <div className="chart-container">
        <h2>2Y/5Y Treasury Spread</h2>
        {treasurySpreadData && <Line data={treasurySpreadData} />}
      </div>

      <div className="chart-container">
        <h2>S&P 500</h2>
        {sp500Data && <Line data={sp500Data} />}
      </div>

      <div className="chart-container">
        <h2>DOW</h2>
        {dowData && <Line data={dowData} />}
      </div>

      <div className="chart-container">
        <h2>Nasdaq</h2>
        {nasdaqData && <Line data={nasdaqData} />}
      </div>
    </div>
  );
};

export default Dashboard;
