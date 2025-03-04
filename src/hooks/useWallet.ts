import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { WalletState } from '../types';
import { BNB_CHAIN_ID, BNB_TESTNET_CHAIN_ID, CURRENT_NETWORK_ID, NETWORK_CONFIG } from '../constants';

const initialState: WalletState = {
  connected: false,
  address: null,
  chainId: null,
  provider: null,
  signer: null,
};

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 初始化 provider 和 signer
  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // 检查是否已连接
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            const signer = provider.getSigner();
            setWalletState({
              connected: true,
              address: accounts[0],
              chainId: null,
              provider,
              signer,
            });
          }
        })
        .catch(console.error);
    }
  }, []);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed. Please install MetaMask to continue.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // 请求用户连接钱包
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length === 0) {
        throw new Error("No accounts found. Please connect to MetaMask.");
      }
      
      const address = accounts[0];
      const signer = provider.getSigner();
      
      // 检查当前网络
      const network = await provider.getNetwork();
      const chainId = network.chainId;
      
      // 如果不是目标网络，请求切换
      if (chainId !== CURRENT_NETWORK_ID) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: NETWORK_CONFIG[CURRENT_NETWORK_ID].chainId }],
          });
        } catch (switchError: any) {
          // 如果网络不存在，添加网络
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [NETWORK_CONFIG[CURRENT_NETWORK_ID]],
            });
          } else {
            throw switchError;
          }
        }
      }
      
      setWalletState({
        connected: true,
        address,
        chainId,
        provider,
        signer,
      });
    } catch (err: any) {
      console.error("Wallet connection error:", err);
      setError(err.message || "Failed to connect wallet");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWalletState(initialState);
  }, []);

  // 监听账户变化
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // 用户断开了连接
          setWalletState(initialState);
        } else if (walletState.connected) {
          // 用户切换了账户
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          setWalletState({
            ...walletState,
            address: accounts[0],
            provider,
            signer: provider.getSigner(),
          });
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [walletState]);

  // 监听网络变化
  useEffect(() => {
    if (window.ethereum) {
      const handleChainChanged = (chainId: string) => {
        // 网络变化时刷新页面
        window.location.reload();
      };

      window.ethereum.on('chainChanged', handleChainChanged);
      
      return () => {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  return {
    ...walletState,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
  };
}