import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { HoldingSchema } from '@/types/portfolio';
import { generatePortfolioSnapshot } from '@/lib/portfolio-utils';
import holdings from '@/data/holdings';

const RequestSchema = z.object({
  holdings: z.array(HoldingSchema).optional(),
});

export async function GET() {
  try {
    const snapshot = await generatePortfolioSnapshot(holdings);
    
    return NextResponse.json(snapshot);
  } catch (error) {
    console.error('Error generating portfolio snapshot:', error);
    return NextResponse.json(
      { error: 'Failed to generate portfolio snapshot' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = RequestSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const userHoldings = validationResult.data.holdings || holdings;
    
    const snapshot = await generatePortfolioSnapshot(userHoldings);
    
    return NextResponse.json(snapshot);
  } catch (error) {
    console.error('Error generating portfolio snapshot:', error);
    return NextResponse.json(
      { error: 'Failed to generate portfolio snapshot' },
      { status: 500 }
    );
  }
}