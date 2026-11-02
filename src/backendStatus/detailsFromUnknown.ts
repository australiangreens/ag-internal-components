import type { BackendStatusDetails, BackendStatusReason } from './types';

function readStringField(value: unknown, key: string): string | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const field = (value as Record<string, unknown>)[key];
  return typeof field === 'string' && field.length > 0 ? field : undefined;
}

/**
 * Build latched technical details from a thrown value or partial details object.
 * Returns undefined when no source is provided so the overlay can fall back to messages.ts.
 */
export function detailsFromUnknown(
  reason: Exclude<BackendStatusReason, ''>,
  source?: unknown
): BackendStatusDetails | undefined {
  if (source === undefined || source === null) return undefined;

  if (typeof source === 'string') {
    return { reason, name: 'Error', message: source };
  }

  const name =
    readStringField(source, 'name') ??
    (source instanceof Error ? source.name || 'Error' : 'Error');
  const message =
    readStringField(source, 'message') ??
    (source instanceof Error
      ? source.message || String(source)
      : typeof source === 'object'
        ? JSON.stringify(source)
        : String(source));

  const details: BackendStatusDetails = { reason, name, message };

  if (source && typeof source === 'object' && !(source instanceof Error)) {
    for (const [key, value] of Object.entries(source as Record<string, unknown>)) {
      if (key === 'reason' || key === 'name' || key === 'message') continue;
      if (typeof value === 'string') details[key] = value;
    }
  }

  return details;
}
