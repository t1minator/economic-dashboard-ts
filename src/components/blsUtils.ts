import axios from 'axios';


// Define the interface for the CPI data
export interface CPIData {
    year: string;
    period: string;
    periodName: string;
    value: string; // CPI value is a string, but we will convert it to a number
  }
  
  // Define the interface for the BLS API response
export  interface BLSResponse {
    status: string;
    responseTime: number;
    message: string[];
    Results: {
      series: [
        {
          seriesID: string;
          data: CPIData[];
        }
      ];
    };
  }

// Function to fetch data from the BLS API (you can use this for GDP-related series or other series)
export const fetchBLSData = async (seriesID: string): Promise<BLSResponse | null> => {
  const API_KEY = '91f53a655622461a86f6b34abcabc167'; // Replace with your BLS API key
  const url = `https://api.bls.gov/publicAPI/v2/timeseries/data/${seriesID}?registrationkey=${API_KEY}`;

  try {
    const response = await axios.get<BLSResponse>(url);

    if (response.data.status === 'REQUEST_SUCCEEDED') {
      return response.data;
    } else {
      console.error('Failed to fetch data from BLS:', response.data.message);
      return null;
    }
  } catch (error) {
    console.error('Error fetching data from BLS:', error);
    return null;
  }
};

// Helper function to get the latest value from a BLS series
export const fetchLatestBLSData = async (seriesID: string): Promise<string | null> => {
  const blsData = await fetchBLSData(seriesID);

  if (blsData && blsData.Results.series[0].data.length > 0) {
    // Get the most recent data point
    const latestData = blsData.Results.series[0].data[0];
    return `Latest data for ${seriesID}: ${latestData.value} (${latestData.periodName} ${latestData.year})`;
  } else {
    console.log('No data available for the series.');
    return null;
  }
};