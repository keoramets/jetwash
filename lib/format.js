export function money(value, currency = 'USD') {
  const amount = Number(value || 0);
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}
export function date(value, options = {}) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-ZW', { dateStyle: 'medium', ...options }).format(new Date(value));
}
export function dateTime(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-ZW', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}
export function titleCase(value='') {
  return value.toLowerCase().replaceAll('_', ' ').replace(/\w/g, (c) => c.toUpperCase());
}
export function reference(prefix) {
  const stamp = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  return `${prefix}-${stamp}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
}
