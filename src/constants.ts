import { TokenInfo } from './types';

export const BNB_CHAIN_ID = 56;
export const BNB_TESTNET_CHAIN_ID = 97;

export const SAIGO_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890"; // Replace with actual contract address

export const TOKENS: Record<string, TokenInfo> = {
  BNB: {
    symbol: "BNB",
    name: "BNB",
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