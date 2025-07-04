import axios from 'axios';

const API_KEY = 'FGS7HUKCX4OSLTAN'; // Replace with your Alpha Vantage API key
const BASE_URL = 'https://www.alphavantage.co/query';

export const fetchStockQuote = async (symbol) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol,
        apikey: API_KEY
      }
    });

    const quote = response.data['Global Quote'];
    if (!quote || Object.keys(quote).length === 0) {
      throw new Error(`No data found for symbol: ${symbol}`);
    }

    return {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: quote['10. change percent'],
      volume: parseInt(quote['06. volume']),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    throw error;
  }
};

export const fetchMultipleQuotes = async (symbols) => {
  const quotes = [];
  
  for (const symbol of symbols) {
    try {
      const quote = await fetchStockQuote(symbol);
      quotes.push(quote);
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 12000)); // 12 seconds delay
    } catch (error) {
      console.error(`Failed to fetch quote for ${symbol}:`, error);
      quotes.push({
        symbol: symbol,
        price: 0,
        change: 0,
        changePercent: '0%',
        volume: 0,
        timestamp: new Date().toISOString(),
        error: error.message
      });
    }
  }
  
  return quotes;
};
