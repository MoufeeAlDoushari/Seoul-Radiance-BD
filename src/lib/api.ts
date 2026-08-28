import { NextResponse } from 'next/server';
import { HttpError } from './auth';

/**
 * Shared route-handler plumbing.
 *
 * Every handler runs through `handle`, which turns a thrown HttpError into the
 * right status and anything unexpected into a flat 500. Internal messages and
 * stack traces stay in the server log — the client only ever sees text we chose
 * deliberately.
 */

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function fail(message: string, status = 400, errors?: Record<string, string>) {
  return NextResponse.json(errors ? { error: message, errors } : { error: message }, { status });
}

export async function handle<T>(fn: () => Promise<T>): Promise<NextResponse> {
  try {
    const result = await fn();
    return result instanceof NextResponse ? result : json(result as unknown);
  } catch (err) {
    if (err instanceof HttpError) {
      return fail(err.message, err.status);
    }
    // Log the detail, return none of it.
    console.error('[api]', err);
    return fail('Something went wrong on our side. Please try again.', 500);
  }
}

/** Reads a JSON body, treating malformed input as a 400 rather than a crash. */
export async function readJson<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new HttpError(400, 'Invalid request body.');
  }
}
