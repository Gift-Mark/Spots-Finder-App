import Amenity from "../models/Amenity.js";

export const listAmenities = async (req, res, next) => {
  try {
    const amenities = await Amenity.find({ isPublished: true });
    res.status(200).json({ success: true, data: amenities });
  } catch (error) {
    next(error);
  }
};