/**
 * Map budget/transaction categories to icon names.
 */
import { Icons } from '../constants/Icons';

const CATEGORY_ICONS: Record<string, string> = {
  Food: Icons.categoryFood,
  Transport: Icons.categoryTransport,
  Shopping: Icons.categoryShopping,
  Bills: Icons.categoryBills,
  Entertainment: Icons.categoryEntertainment,
  Health: Icons.categoryHealth,
  Salary: Icons.categorySalary,
  Other: Icons.categoryOther,
};

export function getCategoryIcon(category: string): string {
  return CATEGORY_ICONS[category] ?? Icons.category;
}
