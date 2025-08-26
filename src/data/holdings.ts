import { Holding } from '../types/portfolio';

// Seed data with realistic stocks across different sectors
const holdings: Holding[] = [
  // Technology Sector
  {
    sector: 'Technology',
    particulars: 'Infosys Ltd',
    purchasePrice: 1450.75,
    quantity: 15,
    exchange: 'NSE',
    ticker: 'INFY.NS',
  },
  {
    sector: 'Technology',
    particulars: 'Tata Consultancy Services Ltd',
    purchasePrice: 3250.50,
    quantity: 8,
    exchange: 'NSE',
    ticker: 'TCS.NS',
  },
  {
    sector: 'Technology',
    particulars: 'Microsoft Corporation',
    purchasePrice: 320.75,
    quantity: 5,
    exchange: 'NASDAQ',
    ticker: 'MSFT',
  },

  // Finance Sector
  {
    sector: 'Finance',
    particulars: 'HDFC Bank Ltd',
    purchasePrice: 1620.25,
    quantity: 12,
    exchange: 'NSE',
    ticker: 'HDFCBANK.NS',
  },
  {
    sector: 'Finance',
    particulars: 'ICICI Bank Ltd',
    purchasePrice: 875.50,
    quantity: 20,
    exchange: 'NSE',
    ticker: 'ICICIBANK.NS',
  },

  // Healthcare Sector
  {
    sector: 'Healthcare',
    particulars: 'Dr. Reddy\'s Laboratories Ltd',
    purchasePrice: 4750.25,
    quantity: 4,
    exchange: 'NSE',
    ticker: 'DRREDDY.NS',
  },
  {
    sector: 'Healthcare',
    particulars: 'Pfizer Inc',
    purchasePrice: 42.75,
    quantity: 10,
    exchange: 'NYSE',
    ticker: 'PFE',
  },

  // Consumer Goods Sector
  {
    sector: 'Consumer Goods',
    particulars: 'Hindustan Unilever Ltd',
    purchasePrice: 2450.75,
    quantity: 7,
    exchange: 'BSE',
    ticker: 'HINDUNILVR.BO',
  },
  {
    sector: 'Consumer Goods',
    particulars: 'ITC Ltd',
    purchasePrice: 375.25,
    quantity: 30,
    exchange: 'NSE',
    ticker: 'ITC.NS',
  },
];

export default holdings;