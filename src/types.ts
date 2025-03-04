export interface TokenInfo {
  symbol: string;
  name: string;
  decimals: number;
  address?: string;
  logoUrl: string;
  balance?: string;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  chainId: number | null;
  provider: any;
  signer: any;
}