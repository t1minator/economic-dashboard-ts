import axios from 'axios';

interface CPIData {
  year: string;
  period: string;
  periodName: string;
  value: string; // CPI value is a string, but we will convert it to a number
}

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

const fetchCPI = async (): Promise<CPIData[] | null> => {
  const API_KEY = '91f53a655622461a86f6b34abcabc167'; // Replace with your BLS API key
  const CPI_SERIES_ID = 'CUSR0000SA0'; // The series ID for CPI for All Urban Consumers (CPI-U)

  const url = `https://api.bls.gov/publicAPI/v2/timeseries/data/${CPI_SERIES_ID}?registrationkey=${API_KEY}`;

  try {
    const response = await axios.get<BLSResponse>(url);

    if (response.data.status === 'REQUEST_SUCCEEDED') {
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

// Function to calculate month-over-month inflation percentage
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const calculateMonthOverMonthInflation = (currentCPI: number, previousMonthCPI: number): number => {
    return ((currentCPI - previousMonthCPI) / previousMonthCPI) * 100;
};
// Function to calculate year-over-year inflation percentage
const calculateYearOverYearInflation = (currentCPI: number, previousCPI: number): number => {
  return ((currentCPI - previousCPI) / previousCPI) * 100;
};

// Example usage of calculating year-over-year inflation
const calculateInflationFromCPI = async () => {
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
      console.log(`Year-over-Year Inflation: ${inflationRate.toFixed(2)}%`);
    } else {
      console.log('Could not find CPI data for the previous year');
    }
  } else {
    console.log('Failed to retrieve CPI data');
  }
};

// Call the function to calculate inflation
calculateInflationFromCPI();