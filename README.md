#SAIGO-FUNDING-PAGE


## Overview

SAIGO is a trading tool project that integrates on-chain data exploration and value capture. It aims to build an efficient, transparent, and sustainably growing community ecosystem through token monetization.

This repository contains the frontend application for the SAIGO token exchange platform, allowing users to participate in the fundraising event by exchanging BNB for SAIGO tokens.

## Features

- **Wallet Integration**: Connect with MetaMask or other Web3 wallets
- **Token Exchange**: Swap BNB for SAIGO tokens at a fixed rate
- **Real-time Balance Updates**: View your BNB and SAIGO token balances
- **Fundraising Progress Tracking**: Monitor the current fundraising status
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **Web3 Integration**: ethers.js
- **UI Components**: Custom components with Lucide React icons
- **Notifications**: React Toastify

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask or another Web3 wallet browser extension

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/saigo-exchange.git
   cd saigo-exchange
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/         # UI components
│   ├── ExchangeCard.tsx       # Token exchange interface
│   ├── FundraisingProgress.tsx # Fundraising progress bar
│   ├── TokenInput.tsx         # Token input field
│   └── WalletButton.tsx       # Wallet connection button
├── constants/          # Application constants
├── hooks/              # Custom React hooks
│   ├── useTokenBalance.ts     # Hook for fetching token balances
│   └── useWallet.ts           # Hook for wallet connection
├── types/              # TypeScript type definitions
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## Fundraising Details

- **Start Date**: March 3, 2025, 16:00 UTC
- **Duration**: Maximum 72 hours
- **Minimum Contribution**: 0.0001 BNB
- **Maximum Contribution**: 100 BNB per wallet
- **Fundraising Goal**: 5,500 - 7,000 BNB
- **Exchange Rate**: 1 BNB = 14,285.7 SAIGO

## Token Distribution

- **10%** - Public Sale (this fundraising, no lock)
- **30%** - Team (36 month linear unlock, 6-month cliff)
- **30%** - Ecosystem development
- **24%** - Reserved for the community
- **5%** - Liquidity
- **1%** - Fundraising incentives

## Development

### Building for Production

```
npm run build
```

This will create a production-ready build in the `dist` directory.

### Linting

```
npm run lint
```

## Deployment

The application is deployed at [funds.saigo.dev](https://funds.saigo.dev).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

- Twitter: [@SaigoTrading](https://x.com/SaigoTrading/)
- Telegram: [SAIGO Group](https://t.me/SAIGOGroup)
- Website: [home.saigo.dev](https://home.saigo.dev/)

## Disclaimer

Users from regions where the project is restricted by policies and regulations are not allowed to participate in the fundraising event. By participating, you agree to the Terms and Conditions.
