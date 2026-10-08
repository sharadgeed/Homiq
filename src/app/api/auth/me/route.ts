import { getCurrentUser } from '@/lib/auth';
import { jsonResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return jsonResponse({ user: null });
  }

  return jsonResponse({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      avatarUrl: user.avatarUrl,
      verificationStatus: user.verificationStatus,
      idDocType: user.idDocType,
      representationType: user.representationType,
      brokerageRegistrationNo: user.brokerageRegistrationNo,
      bio: user.bio,
      cityPreference: user.cityPreference,
      budgetPreference: user.budgetPreference,
      moveInDatePreference: user.moveInDatePreference,
      commuteDestination: user.commuteDestination,
    },
  });
}
