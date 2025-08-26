# Portfolio Dashboard

A comprehensive portfolio dashboard application built with Next.js, TypeScript, and TailwindCSS. This application allows users to track their stock portfolio with real-time data from Yahoo Finance and Google Finance.

## Features

- **Real-time Data**: Fetches current market prices from Yahoo Finance API
- **Fundamental Data**: Scrapes P/E Ratio and Latest Earnings from Google Finance
- **Auto-refresh**: Updates data every 15 seconds
- **Responsive Design**: Works on desktop and mobile devices
- **Interactive UI**: Collapsible sector groups, donut chart for sector allocation
- **Performance**: Efficient caching strategy to minimize API calls

## Screenshots

![Portfolio Dashboard](./screenshots/dashboard.png)

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **Data Fetching**: Axios, Yahoo Finance API, Cheerio for scraping
- **State Management**: React Hooks, TanStack Table & Store
- **Data Visualization**: Recharts
- **Caching**: Node-cache
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/portfolio-dashboard.git
   cd portfolio-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

The dashboard displays your portfolio with the following information:

- **KPI Cards**: Total Investment, Present Value, and Net Gain/Loss
- **Portfolio Table**: Detailed view of each holding with current market data
- **Sector Allocation**: Donut chart showing allocation by sector

The data automatically refreshes every 15 seconds, or you can manually refresh by clicking the "Refresh" button.

## Project Structure

```
portfolio-dashboard/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/              # API routes
│   │   │   └── snapshot/     # Portfolio snapshot API
│   │   ├── page.tsx          # Main dashboard page
│   │   └── layout.tsx        # Root layout
│   ├── components/           # UI components
│   │   ├── KpiCards.tsx      # KPI summary cards
│   │   ├── PortfolioTable.tsx # Main portfolio table
│   │   ├── SectorGroup.tsx   # Collapsible sector grouping
│   │   └── SectorDonut.tsx   # Sector allocation chart
│   ├── data/                 # Seed data
│   │   └── holdings.ts       # Sample portfolio holdings
│   ├── hooks/                # Custom React hooks
│   │   └── usePortfolio.ts   # Portfolio data fetching hook
│   ├── lib/                  # Utility functions
│   │   ├── cache.ts          # Caching utilities
│   │   ├── yahoo-finance.ts  # Yahoo Finance API integration
│   │   ├── google-finance.ts # Google Finance scraping
│   │   └── portfolio-utils.ts # Portfolio calculations
│   └── types/                # TypeScript types
│       └── portfolio.ts      # Portfolio-related types and schemas
├── public/                   # Static assets
└── package.json              # Project dependencies
```

## Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Deploy to Vercel

The easiest way to deploy this application is to use the [Vercel Platform](https://vercel.com).

```bash
npm install -g vercel
vercel
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Yahoo Finance API](https://github.com/gadicc/node-yahoo-finance2)
- [TanStack Table](https://tanstack.com/table)
- [Recharts](https://recharts.org/)
