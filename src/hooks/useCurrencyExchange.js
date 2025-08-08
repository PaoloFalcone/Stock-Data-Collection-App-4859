import { useState, useEffect, useCallback } from 'react';
import { fetchExchangeRate } from '../services/currencyApi';
import { saveToLocalStorage, loadFromLocalStorage } from '../services/csvService';

export const useCurrencyExchange = (fromCurrency, toCurrency, refreshInterval = 3600000) => {
  const [exchangeData, setExchangeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchExchangeRate(fromCurrency, toCurrency);
      setExchangeData(data);
      setLastUpdated(new Date().toISOString());
      
      // Save to local storage for persistence
      saveToLocalStorage(data, `exchange_${fromCurrency}_${toCurrency}`);
      saveToLocalStorage(new Date().toISOString(), `exchange_${fromCurrency}_${toCurrency}_updated`);
    } catch (err) {
      console.error('Error in useCurrencyExchange:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fromCurrency, toCurrency]);

  // Load cached data on initial mount
  useEffect(() => {
    const cachedData = loadFromLocalStorage(`exchange_${fromCurrency}_${toCurrency}`);
    const cachedTimestamp = loadFromLocalStorage(`exchange_${fromCurrency}_${toCurrency}_updated`);
    
    if (cachedData && cachedTimestamp) {
      setExchangeData(cachedData);
      setLastUpdated(cachedTimestamp);
    }
    
    // Initial fetch regardless of cache to ensure fresh data
    fetchData();
    
    // Set up refresh interval
    const interval = setInterval(fetchData, refreshInterval);
    
    return () => clearInterval(interval);
  }, [fromCurrency, toCurrency, refreshInterval, fetchData]);

  return {
    data: exchangeData,
    loading,
    error,
    lastUpdated,
    refetch: fetchData
  };
};