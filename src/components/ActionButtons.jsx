import React from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlay, FiDownload, FiRefreshCw } = FiIcons;

const ActionButtons = ({ onRunManually, onDownloadHistory, isRunning, hasData }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Azioni</h3>
      
      <div className="space-y-3">
        <button
          onClick={onRunManually}
          disabled={isRunning}
          className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
            isRunning
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          <SafeIcon 
            icon={isRunning ? FiRefreshCw : FiPlay} 
            className={`w-5 h-5 ${isRunning ? 'animate-spin' : ''}`} 
          />
          <span>
            {isRunning ? 'Acquisizione in corso...' : 'Esegui ora'}
          </span>
        </button>

        <button
          onClick={onDownloadHistory}
          disabled={!hasData}
          className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
            !hasData
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          <SafeIcon icon={FiDownload} className="w-5 h-5" />
          <span>Scarica storico CSV</span>
        </button>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Programmazione automatica:</strong> L'app acquisisce automaticamente 
          le quotazioni ogni giorno alle 08:00 e scarica il file CSV.
        </p>
      </div>
    </div>
  );
};

export default ActionButtons;