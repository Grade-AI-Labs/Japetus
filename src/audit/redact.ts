import type { AuditEntry } from './logger.ts';

const EMAIL_RE = /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g;
export const ARGS_SUMMARY_MAX = 80;

/**
 * Pure, side-effect-free transformation: raw audit entry → safe-to-emit entry.
 * Applies email regex-strip and 80-char truncation per PRD §4.8.
 * Truncation runs AFTER redaction so a trailing email is still scrubbed before
 * any sink sees the entry.
 */
export function redact(entry: AuditEntry): AuditEntry {
  if (entry.argsSummary === undefined) return entry;
  const stripped = entry.argsSummary.replace(EMAIL_RE, '<email>');
  const truncated =
    stripped.length > ARGS_SUMMARY_MAX ? stripped.slice(0, ARGS_SUMMARY_MAX) : stripped;
  if (truncated === entry.argsSummary) return entry;
  return { ...entry, argsSummary: truncated };
}
