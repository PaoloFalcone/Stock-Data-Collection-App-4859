import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiTrash2, FiEdit3, FiCheck, FiX } = FiIcons;

const StockSymbolManager = ({ symbols, onSymbolsChange }) => {
  const [newSymbol, setNewSymbol] = useState('');
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editingValue, setEditingValue] = useState('');

  const addSymbol = () => {
    if (newSymbol.trim() && !symbols.includes(newSymbol.trim().toUpperCase())) {
      onSymbolsChange([...symbols, newSymbol.trim().toUpperCase()]);
      setNewSymbol('');
    }
  };

  const removeSymbol = (index) => {
    onSymbolsChange(symbols.filter((_, i) => i !== index));
  };

  const startEditing = (index, value) => {
    setEditingIndex(index);
    setEditingValue(value);
  };

  const saveEdit = () => {
    if (editingValue.trim()) {
      const newSymbols = [...symbols];
      newSymbols[editingIndex] = editingValue.trim().toUpperCase();
      onSymbolsChange(newSymbols);
    }
    setEditingIndex(-1);
    setEditingValue('');
  };

  const cancelEdit = () => {
    setEditingIndex(-1);
    setEditingValue('');
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    } else if (e.key === 'Escape' && action === cancelEdit) {
      cancelEdit();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Gestione Titoli Azionari
      </h3>

      {/* Add new symbol */}
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={newSymbol}
          onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
          onKeyPress={(e) => handleKeyPress(e, addSymbol)}
          placeholder="Aggiungi simbolo (es. AAPL)"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addSymbol}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4" />
          <span>Aggiungi</span>
        </button>
      </div>

      {/* Symbols list */}
      <div className="space-y-2">
        {symbols.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Nessun titolo configurato. Aggiungi alcuni simboli per iniziare.
          </p>
        ) : (
          symbols.map((symbol, index) => (
            <motion.div
              key={`${symbol}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              {editingIndex === index ? (
                <div className="flex items-center space-x-2 flex-1">
                  <input
                    type="text"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value.toUpperCase())}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') saveEdit();
                      if (e.key === 'Escape') cancelEdit();
                    }}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={saveEdit}
                    className="p-1 text-green-600 hover:bg-green-100 rounded"
                  >
                    <SafeIcon icon={FiCheck} className="w-4 h-4" />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <SafeIcon icon={FiX} className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <span className="font-medium text-gray-800">{symbol}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => startEditing(index, symbol)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    >
                      <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeSymbol(index)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))
        )}
      </div>

      {symbols.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Nota:</strong> Con la chiave API demo, le quotazioni potrebbero non essere aggiornate. 
            Ottieni una chiave API gratuita da Alpha Vantage per dati in tempo reale.
          </p>
        </div>
      )}
    </div>
  );
};

export default StockSymbolManager;