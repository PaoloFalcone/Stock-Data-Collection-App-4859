import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useCurrencyExchange } from '../hooks/useCurrencyExchange';

const { FiRefreshCw, FiDollarSign, FiEuro } = FiIcons;

const ExchangeRateWidget = () => {
  const { data, loading, error, lastUpdated, refetch } = useCurrencyExchange('USD', 'EUR');
  
  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('it-IT');
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Tasso di Cambio</h3>
        <button 
          onClick={handleRefresh}
          disabled={loading}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <SafeIcon 
            icon={FiRefreshCw} 
            className={`w-5 h-5 text-blue-500 ${loading ? 'animate-spin' : ''}`} 
          />
        </button>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 rounded-lg text-red-700 text-sm">
          Errore: {error}
        </div>
      ) : (
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center space-x-4"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                <SafeIcon icon={FiDollarSign} className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600">USD</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-gray-800">
                {loading ? (
                  <span className="inline-block w-16 h-8 bg-gray-200 animate-pulse rounded"></span>
                ) : (
                  data?.exchangeRate.toFixed(4)
                )}
              </div>
              <span className="text-xs text-gray-500">Tasso di cambio</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-1">
                <SafeIcon icon={FiEuro} className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">EUR</span>
            </div>
          </motion.div>

          <div className="border-t border-gray-100 pt-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-600">Bid</div>
                <div className="font-medium text-gray-800">
                  {loading ? (
                    <span className="inline-block w-16 h-6 bg-gray-200 animate-pulse rounded"></span>
                  ) : (
                    data?.bid.toFixed(4)
                  )}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-600">Ask</div>
                <div className="font-medium text-gray-800">
                  {loading ? (
                    <span className="inline-block w-16 h-6 bg-gray-200 animate-pulse rounded"></span>
                  ) : (
                    data?.ask.toFixed(4)
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 text-center mt-2">
            Ultimo aggiornamento: {formatDateTime(lastUpdated)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExchangeRateWidget;