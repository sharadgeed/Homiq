import { cookies } from 'next/headers';
import { COOKIE_NAME } from '@/lib/auth';
import { jsonResponse } from '@/lib/api-response';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  return jsonResponse({ success: true, message: 'Logged out successfully' });
}
