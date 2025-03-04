import React from 'react';
import { RefreshCw } from 'lucide-react';
import { getCurrentNetworkCurrency } from '../constants';
import { useFundraisingProgress } from '../hooks/useFundraisingProgress';

interface FundraisingProgressProps {
  className?: string;
  provider: any;
}

const FundraisingProgress: React.FC<FundraisingProgressProps> = ({ className = '', provider }) => {
  const { 
    maxBnbCap, 
    totalBnbReceived, 
    isLoading, 
    error, 
    refetch 
  } = useFundraisingProgress(provider);
  
  // 计算进度百分比
  const progressPercentage = maxBnbCap && parseFloat(maxBnbCap) > 0 
    ? Math.min((parseFloat(totalBnbReceived) / parseFloat(maxBnbCap)) * 100, 100) 
    : 0;
  
  // 格式化数字显示
  const formattedCurrent = parseFloat(totalBnbReceived).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  const formattedGoal = parseFloat(maxBnbCap).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  // 获取当前网络的原生代币符号
  const nativeCurrency = getCurrentNetworkCurrency();
  
  const handleRefresh = () => {
    refetch();
  };
  
  return (
    <div className={`bg-white rounded-xl shadow-md p-4 w-full max-w-md ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">Fundraising Progress</h3>
        <div className="flex items-center">
          {isLoading ? (
            <RefreshCw size={16} className="animate-spin text-blue-600 mr-2" />
          ) : (
            <button 
              onClick={handleRefresh} 
              className="text-blue-600 hover:text-blue-800"
              title="Refresh progress"
            >
              <RefreshCw size={16} />
            </button>
          )}
          <span className="text-sm font-medium text-blue-600 ml-2">
            {progressPercentage.toFixed(1)}%
          </span>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      {error ? (
        <div className="text-red-500 text-sm text-center my-2">
          Error loading progress. Please try again.
        </div>
      ) : (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            <span className="font-semibold text-blue-700">{formattedCurrent} {nativeCurrency}</span> raised
          </span>
          <span className="text-gray-600">
            Goal: <span className="font-semibold">{formattedGoal} {nativeCurrency}</span>
          </span>
        </div>
      )}
      
      <div className="mt-3 text-center">
        <p className="text-sm text-gray-600">
          Join our community and help us reach our fundraising goal!
        </p>
      </div>
    </div>
  );
};

export default FundraisingProgress;