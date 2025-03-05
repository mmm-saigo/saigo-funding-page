import React, { useState } from 'react';
import { Wallet, LogOut, ChevronDown, ChevronUp } from 'lucide-react';

interface WalletButtonProps {
  connected: boolean;
  address: string | null;
  isLoading: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onConnectOKX?: () => void;
  isMobile: boolean;
}

const WalletButton: React.FC<WalletButtonProps> = ({
  connected,
  address,
  isLoading,
  onConnect,
  onDisconnect,
  onConnectOKX,
  isMobile,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // 已连接状态显示
  if (connected && address) {
    return (
      <div className="flex items-center">
        <button
          className="bg-white text-blue-600 border border-blue-600 rounded-lg py-2 px-4 flex items-center hover:bg-blue-50 transition-colors"
          onClick={onDisconnect}
        >
          <span className="mr-2">{formatAddress(address)}</span>
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  // 移动设备上直接连接OKX钱包
  if (isMobile) {
    return (
      <button
        className="bg-blue-600 text-white rounded-lg py-2 px-4 flex items-center hover:bg-blue-700 transition-colors"
        onClick={onConnectOKX}
        disabled={isLoading}
      >
        {isLoading ? (
          <span>Connecting...</span>
        ) : (
          <>
            <img src="https://pic-saigo.saigo.dev/wallet.png" alt="OKX Wallet" className="w-5 h-5 mr-2" />
            <span>Connect OKX</span>
          </>
        )}
      </button>
    );
  }

  // 桌面设备上显示普通连接按钮
  return (
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
  );
};

export default WalletButton;
