import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { SWAP_TARGET_CONTRACT_ADDRESS } from '../constants';

// 简化的 ABI，只包含我们需要的函数
const DISTRIBUTOR_ABI = [
  "function exchangeRate() view returns (uint256)",
  "function minBnbAmount() view returns (uint256)",
  "function maxBnbAmount() view returns (uint256)"
];

export function useExchangeParams(provider: any) {
  const [exchangeRate, setExchangeRate] = useState<string>('0');
  const [minBnbAmount, setMinBnbAmount] = useState<string>('0');
  const [maxBnbAmount, setMaxBnbAmount] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchParams = useCallback(async () => {
    if (!provider) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const contract = new ethers.Contract(
        SWAP_TARGET_CONTRACT_ADDRESS,
        DISTRIBUTOR_ABI,
        provider
      );

      // 获取汇率
      const rateWei = await contract.exchangeRate();
      const formattedRate = ethers.utils.formatUnits(rateWei, 0);
      setExchangeRate(formattedRate);

      // 获取最小交易金额
      const minAmountWei = await contract.minBnbAmount();
      const formattedMinAmount = ethers.utils.formatEther(minAmountWei);
      setMinBnbAmount(formattedMinAmount);

      // 获取最大交易金额
      const maxAmountWei = await contract.maxBnbAmount();
      const formattedMaxAmount = ethers.utils.formatEther(maxAmountWei);
      setMaxBnbAmount(formattedMaxAmount);
    } catch (err: any) {
      console.error("Error fetching exchange parameters:", err);
      setError(err.message || "Failed to fetch exchange parameters");
    } finally {
      setIsLoading(false);
    }
  }, [provider]);

  useEffect(() => {
    if (provider) {
      fetchParams();
    }
  }, [provider, fetchParams]);

  return { 
    exchangeRate, 
    minBnbAmount, 
    maxBnbAmount, 
    isLoading, 
    error, 
    refetch: fetchParams 
  };
} 