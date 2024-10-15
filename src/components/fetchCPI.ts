import axios from 'axios';

// Define the interface for the CPI data
interface CPIData {
  year: string;
  period: string;
  periodName: string;
  value: string;
}

// Define the interface for the BLS API response
interface BLSResponse {
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

// Function to fetch the current CPI data from BLS API
const fetchCPI = async (): Promise<CPIData[] | null> => {
  const API_KEY = '91f53a655622461a86f6b34abcabc167'; // Replace with your BLS API key
  const CPI_SERIES_ID = 'CUSR0000SA0'; // The series ID for CPI for All Urban Consumers (CPI-U)

  const url = `https://api.bls.gov/publicAPI/v2/timeseries/data/${CPI_SERIES_ID}?registrationkey=${API_KEY}`;

  try {
    const response = await axios.get<BLSResponse>(url);

    if (response.data.status === 'REQUEST_SUCCEEDED') {
      // Return the data from the API
      return response.data.Results.series[0].data;
    } else {
      console.error('Failed to fetch CPI data:', response.data.message);
      return null;
    }
  } catch (error) {
    console.error('Error fetching CPI data:', error);
    return null;
  }
};

// Example usage of fetchCPI
fetchCPI().then((data) => {
  if (data) {
    console.log('CPI Data:', data);
  } else {
    console.log('Failed to retrieve CPI data');
  }
});