import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getSavedListings, toggleSaveListing } from '@/lib/db/queries';
import { jsonResponse, errorResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await requireAuth();
    const saved = getSavedListings(user.id);
    return jsonResponse({ saved });
  } catch (err: any) {
    return errorResponse(err.message || 'Unauthorized', 401);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { listingId } = await req.json();

    if (!listingId) {
      return errorResponse('listingId is required', 400);
    }

    const isSaved = toggleSaveListing(user.id, listingId);
    return jsonResponse({ success: true, saved: isSaved });
  } catch (err: any) {
    return errorResponse(err.message || 'Unauthorized', 401);
  }
}
