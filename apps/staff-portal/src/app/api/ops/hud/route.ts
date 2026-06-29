import { NextResponse } from 'next/server';
import { buildOpsHud } from '@/lib/ops/build-hud';

export const dynamic = 'force-static';

export async function GET() {
  try {
    const hud = await buildOpsHud();

    return NextResponse.json(hud, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Failed to build ops HUD', error);

    return NextResponse.json(
      {
        generatedAt: new Date().toISOString(),
        stale: true,
        priorityItems: [],
        tickerItems: [],
        error: 'Operational feed unavailable',
      },
      { status: 500 }
    );
  }
}
