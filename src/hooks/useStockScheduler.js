import { useState, useEffect, useCallback } from 'react';
import { fetchMultipleQuotes } from '../services/stockApi';
import { convertToCSV, downloadCSV, saveToLocalStorage, loadFromLocalStorage } from '../services/csvService';

export const useStockScheduler = (stockSymbols) => {
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState(null);
  const [nextRun, setNextRun] = useState(null);
  const [history, setHistory] = useState([]);
  const [currentQuotes, setCurrentQuotes] = useState([]);
  const [error, setError] = useState(null);

  const fetchAndSaveQuotes = useCallback(async () => {
    if (!stockSymbols || stockSymbols.length === 0) {
      setError('No stock symbols provided');
      return;
    }

    setIsRunning(true);
    setError(null);
    
    try {
      const quotes = await fetchMultipleQuotes(stockSymbols);
      const timestamp = new Date().toISOString();
      
      // Update current quotes
      setCurrentQuotes(quotes);
      
      // Generate CSV
      const csvContent = convertToCSV(quotes);
      const filename = `stock-quotes-${new Date().toISOString().split('T')[0]}.csv`;
      
      // Download CSV
      downloadCSV(csvContent, filename);
      
      // Save to history
      const newEntry = {
        timestamp,
        quotes,
        filename
      };
      
      const updatedHistory = [...history, newEntry];
      setHistory(updatedHistory);
      saveToLocalStorage(updatedHistory, 'stockQuotesHistory');
      
      setLastRun(timestamp);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  }, [stockSymbols, history]);

  const calculateNextRun = useCallback(() => {
    const now = new Date();
    const next = new Date();
    next.setHours(8, 0, 0, 0);
    
    // If it's already past 8 AM today, schedule for tomorrow
    if (now.getHours() >= 8) {
      next.setDate(next.getDate() + 1);
    }
    
    return next;
  }, []);

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = loadFromLocalStorage('stockQuotesHistory');
    if (savedHistory) {
      setHistory(savedHistory);
    }
    
    // Calculate next run
    setNextRun(calculateNextRun());
  }, [calculateNextRun]);

  useEffect(() => {
    if (!stockSymbols || stockSymbols.length === 0) return;

    const checkSchedule = () => {
      const now = new Date();
      const targetTime = new Date();
      targetTime.setHours(8, 0, 0, 0);
      
      // Check if it's 8 AM and we haven't run today
      if (now.getHours() === 8 && now.getMinutes() === 0) {
        const today = now.toDateString();
        const lastRunDate = lastRun ? new Date(lastRun).toDateString() : null;
        
        if (lastRunDate !== today) {
          fetchAndSaveQuotes();
        }
      }
      
      // Update next run time
      setNextRun(calculateNextRun());
    };

    // Check every minute
    const interval = setInterval(checkSchedule, 60000);
    
    return () => clearInterval(interval);
  }, [stockSymbols, lastRun, fetchAndSaveQuotes, calculateNextRun]);

  const runManually = () => {
    fetchAndSaveQuotes();
  };

  return {
    isRunning,
    lastRun,
    nextRun,
    history,
    currentQuotes,
    error,
    runManually
  };
};