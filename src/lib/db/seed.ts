import bcrypt from 'bcryptjs';
import { getDb, initSchema } from './index';

export async function runSeed() {
  const db = getDb();
  initSchema(db);

  console.log('Seeding Homiq database with realistic India-focused accommodation data...');

  // Clear existing data safely
  db.exec(`
    DELETE FROM audit_logs;
    DELETE FROM maintenance_requests;
    DELETE FROM move_in_records;
    DELETE FROM reports;
    DELETE FROM reviews;
    DELETE FROM saved_listings;
    DELETE FROM viewings;
    DELETE FROM enquiry_messages;
    DELETE FROM enquiries;
    DELETE FROM neighbourhood_facilities;
    DELETE FROM rooms;
    DELETE FROM listings;
    DELETE FROM users;
  `);

  const passwordHash = await bcrypt.hash('Password123!', 10);
  const now = new Date().toISOString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();

  // 1. Insert Users (5 Roles)
  const insertUser = db.prepare(`
    INSERT INTO users (
      id, email, passwordHash, name, phone, role, avatarUrl, verificationStatus,
      idDocType, idDocUrl, representationType, brokerageRegistrationNo, bio,
      moveInDatePreference, budgetPreference, cityPreference, commuteDestination,
      createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Renter
  insertUser.run(
    'usr_renter_1',
    'renter@homiq.in',
    passwordHash,
    'Aarav Sharma',
    '+91 98765 43210',
    'renter',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'verified',
    'Aadhaar / DigiLocker',
    '/uploads/verified_badge.png',
    null,
    null,
    'Software engineer relocating to Bangalore. Looking for a quiet, fully-furnished 1BHK or master room with high-speed internet and metro access.',
    '2026-11-01',
    25000,
    'Bengaluru',
    'Manyata Tech Park, Hebbal',
    now,
    now
  );

  // Property Owner
  insertUser.run(
    'usr_owner_1',
    'owner@homiq.in',
    passwordHash,
    'Rajesh Venkatesh',
    '+91 98230 11223',
    'owner',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'verified',
    'Electricity Bill & Property Tax',
    '/uploads/owner_tax_receipt.png',
    null,
    null,
    'Independent property owner in Koramangala 4th Block and Indiranagar. I prefer transparent rental agreements and maintain all flats personally.',
    null,
    null,
    'Bengaluru',
    null,
    now,
    now
  );

  // PG / Co-Living Operator
  insertUser.run(
    'usr_operator_1',
    'operator@homiq.in',
    passwordHash,
    'Priya Nambiar',
    '+91 97112 88440',
    'operator',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    'verified',
    'FSSAI & Trade License',
    '/uploads/pg_trade_license.png',
    null,
    null,
    'Operating "Serene Living Co-living & PGs" across HSR Layout and Bellandur. We provide hygienic home-cooked meals, 300 Mbps Wi-Fi, and 24x7 security.',
    null,
    null,
    'Bengaluru',
    null,
    now,
    now
  );

  // Broker / Property Manager
  insertUser.run(
    'usr_broker_1',
    'broker@homiq.in',
    passwordHash,
    'Vikram Kulkarni',
    '+91 98451 99220',
    'broker',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    'verified',
    'Karnataka RERA Certificate',
    '/uploads/rera_cert.png',
    'owner_rep',
    'PRM/KA/RERA/1251/310/AG/210319/002241',
    'RERA registered residential advisor representing owners across Whitefield & Outer Ring Road. 15-day brokerage disclosed transparently upfront.',
    null,
    null,
    'Bengaluru',
    null,
    now,
    now
  );

  // Admin / Compliance Moderator
  insertUser.run(
    'usr_admin_1',
    'admin@homiq.in',
    passwordHash,
    'Neha Iyer',
    '+91 98100 55443',
    'admin',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    'verified',
    'Homiq Trust & Safety Staff ID',
    '/uploads/staff_id.png',
    null,
    null,
    'Platform Trust & Safety Lead. Managing verification audit trails, listing accuracy, and user dispute mediation.',
    null,
    null,
    'Bengaluru',
    null,
    now,
    now
  );

  // 2. Insert Listings
  const insertListing = db.prepare(`
    INSERT INTO listings (
      id, ownerId, title, slug, description, propertyType, accommodationType,
      address, publicLocationDescription, city, neighbourhood, pincode,
      latitude, longitude, landmark, rentAmount, depositAmount, brokerageAmount,
      maintenanceAmount, utilityEstimatedAmount, foodCharges, otherCharges,
      currency, availableFrom, availabilityConfirmedAt, furnishing,
      totalBedrooms, totalBathrooms, balconyCount, floor, totalFloors,
      carpetAreaSqFt, foodIncluded, foodType, houseRules, amenities,
      accessibilityFeatures, images, videoTourUrl, managerType, status,
      verifiedListing, verificationNotes, viewCount, enquiryCount,
      createdAt, updatedAt
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `);

  // Listing 1: 1BHK in Koramangala (Owner)
  insertListing.run(
    'lst_koramangala_1bhk',
    'usr_owner_1',
    'Sunlit 1BHK with Balcony near Sony World Signal',
    'sunlit-1bhk-balcony-koramangala-bengaluru',
    'Spacious 650 sq.ft fully furnished 1BHK on the 2nd floor of a quiet residential building in Koramangala 4th Block. Features high-speed fiber internet, modular kitchen with chimney, inverter power backup, and dedicated covered two-wheeler parking. Walking distance to 80 Feet Road cafes and Sony World junction. No brokerage, directly from owner.',
    'flat',
    'entire_apartment',
    '#412, 17th E Main Rd, 4th Block, Koramangala, Bengaluru, Karnataka 560034',
    'Near Sony World Signal, Koramangala 4th Block',
    'Bengaluru',
    'Koramangala',
    '560034',
    12.9344,
    77.6253,
    'Near Sony World Signal & Wipro Park',
    24000,
    60000,
    0, // Zero brokerage
    2000, // Maintenance
    1200, // Utilities
    0,
    1500, // Move-in cleaning
    'INR',
    '2026-11-01',
    now,
    'fully_furnished',
    1,
    1,
    1,
    2,
    4,
    650,
    0,
    'none',
    JSON.stringify(['No indoor smoking', 'Quiet hours after 10:30 PM', 'Cats and small dogs allowed with prior agreement', 'Guests welcome with advance notice']),
    JSON.stringify(['wifi', 'ac', 'power_backup', 'washing_machine', 'refrigerator', 'geyser', 'lift', 'parking_two_wheeler', 'cctv']),
    JSON.stringify(['elevator', 'wide_doors']),
    JSON.stringify([
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80'
    ]),
    'https://www.youtube.com/watch?v=sample-video-tour',
    'owner',
    'active',
    1,
    'Physical verification completed by Homiq team on 2026-09-15. Title documents verified.',
    148,
    12,
    threeDaysAgo,
    now
  );

  // Listing 2: Luxury PG / Co-living in HSR Layout (Operator)
  insertListing.run(
    'lst_hsr_coliving_pg',
    'usr_operator_1',
    'Serene Heights Co-Living & PG with 3-Meal Dining',
    'serene-heights-coliving-pg-hsr-layout',
    'Premium boutique co-living space designed for IT professionals and remote workers in HSR Layout Sector 2. Includes daily chef-prepared breakfast, lunch, and dinner (both North and South Indian home-style menu). Daily professional housekeeping, high-speed ergonomic workspace desks, gaming zone with PS5, gym, and 24/7 biometric security.',
    'pg',
    'private_room',
    'Plot 88, 19th Main Rd, Sector 2, HSR Layout, Bengaluru, Karnataka 560102',
    'HSR Layout Sector 2, 5 mins from 27th Main Commercial St',
    'Bengaluru',
    'HSR Layout',
    '560102',
    12.9116,
    77.6534,
    'Near NIFT & Sector 2 BDA Complex',
    16500,
    30000,
    0, // Zero brokerage
    0, // Included in rent
    0, // Wi-Fi & electricity included
    3500, // Food charges (optional package included)
    1000, // Onboarding fee
    'INR',
    '2026-10-15',
    yesterday,
    'fully_furnished',
    1,
    1,
    1,
    3,
    5,
    280,
    1,
    'veg_nonveg',
    JSON.stringify(['Biometric entry at main gate', 'Visitors allowed in common lounge until 9:00 PM', 'Designated smoking zone in rooftop gazebo', 'Zero loud music past 11 PM']),
    JSON.stringify(['wifi', 'ac', 'power_backup', 'washing_machine', 'gym', 'cctv', 'security_guard', 'ro_water', 'daily_housekeeping', 'cafeteria']),
    JSON.stringify(['elevator', 'wheelchair_ramp']),
    JSON.stringify([
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80'
    ]),
    null,
    'authorized_representative',
    'active',
    1,
    'Operator verified with active GST and FSSAI hygiene certificate.',
    320,
    28,
    threeDaysAgo,
    yesterday
  );

  // Listing 3: 2BHK in Indiranagar (Broker with clear fee disclosure)
  insertListing.run(
    'lst_indiranagar_2bhk',
    'usr_broker_1',
    'Contemporary 2BHK Apartment near 100 Feet Road',
    'contemporary-2bhk-apartment-indiranagar-bengaluru',
    'Modern, well-ventilated 2BHK apartment situated in a gated community in Defence Colony, Indiranagar. Features modular Italian kitchen, teak wardrobes, solar water heating, 2 covered car parking slots, and 24x7 security. Professional management by Vikram Kulkarni (RERA Certified). Brokerage of 15 days rent strictly applies upon agreement execution.',
    'flat',
    'entire_apartment',
    'Flat 302, Green Palms, 6th Cross, Defence Colony, Indiranagar, Bengaluru, 560038',
    'Defence Colony, 3 mins from Indiranagar 100 Feet Road',
    'Bengaluru',
    'Indiranagar',
    '560038',
    12.9784,
    77.6408,
    'Near Toit & CMH Road Metro Station',
    42000,
    150000,
    21000, // 15 days brokerage disclosed
    4500, // Society maintenance
    2000,
    0,
    2000,
    'INR',
    '2026-11-15',
    now,
    'semi_furnished',
    2,
    2,
    2,
    3,
    4,
    1150,
    0,
    'none',
    JSON.stringify(['Family or working executives preferred', 'Pets allowed with building society NOC', 'Strict parking rules inside basement']),
    JSON.stringify(['wifi', 'power_backup', 'lift', 'parking_four_wheeler', 'parking_two_wheeler', 'security_guard', 'cctv', 'solar_water', 'intercom']),
    JSON.stringify(['elevator', 'wheelchair_ramp']),
    JSON.stringify([
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80'
    ]),
    null,
    'broker',
    'active',
    1,
    'Verified Brokerage Listing. RERA credentials confirmed on Karnataka RERA portal.',
    210,
    9,
    threeDaysAgo,
    now
  );

  // Listing 4: Budget Private Room in Powai, Mumbai
  insertListing.run(
    'lst_mumbai_powai_room',
    'usr_owner_1',
    'Private AC Bedroom in Lake View 3BHK flat Powai',
    'private-ac-bedroom-powai-mumbai',
    'Fully furnished master bedroom with attached bathroom and balcony facing Powai Lake in Hiranandani Gardens. Looking for a working professional flatmate. Flat includes shared washing machine, high-end microwave, refrigerator, and daily cook/maid service split equally.',
    'room',
    'private_room',
    'Wing C, Lake Castle, Hiranandani Gardens, Powai, Mumbai, 400076',
    'Hiranandani Gardens, Powai, Mumbai',
    'Mumbai',
    'Powai',
    '400076',
    19.1197,
    72.9051,
    'Near Galleria Shopping Mall & IIT Bombay',
    22000,
    50000,
    0,
    1500,
    1000,
    2500, // Maid & Cook split
    1000,
    'INR',
    '2026-10-25',
    yesterday,
    'fully_furnished',
    1,
    1,
    1,
    14,
    24,
    320,
    1,
    'veg_only',
    JSON.stringify(['Vegetarian flatmates preferred', 'Smoking strictly on balcony only', 'Quiet study atmosphere due to close IIT Bombay campus']),
    JSON.stringify(['wifi', 'ac', 'power_backup', 'washing_machine', 'refrigerator', 'gym', 'lift', 'security_guard', 'cctv']),
    JSON.stringify(['elevator']),
    JSON.stringify([
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
    ]),
    null,
    'owner',
    'active',
    1,
    'Owner verified via society share certificate.',
    195,
    14,
    threeDaysAgo,
    yesterday
  );

  // Listing 5: Studio Room in Cyber City, Gurgaon (Delhi NCR)
  insertListing.run(
    'lst_gurgaon_cybercity_studio',
    'usr_owner_1',
    'Modern Studio Flat near DLF Cyber City & Rapid Metro',
    'modern-studio-flat-cyber-city-gurgaon',
    'Compact luxury studio apartment right next to DLF Phase 2 Rapid Metro station. Ideal for executives working in Cyber Hub or DLF Square. Independent kitchenette, brand new Daikin 1.5 Ton Inverter AC, king mattress, wardrobe, and high-speed broadband.',
    'room',
    'private_room',
    'Block M, DLF Phase 2, Gurugram, Haryana 122002',
    'DLF Phase 2, 2 mins from Sikanderpur & Cyber City',
    'Delhi NCR',
    'Gurgaon',
    '122002',
    28.4907,
    77.0898,
    'Opposite DLF Cyber Hub & Cyber City Rapid Metro',
    21500,
    43000,
    0,
    1800,
    1500,
    0,
    1000,
    'INR',
    '2026-11-01',
    now,
    'fully_furnished',
    1,
    1,
    0,
    1,
    3,
    400,
    0,
    'none',
    JSON.stringify(['Corporate or IT working professionals', 'No loud parties after midnight', 'Visitors allowed with gate entry register']),
    JSON.stringify(['wifi', 'ac', 'power_backup', 'geyser', 'refrigerator', 'parking_two_wheeler', 'cctv', 'security_guard']),
    JSON.stringify(['ground_floor']),
    JSON.stringify([
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ]),
    null,
    'owner',
    'active',
    1,
    'Physical verification completed on 2026-09-28.',
    167,
    11,
    threeDaysAgo,
    now
  );

  // 3. Insert Rooms for PG / Operator
  const insertRoom = db.prepare(`
    INSERT INTO rooms (
      id, listingId, roomNumber, roomType, capacity, occupiedBeds,
      rentPerBed, depositPerBed, attachedBathroom, acAvailable, status, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertRoom.run('rm_101', 'lst_hsr_coliving_pg', 'Room 101 (Private)', 'single', 1, 0, 16500, 30000, 1, 1, 'available', now);
  insertRoom.run('rm_102', 'lst_hsr_coliving_pg', 'Room 102 (Twin Sharing)', 'double_sharing', 2, 1, 11500, 20000, 1, 1, 'available', now);
  insertRoom.run('rm_103', 'lst_hsr_coliving_pg', 'Room 103 (Triple Sharing)', 'triple_sharing', 3, 2, 8500, 15000, 1, 0, 'available', now);
  insertRoom.run('rm_201', 'lst_hsr_coliving_pg', 'Room 201 (Deluxe Balcony)', 'single', 1, 1, 18500, 35000, 1, 1, 'full', now);

  // 4. Insert Neighbourhood Facilities
  const insertFacility = db.prepare(`
    INSERT INTO neighbourhood_facilities (
      id, listingId, category, name, distanceKm, travelTimeMins, commuteMode
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  // Facilities for Koramangala
  insertFacility.run('fac_kora_1', 'lst_koramangala_1bhk', 'transit', 'Koramangala Sony World Bus Stop', 0.2, 3, 'walk');
  insertFacility.run('fac_kora_2', 'lst_koramangala_1bhk', 'transit', 'Indiranagar Metro Station (Purple Line)', 3.8, 14, 'drive');
  insertFacility.run('fac_kora_3', 'lst_koramangala_1bhk', 'tech_park', 'Embassy GolfLinks Business Park (EGL)', 2.5, 9, 'drive');
  insertFacility.run('fac_kora_4', 'lst_koramangala_1bhk', 'hospital', 'Manipal Hospital HAL Airport Rd', 3.2, 12, 'drive');
  insertFacility.run('fac_kora_5', 'lst_koramangala_1bhk', 'grocery', 'Blinkit Instant Hub & Nature’s Basket', 0.4, 5, 'walk');

  // Facilities for HSR Layout PG
  insertFacility.run('fac_hsr_1', 'lst_hsr_coliving_pg', 'transit', 'HSR BDA Complex Metro Station', 1.1, 12, 'walk');
  insertFacility.run('fac_hsr_2', 'lst_hsr_coliving_pg', 'tech_park', 'Ecospace & RMZ Ecoworld Bellandur', 4.1, 15, 'drive');
  insertFacility.run('fac_hsr_3', 'lst_hsr_coliving_pg', 'college', 'NIFT Bangalore Campus', 0.8, 9, 'walk');
  insertFacility.run('fac_hsr_4', 'lst_hsr_coliving_pg', 'hospital', 'Apollo Cradle Hospital HSR', 1.4, 6, 'drive');

  // Facilities for Indiranagar
  insertFacility.run('fac_indi_1', 'lst_indiranagar_2bhk', 'transit', 'CMH Road Metro Station', 0.7, 8, 'walk');
  insertFacility.run('fac_indi_2', 'lst_indiranagar_2bhk', 'transit', 'Indiranagar Metro Station', 0.9, 10, 'walk');
  insertFacility.run('fac_indi_3', 'lst_indiranagar_2bhk', 'park', 'Defence Colony Children Park', 0.1, 2, 'walk');
  insertFacility.run('fac_indi_4', 'lst_indiranagar_2bhk', 'grocery', 'Dorabjee & Foodworld Supermarket', 0.3, 4, 'walk');

  // 5. Insert Enquiries
  const insertEnquiry = db.prepare(`
    INSERT INTO enquiries (
      id, listingId, renterId, hostId, targetMoveInDate, durationMonths, message, status, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertEnquiry.run(
    'enq_101',
    'lst_koramangala_1bhk',
    'usr_renter_1',
    'usr_owner_1',
    '2026-11-01',
    11,
    'Hi Rajesh, I saw your 1BHK listing in Koramangala. I work at a fintech firm and am looking for a quiet home. Can we schedule a viewing this Saturday around 11:30 AM?',
    'viewing_scheduled',
    threeDaysAgo,
    yesterday
  );

  insertEnquiry.run(
    'enq_102',
    'lst_hsr_coliving_pg',
    'usr_renter_1',
    'usr_operator_1',
    '2026-10-20',
    6,
    'Hello Priya, I would like to know if single private room 101 has dedicated high-speed Wi-Fi and if weekend non-veg food options are included in the package?',
    'responded',
    yesterday,
    now
  );

  // 6. Insert Enquiry Messages
  const insertMessage = db.prepare(`
    INSERT INTO enquiry_messages (id, enquiryId, senderId, message, createdAt)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertMessage.run(
    'msg_1',
    'enq_101',
    'usr_renter_1',
    'Hi Rajesh, I saw your 1BHK listing in Koramangala. Can we schedule a viewing this Saturday?',
    threeDaysAgo
  );
  insertMessage.run(
    'msg_2',
    'enq_101',
    'usr_owner_1',
    'Hello Aarav, Saturday 11:30 AM works well for me. I have confirmed the visit in the platform calendar. See you then!',
    yesterday
  );
  insertMessage.run(
    'msg_3',
    'enq_102',
    'usr_renter_1',
    'Hello Priya, I would like to know if single private room 101 has dedicated high-speed Wi-Fi and if weekend non-veg food options are included?',
    yesterday
  );
  insertMessage.run(
    'msg_4',
    'enq_102',
    'usr_operator_1',
    'Hi Aarav, Yes! Room 101 has dedicated Airtel Fiber and non-veg options are served on Wednesday and Sunday dinners.',
    now
  );

  // 7. Insert Viewings
  const insertViewing = db.prepare(`
    INSERT INTO viewings (
      id, enquiryId, listingId, renterId, hostId, scheduledAt, viewingType, videoMeetingUrl, notes, status, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertViewing.run(
    'viw_101',
    'enq_101',
    'lst_koramangala_1bhk',
    'usr_renter_1',
    'usr_owner_1',
    '2026-10-10T11:30:00Z',
    'in_person',
    null,
    'Host Rajesh will meet at the building entrance. Aarav to check two-wheeler parking and kitchen fittings.',
    'confirmed',
    yesterday,
    yesterday
  );

  insertViewing.run(
    'viw_102',
    null,
    'lst_mumbai_powai_room',
    'usr_renter_1',
    'usr_owner_1',
    '2026-10-12T16:00:00Z',
    'video_tour',
    'https://meet.google.com/hmq-view-powai',
    'Live virtual walkthrough of room, balcony view, and common hall kitchen.',
    'confirmed',
    now,
    now
  );

  // 8. Insert Saved Listings
  const insertSaved = db.prepare(`
    INSERT INTO saved_listings (id, userId, listingId, createdAt)
    VALUES (?, ?, ?, ?)
  `);
  insertSaved.run('sv_1', 'usr_renter_1', 'lst_koramangala_1bhk', threeDaysAgo);
  insertSaved.run('sv_2', 'usr_renter_1', 'lst_hsr_coliving_pg', yesterday);

  // 9. Insert Reviews
  const insertReview = db.prepare(`
    INSERT INTO reviews (
      id, listingId, renterId, overallRating, cleanlinessRating, locationRating, valueRating, landlordRating,
      title, comment, pros, cons, verifiedStay, status, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertReview.run(
    'rev_1',
    'lst_koramangala_1bhk',
    'usr_renter_1',
    4.8,
    5.0,
    5.0,
    4.5,
    5.0,
    'Extremely transparent landlord and peaceful locality',
    'Stayed here for 11 months before my company relocated me. Rajesh uncle is very accommodating and returned the full security deposit within 48 hours of vacating with zero arbitrary deductions.',
    'Prompt plumbing and electrical repairs, 24x7 Kaveri water, walking distance to cafes',
    'Street gets busy during Saturday evenings near the main junction',
    1,
    'published',
    threeDaysAgo
  );

  insertReview.run(
    'rev_2',
    'lst_hsr_coliving_pg',
    'usr_renter_1',
    4.5,
    4.5,
    4.8,
    4.5,
    4.2,
    'Best food quality among all PGs in HSR Sector 2',
    'Food is genuinely home-style with decent variety. Biometric access and cleaning are maintained regularly.',
    'Dedicated high-speed Wi-Fi per floor, hot water, tasty rasam and rotis',
    'Lift was under maintenance for two days last month',
    1,
    'published',
    yesterday
  );

  // 10. Insert Reports
  const insertReport = db.prepare(`
    INSERT INTO reports (
      id, reporterId, listingId, reason, details, status, adminNotes, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertReport.run(
    'rep_1',
    'usr_renter_1',
    'lst_indiranagar_2bhk',
    'misleading_price',
    'Clarification needed on whether society maintenance of 4,500 INR includes water charges.',
    'resolved',
    'Reviewed agreement: maintenance covers 24hr Kaveri water and security. Added explicit note in listing breakdown.',
    threeDaysAgo,
    yesterday
  );

  // 11. Insert Move-In Condition Record
  const insertMoveIn = db.prepare(`
    INSERT INTO move_in_records (
      id, listingId, renterId, hostId, moveInDate, agreedRent, agreedDeposit, checklist, conditionNotes, datedPhotos, status, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertMoveIn.run(
    'mir_101',
    'lst_koramangala_1bhk',
    'usr_renter_1',
    'usr_owner_1',
    '2026-11-01',
    24000,
    60000,
    JSON.stringify({
      mainDoorKeysHandedOver: true,
      cupboardKeysHandedOver: true,
      electricityMeterReading: '4,892 kWh',
      geyserFunctional: true,
      acCoolingOperational: true,
      wallPaintCondition: 'Clean freshly painted Asian Paints Royale off-white',
      bathroomFixturesLeakFree: true,
      kitchenChimneyClean: true
    }),
    'All inventory checked together during handover. Both parties agreed that small scratch on bedroom door frame existed prior to move-in and renter will not be liable at move-out.',
    JSON.stringify([
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80', caption: 'Living room condition on move-in day', date: '2026-11-01' },
      { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80', caption: 'Meter reading & master switch panel', date: '2026-11-01' }
    ]),
    'agreed_by_both',
    yesterday,
    yesterday
  );

  // 12. Insert Maintenance Requests
  const insertMaint = db.prepare(`
    INSERT INTO maintenance_requests (
      id, listingId, requesterId, hostId, title, description, category, priority, status, resolutionNotes, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertMaint.run(
    'mnt_1',
    'lst_koramangala_1bhk',
    'usr_renter_1',
    'usr_owner_1',
    'Geyser thermostat check requested',
    'Water heats up quickly but cuts off after 5 mins. Requesting electrician inspection.',
    'electrical',
    'medium',
    'resolved',
    'Electrician Mr. Murugan visited on Oct 7. Replaced copper element. Tested functional.',
    threeDaysAgo,
    yesterday
  );

  // 13. Audit Logs
  const insertAudit = db.prepare(`
    INSERT INTO audit_logs (id, actorId, action, targetType, targetId, metadata, ipAddress, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertAudit.run('aud_1', 'usr_admin_1', 'VERIFY_LISTING', 'listing', 'lst_koramangala_1bhk', JSON.stringify({ verified: true, doc: 'property_tax' }), '127.0.0.1', threeDaysAgo);
  insertAudit.run('aud_2', 'usr_admin_1', 'VERIFY_USER', 'user', 'usr_broker_1', JSON.stringify({ verified: true, rera: 'PRM/KA/RERA/1251' }), '127.0.0.1', threeDaysAgo);
  insertAudit.run('aud_3', 'usr_owner_1', 'UPDATE_AVAILABILITY', 'listing', 'lst_koramangala_1bhk', JSON.stringify({ availabilityConfirmedAt: now }), '127.0.0.1', now);

  console.log('Database seeded successfully with 5 test user roles and rich listings!');
}

// Allow CLI execution
if (require.main === module) {
  runSeed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
}
