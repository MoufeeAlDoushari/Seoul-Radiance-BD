import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

/**
 * Outgoing mail.
 *
 * No email provider is configured on this project yet, so delivery has two
 * clearly separated modes:
 *
 *   development — the message is written to data/outbox/ as a file. That
 *     directory is gitignored. Tokens are testable locally without ever being
 *     printed to a terminal or a log aggregator.
 *
 *   production — with no provider configured the send is refused and an error
 *     is logged WITHOUT the body, because the body contains a live token. The
 *     caller still succeeds, so an unconfigured mailer cannot be used to probe
 *     which addresses exist.
 *
 * Wiring a real provider means implementing `deliver` and setting MAIL_PROVIDER.
 */

export type Mail = {
  to: string;
  subject: string;
  text: string;
};

const OUTBOX = path.join(process.cwd(), 'data', 'outbox');

function devDeliver(mail: Mail): void {
  mkdirSync(OUTBOX, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const safeTo = mail.to.replace(/[^a-z0-9@._-]/gi, '_');
  const file = path.join(OUTBOX, `${stamp}__${safeTo}.txt`);
  writeFileSync(file, `To: ${mail.to}\nSubject: ${mail.subject}\n\n${mail.text}\n`, 'utf8');
  // Filename only — never the body, which carries the token.
  console.log(`[mail:dev] written to data/outbox/${path.basename(file)}`);
}

export async function sendMail(mail: Mail): Promise<void> {
  const provider = process.env.MAIL_PROVIDER;

  if (!provider || provider === 'dev') {
    if (process.env.NODE_ENV === 'production') {
      // Deliberately vague, and deliberately not the body.
      console.error(
        `[mail] no provider configured; "${mail.subject}" was not delivered. Set MAIL_PROVIDER.`,
      );
      return;
    }
    devDeliver(mail);
    return;
  }

  // Space for a real provider. Left unimplemented rather than half-written, so
  // it cannot appear to work while silently dropping mail.
  console.error(`[mail] MAIL_PROVIDER="${provider}" is not implemented.`);
}

export function appUrl(pathname: string): string {
  const base = (process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, '');
  return `${base}${pathname}`;
}
