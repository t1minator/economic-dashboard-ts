import React, { useEffect, useState } from 'react';
import { fetchGDP, fetchUnemploymentRate, calculateInflationFromCPI } from './cpiUtils'; // Assume these functions are defined to fetch data

const MacroEconomicFactors: React.FC = () => {
  const [gdp, setGDP] = useState<number | null>(null);
  const [unemploymentRate, setUnemploymentRate] = useState<number | null>(null);
  const [cpi, setCPI] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const gdpData = await fetchGDP();
      const unemploymentData = await fetchUnemploymentRate();
      const cpiData = await calculateInflationFromCPI();
        console.log(unemploymentData);
      setGDP(gdpData);
      setUnemploymentRate(unemploymentData);
      cpiData && setCPI(parseFloat(cpiData.toFixed(2)));
    
    };

    fetchData();
  }, []);

  return (
    <div className="macro-economic-factors">
      <h2>Macro Economic Factors</h2>
      <p>GDP: {gdp ? gdp.toFixed(2) : 'Loading...'}%</p>
      <p>Unemployment Rate: {unemploymentRate ? unemploymentRate.toFixed(2) : 'Loading...'}%</p>
      <p>CPI: {cpi ? cpi.toFixed(2) : 'Loading...'}%</p>
    </div>
  );
};

export default MacroEconomicFactors;
