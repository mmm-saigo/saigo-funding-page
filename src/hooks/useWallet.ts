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

// 检测是否为移动设备
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// 检测是否在OKX App内部浏览器中
const isInOKXApp = () => {
  return /OKX/i.test(navigator.userAgent);
};

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile] = useState(isMobileDevice());

  // 初始化 provider 和 signer
  useEffect(() => {
    // 检查是否有可用的以太坊提供者
    const checkProvider = async () => {
      // 检查OKX钱包
      if (window.okxwallet) {
        const provider = new ethers.providers.Web3Provider(window.okxwallet);
        
        try {
          const accounts = await window.okxwallet.request({ method: 'eth_accounts' });
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
        } catch (err) {
          console.error("Error checking OKX wallet:", err);
        }
      } 
      // 检查MetaMask或其他以太坊钱包
      else if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
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
        } catch (err) {
          console.error("Error checking Ethereum wallet:", err);
        }
      }
    };

    checkProvider();
  }, []);

  // 连接MetaMask或其他以太坊钱包
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      // 如果在移动设备上且没有检测到钱包，提示下载
      if (isMobile) {
        setError("No wallet detected. Please install MetaMask or OKX Wallet.");
        return;
      }
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
  }, [isMobile]);

  // 连接OKX钱包
  const connectOKXWallet = useCallback(async () => {
    // 检查OKX钱包是否可用
    if (!window.okxwallet) {
      // 如果在移动设备上，尝试打开OKX App
      if (isMobile && !isInOKXApp()) {
        // 尝试打开OKX App
        window.location.href = 'okx://wallet/dapp/details?dappUrl=' + encodeURIComponent(window.location.href);
        
        // 设置一个超时，如果用户没有OKX App，提示下载
        setTimeout(() => {
          window.location.href = 'https://www.okx.com/download';
        }, 1500);
        return;
      }
      
      setError("OKX Wallet is not installed. Please install OKX Wallet to continue.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const provider = new ethers.providers.Web3Provider(window.okxwallet);
      
      // 请求用户连接钱包
      const accounts = await window.okxwallet.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length === 0) {
        throw new Error("No accounts found. Please connect to OKX Wallet.");
      }
      
      const address = accounts[0];
      const signer = provider.getSigner();
      
      // 检查当前网络
      const network = await provider.getNetwork();
      const chainId = network.chainId;
      
      // 如果不是目标网络，请求切换
      if (chainId !== CURRENT_NETWORK_ID) {
        try {
          await window.okxwallet.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: NETWORK_CONFIG[CURRENT_NETWORK_ID].chainId }],
          });
        } catch (switchError: any) {
          // 如果网络不存在，添加网络
          if (switchError.code === 4902) {
            await window.okxwallet.request({
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
      console.error("OKX wallet connection error:", err);
      setError(err.message || "Failed to connect OKX wallet");
    } finally {
      setIsLoading(false);
    }
  }, [isMobile]);

  const disconnectWallet = useCallback(() => {
    setWalletState(initialState);
  }, []);

  // 监听账户变化
  useEffect(() => {
    const setupAccountsChangedListener = (provider: any, method: string) => {
      if (!provider) return () => {};
      
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // 用户断开了连接
          setWalletState(initialState);
        } else if (walletState.connected) {
          // 用户切换了账户
          const web3Provider = new ethers.providers.Web3Provider(provider);
          setWalletState({
            ...walletState,
            address: accounts[0],
            provider: web3Provider,
            signer: web3Provider.getSigner(),
          });
        }
      };

      provider.on('accountsChanged', handleAccountsChanged);
      
      return () => {
        provider.removeListener('accountsChanged', handleAccountsChanged);
      };
    };

    // 设置MetaMask监听器
    const cleanupEthereum = setupAccountsChangedListener(window.ethereum, 'ethereum');
    
    // 设置OKX钱包监听器
    const cleanupOKX = setupAccountsChangedListener(window.okxwallet, 'okxwallet');
    
    return () => {
      cleanupEthereum();
      cleanupOKX();
    };
  }, [walletState]);

  // 监听网络变化
  useEffect(() => {
    const setupChainChangedListener = (provider: any) => {
      if (!provider) return () => {};
      
      const handleChainChanged = () => {
        // 网络变化时刷新页面
        window.location.reload();
      };

      provider.on('chainChanged', handleChainChanged);
      
      return () => {
        provider.removeListener('chainChanged', handleChainChanged);
      };
    };

    // 设置MetaMask监听器
    const cleanupEthereum = setupChainChangedListener(window.ethereum);
    
    // 设置OKX钱包监听器
    const cleanupOKX = setupChainChangedListener(window.okxwallet);
    
    return () => {
      cleanupEthereum();
      cleanupOKX();
    };
  }, []);

  return {
    ...walletState,
    isLoading,
    error,
    isMobile,
    connectWallet,
    connectOKXWallet,
    disconnectWallet,
  };
}