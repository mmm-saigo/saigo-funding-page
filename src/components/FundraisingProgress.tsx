import React from 'react';
import { FUNDRAISING_GOAL, FUNDRAISING_CURRENT, getCurrentNetworkCurrency } from '../constants';

interface FundraisingProgressProps {
  className?: string;
}

const FundraisingProgress: React.FC<FundraisingProgressProps> = ({ className = '' }) => {
  const progressPercentage = Math.min((FUNDRAISING_CURRENT / FUNDRAISING_GOAL) * 100, 100);
  const formattedCurrent = FUNDRAISING_CURRENT.toLocaleString();
  const formattedGoal = FUNDRAISING_GOAL.toLocaleString();
  
  // 获取当前网络的原生代币符号
  const nativeCurrency = getCurrentNetworkCurrency();
  
  return (
    <div className={`bg-white rounded-xl shadow-md p-4 w-full max-w-md ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">Fundraising Progress</h3>
        <span className="text-sm font-medium text-blue-600">
          {progressPercentage.toFixed(1)}%
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">
          <span className="font-semibold text-blue-700">{formattedCurrent} {nativeCurrency}</span> raised
        </span>
        <span className="text-gray-600">
          Goal: <span className="font-semibold">{formattedGoal} {nativeCurrency}</span>
        </span>
      </div>
      
      <div className="mt-3 text-center">
        <p className="text-sm text-gray-600">
          Join our community and help us reach our fundraising goal!
        </p>
      </div>
    </div>
  );
};

export default FundraisingProgress;