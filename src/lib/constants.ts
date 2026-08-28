/**
 * Values shared between the Edge middleware and the Node server code.
 *
 * Kept free of any import so middleware can use it: middleware runs on the Edge
 * runtime, and pulling in anything that reaches node:crypto or node:sqlite
 * makes the whole bundle fail to compile.
 */
export const SESSION_COOKIE = 'srbd_session';
