export type UserRole = 'renter' | 'owner' | 'operator' | 'broker' | 'admin';

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: UserRole;
  avatarUrl?: string | null;
  verificationStatus: VerificationStatus;
  idDocType?: string | null;
  idDocUrl?: string | null;
  representationType?: 'owner_rep' | 'renter_rep' | 'dual_rep' | null;
  brokerageRegistrationNo?: string | null;
  bio?: string | null;
  moveInDatePreference?: string | null;
  budgetPreference?: number | null;
  cityPreference?: string | null;
  commuteDestination?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type PropertyType = 'flat' | 'room' | 'pg' | 'hostel' | 'guesthouse';
export type AccommodationType = 'entire_apartment' | 'private_room' | 'shared_room';
export type FurnishingType = 'unfurnished' | 'semi_furnished' | 'fully_furnished';
export type FoodType = 'none' | 'veg_only' | 'veg_nonveg';
export type ManagerType = 'owner' | 'authorized_representative' | 'broker';
export type ListingStatus = 'active' | 'paused' | 'rented' | 'under_review' | 'suspended';

export interface Listing {
  id: string;
  ownerId: string;
  title: string;
  slug: string;
  description: string;
  propertyType: PropertyType;
  accommodationType: AccommodationType;
  address: string;
  publicLocationDescription: string;
  city: string;
  neighbourhood: string;
  pincode: string;
  latitude: number;
  longitude: number;
  landmark?: string | null;
  rentAmount: number;
  depositAmount: number;
  brokerageAmount: number;
  maintenanceAmount: number;
  utilityEstimatedAmount: number;
  foodCharges: number;
  otherCharges: number;
  currency: string;
  availableFrom: string;
  availabilityConfirmedAt: string;
  furnishing: FurnishingType;
  totalBedrooms: number;
  totalBathrooms: number;
  balconyCount: number;
  floor: number;
  totalFloors: number;
  carpetAreaSqFt?: number | null;
  foodIncluded: boolean;
  foodType: FoodType;
  houseRules: string[]; // Parsed array
  amenities: string[];  // Parsed array
  accessibilityFeatures: string[]; // Parsed array
  images: string[];     // Parsed array
  videoTourUrl?: string | null;
  managerType: ManagerType;
  status: ListingStatus;
  verifiedListing: boolean;
  verificationNotes?: string | null;
  viewCount: number;
  enquiryCount: number;
  createdAt: string;
  updatedAt: string;

  // Joined/calculated optional fields
  ownerName?: string;
  ownerRole?: string;
  ownerVerification?: VerificationStatus;
  ownerPhone?: string | null;
  ownerEmail?: string | null;
  brokerageRegistrationNo?: string | null;
  representationType?: string | null;
  rooms?: Room[];
  neighbourhoodFacilities?: NeighbourhoodFacility[];
  avgRating?: number;
  reviewCount?: number;
}

export interface Room {
  id: string;
  listingId: string;
  roomNumber: string;
  roomType: 'single' | 'double_sharing' | 'triple_sharing' | 'four_sharing';
  capacity: number;
  occupiedBeds: number;
  rentPerBed: number;
  depositPerBed: number;
  attachedBathroom: boolean;
  acAvailable: boolean;
  status: 'available' | 'full' | 'maintenance';
  createdAt: string;
}

export interface NeighbourhoodFacility {
  id: string;
  listingId: string;
  category: 'transit' | 'hospital' | 'grocery' | 'park' | 'college' | 'tech_park';
  name: string;
  distanceKm: number;
  travelTimeMins: number;
  commuteMode: 'walk' | 'metro' | 'bus' | 'drive';
}

export type EnquiryStatus = 'pending' | 'responded' | 'viewing_scheduled' | 'closed' | 'rejected';

export interface Enquiry {
  id: string;
  listingId: string;
  renterId: string;
  hostId: string;
  targetMoveInDate: string;
  durationMonths: number;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt: string;

  // Joined fields
  listingTitle?: string;
  listingCity?: string;
  listingRent?: number;
  renterName?: string;
  renterEmail?: string;
  renterPhone?: string;
  hostName?: string;
  messages?: EnquiryMessage[];
}

export interface EnquiryMessage {
  id: string;
  enquiryId: string;
  senderId: string;
  message: string;
  createdAt: string;
  senderName?: string;
}

export type ViewingType = 'in_person' | 'video_tour';
export type ViewingStatus = 'requested' | 'confirmed' | 'rescheduled' | 'completed' | 'cancelled';

export interface Viewing {
  id: string;
  enquiryId?: string | null;
  listingId: string;
  renterId: string;
  hostId: string;
  scheduledAt: string;
  viewingType: ViewingType;
  videoMeetingUrl?: string | null;
  notes?: string | null;
  status: ViewingStatus;
  createdAt: string;
  updatedAt: string;

  listingTitle?: string;
  renterName?: string;
  hostName?: string;
}

export interface Review {
  id: string;
  listingId: string;
  renterId: string;
  overallRating: number;
  cleanlinessRating: number;
  locationRating: number;
  valueRating: number;
  landlordRating: number;
  title: string;
  comment: string;
  pros?: string | null;
  cons?: string | null;
  verifiedStay: boolean;
  status: 'published' | 'flagged' | 'hidden';
  createdAt: string;

  renterName?: string;
}

export interface Report {
  id: string;
  reporterId: string;
  listingId: string;
  reason: 'misleading_price' | 'unavailable_rented' | 'scam_fake' | 'discriminatory' | 'hygiene_safety' | 'other';
  details: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;

  listingTitle?: string;
  reporterName?: string;
}

export interface MoveInConditionPhoto {
  url: string;
  caption: string;
  date: string;
}

export interface MoveInRecord {
  id: string;
  listingId: string;
  renterId: string;
  hostId: string;
  moveInDate: string;
  agreedRent: number;
  agreedDeposit: number;
  checklist: Record<string, boolean | string>;
  conditionNotes?: string | null;
  datedPhotos: MoveInConditionPhoto[];
  status: 'draft' | 'agreed_by_both' | 'dispute';
  createdAt: string;
  updatedAt: string;

  listingTitle?: string;
  renterName?: string;
  hostName?: string;
}

export interface MaintenanceRequest {
  id: string;
  listingId: string;
  requesterId: string;
  hostId: string;
  title: string;
  description: string;
  category: 'plumbing' | 'electrical' | 'appliance' | 'carpentry' | 'cleanliness' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'rejected';
  resolutionNotes?: string | null;
  createdAt: string;
  updatedAt: string;

  listingTitle?: string;
  requesterName?: string;
}

export interface AuditLog {
  id: string;
  actorId?: string | null;
  action: string;
  targetType: string;
  targetId: string;
  metadata?: string | null;
  ipAddress?: string | null;
  createdAt: string;
  actorName?: string;
}

export interface CostBreakdown {
  rentAmount: number;
  depositAmount: number;
  brokerageAmount: number;
  maintenanceAmount: number;
  utilityEstimatedAmount: number;
  foodCharges: number;
  otherCharges: number;
  totalUpfrontCost: number;
  monthlyRecurringCost: number;
}

export function calculateCosts(listing: {
  rentAmount: number;
  depositAmount: number;
  brokerageAmount?: number;
  maintenanceAmount?: number;
  utilityEstimatedAmount?: number;
  foodCharges?: number;
  otherCharges?: number;
}): CostBreakdown {
  const rent = Number(listing.rentAmount) || 0;
  const deposit = Number(listing.depositAmount) || 0;
  const brokerage = Number(listing.brokerageAmount) || 0;
  const maintenance = Number(listing.maintenanceAmount) || 0;
  const utility = Number(listing.utilityEstimatedAmount) || 0;
  const food = Number(listing.foodCharges) || 0;
  const other = Number(listing.otherCharges) || 0;

  return {
    rentAmount: rent,
    depositAmount: deposit,
    brokerageAmount: brokerage,
    maintenanceAmount: maintenance,
    utilityEstimatedAmount: utility,
    foodCharges: food,
    otherCharges: other,
    // Upfront = Deposit + First Month Rent + Brokerage + One-time other charges
    totalUpfrontCost: deposit + rent + brokerage + other,
    // Monthly Recurring = Rent + Maintenance + Estimated utilities + Food
    monthlyRecurringCost: rent + maintenance + utility + food,
  };
}
