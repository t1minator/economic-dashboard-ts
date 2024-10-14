import React, { useState } from 'react';
import SectorBarChart from './SectorBarChart';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ChartComponent from './ChartComponent';
import './Dashboard.css';

type ChartParameter = {
    symbol: string;
    title: string;
    label: string;
    startDate: Date;
    endDate: Date;
};
  // Style for the chart container
  const chartContainerStyle: React.CSSProperties = {
    width: '15%',
    alignContent: 'start',
    margin: '0 auto', // Center the chart horizontally
  };
const Dashboard: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  return (
    <div className="dashboard-container">
        <div className="header-container">
        <h1>Economic Dashboard</h1>

        <div className="date-picker-container">
            <div style={{ padding: '10px' }}>
              <label>Select Start Date: </label>
              <DatePicker selected={startDate} onChange={(date: Date | null) => setStartDate(date)} />
            </div>
            <div style={{ padding: '10px' }}>
              <label>Select End Date: </label>
              <DatePicker selected={endDate} onChange={(date: Date | null) => setEndDate(date)} />
            </div>
        </div>
      </div>
      <div >
      <SectorBarChart />
    </div>
      {/* Use ChartComponent for each chart */}
      {startDate && endDate && (
        <div className="chart-grid-container">
          {['1w', '1m', '3m'].map((duration) => {
            const endDate = new Date();
            let startDate = new Date();
            switch (duration) {
              case '1w':
                startDate.setDate(endDate.getDate() - 7);
                break;
              case '1m':
                startDate.setMonth(endDate.getMonth() - 1);
                break;
              case '3m':
                startDate.setMonth(endDate.getMonth() - 3);
                break;
            }
           
            const defaultParameters: ChartParameter[] = [
                { symbol: 'IEI', title: '10 Year Treasury', label: 'IEI', startDate, endDate },
                { symbol: 'TLT', title: '20 Year Treasury', label: 'TLT', startDate, endDate },
                { symbol: 'DOW', title: 'DOW', label: 'DOW', startDate, endDate },
                { symbol: 'QQQ', title: 'Nasdaq', label: 'QQQ', startDate, endDate },
                { symbol: 'SPY', title: 'S&P 500', label: 'SPX', startDate, endDate },
            ];

            const banks: ChartParameter[] = [
                { symbol: 'JPM', title: 'JPMorgan Chase', label: 'JPM', startDate, endDate },
                { symbol: 'BAC', title: 'Bank of America', label: 'BAC', startDate, endDate },
                { symbol: 'FITB', title: 'Fifth Third Bank', label: 'FITB', startDate, endDate },
                { symbol: 'INTR', title: 'Interbank', label: 'INTR', startDate, endDate },
                { symbol: 'WFC', title: 'Wells Fargo', label: 'WFC', startDate, endDate },
            ];

            const semiconductors: ChartParameter[] = [
                { symbol: 'NVDA', title: 'NVIDIA', label: 'NVDA', startDate, endDate },
                { symbol: 'AMD', title: 'Advanced Micro Devices', label: 'AMD', startDate, endDate },
                { symbol: 'INTC', title: 'Intel', label: 'INTC', startDate, endDate },
                { symbol: 'TSM', title: 'Taiwan Semiconductor', label: 'TSM', startDate, endDate },
                { symbol: 'ASML', title: 'ASML Holding', label: 'ASML', startDate, endDate },
            ];

            const chartParameters: ChartParameter[] = [...defaultParameters, ...banks, ...semiconductors];
            

   
            return (
                <React.Fragment key={duration}>
                    {chartParameters.map(({ symbol, title, label }) => (
                        <ChartComponent
                            key={symbol}
                            symbol={symbol}
                            title={`${title} (${duration})`}
                            label={label}
                            startDate={startDate}
                            endDate={endDate}
                        />
                    ))}
                </React.Fragment>
            );
            
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
