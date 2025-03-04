import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ArrowDown, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import TokenInput from './TokenInput';
import { TokenInfo, WalletState } from '../types';
import { EXCHANGE_RATE, TOKENS, SAIGO_CONTRACT_ADDRESS, SWAP_TARGET_CONTRACT_ADDRESS, getCurrentNetworkCurrency } from '../constants';
import { useTokenBalance } from '../hooks/useTokenBalance';
import { useExchangeParams } from '../hooks/useExchangeParams';

// Simple ERC20 ABI for token transfers
const ERC20_ABI = [
  "function transfer(address to, uint amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)"
];

interface ExchangeCardProps {
  walletState: WalletState;
}

const ExchangeCard: React.FC<ExchangeCardProps> = ({ walletState }) => {
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [isSwapping, setIsSwapping] = useState<boolean>(false);

  // Use the useTokenBalance hook to fetch native token balance
  const { balance: bnbBalance, refetch: refetchBnbBalance, isLoading: bnbLoading } = useTokenBalance(
    TOKENS.BNB,
    walletState.address,
    walletState.provider
  );

  // Use the useTokenBalance hook to fetch SAIGO token balance
  const { balance: saigoBalance, refetch: refetchSaigoBalance, isLoading: saigoLoading } = useTokenBalance(
    TOKENS.SAIGO,
    walletState.address,
    walletState.provider
  );

  // Get exchange parameters
  const { 
    exchangeRate, 
    minBnbAmount, 
    maxBnbAmount, 
    isLoading: paramsLoading, 
    error: paramsError 
  } = useExchangeParams(walletState.provider);

  // Update token objects with balances
  const fromToken = { ...TOKENS.BNB, balance: bnbBalance };
  const toToken = { ...TOKENS.SAIGO, balance: saigoBalance };

  // Calculate exchange amount when fromAmount changes
  useEffect(() => {
    if (fromAmount && exchangeRate && parseFloat(exchangeRate) > 0) {
      const calculatedAmount = parseFloat(fromAmount) * parseFloat(exchangeRate);
      setToAmount(calculatedAmount.toString());
    } else {
      setToAmount('');
    }
  }, [fromAmount, exchangeRate]);

  // Refresh balances when wallet connection changes
  useEffect(() => {
    if (walletState.connected && walletState.provider) {
      refetchBnbBalance();
      refetchSaigoBalance();
    }
  }, [walletState.connected, walletState.provider, refetchBnbBalance, refetchSaigoBalance]);

  const handleSwap = async () => {
    if (!walletState.connected || !walletState.signer || !fromAmount) {
      toast.error("Please connect your wallet and enter an amount");
      return;
    }

    // Validate input amount
    const bnbAmountFloat = parseFloat(fromAmount);
    const minBnbAmountFloat = parseFloat(minBnbAmount);
    const maxBnbAmountFloat = parseFloat(maxBnbAmount);

    if (bnbAmountFloat <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (minBnbAmountFloat > 0 && bnbAmountFloat < minBnbAmountFloat) {
      toast.error(`Minimum contribution is ${minBnbAmount} ${getCurrentNetworkCurrency()}`);
      return;
    }

    if (maxBnbAmountFloat > 0 && bnbAmountFloat > maxBnbAmountFloat) {
      toast.error(`Maximum contribution is ${maxBnbAmount} ${getCurrentNetworkCurrency()}`);
      return;
    }

    if (bnbAmountFloat > parseFloat(bnbBalance)) {
      toast.error(`Insufficient ${getCurrentNetworkCurrency()} balance`);
      return;
    }

    setIsSwapping(true);

    try {
      // Convert user input amount to Wei units
      const amountInWei = ethers.utils.parseEther(fromAmount);
      
      // Create transaction object
      const tx = await walletState.signer.sendTransaction({
        to: SWAP_TARGET_CONTRACT_ADDRESS,
        value: amountInWei,
        gasLimit: 200000, // Set enough gas limit
      });

      toast.info("Transaction submitted. Waiting for confirmation...");
      
      // Wait for transaction to be confirmed
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        toast.success("Exchange completed successfully!");
        
        // Refresh balances after successful transaction
        await refetchBnbBalance();
        await refetchSaigoBalance();
        
        // Clear input fields
        setFromAmount('');
        setToAmount('');
      } else {
        toast.error("Transaction failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Swap error:", error);
      
      // Provide more user-friendly error message
      if (error.code === 'ACTION_REJECTED') {
        toast.error("Transaction was rejected by user");
      } else if (error.message && error.message.includes("insufficient funds")) {
        toast.error(`Insufficient ${getCurrentNetworkCurrency()} for transaction (including gas fees)`);
      } else {
        toast.error(error.message || "Failed to complete exchange");
      }
    } finally {
      setIsSwapping(false);
    }
  };

  // Get current network's native token symbol
  const nativeCurrency = getCurrentNetworkCurrency();

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-5 rounded-2xl shadow-lg max-w-md w-full">
      <h2 className="text-xl font-bold text-center mb-4 text-gray-800">Exchange {nativeCurrency} for SAIGO</h2>
      
      {paramsError && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4 rounded">
          <div className="flex items-center">
            <AlertCircle size={16} className="text-yellow-500 mr-2" />
            <p className="text-sm text-yellow-700">
              Could not load exchange parameters. Using default values.
            </p>
          </div>
        </div>
      )}
      
      <TokenInput
        token={fromToken}
        amount={fromAmount}
        balance={bnbBalance}
        onChange={setFromAmount}
        isLoading={bnbLoading}
      />
      
      <div className="flex justify-center my-1">
        <div className="bg-blue-100 p-1.5 rounded-full">
          <ArrowDown size={16} className="text-blue-600" />
        </div>
      </div>
      
      <TokenInput
        token={toToken}
        amount={toAmount}
        balance={saigoBalance}
        onChange={() => {}} // Read-only
        readonly={true}
        isLoading={saigoLoading}
      />
      
      <div className="text-center text-sm text-gray-500 my-2">
        {paramsLoading ? (
          <span className="flex items-center justify-center">
            <RefreshCw size={12} className="animate-spin mr-1" />
            Loading exchange rate...
          </span>
        ) : (
          <>
            Exchange Rate: 1 {nativeCurrency} = {parseFloat(exchangeRate).toLocaleString()} SAIGO
            <div className="mt-1">
              <span className="text-xs">
                Min: {parseFloat(minBnbAmount).toFixed(4)} {nativeCurrency} | 
                Max: {parseFloat(maxBnbAmount).toFixed(2)} {nativeCurrency}
              </span>
            </div>
          </>
        )}
      </div>
      
      <button
        className={`w-full py-2.5 px-4 rounded-xl font-semibold text-white ${
          !walletState.connected || isSwapping || paramsLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
        onClick={handleSwap}
        disabled={!walletState.connected || isSwapping || !fromAmount || paramsLoading}
      >
        {isSwapping ? (
          <div className="flex items-center justify-center">
            <RefreshCw size={18} className="animate-spin mr-2" />
            <span>Swapping...</span>
          </div>
        ) : paramsLoading ? (
          "Loading parameters..."
        ) : !walletState.connected ? (
          "Connect Wallet to Swap"
        ) : !fromAmount ? (
          "Enter an amount"
        ) : (
          `Swap ${nativeCurrency} for SAIGO`
        )}
      </button>
    </div>
  );
};

export default ExchangeCard;