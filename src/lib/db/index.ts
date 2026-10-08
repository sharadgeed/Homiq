import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'homiq.db');

// Ensure parent directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!dbInstance) {
    dbInstance = new Database(DB_PATH);
    dbInstance.pragma('journal_mode = WAL');
    dbInstance.pragma('foreign_keys = ON');
    initSchema(dbInstance);
  }
  return dbInstance;
}

export function initSchema(db: Database.Database) {
  // Create tables in transaction
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      role TEXT NOT NULL CHECK(role IN ('renter', 'owner', 'operator', 'broker', 'admin')),
      avatarUrl TEXT,
      verificationStatus TEXT DEFAULT 'unverified' CHECK(verificationStatus IN ('unverified', 'pending', 'verified', 'rejected')),
      idDocType TEXT,
      idDocUrl TEXT,
      representationType TEXT,
      brokerageRegistrationNo TEXT,
      bio TEXT,
      moveInDatePreference TEXT,
      budgetPreference INTEGER,
      cityPreference TEXT,
      commuteDestination TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS listings (
      id TEXT PRIMARY KEY,
      ownerId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      propertyType TEXT NOT NULL CHECK(propertyType IN ('flat', 'room', 'pg', 'hostel', 'guesthouse')),
      accommodationType TEXT NOT NULL CHECK(accommodationType IN ('entire_apartment', 'private_room', 'shared_room')),
      address TEXT NOT NULL,
      publicLocationDescription TEXT NOT NULL,
      city TEXT NOT NULL,
      neighbourhood TEXT NOT NULL,
      pincode TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      landmark TEXT,
      rentAmount INTEGER NOT NULL,
      depositAmount INTEGER NOT NULL,
      brokerageAmount INTEGER DEFAULT 0,
      maintenanceAmount INTEGER DEFAULT 0,
      utilityEstimatedAmount INTEGER DEFAULT 0,
      foodCharges INTEGER DEFAULT 0,
      otherCharges INTEGER DEFAULT 0,
      currency TEXT DEFAULT 'INR',
      availableFrom TEXT NOT NULL,
      availabilityConfirmedAt TEXT NOT NULL,
      furnishing TEXT NOT NULL CHECK(furnishing IN ('unfurnished', 'semi_furnished', 'fully_furnished')),
      totalBedrooms INTEGER DEFAULT 1,
      totalBathrooms INTEGER DEFAULT 1,
      balconyCount INTEGER DEFAULT 0,
      floor INTEGER DEFAULT 1,
      totalFloors INTEGER DEFAULT 1,
      carpetAreaSqFt INTEGER,
      foodIncluded INTEGER DEFAULT 0,
      foodType TEXT DEFAULT 'none' CHECK(foodType IN ('none', 'veg_only', 'veg_nonveg')),
      houseRules TEXT NOT NULL,
      amenities TEXT NOT NULL,
      accessibilityFeatures TEXT NOT NULL,
      images TEXT NOT NULL,
      videoTourUrl TEXT,
      managerType TEXT NOT NULL CHECK(managerType IN ('owner', 'authorized_representative', 'broker')),
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'paused', 'rented', 'under_review', 'suspended')),
      verifiedListing INTEGER DEFAULT 0,
      verificationNotes TEXT,
      viewCount INTEGER DEFAULT 0,
      enquiryCount INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS rooms (
      id TEXT PRIMARY KEY,
      listingId TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
      roomNumber TEXT NOT NULL,
      roomType TEXT NOT NULL CHECK(roomType IN ('single', 'double_sharing', 'triple_sharing', 'four_sharing')),
      capacity INTEGER NOT NULL,
      occupiedBeds INTEGER DEFAULT 0,
      rentPerBed INTEGER NOT NULL,
      depositPerBed INTEGER NOT NULL,
      attachedBathroom INTEGER DEFAULT 0,
      acAvailable INTEGER DEFAULT 0,
      status TEXT DEFAULT 'available' CHECK(status IN ('available', 'full', 'maintenance')),
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS neighbourhood_facilities (
      id TEXT PRIMARY KEY,
      listingId TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
      category TEXT NOT NULL CHECK(category IN ('transit', 'hospital', 'grocery', 'park', 'college', 'tech_park')),
      name TEXT NOT NULL,
      distanceKm REAL NOT NULL,
      travelTimeMins INTEGER NOT NULL,
      commuteMode TEXT NOT NULL CHECK(commuteMode IN ('walk', 'metro', 'bus', 'drive'))
    );

    CREATE TABLE IF NOT EXISTS enquiries (
      id TEXT PRIMARY KEY,
      listingId TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
      renterId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      hostId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      targetMoveInDate TEXT NOT NULL,
      durationMonths INTEGER DEFAULT 11,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'responded', 'viewing_scheduled', 'closed', 'rejected')),
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS enquiry_messages (
      id TEXT PRIMARY KEY,
      enquiryId TEXT NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
      senderId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      message TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS viewings (
      id TEXT PRIMARY KEY,
      enquiryId TEXT REFERENCES enquiries(id) ON DELETE SET NULL,
      listingId TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
      renterId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      hostId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      scheduledAt TEXT NOT NULL,
      viewingType TEXT NOT NULL CHECK(viewingType IN ('in_person', 'video_tour')),
      videoMeetingUrl TEXT,
      notes TEXT,
      status TEXT DEFAULT 'requested' CHECK(status IN ('requested', 'confirmed', 'rescheduled', 'completed', 'cancelled')),
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS saved_listings (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      listingId TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
      createdAt TEXT NOT NULL,
      UNIQUE(userId, listingId)
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      listingId TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
      renterId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      overallRating REAL NOT NULL,
      cleanlinessRating REAL NOT NULL,
      locationRating REAL NOT NULL,
      valueRating REAL NOT NULL,
      landlordRating REAL NOT NULL,
      title TEXT NOT NULL,
      comment TEXT NOT NULL,
      pros TEXT,
      cons TEXT,
      verifiedStay INTEGER DEFAULT 1,
      status TEXT DEFAULT 'published' CHECK(status IN ('published', 'flagged', 'hidden')),
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      reporterId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      listingId TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
      reason TEXT NOT NULL CHECK(reason IN ('misleading_price', 'unavailable_rented', 'scam_fake', 'discriminatory', 'hygiene_safety', 'other')),
      details TEXT NOT NULL,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'investigating', 'resolved', 'dismissed')),
      adminNotes TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS move_in_records (
      id TEXT PRIMARY KEY,
      listingId TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
      renterId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      hostId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      moveInDate TEXT NOT NULL,
      agreedRent INTEGER NOT NULL,
      agreedDeposit INTEGER NOT NULL,
      checklist TEXT NOT NULL,
      conditionNotes TEXT,
      datedPhotos TEXT NOT NULL,
      status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'agreed_by_both', 'dispute')),
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS maintenance_requests (
      id TEXT PRIMARY KEY,
      listingId TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
      requesterId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      hostId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('plumbing', 'electrical', 'appliance', 'carpentry', 'cleanliness', 'other')),
      priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high', 'urgent')),
      status TEXT DEFAULT 'open' CHECK(status IN ('open', 'in_progress', 'resolved', 'rejected')),
      resolutionNotes TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      actorId TEXT REFERENCES users(id) ON DELETE SET NULL,
      action TEXT NOT NULL,
      targetType TEXT NOT NULL,
      targetId TEXT NOT NULL,
      metadata TEXT,
      ipAddress TEXT,
      createdAt TEXT NOT NULL
    );

    -- Performance indexes
    CREATE INDEX IF NOT EXISTS idx_listings_city ON listings(city);
    CREATE INDEX IF NOT EXISTS idx_listings_owner ON listings(ownerId);
    CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
    CREATE INDEX IF NOT EXISTS idx_listings_rent ON listings(rentAmount);
    CREATE INDEX IF NOT EXISTS idx_listings_property_type ON listings(propertyType);
    CREATE INDEX IF NOT EXISTS idx_enquiries_renter ON enquiries(renterId);
    CREATE INDEX IF NOT EXISTS idx_enquiries_host ON enquiries(hostId);
    CREATE INDEX IF NOT EXISTS idx_viewings_host ON viewings(hostId);
    CREATE INDEX IF NOT EXISTS idx_viewings_renter ON viewings(renterId);
    CREATE INDEX IF NOT EXISTS idx_reviews_listing ON reviews(listingId);
    CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
    CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(createdAt);
  `);
}
