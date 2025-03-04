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

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed. Please install MetaMask to continue.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      
      // Get the connected chain ID
      const { chainId } = await provider.getNetwork();
      
      // Check if we're on the configured network
      if (chainId !== CURRENT_NETWORK_ID) {
        try {
          // Try to switch to the configured network
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: ethers.utils.hexValue(CURRENT_NETWORK_ID) }],
          });
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            // Add the network to MetaMask
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [NETWORK_CONFIG[CURRENT_NETWORK_ID]],
            });
          } else {
            throw switchError;
          }
        }
      }

      const signer = provider.getSigner();
      
      setWalletState({
        connected: true,
        address,
        chainId,
        provider,
        signer,
      });
    } catch (err: any) {
      console.error("Error connecting wallet:", err);
      setError(err.message || "Failed to connect wallet");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWalletState(initialState);
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnectWallet();
        } else if (walletState.connected) {
          // User switched accounts
          setWalletState(prev => ({
            ...prev,
            address: accounts[0],
          }));
        }
      };

      const handleChainChanged = (chainIdHex: string) => {
        // Handle chain changes - reload the page as recommended by MetaMask
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [disconnectWallet, walletState.connected]);

  return {
    ...walletState,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
  };
}