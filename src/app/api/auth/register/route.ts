import { cookies } from 'next/headers';
import { handle, readJson, fail, json } from '@/lib/api';
import { validateRegistration } from '@/lib/validate';
import {
  createSession,
  findUserByEmail,
  hashPassword,
  sessionCookieOptions,
  SESSION_COOKIE,
} from '@/lib/auth';
import { run, get } from '@/lib/db';
import { issueToken, TOKEN_TTL } from '@/lib/tokens';
import { appUrl, sendMail } from '@/lib/mail';

export const runtime = 'nodejs';

type Body = { name?: string; email?: string; password?: string; confirmPassword?: string };

export async function POST(request: Request) {
  return handle(async () => {
    const body = await readJson<Body>(request);
    const name = (body.name ?? '').trim();
    const email = (body.email ?? '').trim().toLowerCase();
    const password = body.password ?? '';
    const confirmPassword = body.confirmPassword ?? '';

    const errors = validateRegistration({ name, email, password, confirmPassword });
    if (Object.keys(errors).length > 0) {
      return fail('Please check the form.', 400, errors);
    }

    if (findUserByEmail(email)) {
      // Specific on the signup form is the right trade-off: the person needs to
      // know to sign in instead. Login stays deliberately vague.
      return fail('Please check the form.', 409, {
        email: 'An account with this email already exists. Try signing in.',
      });
    }

    run("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'user')", [
      name,
      email,
      hashPassword(password),
    ]);

    const created = get<{ id: number }>('SELECT id FROM users WHERE email = ?', [email]);
    if (!created) return fail('Could not create the account. Please try again.', 500);

    // The account starts unverified. Verification is not required to shop —
    // guest checkout already exists, so gating the site on a working mailbox
    // would remove a capability rather than add one.
    const verifyToken = issueToken('email_verification', created.id);
    await sendMail({
      to: email,
      subject: 'Confirm your Seoul Radiance BD email',
      text: [
        `Hello ${name},`,
        '',
        `Confirm this address using the link below. It expires in ${TOKEN_TTL.verifyHours} hours.`,
        '',
        appUrl(`/verify-email?token=${verifyToken}`),
      ].join('\n'),
    });

    const cookie = createSession(created.id);
    (await cookies()).set(SESSION_COOKIE, cookie, sessionCookieOptions);

    return json({ user: { id: created.id, name, email, role: 'user' } }, 201);
  });
}
