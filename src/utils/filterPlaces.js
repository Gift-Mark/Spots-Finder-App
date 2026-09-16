/* export function filterPlaces(places, searchQuery) {
  const q = searchQuery.trim().toLowerCase();

  if (!q) return places;

  return places.filter((place) => {
    return (
      place.title.toLowerCase().includes(q) ||
      place.location.toLowerCase().includes(q) ||
      place.category.some((category) =>
        category.toLowerCase().includes(q)
      ) ||
      (place.subtitle &&
        place.subtitle.toLowerCase().includes(q))
    );
  });
} */

  export function filterPlaces(places, searchQuery) {
  // Normalize once so search is case-insensitive and ignores surrounding spaces.
  const q = searchQuery.trim().toLowerCase();

  if (!q) return places;

  return places.filter((place) => {
    // Build one searchable list so optional fields do not require separate checks.
    const searchableFields = [
      place.title,
      place.location,
      place.subtitle,
      ...place.category,
    ].filter(Boolean);

    return searchableFields.some((field) =>
      field.toLowerCase().includes(q)
    );
  });
}