import { NextRequest } from 'next/server';
import { searchListings } from '@/lib/db/queries';
import { requireAuth, logAuditEvent } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { jsonResponse, errorResponse, handleApiError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    let filterOwnerId: string | undefined = undefined;
    if (searchParams.get('mine') === 'true') {
      const user = await requireAuth();
      filterOwnerId = user.id;
    } else if (searchParams.get('ownerId')) {
      filterOwnerId = searchParams.get('ownerId')!;
    }

    const city = searchParams.get('city') || undefined;
    const neighbourhood = searchParams.get('neighbourhood') || undefined;
    const propertyType = searchParams.get('propertyType') || undefined;
    const accommodationType = searchParams.get('accommodationType') || undefined;
    const furnishing = searchParams.get('furnishing') || undefined;
    const minRent = searchParams.get('minRent') ? Number(searchParams.get('minRent')) : undefined;
    const maxRent = searchParams.get('maxRent') ? Number(searchParams.get('maxRent')) : undefined;
    const maxDeposit = searchParams.get('maxDeposit') ? Number(searchParams.get('maxDeposit')) : undefined;
    const maxTotalUpfront = searchParams.get('maxTotalUpfront') ? Number(searchParams.get('maxTotalUpfront')) : undefined;
    const foodIncluded = searchParams.get('foodIncluded') === 'true';
    const zeroBrokerage = searchParams.get('zeroBrokerage') === 'true';
    const verifiedOnly = searchParams.get('verifiedOnly') === 'true';
    const search = searchParams.get('search') || undefined;
    const sortBy = (searchParams.get('sortBy') as any) || undefined;
    const status = searchParams.get('status') || undefined;
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 20;

    const result = searchListings({
      city,
      neighbourhood,
      propertyType,
      accommodationType,
      furnishing,
      minRent,
      maxRent,
      maxDeposit,
      maxTotalUpfront,
      foodIncluded,
      zeroBrokerage,
      verifiedOnly,
      search,
      sortBy,
      page,
      limit,
      ownerId: filterOwnerId,
      status,
    });

    return jsonResponse(result);
  } catch (err: any) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();

    // Only owners, operators, brokers, or admin can create listings
    if (!['owner', 'operator', 'broker', 'admin'].includes(user.role)) {
      return errorResponse('Forbidden: Only landlords, operators, and verified brokers can create listings', 403);
    }

    const body = await req.json();
    const {
      title,
      description,
      propertyType,
      accommodationType,
      address,
      publicLocationDescription,
      city,
      neighbourhood,
      pincode,
      latitude = 12.9716,
      longitude = 77.5946,
      landmark,
      rentAmount,
      depositAmount,
      brokerageAmount = 0,
      maintenanceAmount = 0,
      utilityEstimatedAmount = 0,
      foodCharges = 0,
      otherCharges = 0,
      availableFrom,
      furnishing,
      totalBedrooms = 1,
      totalBathrooms = 1,
      balconyCount = 0,
      floor = 1,
      totalFloors = 1,
      carpetAreaSqFt,
      foodIncluded = false,
      foodType = 'none',
      houseRules = [],
      amenities = [],
      accessibilityFeatures = [],
      images = [],
      videoTourUrl,
      managerType,
      rooms = [],
    } = body;

    if (!title || !description || !city || !rentAmount || !depositAmount || !propertyType || !accommodationType) {
      return errorResponse('Missing required listing fields: title, description, city, rent, deposit, types', 400);
    }

    // Determine manager type
    let finalManagerType = managerType || 'owner';
    if (user.role === 'broker') finalManagerType = 'broker';
    if (user.role === 'operator') finalManagerType = 'authorized_representative';

    const db = getDb();
    const id = 'lst_' + Math.random().toString(36).substring(2, 11);
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + id.substring(4);
    const now = new Date().toISOString();

    const insertStmt = db.prepare(`
      INSERT INTO listings (
        id, ownerId, title, slug, description, propertyType, accommodationType,
        address, publicLocationDescription, city, neighbourhood, pincode,
        latitude, longitude, landmark, rentAmount, depositAmount, brokerageAmount,
        maintenanceAmount, utilityEstimatedAmount, foodCharges, otherCharges,
        currency, availableFrom, availabilityConfirmedAt, furnishing,
        totalBedrooms, totalBathrooms, balconyCount, floor, totalFloors,
        carpetAreaSqFt, foodIncluded, foodType, houseRules, amenities,
        accessibilityFeatures, images, videoTourUrl, managerType, status,
        verifiedListing, viewCount, enquiryCount, createdAt, updatedAt
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `);

    insertStmt.run(
      id,
      user.id,
      title.trim(),
      slug,
      description.trim(),
      propertyType,
      accommodationType,
      address || publicLocationDescription || 'Bengaluru',
      publicLocationDescription || `${neighbourhood || city}, ${city}`,
      city.trim(),
      neighbourhood || city.trim(),
      pincode || '560001',
      latitude,
      longitude,
      landmark || null,
      Number(rentAmount),
      Number(depositAmount),
      Number(brokerageAmount),
      Number(maintenanceAmount),
      Number(utilityEstimatedAmount),
      Number(foodCharges),
      Number(otherCharges),
      'INR',
      availableFrom || now.split('T')[0],
      now, // availability confirmed today
      furnishing || 'semi_furnished',
      Number(totalBedrooms),
      Number(totalBathrooms),
      Number(balconyCount),
      Number(floor),
      Number(totalFloors),
      carpetAreaSqFt ? Number(carpetAreaSqFt) : null,
      foodIncluded ? 1 : 0,
      foodType,
      JSON.stringify(houseRules),
      JSON.stringify(amenities),
      JSON.stringify(accessibilityFeatures),
      JSON.stringify(images.length > 0 ? images : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80']),
      videoTourUrl || null,
      finalManagerType,
      'active',
      0, // pending moderation verification
      0,
      0,
      now,
      now
    );

    // If PG / hostel with rooms
    if (Array.isArray(rooms) && rooms.length > 0) {
      const roomInsert = db.prepare(`
        INSERT INTO rooms (
          id, listingId, roomNumber, roomType, capacity, occupiedBeds,
          rentPerBed, depositPerBed, attachedBathroom, acAvailable, status, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const rm of rooms) {
        roomInsert.run(
          'rm_' + Math.random().toString(36).substring(2, 11),
          id,
          rm.roomNumber || 'Room',
          rm.roomType || 'single',
          Number(rm.capacity) || 1,
          Number(rm.occupiedBeds) || 0,
          Number(rm.rentPerBed) || Number(rentAmount),
          Number(rm.depositPerBed) || Number(depositAmount),
          rm.attachedBathroom ? 1 : 0,
          rm.acAvailable ? 1 : 0,
          'available',
          now
        );
      }
    }

    logAuditEvent(user.id, 'CREATE_LISTING', 'listing', id, { title, rent: rentAmount });

    return jsonResponse({ success: true, listingId: id, slug }, 201);
  } catch (err: any) {
    console.error('Create listing error:', err);
    return errorResponse(err.message || 'Failed to create listing', err.status || 500);
  }
}
