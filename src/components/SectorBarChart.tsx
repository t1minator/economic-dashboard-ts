import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { dynamicAssetAllocation } from './useDynamicAssetAllocation'; // Import the allocation function

// Register the required components for the bar chart
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type EconomicData = {
  inflation: number;
  gdpGrowth: number;
  interestRate: number;
};

type SectorData = {
  [key: string]: {
    momentum: number;
    volatility: number;
  };
};

const SectorBarChart: React.FC = () => {
  const [sectorWeights, setSectorWeights] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    // Sample data for economic indicators and sector performance
    const economicData: EconomicData = {
      inflation: 3.0,
      gdpGrowth: 1.0,
      interestRate: 1.5,
    };

    const sectorData: SectorData = {
      Technology: { momentum: 0.12, volatility: 0.15 },
      Financials: { momentum: 0.10, volatility: 0.18 },
      Healthcare: { momentum: 0.05, volatility: 0.10 },
      Energy: { momentum: 0.08, volatility: 0.20 },
      Utilities: { momentum: 0.03, volatility: 0.08 },
      ConsumerDiscretionary: { momentum: 0.11, volatility: 0.17 },
      Industrials: { momentum: 0.09, volatility: 0.14 },
      RealEstate: { momentum: 0.04, volatility: 0.12 },
      Materials: { momentum: 0.07, volatility: 0.16 },
      CommunicationServices: { momentum: 0.06, volatility: 0.11 },
      ConsumerStaples: { momentum: 0.02, volatility: 0.07 },
    };

    // Call the dynamicAssetAllocation function and set the sector weights
    const weights = dynamicAssetAllocation(economicData, sectorData);
    setSectorWeights(weights);
  }, []);

  // Abbreviated sector labels
  const sectorFullNames: { [key: string]: string } = {
    Technology: 'Tech',
    Financials: 'Fin',
    Healthcare: 'HC',
    Energy: 'Energy',
    Utilities: 'Utils',
    ConsumerDiscretionary: 'CD',
    Industrials: 'Indust',
    RealEstate: 'RE',
    Materials: 'Mat',
    CommunicationServices: 'Comm',
    ConsumerStaples: 'CS',
  };

  // Sort sector weights in descending order
  const sortedSectors = Object.keys(sectorWeights)
    .map((key) => ({
      sector: sectorFullNames[key],
      weight: sectorWeights[key],
    }))
    .sort((a, b) => b.weight - a.weight); // Sort by weight descending

  // Separate sorted labels and weights for the chart
  const labels = sortedSectors.map((item) => item.sector);
  const weights = sortedSectors.map((item) => item.weight);

  // Data for the bar chart
  const data = {
    labels, // Use sorted labels
    datasets: [
      {
        label: 'Sector Weights',
        data: weights, // Use sorted weights
        backgroundColor: '#36A2EB',
        borderColor: '#36A2EB',
        borderWidth: 1,
      },
    ],
  };

  // Bar chart options
  const options = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Weight',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Sectors',
        },
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const fullSectorName = Object.keys(sectorFullNames).find(
              (key) => sectorFullNames[key] === context.label
            );
            const label = fullSectorName || context.label;
            return `${label}: ${context.raw.toFixed(2)}`;
          },
        },
      },
    },
  };

  // Style for the chart container
  const chartContainerStyle: React.CSSProperties = {
    width: '100%',
    height: '25vh', // Ensure chart is within 25% of viewport height
    maxHeight: '25vh',
    margin: '0 auto', // Center the chart horizontally
  };

  return (
    <div>
      <h2>Dynamic Asset Allocation Bar Chart</h2>
      <div style={chartContainerStyle}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default SectorBarChart;