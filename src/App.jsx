import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StockSymbolManager from './components/StockSymbolManager';
import ScheduleStatus from './components/ScheduleStatus';
import StockList from './components/StockList';
import ActionButtons from './components/ActionButtons';
import ExchangeRateWidget from './components/ExchangeRateWidget';
import CurrencyConverter from './components/CurrencyConverter';
import { useStockScheduler } from './hooks/useStockScheduler';
import { convertToCSV, downloadCSV } from './services/csvService';
import SafeIcon from './common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp } = FiIcons;

function App() {
  const [stockSymbols, setStockSymbols] = useState([
    'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'
  ]);

  const {
    isRunning,
    lastRun,
    nextRun,
    history,
    currentQuotes,
    error,
    runManually
  } = useStockScheduler(stockSymbols);

  const handleDownloadHistory = () => {
    if (history.length === 0) return;
    
    const allQuotes = history.flatMap(entry => 
      entry.quotes.map(quote => ({
        ...quote,
        date: new Date(entry.timestamp).toISOString().split('T')[0]
      }))
    );
    
    const csvContent = convertToCSV(allQuotes);
    const filename = `stock-quotes-history-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, filename);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <SafeIcon icon={FiTrendingUp} className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">
              Stock Quotes Scheduler
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Acquisisce automaticamente le quotazioni azionarie ogni giorno alle 08:00 
            e le salva in un file CSV per il monitoraggio e l'analisi.
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <StockSymbolManager
                symbols={stockSymbols}
                onSymbolsChange={setStockSymbols}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ScheduleStatus
                isRunning={isRunning}
                lastRun={lastRun}
                nextRun={nextRun}
                error={error}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ActionButtons
                onRunManually={runManually}
                onDownloadHistory={handleDownloadHistory}
                isRunning={isRunning}
                hasData={history.length > 0}
              />
            </motion.div>
            
            {/* Exchange Rate Widget */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ExchangeRateWidget />
            </motion.div>
            
            {/* Currency Converter */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <CurrencyConverter />
            </motion.div>
          </div>

          {/* Right Column - Expanded to 2 columns */}
          <div className="space-y-6 lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <StockList
                stocks={currentQuotes}
                title="Quotazioni Attuali"
              />
            </motion.div>

            {history.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Storico Esecuzioni
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {history.slice(-5).reverse().map((entry, index) => (
                    <div
                      key={entry.timestamp}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-gray-800">
                          {new Date(entry.timestamp).toLocaleString('it-IT')}
                        </div>
                        <div className="text-sm text-gray-600">
                          {entry.quotes.length} titoli acquisiti
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {entry.filename}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center text-gray-500 text-sm"
        >
          <p>
            I dati sono forniti da Alpha Vantage. Per dati in tempo reale, 
            registrati per una chiave API gratuita.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default App;