import { NextRequest } from 'next/server';
import { getListingById } from '@/lib/db/queries';
import { calculateCosts } from '@/lib/types';
import { jsonResponse, errorResponse } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get('ids');

    if (!idsParam) {
      return errorResponse('ids parameter is required (e.g. ?ids=id1,id2)', 400);
    }

    const ids = idsParam.split(',').map(s => s.trim()).filter(Boolean);
    if (ids.length < 2) {
      return errorResponse('Provide at least 2 listings to compare', 400);
    }

    const listings = ids
      .map(id => getListingById(id))
      .filter((l): l is NonNullable<typeof l> => l !== null);

    const enriched = listings.map(l => ({
      ...l,
      costs: calculateCosts(l),
    }));

    return jsonResponse({ listings: enriched });
  } catch (err: any) {
    return errorResponse(err.message || 'Comparison failed', 500);
  }
}
