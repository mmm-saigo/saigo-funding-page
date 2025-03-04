import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ArrowDown, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import TokenInput from './TokenInput';
import { TokenInfo, WalletState } from '../types';
import { EXCHANGE_RATE, TOKENS, SAIGO_CONTRACT_ADDRESS, SWAP_TARGET_CONTRACT_ADDRESS, getCurrentNetworkCurrency } from '../constants';
import { useTokenBalance } from '../hooks/useTokenBalance';

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

  // Update token objects with balances
  const fromToken = { ...TOKENS.BNB, balance: bnbBalance };
  const toToken = { ...TOKENS.SAIGO, balance: saigoBalance };

  // Calculate exchange amount when fromAmount changes
  useEffect(() => {
    if (fromAmount) {
      const calculatedAmount = parseFloat(fromAmount) * EXCHANGE_RATE;
      setToAmount(calculatedAmount.toString());
    } else {
      setToAmount('');
    }
  }, [fromAmount]);

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

    if (parseFloat(fromAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (parseFloat(fromAmount) > parseFloat(bnbBalance)) {
      toast.error(`Insufficient ${getCurrentNetworkCurrency()} balance`);
      return;
    }

    setIsSwapping(true);

    try {
      // 将用户输入的金额转换为 Wei 单位
      const amountInWei = ethers.utils.parseEther(fromAmount);
      
      // 创建交易对象
      const tx = await walletState.signer.sendTransaction({
        to: SWAP_TARGET_CONTRACT_ADDRESS,
        value: amountInWei,
        gasLimit: 200000, // 设置足够的 gas 限制
      });

      toast.info("Transaction submitted. Waiting for confirmation...");
      
      // 等待交易被确认
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        toast.success("Exchange completed successfully!");
        
        // 交易成功后刷新余额
        await refetchBnbBalance();
        await refetchSaigoBalance();
        
        // 清空输入框
        setFromAmount('');
        setToAmount('');
      } else {
        toast.error("Transaction failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Swap error:", error);
      
      // 提供更友好的错误信息
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

  // 获取当前网络的原生代币符号
  const nativeCurrency = getCurrentNetworkCurrency();

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-5 rounded-2xl shadow-lg max-w-md w-full">
      <h2 className="text-xl font-bold text-center mb-4 text-gray-800">Exchange {nativeCurrency} for SAIGO</h2>
      
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
        Exchange Rate: 1 {nativeCurrency} = {EXCHANGE_RATE.toLocaleString()} SAIGO
      </div>
      
      <button
        className={`w-full py-2.5 px-4 rounded-xl font-semibold text-white ${
          !walletState.connected || isSwapping
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
        onClick={handleSwap}
        disabled={!walletState.connected || isSwapping || !fromAmount}
      >
        {isSwapping ? (
          <div className="flex items-center justify-center">
            <RefreshCw size={18} className="animate-spin mr-2" />
            <span>Swapping...</span>
          </div>
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