import React from 'react';
import { TokenInfo } from '../types';

interface TokenInputProps {
  token: TokenInfo;
  amount: string;
  balance?: string;
  onChange: (value: string) => void;
  readonly?: boolean;
}

const TokenInput: React.FC<TokenInputProps> = ({
  token,
  amount,
  balance,
  onChange,
  readonly = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimals
    if (/^[0-9]*[.,]?[0-9]*$/.test(value)) {
      onChange(value);
    }
  };

  const handleMaxClick = () => {
    if (balance) {
      onChange(balance);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-3 mb-2">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center">
          <img 
            src={token.logoUrl} 
            alt={token.symbol} 
            className="w-6 h-6 rounded-full mr-2"
          />
          <span className="font-semibold">{token.symbol}</span>
        </div>
        {balance && (
          <div className="text-xs text-gray-500">
            Balance: {parseFloat(balance).toFixed(6)}
            {!readonly && (
              <button 
                onClick={handleMaxClick}
                className="ml-1 text-blue-500 text-xs font-semibold"
              >
                MAX
              </button>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          value={amount}
          onChange={handleChange}
          readOnly={readonly}
          placeholder="0.0"
          className={`w-full text-xl bg-transparent outline-none ${readonly ? 'text-gray-500' : 'text-black'}`}
        />
        <div className="text-gray-400 text-xs">{token.name}</div>
      </div>
    </div>
  );
};

export default TokenInput;