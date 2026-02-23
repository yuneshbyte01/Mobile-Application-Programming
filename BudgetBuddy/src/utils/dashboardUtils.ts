/**
 * Dashboard-specific helpers.
 */
import type { Subscription } from '../services/subscriptionService';

/**
 * Get time-based greeting (Good Morning / Afternoon / Evening).
 */
export function getGreeting(): 'goodMorning' | 'goodAfternoon' | 'goodEvening' {
  const hour = new Date().getHours();
  if (hour < 12) return 'goodMorning';
  if (hour < 17) return 'goodAfternoon';
  return 'goodEvening';
}

/**
 * Get next billing date label for a subscription (e.g. "28" for day, "May 3" for full).
 */
export function getNextBillingLabel(sub: Subscription): string {
  const d = new Date(sub.billingDateISO);
  const now = new Date();
  const dayOfMonth = d.getDate();

  if (sub.cycle === 'monthly') {
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), dayOfMonth);
    if (thisMonth >= now) {
      return String(dayOfMonth);
    }
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, dayOfMonth);
    return nextMonth.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
  // yearly
  const thisYear = new Date(now.getFullYear(), d.getMonth(), dayOfMonth);
  if (thisYear >= now) {
    return thisYear.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
  const nextYear = new Date(now.getFullYear() + 1, d.getMonth(), dayOfMonth);
  return nextYear.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/**
 * Get next billing date string for a selected month (e.g. "Apr 28").
 */
export function getNextBillingInMonth(
  sub: Subscription,
  year: number,
  month: number
): string {
  const d = new Date(sub.billingDateISO);
  const dayOfMonth = d.getDate();

  if (sub.cycle === 'monthly') {
    const billingDate = new Date(year, month, dayOfMonth);
    return billingDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
  // yearly - next occurrence in or after selected month
  const billingThisYear = new Date(year, d.getMonth(), dayOfMonth);
  if (d.getMonth() >= month) {
    return billingThisYear.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
  const nextYear = new Date(year + 1, d.getMonth(), dayOfMonth);
  return nextYear.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/**
 * Check if a subscription bills in the given month.
 */
export function subscriptionBillsInMonth(
  sub: Subscription,
  _year: number,
  month: number
): boolean {
  const d = new Date(sub.billingDateISO);
  if (sub.cycle === 'monthly') {
    return true; // bills every month
  }
  return d.getMonth() === month;
}
