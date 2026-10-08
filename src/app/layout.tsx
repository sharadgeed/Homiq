import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Homiq | India-Focused Rental Accommodation Platform | Rooms, Flats & PGs',
  description: 'Find verified flats, private rooms, PGs, and hostels in Bengaluru, Mumbai, Gurgaon, Pune, and Hyderabad. Compare by total upfront cost, confirmed availability, and real commute times.',
  keywords: [
    'rental accommodation India',
    'flats for rent Bangalore',
    'PG in HSR Layout',
    'zero brokerage flats Mumbai',
    'co-living Gurgaon',
    'verified landlord homes India',
    'rent agreement condition checklist',
  ],
  openGraph: {
    title: 'Homiq | Verified Rental Accommodations in India',
    description: 'Compare homes by total move-in cost, verified landlord status, and real commute estimates.',
    url: 'https://homiq.in',
    siteName: 'Homiq India',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
