import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Coins } from 'lucide-react';
import WalletButton from './components/WalletButton';
import ExchangeCard from './components/ExchangeCard';
import FundraisingProgress from './components/FundraisingProgress';
import { useWallet } from './hooks/useWallet';
import { CURRENT_NETWORK_ID, BNB_CHAIN_ID, BNB_TESTNET_CHAIN_ID, getCurrentNetworkCurrency } from './constants';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum: any;
  }
}

function App() {
  const walletState = useWallet();
  const {
    connected,
    address,
    isLoading,
    error,
    isMobile,
    connectWallet,
    connectOKXWallet,
    disconnectWallet,
  } = walletState;

  // 获取当前网络名称
  const getNetworkName = () => {
    return CURRENT_NETWORK_ID === BNB_CHAIN_ID 
      ? "Binance Smart Chain" 
      : "Binance Smart Chain Testnet";
  };
  
  const getNetworkShortName = () => {
    return CURRENT_NETWORK_ID === BNB_CHAIN_ID 
      ? "" 
      : "Testnet";
  };

  // 获取当前网络的原生代币符号
  const nativeCurrency = getCurrentNetworkCurrency();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Coins size={32} className="text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-blue-800">SAIGO</h1>
        </div>
        <div className="flex items-center">
          <span className="text-sm text-gray-600 mr-4">
            {getNetworkShortName()}
          </span>
          <WalletButton
            connected={connected}
            address={address}
            isLoading={isLoading}
            onConnect={connectWallet}
            onConnectOKX={connectOKXWallet}
            onDisconnect={disconnectWallet}
            isMobile={isMobile}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-md">
            <p>{error}</p>
          </div>
        )}
        
        <div className="flex flex-col items-center mt-0 mb-auto pt-10">
          <ExchangeCard walletState={walletState} />
          
          <FundraisingProgress 
            className="mt-4" 
            provider={walletState.provider} 
          />
          
          <div className="mt-6 text-center text-gray-700 max-w-md px-4">
            <h3 className="text-lg font-semibold mb-2">About  the SAIGO</h3>
            <div className="mb-4">
              <p className="mb-3">SAIGO is a trading tool project that integrates on-chain data exploration and value capture. It aims to build an efficient, transparent, and sustainably growing community ecosystem through token monetization. <a href="https://home.saigo.dev/" className="text-blue-600 hover:underline">more information for saigo.</a></p>
            </div>
            
            <h4 className="text-md font-semibold mb-2 mt-4">Fundraising Rules</h4>
            <div className="bg-white rounded-lg p-4 shadow-sm text-left">
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>The fundraising will start at 16:00 on March 3, 2025, Coordinated Universal Time (UTC+0). The fundraising period will last for a maximum of 72 hours.</li>
                <li>Minimum contribution: <span className="font-medium">0.0001 {nativeCurrency}</span></li>
                <li>Maximum contribution per wallet: <span className="font-medium">100 {nativeCurrency}</span></li>
                <li>The lower limit for successful fundraising is <span className="font-medium">5,500 {nativeCurrency}</span>, and the upper limit for successful fundraising is <span className="font-medium">7,000 {nativeCurrency}</span>. If the fundraising fails, all the {nativeCurrency} will be refunded. If the fundraising amount exceeds 7,000 {nativeCurrency}, the UI exchange function will be shut down, and the {nativeCurrency} that exceeds the amount and is transferred to the contract address will be refunded.</li>
                <li>Tokens will be distributed in real time to the addresses that interact with the contract.</li>
                <li>This fundraising corresponds to 10% of the total circulating supply of SAIGO. The funds raised will be used for the project's development, covering the expansion and maintenance of the technical team, as well as early - stage marketing and project promotion.</li>
                <li>Users who participate in the exchange with an amount of 0.000303 {nativeCurrency} for the first time will share 1% of the fundraising incentives after the fundraising is successful.</li>
                <li>If KOLs and media initiate discussions or share relevant content, they will share 1% of the fundraising incentives based on the popularity of the discussions after the fundraising is successful. <a href="https://docs.google.com/forms/d/e/1FAIpQLSfj0uTSY2mx6JPEpfyE3uKa8ONGbDLYBAiD5MajbIWUeKzPyw/viewform?entry.2005620554=Your+name+on+the+social+platform.&entry.1045781291=xxxxxxxx@xx.com&entry.1065046570=0x*****************************" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">KOL submission entry</a></li>
                <li>Users from regions where the project is restricted by policies and regulations are not allowed to participate.</li>
                <li>By participating, you agree to the <span className="text-blue-600 cursor-pointer">Terms and Conditions</span></li>
              </ul>
            </div>
            
            <h4 className="text-md font-semibold mb-2 mt-4">Token Distribution and Unlock Rules</h4>
            <div className="bg-white rounded-lg p-4 shadow-sm text-left mb-4">
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><span className="font-medium">10%</span> - Public Sale (this fundraising, no lock)</li>
                <li><span className="font-medium">30%</span> - Team (36 month linear unlock, 6-month cliff, 5% will be unlocked every six months.)</li>
                <li><span className="font-medium">30%</span> - Ecosystem development (Airdrop incentives, liquidity incentives, product ecosystem incentives.) </li>
                <li><span className="font-medium">24%</span> - 25% is reserved for the community (for listing on exchanges (CEX), legal services)</li>
                <li><span className="font-medium">5%</span> - Liquidity (permanently added to the liquidity pool, and the liquidity will be provided by the funds raised by the team.)</li>
                <li><span className="font-medium">1%</span> - Fundraising incentives will be shared with individuals and KOLs who have helped SAIGO with its fundraising.(no lock)</li>
              </ul>
              <div className="mt-3 text-xs text-gray-600">
                <p>Except for the non - locked tokens (16%), the unlocking of other tokens needs to be determined based on both price and date conditions. For unlocking, the average price in the 30 days before the due date must be more than 200% of the price at the time of the last unlocking. The initial price is set as the price when the fundraising is successfully completed.

Tokens unlocked by the team will be released to the team's multi - signature address, while tokens for the ecosystem and those reserved for the community will be released to the community's multi - signature address. If there is no actual plan or demand, the released tokens need to be locked again to the contract address. (All the above unlocking processes will be completely controlled by smart contracts.) </p>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">Make sure you're connected to the {getNetworkName()} network to complete your exchange.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-gray-600">
        <div className="flex justify-center items-center mb-2">
          <a href="https://x.com/SaigoTrading/" target="_blank" rel="noopener noreferrer" className="mx-2 hover:text-blue-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="text-black">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a href="https://t.me/SAIGOGroup" target="_blank" rel="noopener noreferrer" className="mx-2 hover:text-blue-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="text-[#0088cc]">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.05-.2-.06-.06-.17-.04-.25-.02-.11.02-1.84 1.17-5.2 3.42-.49.33-.94.5-1.35.48-.44-.01-1.29-.25-1.92-.46-.78-.26-1.39-.4-1.34-.85.03-.22.32-.45.88-.68 3.49-1.51 5.82-2.51 6.98-3 3.32-1.38 4.01-1.62 4.46-1.63.1 0 .32.02.46.19.12.13.15.31.17.5 0 .06.01.12.01.19z" />
            </svg>
          </a>
        </div>
        <p>© 2025 SAIGO. All rights reserved.</p>
      </footer>

      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;