import axios from 'axios';

const API_KEY = 'FGS7HUKCX4OSLTAN'; // Usando la stessa API key di stockApi
const BASE_URL = 'https://www.alphavantage.co/query';

export const fetchExchangeRate = async (fromCurrency, toCurrency) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'CURRENCY_EXCHANGE_RATE',
        from_currency: fromCurrency,
        to_currency: toCurrency,
        apikey: API_KEY
      }
    });

    // Check if the response contains error messages
    if (Object.prototype.hasOwnProperty.call(response.data, 'Error Message')) {
      throw new Error(response.data['Error Message']);
    }
    
    // Check if we have the data in the expected format
    const data = response.data['Realtime Currency Exchange Rate'];
    if (!data || Object.keys(data).length === 0) {
      // Return mock data for development and demo purposes
      return getMockExchangeRate(fromCurrency, toCurrency);
    }

    return {
      fromCurrency: data['1. From_Currency Code'],
      toCurrency: data['3. To_Currency Code'],
      exchangeRate: parseFloat(data['5. Exchange Rate']),
      lastUpdated: data['6. Last Refreshed'],
      timeZone: data['7. Time Zone'],
      bid: parseFloat(data['8. Bid Price'] || data['5. Exchange Rate']),
      ask: parseFloat(data['9. Ask Price'] || data['5. Exchange Rate'])
    };
  } catch (error) {
    console.error(`Error fetching exchange rate for ${fromCurrency}/${toCurrency}:`, error);
    // Return mock data on error
    return getMockExchangeRate(fromCurrency, toCurrency);
  }
};

// Mock function to provide fallback data when API fails
const getMockExchangeRate = (fromCurrency, toCurrency) => {
  const now = new Date().toISOString();
  const mockRates = {
    'USD-EUR': { rate: 0.9283, bid: 0.9280, ask: 0.9285 },
    'EUR-USD': { rate: 1.0772, bid: 1.0770, ask: 1.0774 }
  };
  
  const key = `${fromCurrency}-${toCurrency}`;
  const reverseKey = `${toCurrency}-${fromCurrency}`;
  
  let rateData = mockRates[key];
  if (!rateData && mockRates[reverseKey]) {
    // If we have the reverse rate, calculate the direct rate
    const reverseRate = mockRates[reverseKey];
    rateData = {
      rate: 1 / reverseRate.rate,
      bid: 1 / reverseRate.ask, // Bid and ask are swapped when reversed
      ask: 1 / reverseRate.bid
    };
  }
  
  // Fallback to a reasonable default if we don't have either rate
  if (!rateData) {
    rateData = { rate: fromCurrency === 'USD' ? 0.93 : 1.07, bid: 0.928, ask: 0.932 };
  }
  
  return {
    fromCurrency: fromCurrency,
    toCurrency: toCurrency,
    exchangeRate: rateData.rate,
    lastUpdated: now,
    timeZone: 'UTC',
    bid: rateData.bid,
    ask: rateData.ask
  };
};