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
  
  type SectorWeights = {
    [key: string]: number;
  };
  
  const GDP_GROWTH_THRESHOLD = 1.5;
  const INFLATION_THRESHOLD = 2.5;
  
  const initialSectorWeights: SectorWeights = {
    Technology: 0.0,
    Financials: 0.0,
    Healthcare: 0.0,
    Energy: 0.0,
    Utilities: 0.0,
    ConsumerDiscretionary: 0.0,
    Industrials: 0.0,
    RealEstate: 0.0,
    Materials: 0.0,
    CommunicationServices: 0.0,
    ConsumerStaples: 0.0,
  };
  
  // Adjust allocation based on economic conditions
  const adjustForEconomicConditions = (weights: SectorWeights, economicData: EconomicData): void => {
    if (economicData.gdpGrowth > GDP_GROWTH_THRESHOLD && economicData.inflation < INFLATION_THRESHOLD) {
      // Economic expansion - favor cyclical sectors
      weights.Technology += 0.2;
      weights.ConsumerDiscretionary += 0.2;
      weights.Industrials += 0.2;
    } else if (economicData.gdpGrowth < GDP_GROWTH_THRESHOLD || economicData.inflation > INFLATION_THRESHOLD) {
      // Economic contraction or recession - favor defensive sectors
      weights.Healthcare += 0.2;
      weights.Utilities += 0.2;
      weights.ConsumerStaples += 0.2;
    }
  };
  
  // Adjust allocation based on market performance
  const adjustForMarketPerformance = (weights: SectorWeights, sectorData: SectorData): void => {
    for (const sector in sectorData) {
      const data = sectorData[sector];
      if (data.momentum > 0.05 && data.volatility < 0.15) {
        weights[sector] += 0.1;
      } else if (data.volatility > 0.2) {
        weights[sector] -= 0.1;
      }
    }
  };
  
  // Main function for dynamic asset allocation
  export const dynamicAssetAllocation = (economicData: EconomicData, sectorData: SectorData): SectorWeights => {
    // Copy the initial sector weights
    const sectorWeights: SectorWeights = { ...initialSectorWeights };
  
    // Adjust based on economic and market data
    adjustForEconomicConditions(sectorWeights, economicData);
    adjustForMarketPerformance(sectorWeights, sectorData);
  
    return sectorWeights;
  };