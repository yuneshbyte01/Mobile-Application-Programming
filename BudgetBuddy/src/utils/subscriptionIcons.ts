/**
 * Map subscription names (or keywords) to icon names for visual identification.
 * Uses partial matching so "Netflix Premium" matches "netflix".
 */
const SUBSCRIPTION_ICONS: Record<string, string> = {
  netflix: 'tv-outline',
  spotify: 'musical-notes-outline',
  gym: 'barbell-outline',
  fitness: 'barbell-outline',
  cloud: 'cloud-outline',
  storage: 'cloud-outline',
  software: 'code-slash-outline',
  amazon: 'cart-outline',
  disney: 'play-outline',
  youtube: 'logo-youtube',
  apple: 'logo-apple',
  google: 'logo-google',
  microsoft: 'logo-microsoft',
  adobe: 'color-palette-outline',
  music: 'musical-notes-outline',
  streaming: 'play-outline',
};

const DEFAULT_ICON = 'repeat-outline';

export function getSubscriptionIcon(name: string): string {
  const lower = name.toLowerCase().trim();
  for (const [key, icon] of Object.entries(SUBSCRIPTION_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return DEFAULT_ICON;
}
