import axios from 'axios';
import { BLSResponse, CPIData, fetchBLSData } from './blsUtils';


// Fetch the CPI data from the BLS API
export const fetchCPI = async (): Promise<CPIData[] > => {
  const CPI_SERIES_ID = 'CUSR0000SA0'; // The series ID for CPI for All Urban Consumers (CPI-U)

  try {
    const response = await fetchBLSData(CPI_SERIES_ID);

    if (response?.status === 'REQUEST_SUCCEEDED') {
      return response.Results.series[0].data;
    } else {
      console.error('Failed to fetch CPI data:', response?.message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching CPI data:', error);
    return [];
  }
};

// Calculate year-over-year inflation percentage
export const calculateYearOverYearInflation = (currentCPI: number, previousCPI: number): number => {
  return ((currentCPI - previousCPI) / previousCPI) * 100;
};

// Main method to fetch and calculate inflation from CPI data
export const calculateInflationFromCPI = async (): Promise<number | null> => {
  const cpiData = await fetchCPI();

  if (cpiData && cpiData.length > 0) {
    // Find the latest CPI (current period)
    const currentCPIValue = parseFloat(cpiData[0].value); // Most recent CPI

    // Find the CPI value for the same period last year (previous year)
    const currentYear = cpiData[0].year;
    const currentPeriod = cpiData[0].period;

    const previousYearCPI = cpiData.find(
      (data) => data.year === (parseInt(currentYear) - 1).toString() && data.period === currentPeriod
    );

    if (previousYearCPI) {
      const previousCPIValue = parseFloat(previousYearCPI.value); // CPI for the previous year

      // Calculate the inflation percentage
      const inflationRate = calculateYearOverYearInflation(currentCPIValue, previousCPIValue);
      return inflationRate;
    } else {
      console.log('Could not find CPI data for the previous year');
      return null;
    }
  } else {
    console.log('Failed to retrieve CPI data');
    return null;
  }
};


// New utility method to fetch the current risk-free rate (e.g., the yield on the 10-year U.S. Treasury bond)
export const fetchRiskFreeRate = async (): Promise<number | null> => {
    const API_KEY = 'YOUR_ALPHA_VANTAGE_API_KEY'; // Replace with your Alpha Vantage API key
    const TREASURY_10YR_SERIES = '10Y'; // 10-Year Treasury Bond Yield
  
    const url = `https://www.alphavantage.co/query?function=TREASURY_YIELD&interval=monthly&maturity=${TREASURY_10YR_SERIES}&apikey=${API_KEY}`;
  
    try {
      const response = await axios.get(url);
  
      if (response.data && response.data.data && response.data.data.length > 0) {
        const latestRate = parseFloat(response.data.data[0].value);
        return latestRate;
      } else {
        console.error('Failed to fetch the risk-free rate data.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching the risk-free rate:', error);
      return null;
    }
  };

  // Fetch GDP data using Alpha Vantage
export const fetchGDP = async (): Promise<number | null> => {
    const API_KEY = 'YOUR_ALPHA_VANTAGE_API_KEY'; // Replace with your Alpha Vantage API key
    const url = `https://www.alphavantage.co/query?function=REAL_GDP&interval=annual&apikey=${API_KEY}`;
  
    try {
      const response = await axios.get(url);
  
      if (response.data && response.data.data && response.data.data.length > 0) {
        const latestGDP = parseFloat(response.data.data[0].value); // Get the latest GDP value
        return latestGDP;
      } else {
        console.error('Failed to fetch GDP data.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching GDP data:', error);
      return null;
    }
  };
  
  // Fetch Unemployment Rate from BLS API
  export const fetchUnemploymentRate = async (): Promise<number | null> => {
    
    const UNEMPLOYMENT_SERIES_ID = 'LNS14000000'; // Series ID for the U.S. Unemployment Rate
    const API_KEY = '91f53a655622461a86f6b34abcabc167';
    const url = `https://api.bls.gov/publicAPI/v2/timeseries/data/${UNEMPLOYMENT_SERIES_ID}?registrationkey=${API_KEY}`;
  
    try {
      const response = await axios.get<BLSResponse>(url);
  
      if (response.data.status === 'REQUEST_SUCCEEDED') {
        const latestUnemploymentRate = parseFloat(response.data.Results.series[0].data[0].value); // Latest value
        return latestUnemploymentRate;
      } else {
        console.error('Failed to fetch unemployment rate data:', response.data.message);
        return null;
      }
    } catch (error) {
      console.error('Error fetching unemployment rate:', error);
      return null;
    }
  };