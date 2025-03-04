import React from 'react';
import { Wallet, LogOut } from 'lucide-react';

interface WalletButtonProps {
  connected: boolean;
  address: string | null;
  isLoading: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const WalletButton: React.FC<WalletButtonProps> = ({
  connected,
  address,
  isLoading,
  onConnect,
  onDisconnect,
}) => {
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div>
      {connected && address ? (
        <div className="flex items-center">
          <button
            className="bg-white text-blue-600 border border-blue-600 rounded-lg py-2 px-4 flex items-center hover:bg-blue-50 transition-colors"
            onClick={onDisconnect}
          >
            <span className="mr-2">{formatAddress(address)}</span>
            <LogOut size={16} />
          </button>
        </div>
      ) : (
        <button
          className="bg-blue-600 text-white rounded-lg py-2 px-4 flex items-center hover:bg-blue-700 transition-colors"
          onClick={onConnect}
          disabled={isLoading}
        >
          {isLoading ? (
            <span>Connecting...</span>
          ) : (
            <>
              <Wallet size={16} className="mr-2" />
              <span>Connect Wallet</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default WalletButton;