import { handle, readJson, json } from '@/lib/api';
import { findUserByEmail } from '@/lib/auth';
import { issueToken, purgeExpiredTokens, TOKEN_TTL } from '@/lib/tokens';
import { appUrl, sendMail } from '@/lib/mail';
import { clientIp, loginAllowed, recordFailedLogin } from '@/lib/rate-limit';
import { validateEmail } from '@/lib/validate';

export const runtime = 'nodejs';

type Body = { email?: string };

export async function POST(request: Request) {
  return handle(async () => {
    const body = await readJson<Body>(request);
    const email = (body.email ?? '').trim().toLowerCase();

    // The response below is identical whatever happens, so this endpoint can
    // never be used to check whether an address has an account.
    const generic = json({
      ok: true,
      message: 'If that email has an account, a reset link is on its way.',
    });

    if (validateEmail(email)) return generic;

    const ip = clientIp(request);
    // Reuse the login limiter so this cannot become the cheap way to enumerate.
    if (!loginAllowed(ip, email)) return generic;
    recordFailedLogin(ip, email);

    const user = findUserByEmail(email);
    if (!user || user.status !== 'active') return generic;

    purgeExpiredTokens();
    const token = issueToken('password_reset', user.id);

    await sendMail({
      to: user.email,
      subject: 'Reset your Seoul Radiance BD password',
      text: [
        `Hello ${user.name},`,
        '',
        'Use the link below to set a new password. It works once and expires in',
        `${TOKEN_TTL.resetMinutes} minutes.`,
        '',
        appUrl(`/reset-password?token=${token}`),
        '',
        'If you did not ask for this, you can ignore this message — your password',
        'has not changed.',
      ].join('\n'),
    });

    return generic;
  });
}
