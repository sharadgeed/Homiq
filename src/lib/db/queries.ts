import { getDb } from './index';
import { Listing, Room, NeighbourhoodFacility, Review, Enquiry, Viewing, MoveInRecord, MaintenanceRequest, calculateCosts } from '@/lib/types';

export function parseListingRow(row: any): Listing {
  if (!row) return null as any;
  const houseRules = row.houseRules ? JSON.parse(row.houseRules) : [];
  const amenities = row.amenities ? JSON.parse(row.amenities) : [];
  const accessibilityFeatures = row.accessibilityFeatures ? JSON.parse(row.accessibilityFeatures) : [];
  const images = row.images ? JSON.parse(row.images) : [];

  return {
    ...row,
    foodIncluded: Boolean(row.foodIncluded),
    verifiedListing: Boolean(row.verifiedListing),
    houseRules,
    amenities,
    accessibilityFeatures,
    images,
  };
}

export interface ListingFilterParams {
  city?: string;
  neighbourhood?: string;
  propertyType?: string;
  accommodationType?: string;
  furnishing?: string;
  minRent?: number;
  maxRent?: number;
  maxDeposit?: number;
  maxTotalUpfront?: number;
  foodIncluded?: boolean;
  zeroBrokerage?: boolean;
  verifiedOnly?: boolean;
  search?: string;
  sortBy?: 'rent_asc' | 'rent_desc' | 'availability_new' | 'rating' | 'cost_asc';
  page?: number;
  limit?: number;
  ownerId?: string;
  status?: string;
}

export function searchListings(params: ListingFilterParams) {
  const db = getDb();
  let query = `
    SELECT l.*, u.name as ownerName, u.role as ownerRole, u.verificationStatus as ownerVerification,
           (SELECT AVG(overallRating) FROM reviews r WHERE r.listingId = l.id AND r.status = 'published') as avgRating,
           (SELECT COUNT(*) FROM reviews r WHERE r.listingId = l.id AND r.status = 'published') as reviewCount
    FROM listings l
    JOIN users u ON l.ownerId = u.id
    WHERE 1=1
  `;
  const queryParams: any[] = [];

  if (params.ownerId) {
    query += ` AND l.ownerId = ?`;
    queryParams.push(params.ownerId);
  }

  if (params.status) {
    query += ` AND l.status = ?`;
    queryParams.push(params.status);
  } else if (!params.ownerId) {
    query += ` AND l.status = 'active'`;
  }

  if (params.city && params.city !== 'all') {
    query += ` AND LOWER(l.city) LIKE LOWER(?)`;
    queryParams.push(`%${params.city.trim()}%`);
  }

  if (params.neighbourhood) {
    query += ` AND LOWER(l.neighbourhood) LIKE LOWER(?)`;
    queryParams.push(`%${params.neighbourhood.trim()}%`);
  }

  if (params.propertyType && params.propertyType !== 'all') {
    query += ` AND l.propertyType = ?`;
    queryParams.push(params.propertyType);
  }

  if (params.accommodationType && params.accommodationType !== 'all') {
    query += ` AND l.accommodationType = ?`;
    queryParams.push(params.accommodationType);
  }

  if (params.furnishing && params.furnishing !== 'all') {
    query += ` AND l.furnishing = ?`;
    queryParams.push(params.furnishing);
  }

  if (params.minRent && params.minRent > 0) {
    query += ` AND l.rentAmount >= ?`;
    queryParams.push(params.minRent);
  }

  if (params.maxRent && params.maxRent > 0) {
    query += ` AND l.rentAmount <= ?`;
    queryParams.push(params.maxRent);
  }

  if (params.maxDeposit && params.maxDeposit > 0) {
    query += ` AND l.depositAmount <= ?`;
    queryParams.push(params.maxDeposit);
  }

  if (params.foodIncluded) {
    query += ` AND l.foodIncluded = 1`;
  }

  if (params.zeroBrokerage) {
    query += ` AND l.brokerageAmount = 0`;
  }

  if (params.verifiedOnly) {
    query += ` AND l.verifiedListing = 1`;
  }

  if (params.search && params.search.trim()) {
    const s = `%${params.search.trim()}%`;
    query += ` AND (l.title LIKE ? OR l.description LIKE ? OR l.neighbourhood LIKE ? OR l.city LIKE ? OR l.landmark LIKE ?)`;
    queryParams.push(s, s, s, s, s);
  }

  // Sorting
  if (params.sortBy === 'rent_asc') {
    query += ` ORDER BY l.rentAmount ASC`;
  } else if (params.sortBy === 'rent_desc') {
    query += ` ORDER BY l.rentAmount DESC`;
  } else if (params.sortBy === 'availability_new') {
    query += ` ORDER BY l.availabilityConfirmedAt DESC`;
  } else if (params.sortBy === 'rating') {
    query += ` ORDER BY avgRating DESC NULLS LAST`;
  } else if (params.sortBy === 'cost_asc') {
    query += ` ORDER BY (l.depositAmount + l.rentAmount + l.brokerageAmount + l.otherCharges) ASC`;
  } else {
    // Default: verified first, then freshness
    query += ` ORDER BY l.verifiedListing DESC, l.availabilityConfirmedAt DESC`;
  }

  const rows = db.prepare(query).all(...queryParams);
  let parsed = rows.map(parseListingRow);

  // Upfront max filter in-memory if requested
  if (params.maxTotalUpfront && params.maxTotalUpfront > 0) {
    parsed = parsed.filter(l => {
      const costs = calculateCosts(l);
      return costs.totalUpfrontCost <= params.maxTotalUpfront!;
    });
  }

  const total = parsed.length;
  const page = params.page || 1;
  const limit = params.limit || 20;
  const paginated = parsed.slice((page - 1) * limit, page * limit);

  return {
    listings: paginated,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export function getListingById(id: string, viewerUserId?: string, viewerRole?: string): Listing | null {
  const db = getDb();
  const row = db.prepare(`
    SELECT l.*, u.name as ownerName, u.role as ownerRole, u.verificationStatus as ownerVerification,
           u.phone as ownerPhone, u.email as ownerEmail, u.brokerageRegistrationNo, u.representationType,
           (SELECT AVG(overallRating) FROM reviews r WHERE r.listingId = l.id AND r.status = 'published') as avgRating,
           (SELECT COUNT(*) FROM reviews r WHERE r.listingId = l.id AND r.status = 'published') as reviewCount
    FROM listings l
    JOIN users u ON l.ownerId = u.id
    WHERE l.id = ? OR l.slug = ?
  `).get(id, id) as any;

  if (!row) return null;

  // Increment view count asynchronously
  try {
    db.prepare('UPDATE listings SET viewCount = viewCount + 1 WHERE id = ?').run(row.id);
  } catch {}

  const listing = parseListingRow(row);

  // Check viewer access level to protect private address and direct contact information
  let hasPrivilegedAccess = false;
  if (viewerRole === 'admin') {
    hasPrivilegedAccess = true;
  } else if (viewerUserId && viewerUserId === listing.ownerId) {
    hasPrivilegedAccess = true;
  } else if (viewerUserId) {
    // Check if renter has an accepted/confirmed viewing
    const viewing = db.prepare(`
      SELECT 1 FROM viewings
      WHERE listingId = ? AND renterId = ? AND status IN ('confirmed', 'completed')
      LIMIT 1
    `).get(listing.id, viewerUserId);
    if (viewing) {
      hasPrivilegedAccess = true;
    }
  }

  // If not privileged, protect host contact information and mask exact flat/unit address
  if (!hasPrivilegedAccess) {
    listing.address = listing.publicLocationDescription || `${listing.neighbourhood}, ${listing.city}`;
    listing.ownerPhone = undefined as any;
    listing.ownerEmail = undefined as any;
  }

  // Load rooms
  const rooms = db.prepare('SELECT * FROM rooms WHERE listingId = ? ORDER BY rentPerBed ASC').all(row.id) as any[];
  listing.rooms = rooms.map(r => ({
    ...r,
    attachedBathroom: Boolean(r.attachedBathroom),
    acAvailable: Boolean(r.acAvailable),
  }));

  // Load facilities
  const facilities = db.prepare('SELECT * FROM neighbourhood_facilities WHERE listingId = ? ORDER BY distanceKm ASC').all(row.id) as any[];
  listing.neighbourhoodFacilities = facilities;

  return listing;
}

export function reconfirmAvailability(listingId: string, ownerId: string): boolean {
  const db = getDb();
  const listing = db.prepare('SELECT * FROM listings WHERE id = ?').get(listingId) as any;
  if (!listing) return false;
  if (listing.ownerId !== ownerId) {
    // Check if admin
    const user = db.prepare('SELECT role FROM users WHERE id = ?').get(ownerId) as any;
    if (user?.role !== 'admin') return false;
  }

  const now = new Date().toISOString();
  db.prepare('UPDATE listings SET availabilityConfirmedAt = ?, updatedAt = ? WHERE id = ?').run(now, now, listingId);
  return true;
}

export function getSavedListings(userId: string): Listing[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT l.*, u.name as ownerName, u.role as ownerRole, u.verificationStatus as ownerVerification,
           (SELECT AVG(overallRating) FROM reviews r WHERE r.listingId = l.id AND r.status = 'published') as avgRating,
           (SELECT COUNT(*) FROM reviews r WHERE r.listingId = l.id AND r.status = 'published') as reviewCount
    FROM saved_listings sl
    JOIN listings l ON sl.listingId = l.id
    JOIN users u ON l.ownerId = u.id
    WHERE sl.userId = ?
    ORDER BY sl.createdAt DESC
  `).all(userId);

  return rows.map(parseListingRow);
}

export function isListingSaved(userId: string, listingId: string): boolean {
  const db = getDb();
  const res = db.prepare('SELECT id FROM saved_listings WHERE userId = ? AND listingId = ?').get(userId, listingId);
  return Boolean(res);
}

export function toggleSaveListing(userId: string, listingId: string): boolean {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM saved_listings WHERE userId = ? AND listingId = ?').get(userId, listingId) as any;
  if (existing) {
    db.prepare('DELETE FROM saved_listings WHERE id = ?').run(existing.id);
    return false; // unsaved
  } else {
    db.prepare('INSERT INTO saved_listings (id, userId, listingId, createdAt) VALUES (?, ?, ?, ?)').run(
      'sv_' + Math.random().toString(36).substring(2, 11),
      userId,
      listingId,
      new Date().toISOString()
    );
    return true; // saved
  }
}

export function getEnquiriesForUser(userId: string, role: string): Enquiry[] {
  const db = getDb();
  let query = '';
  if (role === 'renter') {
    query = `
      SELECT e.*, l.title as listingTitle, l.city as listingCity, l.rentAmount as listingRent,
             u.name as hostName
      FROM enquiries e
      JOIN listings l ON e.listingId = l.id
      JOIN users u ON e.hostId = u.id
      WHERE e.renterId = ?
      ORDER BY e.updatedAt DESC
    `;
  } else {
    query = `
      SELECT e.*, l.title as listingTitle, l.city as listingCity, l.rentAmount as listingRent,
             r.name as renterName, r.email as renterEmail, r.phone as renterPhone
      FROM enquiries e
      JOIN listings l ON e.listingId = l.id
      JOIN users r ON e.renterId = r.id
      WHERE e.hostId = ?
      ORDER BY e.updatedAt DESC
    `;
  }

  const rows = db.prepare(query).all(userId) as any[];

  // Fetch latest messages for each
  for (const enq of rows) {
    const messages = db.prepare(`
      SELECT m.*, u.name as senderName
      FROM enquiry_messages m
      JOIN users u ON m.senderId = u.id
      WHERE m.enquiryId = ?
      ORDER BY m.createdAt ASC
    `).all(enq.id) as any[];

    if (messages.length === 0 && enq.message) {
      enq.messages = [{
        id: 'msg_init_' + enq.id,
        enquiryId: enq.id,
        senderId: enq.renterId,
        message: enq.message,
        createdAt: enq.createdAt,
        senderName: enq.renterName || 'Renter',
      }];
    } else {
      enq.messages = messages;
    }
  }

  return rows;
}

export function getViewingsForUser(userId: string, role: string): Viewing[] {
  const db = getDb();
  let query = '';
  if (role === 'renter') {
    query = `
      SELECT v.*, l.title as listingTitle, u.name as hostName
      FROM viewings v
      JOIN listings l ON v.listingId = l.id
      JOIN users u ON v.hostId = u.id
      WHERE v.renterId = ?
      ORDER BY v.scheduledAt DESC
    `;
  } else {
    query = `
      SELECT v.*, l.title as listingTitle, r.name as renterName
      FROM viewings v
      JOIN listings l ON v.listingId = l.id
      JOIN users r ON v.renterId = r.id
      WHERE v.hostId = ?
      ORDER BY v.scheduledAt DESC
    `;
  }

  return db.prepare(query).all(userId) as any[];
}
