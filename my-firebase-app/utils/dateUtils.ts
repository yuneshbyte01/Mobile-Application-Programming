/**
 * Date utilities for Budget Buddy.
 * All dates stored as ISO strings (dateISO suffix per .cursorrules).
 */

export function formatDate(dateISO: string): string {
  const date = new Date(dateISO);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateShort(dateISO: string): string {
  const date = new Date(dateISO);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

export function toDateISO(date: Date): string {
  return date.toISOString().split('T')[0]!;
}

export function todayISO(): string {
  return toDateISO(new Date());
}

export function getMonthStart(dateISO: string): string {
  const [year, month] = dateISO.split('-');
  return `${year}-${month}-01`;
}

export function getMonthEnd(dateISO: string): string {
  const date = new Date(dateISO);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return toDateISO(lastDay);
}

export function isInMonth(dateISO: string, monthISO: string): boolean {
  const [dYear, dMonth] = dateISO.split('-').map(Number);
  const [mYear, mMonth] = monthISO.split('-').map(Number);
  return dYear === mYear && dMonth === mMonth;
}

export function getCurrentMonthISO(): string {
  return toDateISO(new Date());
}
