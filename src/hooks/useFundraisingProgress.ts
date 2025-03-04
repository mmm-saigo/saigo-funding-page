import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { SWAP_TARGET_CONTRACT_ADDRESS } from '../constants';

// 简化的 ABI，只包含我们需要的函数
const DISTRIBUTOR_ABI = [
  "function maxBnbCap() view returns (uint256)",
  "function totalBnbReceived() view returns (uint256)"
];

export function useFundraisingProgress(provider: any) {
  const [maxBnbCap, setMaxBnbCap] = useState<string>('0');
  const [totalBnbReceived, setTotalBnbReceived] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
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

      // 获取最大筹款目标
      const maxBnbCapWei = await contract.maxBnbCap();
      const formattedMaxBnbCap = ethers.utils.formatEther(maxBnbCapWei);
      setMaxBnbCap(formattedMaxBnbCap);

      // 获取当前已筹金额
      const totalBnbReceivedWei = await contract.totalBnbReceived();
      const formattedTotalBnbReceived = ethers.utils.formatEther(totalBnbReceivedWei);
      setTotalBnbReceived(formattedTotalBnbReceived);
    } catch (err: any) {
      console.error("Error fetching fundraising progress:", err);
      setError(err.message || "Failed to fetch fundraising progress");
    } finally {
      setIsLoading(false);
    }
  }, [provider]);

  useEffect(() => {
    if (provider) {
      fetchProgress();
      
      // 设置轮询以更新进度
      const intervalId = setInterval(fetchProgress, 30000); // 每30秒轮询一次
      
      return () => clearInterval(intervalId);
    }
  }, [provider, fetchProgress]);

  return { maxBnbCap, totalBnbReceived, isLoading, error, refetch: fetchProgress };
} 