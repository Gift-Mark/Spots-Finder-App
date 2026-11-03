import { fetchPlaces } from "../api/client";
import { fetchAccommodations } from "./api";

const getPlaceImage = (place) => {
  const image =
    place.heroImage ||
    place.coverImage ||
    place.image ||
    place.gallery?.[0] ||
    place.images?.[0];
  return typeof image === "string" ? image : image?.url;
};

const getAccommodationImage = (accommodation) => {
  const images = accommodation.images || [];
  const primaryImage = images.find((image) => image?.isPrimary) || images[0];
  return typeof primaryImage === "string" ? primaryImage : primaryImage?.url;
};

const toMapPlace = (item, kind) => {
  const isStay = kind === "stay";
  const rawLatitude = item.coordinates?.latitude ?? item.latitude;
  const rawLongitude = item.coordinates?.longitude ?? item.longitude;
  const usesDefaultPlaceCoordinates =
    !isStay &&
    (rawLatitude === undefined || rawLatitude === null || rawLatitude === "" ||
      rawLongitude === undefined || rawLongitude === null || rawLongitude === "");
  if (
    !usesDefaultPlaceCoordinates &&
    (rawLatitude === undefined || rawLatitude === null || rawLatitude === "" ||
      rawLongitude === undefined || rawLongitude === null || rawLongitude === "")
  ) {
    return null;
  }
  const latitude = usesDefaultPlaceCoordinates ? 9.9085 : Number(rawLatitude);
  const longitude = usesDefaultPlaceCoordinates ? 8.8921 : Number(rawLongitude);
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }

  const identifier = item.slug || item._id || item.id;
  const image = isStay ? getAccommodationImage(item) : getPlaceImage(item);

  return {
    id: `${kind}-${identifier}`,
    title: item.title || item.name || "Untitled place",
    category: item.category || item.propertyType || item.subcategory || "Place",
    location: item.address || item.location || item.neighborhood || "Jos Plateau",
    image,
    rating: Number(item.rating) || 0,
    reviewsCount: Number(item.reviewsCount ?? item.reviewCount) || 0,
    likes: Number(item.likesCount ?? item.likes) || 0,
    description:
      (typeof item.description === "string" && item.description) ||
      (Array.isArray(item.description) ? item.description[0] : "") ||
      item.summary ||
      "",
    latitude,
    longitude,
    approximateLocation: usesDefaultPlaceCoordinates,
    detailPath: isStay
      ? `/stays/${identifier}`
      : `/place/${identifier}`,
  };
};

export const fetchAllMapPlaces = async () => {
  const [firstPlacesPage, accommodationsResponse] = await Promise.all([
    fetchPlaces({ page: 1, limit: 100, status: "public" }),
    fetchAccommodations(),
  ]);
  const placePages = [firstPlacesPage];
  const total = Number(firstPlacesPage.total);
  const reportedPageCount = Number(firstPlacesPage.pages);
  const pageCount = Number.isFinite(reportedPageCount) && reportedPageCount > 0
    ? reportedPageCount
    : Number.isFinite(total) && total > 0
      ? Math.ceil(total / 100)
      : null;

  if (pageCount) {
    for (let page = 2; page <= pageCount; page += 100) {
      const pageBatch = await Promise.all(
        Array.from(
          { length: Math.min(100, pageCount - page + 1) },
          (_, index) =>
            fetchPlaces({ page: page + index, limit: 100, status: "public" })
        )
      );
      placePages.push(...pageBatch);
    }
  } else {
    let page = 2;
    let previousPageLength = 100;
    while (previousPageLength === 100) {
      const nextPage = await fetchPlaces({ page, limit: 100, status: "public" });
      const nextPlaces = Array.isArray(nextPage.data) ? nextPage.data : [];
      previousPageLength = nextPlaces.length;
      if (nextPlaces.length > 0) placePages.push(nextPage);
      page += 1;
    }
  }

  const places = Array.from(
    new Map(
      placePages
        .flatMap((page) => Array.isArray(page.data) ? page.data : [])
        .map((place) => [String(place._id || place.slug || place.id), place])
    ).values()
  );
  const accommodations = Array.isArray(accommodationsResponse.data)
    ? accommodationsResponse.data
    : [];

  return [
    ...places.map((place) => toMapPlace(place, "place")),
    ...accommodations.map((stay) => toMapPlace(stay, "stay")),
  ].filter(Boolean);
};

export const groupMapPlaces = (places) => {
  const groups = new Map();
  places.forEach((place) => {
    const key = `${place.latitude.toFixed(4)},${place.longitude.toFixed(4)}`;
    const group = groups.get(key);
    if (group) group.push(place);
    else groups.set(key, [place]);
  });
  return Array.from(groups.values()).map((group) => ({
    place: group[0],
    places: group,
  }));
};
