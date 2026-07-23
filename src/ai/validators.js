export function validateQuery(query) {
  if (!query || typeof query !== 'string') return false;
  return query.trim().length > 0;
}
