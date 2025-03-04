import { TokenInfo } from './types';
import { ethers } from 'ethers';

export const BNB_CHAIN_ID = 56;
export const BNB_TESTNET_CHAIN_ID = 97;

// 配置当前使用的网络 - 设置为主网或测试网
// 将此变量设置为 BNB_CHAIN_ID 使用主网，或设置为 BNB_TESTNET_CHAIN_ID 使用测试网
export const CURRENT_NETWORK_ID = BNB_TESTNET_CHAIN_ID; // 或 BNB_TESTNET_CHAIN_ID

// 网络配置
export const NETWORK_CONFIG = {
  [BNB_CHAIN_ID]: {
    chainId: ethers.utils.hexValue(BNB_CHAIN_ID),
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com/'],
  },
  [BNB_TESTNET_CHAIN_ID]: {
    chainId: ethers.utils.hexValue(BNB_TESTNET_CHAIN_ID),
    chainName: 'Binance Smart Chain Testnet',
    nativeCurrency: {
      name: 'tBNB',
      symbol: 'tBNB',
      decimals: 18,
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
    blockExplorerUrls: ['https://testnet.bscscan.com/'],
  },
};

export const SAIGO_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890"; // Replace with actual contract address

// 获取当前网络的原生代币符号
export const getCurrentNetworkCurrency = () => {
  return NETWORK_CONFIG[CURRENT_NETWORK_ID].nativeCurrency.symbol;
};

// 更新 TOKENS 对象以使用当前网络的原生代币符号
export const TOKENS: Record<string, TokenInfo> = {
  BNB: {
    symbol: getCurrentNetworkCurrency(),
    name: getCurrentNetworkCurrency(),
    decimals: 18,
    logoUrl: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
  },
  SAIGO: {
    symbol: "SAIGO",
    name: "SAIGO Token",
    decimals: 18,
    address: SAIGO_CONTRACT_ADDRESS,
    logoUrl: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
  }
};

export const EXCHANGE_RATE = 14285.7; // 1 BNB = 14285.7 SAIGO

// Fundraising constants
export const FUNDRAISING_GOAL = 7000; // Goal in BNB
export const FUNDRAISING_CURRENT = 0; // Current amount raised in BNB