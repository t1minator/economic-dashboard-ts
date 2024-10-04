import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { restClient } from '@polygon.io/client-js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Helper function to format data for charts
const formatDataForChart = (data: ChartData[], label: string): Dataset => {
    return {
        labels: data.map((item) => item?.date || ''),      
        datasets: [
            {
                label: label,
                data: data.map((item) => item?.value || 0),
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
            },
        ],
    };
};

  // Format dates to YYYY-MM-DD for API calls
  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  // Function to safely get results from API response and check for null/undefined
  const getSafeResults = (response: any): any[] => {
    return response && response.results ? response.results : [];
  };
const API_CALL_LIMIT = 5;  // Maximum number of API calls allowed per minute
let apiCallCount = 0;      // Counter to track API calls
let queue: (() => void)[] = [];  // Queue to hold pending API calls

// Function to reset the API call count after 60 seconds
const resetApiCallCount = () => {
  apiCallCount = 0;
  if (queue.length > 0) {
    // Process any pending API calls from the queue
    queue.forEach(call => call());
    queue = [];
  }
};

// Set up the interval to reset the API call counter every 60 seconds
setInterval(resetApiCallCount, 60000);

// Generalized fetch function to handle different symbols and datasets
const fetchData = async (symbol: string, label: string): Promise<Dataset | null> => {
  return new Promise((resolve, reject) => {
    const makeApiCall = async () => {
      if (apiCallCount < API_CALL_LIMIT) {
        // Increment the counter before making the API call
        apiCallCount++;
        try {
          const formattedStartDate = formatDate(startDate);
          const formattedEndDate = formatDate(endDate);

          // Fetch data for the given symbol using the polygon.io client
          const response = await polygonClient.stocks.aggregates(symbol, 1, 'day', formattedStartDate, formattedEndDate);
          const results = getSafeResults(response);

          if (results.length) {
            const data = results.map((item: any) => ({
              date: new Date(item.t).toLocaleDateString(),
              value: item.c,
            }));

            // Format the data for charting and resolve the promise
            resolve(formatDataForChart(data, label));
          } else {
            resolve(null);  // No data available
          }
        } catch (error) {
          console.error(`Error fetching data for ${symbol}:`, error);
          reject(error);
        }
      } else {
        // Queue the API call if the rate limit is reached
        queue.push(makeApiCall);
      }
    };

    // Make the API call (or queue it if the limit is reached)
    makeApiCall();
  });
};

// Example usage for all symbols
const fetchAllData = async () => {
  try {
    const treasurySpreadData = await fetchData('BIL', 'BIL/IEI Spread');
    const sp500Data = await fetchData('SPY', 'S&P 500');
    const dowData = await fetchData('DIA', 'DOW');
    const nasdaqData = await fetchData('QQQ', 'Nasdaq');

    // Set the state for each dataset
    setTreasurySpreadData(treasurySpreadData);
    setSp500Data(sp500Data);
    setDowData(dowData);
    setNasdaqData(nasdaqData);
  } catch (error) {
    console.error('Error fetching all data:', error);
  }
};

useEffect(() => {
  fetchAllData(); // Fetch all data on mount or when date range changes
}, [startDate, endDate]);


  return (
    <div>
      <h1>Economic Dashboard</h1>

      <div className="date-picker-container">
        <label>Select Start Date: </label>
        <DatePicker 
            selected={startDate} 
            onChange={(date: Date | null) => setStartDate(date)} 
        />
        <label>Select End Date: </label>
        <DatePicker 
            selected={endDate} 
            onChange={(date: Date | null) => setEndDate(date)} 
        />
      </div>

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
