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

    const data = response.data['Realtime Currency Exchange Rate'];
    
    if (!data || Object.keys(data).length === 0) {
      throw new Error(`No exchange rate data found for ${fromCurrency} to ${toCurrency}`);
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
    throw error;
  }
};