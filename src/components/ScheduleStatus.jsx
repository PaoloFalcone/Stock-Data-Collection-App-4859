import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiClock, FiCheckCircle, FiAlertCircle, FiLoader } = FiIcons;

const ScheduleStatus = ({ isRunning, lastRun, nextRun, error }) => {
  const formatDateTime = (dateString) => {
    if (!dateString) return 'Mai';
    const date = new Date(dateString);
    return date.toLocaleString('it-IT');
  };

  const getTimeUntilNext = () => {
    if (!nextRun) return '';
    const now = new Date();
    const next = new Date(nextRun);
    const diff = next - now;
    
    if (diff <= 0) return 'Ora';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Stato Scheduler</h3>
        {isRunning && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <SafeIcon icon={FiLoader} className="w-5 h-5 text-blue-500" />
          </motion.div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-green-500" />
            <span className="text-gray-600">Ultima esecuzione:</span>
          </div>
          <span className="font-medium text-gray-800">
            {formatDateTime(lastRun)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiClock} className="w-5 h-5 text-blue-500" />
            <span className="text-gray-600">Prossima esecuzione:</span>
          </div>
          <div className="text-right">
            <div className="font-medium text-gray-800">
              {formatDateTime(nextRun)}
            </div>
            <div className="text-sm text-gray-500">
              tra {getTimeUntilNext()}
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg">
            <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-red-500" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {isRunning && (
          <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
            <SafeIcon icon={FiLoader} className="w-5 h-5 text-blue-500" />
            <span className="text-blue-700 text-sm">
              Acquisizione quotazioni in corso...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleStatus;