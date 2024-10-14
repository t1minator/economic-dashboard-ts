import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { dynamicAssetAllocation } from './useDynamicAssetAllocation'; // Import the allocation function

ChartJS.register(ArcElement, Tooltip, Legend);

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

const SectorPieChart: React.FC = () => {
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

  const data = {
    labels: Object.keys(sectorWeights),
    datasets: [
      {
        label: 'Sector Weights',
        data: Object.values(sectorWeights),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
        ],
        hoverBackgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
        ],
      },
    ],
  };

  return (
    <div>
      <h2>Dynamic Asset Allocation Pie Chart</h2>
      <Pie data={data} />
    </div>
  );
};

export default SectorPieChart;