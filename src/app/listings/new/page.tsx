'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building, Plus, Trash2, ShieldCheck, IndianRupee, Image, Check, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DemoRoleBar from '@/components/DemoRoleBar';

export default function NewListingPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState('flat');
  const [accommodationType, setAccommodationType] = useState('entire_apartment');
  const [city, setCity] = useState('Bengaluru');
  const [neighbourhood, setNeighbourhood] = useState('');
  const [address, setAddress] = useState('');
  const [publicLocationDescription, setPublicLocationDescription] = useState('');
  const [pincode, setPincode] = useState('560034');
  const [landmark, setLandmark] = useState('');

  // Costs
  const [rentAmount, setRentAmount] = useState<number>(22000);
  const [depositAmount, setDepositAmount] = useState<number>(60000);
  const [brokerageAmount, setBrokerageAmount] = useState<number>(0);
  const [maintenanceAmount, setMaintenanceAmount] = useState<number>(2000);
  const [utilityEstimatedAmount, setUtilityEstimatedAmount] = useState<number>(1000);
  const [foodCharges, setFoodCharges] = useState<number>(0);
  const [otherCharges, setOtherCharges] = useState<number>(1000);

  // Configuration
  const [availableFrom, setAvailableFrom] = useState('2026-11-01');
  const [furnishing, setFurnishing] = useState('semi_furnished');
  const [totalBedrooms, setTotalBedrooms] = useState(2);
  const [totalBathrooms, setTotalBathrooms] = useState(2);
  const [carpetAreaSqFt, setCarpetAreaSqFt] = useState(900);
  const [foodIncluded, setFoodIncluded] = useState(false);
  const [foodType, setFoodType] = useState('none');

  // Manager & Representation
  const [managerType, setManagerType] = useState<'owner' | 'authorized_representative' | 'broker'>('owner');

  // Amenities list
  const [amenities, setAmenities] = useState<string[]>([
    'wifi', 'power_backup', 'washing_machine', 'geyser', 'lift', 'parking_two_wheeler', 'cctv'
  ]);

  // House Rules
  const [houseRulesText, setHouseRulesText] = useState(
    'No indoor smoking\nQuiet hours after 10:30 PM\nSmall pets allowed with agreement\nVisitors allowed until 10 PM'
  );

  // PG Rooms (if PG)
  const [rooms, setRooms] = useState([
    { roomNumber: 'Room 101', roomType: 'single', capacity: 1, rentPerBed: 15000, depositPerBed: 30000, attachedBathroom: true, acAvailable: true },
    { roomNumber: 'Room 102', roomType: 'double_sharing', capacity: 2, rentPerBed: 10500, depositPerBed: 20000, attachedBathroom: true, acAvailable: false },
  ]);

  const toggleAmenity = (id: string) => {
    if (amenities.includes(id)) {
      setAmenities(amenities.filter(x => x !== id));
    } else {
      setAmenities([...amenities, id]);
    }
  };

  const handleAddRoom = () => {
    setRooms([
      ...rooms,
      {
        roomNumber: `Room ${100 + rooms.length + 1}`,
        roomType: 'double_sharing',
        capacity: 2,
        rentPerBed: 10000,
        depositPerBed: 20000,
        attachedBathroom: true,
        acAvailable: false,
      },
    ]);
  };

  const handleRemoveRoom = (index: number) => {
    setRooms(rooms.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      const houseRules = houseRulesText.split('\n').map(s => s.trim()).filter(Boolean);

      const payload = {
        title,
        description,
        propertyType,
        accommodationType,
        city,
        neighbourhood,
        address,
        publicLocationDescription: publicLocationDescription || `${neighbourhood}, ${city}`,
        pincode,
        landmark,
        rentAmount,
        depositAmount,
        brokerageAmount,
        maintenanceAmount,
        utilityEstimatedAmount,
        foodCharges,
        otherCharges,
        availableFrom,
        furnishing,
        totalBedrooms,
        totalBathrooms,
        carpetAreaSqFt,
        foodIncluded,
        foodType,
        managerType,
        amenities,
        houseRules,
        rooms: propertyType === 'pg' || propertyType === 'hostel' ? rooms : [],
      };

      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setErrorMsg('Authentication error: please switch to an Owner, Operator, or Broker role.');
        } else {
          setErrorMsg(data.error || 'Failed to publish listing');
        }
      } else {
        router.push(`/listings/${data.listingId}`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <DemoRoleBar />
      <Navbar />

      <main className="homiq-container" style={{ padding: '2.5rem 1.25rem', maxWidth: '880px', flex: 1 }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
            List a Property or Co-Living Space
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Transparent disclosure of all upfront and recurring costs ensures faster move-ins and genuine applicants.
          </p>
        </div>

        {errorMsg && (
          <div style={{ background: '#fee2e2', border: '1px solid #f87171', color: '#b91c1c', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
          {/* Section 1: Basic Classification */}
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            1. Property & Accommodation Category
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Property Type</label>
              <select className="form-select" value={propertyType} onChange={e => setPropertyType(e.target.value)}>
                <option value="flat">Full Apartment / Flat</option>
                <option value="room">Private Room in Shared Flat</option>
                <option value="pg">PG & Co-Living Space</option>
                <option value="hostel">Hostel</option>
                <option value="guesthouse">Guest House</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Occupancy Type</label>
              <select className="form-select" value={accommodationType} onChange={e => setAccommodationType(e.target.value)}>
                <option value="entire_apartment">Entire House / Independent</option>
                <option value="private_room">Private Single Room</option>
                <option value="shared_room">Shared Room / Coliving</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Representation Role</label>
              <select className="form-select" value={managerType} onChange={e => setManagerType(e.target.value as any)}>
                <option value="owner">Direct Property Owner</option>
                <option value="authorized_representative">Authorized PG / Co-living Operator</option>
                <option value="broker">RERA Registered Broker</option>
              </select>
            </div>
          </div>

          {/* Section 2: Details */}
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            2. Title & Locality
          </h2>

          <div className="form-group">
            <label className="form-label">Listing Title</label>
            <input
              type="text"
              placeholder="e.g. Spacious 2BHK with Balcony near Sony World Signal"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Metro / City</label>
              <select className="form-select" value={city} onChange={e => setCity(e.target.value)}>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Pune">Pune</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Neighbourhood / Sector</label>
              <input
                type="text"
                placeholder="e.g. Koramangala 4th Block"
                value={neighbourhood}
                onChange={e => setNeighbourhood(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Pincode</label>
              <input
                type="text"
                value={pincode}
                onChange={e => setPincode(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Exact Physical Address (Shown only after confirmed viewing)</label>
            <input
              type="text"
              placeholder="Door number, street name, apartment society name"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description & Living Highlights</label>
            <textarea
              rows={4}
              placeholder="Describe ventilation, water supply, modular kitchen fittings, internet providers, parking arrangements..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="form-textarea"
              required
            />
          </div>

          {/* Section 3: Cost Separation (Crucial for Homiq) */}
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '1.5rem 0 1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', color: '#044e46' }}>
            3. Transparent Cost Breakdown (INR ₹)
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1rem' }}>
            Mandatory disclosure of all separate line items. No hidden charges permitted.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Monthly Rent (₹)</label>
              <input
                type="number"
                value={rentAmount}
                onChange={e => setRentAmount(Number(e.target.value))}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Refundable Deposit (₹)</label>
              <input
                type="number"
                value={depositAmount}
                onChange={e => setDepositAmount(Number(e.target.value))}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Society Maintenance (₹/mo)</label>
              <input
                type="number"
                value={maintenanceAmount}
                onChange={e => setMaintenanceAmount(Number(e.target.value))}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Brokerage Fee (₹) [0 for owner]</label>
              <input
                type="number"
                value={brokerageAmount}
                onChange={e => setBrokerageAmount(Number(e.target.value))}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Est. Monthly Utilities (₹)</label>
              <input
                type="number"
                value={utilityEstimatedAmount}
                onChange={e => setUtilityEstimatedAmount(Number(e.target.value))}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Food Charges (₹/mo)</label>
              <input
                type="number"
                value={foodCharges}
                onChange={e => setFoodCharges(Number(e.target.value))}
                className="form-input"
              />
            </div>
          </div>

          {/* Section 4: Specifications */}
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '1.5rem 0 1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            4. Room Specs & Amenities
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Furnishing</label>
              <select className="form-select" value={furnishing} onChange={e => setFurnishing(e.target.value)}>
                <option value="fully_furnished">Fully Furnished</option>
                <option value="semi_furnished">Semi Furnished</option>
                <option value="unfurnished">Unfurnished</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Bedrooms (BHK)</label>
              <input
                type="number"
                value={totalBedrooms}
                onChange={e => setTotalBedrooms(Number(e.target.value))}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bathrooms</label>
              <input
                type="number"
                value={totalBathrooms}
                onChange={e => setTotalBathrooms(Number(e.target.value))}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Available Move-In Date</label>
              <input
                type="date"
                value={availableFrom}
                onChange={e => setAvailableFrom(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          {/* Amenities checkboxes */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ marginBottom: '0.5rem' }}>Select Amenities</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.5rem' }}>
              {[
                'wifi', 'ac', 'power_backup', 'washing_machine', 'refrigerator',
                'geyser', 'lift', 'gym', 'cctv', 'security_guard',
                'parking_two_wheeler', 'parking_four_wheeler'
              ].map(am => (
                <label key={am} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={amenities.includes(am)}
                    onChange={() => toggleAmenity(am)}
                  />
                  <span style={{ textTransform: 'capitalize' }}>{am.replace(/_/g, ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* House Rules */}
          <div className="form-group">
            <label className="form-label">House Rules (One per line)</label>
            <textarea
              rows={4}
              value={houseRulesText}
              onChange={e => setHouseRulesText(e.target.value)}
              className="form-textarea"
            />
          </div>

          {/* PG Room Configurations (if PG or hostel) */}
          {(propertyType === 'pg' || propertyType === 'hostel') && (
            <div style={{ marginBottom: '2rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Room & Bed Configuration</h3>
                <button type="button" onClick={handleAddRoom} className="btn btn-secondary btn-sm">
                  <Plus size={14} /> Add Room
                </button>
              </div>

              {rooms.map((rm, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    value={rm.roomNumber}
                    onChange={e => {
                      const updated = [...rooms];
                      updated[idx].roomNumber = e.target.value;
                      setRooms(updated);
                    }}
                    className="form-input"
                    placeholder="Room Name"
                  />
                  <select
                    value={rm.roomType}
                    onChange={e => {
                      const updated = [...rooms];
                      updated[idx].roomType = e.target.value;
                      setRooms(updated);
                    }}
                    className="form-select"
                  >
                    <option value="single">Single Sharing</option>
                    <option value="double_sharing">Double Sharing</option>
                    <option value="triple_sharing">Triple Sharing</option>
                  </select>
                  <input
                    type="number"
                    value={rm.rentPerBed}
                    onChange={e => {
                      const updated = [...rooms];
                      updated[idx].rentPerBed = Number(e.target.value);
                      setRooms(updated);
                    }}
                    className="form-input"
                    placeholder="Rent/Bed"
                  />
                  <input
                    type="number"
                    value={rm.depositPerBed}
                    onChange={e => {
                      const updated = [...rooms];
                      updated[idx].depositPerBed = Number(e.target.value);
                      setRooms(updated);
                    }}
                    className="form-input"
                    placeholder="Deposit/Bed"
                  />
                  <button type="button" onClick={() => handleRemoveRoom(idx)} style={{ color: '#ef4444' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-lg btn-full"
            style={{ marginTop: '1.5rem' }}
          >
            {submitting ? 'Publishing Listing...' : 'Publish Listing with Transparent Costs'}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
