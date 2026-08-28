import { handle, json } from '@/lib/api';
import { requireUser } from '@/lib/auth';
import { issueToken, purgeExpiredTokens, TOKEN_TTL } from '@/lib/tokens';
import { appUrl, sendMail } from '@/lib/mail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  return handle(async () => {
    const user = await requireUser();

    // Already verified is not an error worth surfacing differently.
    if (user.email_verified_at) return json({ ok: true, alreadyVerified: true });

    purgeExpiredTokens();
    const token = issueToken('email_verification', user.id);

    await sendMail({
      to: user.email,
      subject: 'Confirm your Seoul Radiance BD email',
      text: [
        `Hello ${user.name},`,
        '',
        `Confirm this address using the link below. It expires in ${TOKEN_TTL.verifyHours} hours.`,
        '',
        appUrl(`/verify-email?token=${token}`),
      ].join('\n'),
    });

    return json({ ok: true });
  });
}
