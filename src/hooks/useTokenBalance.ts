import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { TokenInfo } from '../types';

// Simple ERC20 ABI for balanceOf function
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)"
];

export function useTokenBalance(
  token: TokenInfo,
  address: string | null,
  provider: any
) {
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!address || !provider) {
      setBalance('0');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let rawBalance;

      if (token.address) {
        // ERC20 token
        const contract = new ethers.Contract(token.address, ERC20_ABI, provider);
        rawBalance = await contract.balanceOf(address);
      } else {
        // Native token (BNB)
        rawBalance = await provider.getBalance(address);
      }

      const formattedBalance = ethers.utils.formatUnits(rawBalance, token.decimals);
      setBalance(formattedBalance);
    } catch (err: any) {
      console.error(`Error fetching ${token.symbol} balance:`, err);
      setError(err.message || `Failed to fetch ${token.symbol} balance`);
    } finally {
      setIsLoading(false);
    }
  }, [address, provider, token]);

  useEffect(() => {
    fetchBalance();
    
    // Set up polling for balance updates
    const intervalId = setInterval(fetchBalance, 15000); // Poll every 15 seconds
    
    return () => clearInterval(intervalId);
  }, [fetchBalance]);

  return { balance, isLoading, error, refetch: fetchBalance };
}