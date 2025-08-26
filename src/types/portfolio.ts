import { z } from 'zod';

export const ExchangeEnum = z.enum(['NSE', 'BSE', 'NASDAQ', 'NYSE']);
export type Exchange = z.infer<typeof ExchangeEnum>;

export const HoldingSchema = z.object({
  sector: z.string(),
  particulars: z.string(),
  purchasePrice: z.number().positive(),
  quantity: z.number().int().positive(),
  exchange: ExchangeEnum,
  ticker: z.string(),
});

export type Holding = z.infer<typeof HoldingSchema>;

export const HoldingWithDerivedSchema = HoldingSchema.extend({
  investment: z.number(),
  portfolioPercentage: z.number(),
});

export type HoldingWithDerived = z.infer<typeof HoldingWithDerivedSchema>;

export const MarketDataSchema = z.object({
  currentPrice: z.number().positive().optional(),
  peRatio: z.number().positive().optional(),
  latestEarnings: z.number().optional(),
});

export type MarketData = z.infer<typeof MarketDataSchema>;

export const SnapshotSchema = HoldingWithDerivedSchema.extend({
  currentPrice: z.number().positive().optional(),
  presentValue: z.number().optional(),
  gainLoss: z.number().optional(),
  gainLossPercentage: z.number().optional(),
  peRatio: z.number().positive().optional(),
  latestEarnings: z.number().optional(),
});

export type Snapshot = z.infer<typeof SnapshotSchema>;

export const SectorTotalSchema = z.object({
  sector: z.string(),
  investment: z.number(),
  presentValue: z.number(),
  gainLoss: z.number(),
  gainLossPercentage: z.number(),
  portfolioPercentage: z.number(),
});

export type SectorTotal = z.infer<typeof SectorTotalSchema>;

export const PortfolioSummarySchema = z.object({
  totalInvestment: z.number(),
  totalPresentValue: z.number(),
  totalGainLoss: z.number(),
  totalGainLossPercentage: z.number(),
});

export type PortfolioSummary = z.infer<typeof PortfolioSummarySchema>;

export const PortfolioSnapshotResponseSchema = z.object({
  holdings: z.array(SnapshotSchema),
  sectorTotals: z.array(SectorTotalSchema),
  summary: PortfolioSummarySchema,
  lastUpdated: z.date(),
});

export type PortfolioSnapshotResponse = z.infer<typeof PortfolioSnapshotResponseSchema>;