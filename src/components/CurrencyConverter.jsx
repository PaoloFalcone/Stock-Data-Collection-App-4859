import React, { useState, useEffect } from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useCurrencyExchange } from '../hooks/useCurrencyExchange';

const { FiDollarSign, FiEuro, FiArrowRight } = FiIcons;

const CurrencyConverter = () => {
  const { data } = useCurrencyExchange('USD', 'EUR');
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState(null);
  
  // Update result whenever amount or exchange rate changes
  useEffect(() => {
    if (data?.exchangeRate && amount) {
      const numericAmount = parseFloat(amount);
      if (!isNaN(numericAmount)) {
        if (fromCurrency === 'USD' && toCurrency === 'EUR') {
          setResult(numericAmount * data.exchangeRate);
        } else {
          // EUR to USD
          setResult(numericAmount / data.exchangeRate);
        }
      }
    }
  }, [amount, data, fromCurrency, toCurrency]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Convertitore</h3>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-1/2">
            <label htmlFor="amount" className="block text-sm text-gray-600 mb-1">Importo</label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Inserisci importo"
            />
          </div>
          
          <div className="w-1/2">
            <label className="block text-sm text-gray-600 mb-1">Valuta</label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleSwap()}
                className={`flex-1 px-3 py-2 rounded-lg border ${
                  fromCurrency === 'USD' ? 'bg-blue-100 border-blue-300' : 'bg-green-100 border-green-300'
                } flex items-center justify-center space-x-2`}
              >
                <SafeIcon 
                  icon={fromCurrency === 'USD' ? FiDollarSign : FiEuro} 
                  className={`w-4 h-4 ${fromCurrency === 'USD' ? 'text-blue-600' : 'text-green-600'}`} 
                />
                <span>{fromCurrency}</span>
              </button>
              
              <button 
                onClick={handleSwap}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <SafeIcon icon={FiArrowRight} className="w-4 h-4 text-gray-500" />
              </button>
              
              <button
                onClick={() => handleSwap()}
                className={`flex-1 px-3 py-2 rounded-lg border ${
                  toCurrency === 'EUR' ? 'bg-green-100 border-green-300' : 'bg-blue-100 border-blue-300'
                } flex items-center justify-center space-x-2`}
              >
                <SafeIcon 
                  icon={toCurrency === 'EUR' ? FiEuro : FiDollarSign} 
                  className={`w-4 h-4 ${toCurrency === 'EUR' ? 'text-green-600' : 'text-blue-600'}`} 
                />
                <span>{toCurrency}</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Risultato</div>
            <div className="text-xl font-bold text-gray-800">
              {result !== null ? (
                <>
                  {amount} {fromCurrency} = {result.toFixed(4)} {toCurrency}
                </>
              ) : (
                <span className="text-gray-400">--</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;