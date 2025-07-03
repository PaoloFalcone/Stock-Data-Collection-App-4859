import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiTrendingDown, FiMinus } = FiIcons;

const StockList = ({ stocks, title }) => {
  const getChangeIcon = (change) => {
    if (change > 0) return FiTrendingUp;
    if (change < 0) return FiTrendingDown;
    return FiMinus;
  };

  const getChangeColor = (change) => {
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      
      {stocks.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Nessun dato disponibile</p>
      ) : (
        <div className="space-y-3">
          {stocks.map((stock, index) => (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">
                    {stock.symbol.substring(0, 2)}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{stock.symbol}</h4>
                  {stock.error && (
                    <p className="text-xs text-red-500">{stock.error}</p>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-800">
                    ${stock.price.toFixed(2)}
                  </span>
                  <SafeIcon 
                    icon={getChangeIcon(stock.change)}
                    className={`w-4 h-4 ${getChangeColor(stock.change)}`}
                  />
                </div>
                <div className={`text-sm ${getChangeColor(stock.change)}`}>
                  {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent})
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StockList;