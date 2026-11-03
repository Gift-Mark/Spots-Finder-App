import Place from "../models/Place.js";

/**
 * @desc    Get all places with optional category, tag, search, & pagination filters
 * @route   GET /api/places
 * @access  Public
 */
export const getAllPlaces = async (req, res) => {
  try {
    const { category, subcategory, section, search, status, page = 1, limit = 12 } = req.query;

    const query = {};

    if (section) query.section = section;

    // Filter by category or subcategory if provided
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;

    // Filter by status - only apply filter if status is explicitly provided and not empty
    // This allows admin to fetch ALL places by passing status='' or omitting status
    if (status && status !== '') {
      query.status = status === "public" ? { $in: [null, "active"] } : status;
    } else if (status === undefined) {
      // Default to 'active' only when status param is completely absent (public views)
      query.status = "active";
    }
    // If status === '', no status filter is applied (returns all)

    // Text search on name, summary, description, and tags
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const places = await Place.find(query)
      .populate("businessId", "name email contactPhone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await Place.countDocuments(query);

    res.status(200).json({
      success: true,
      count: places.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: places,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single place by slug or ID
 * @route   GET /api/places/:identifier
 * @access  Public
 */
export const getPlaceByIdentifier = async (req, res) => {
  try {
    const { identifier } = req.params;

    // Determine if identifier is a MongoDB ObjectId or a slug
    const query = identifier.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: identifier }
      : { slug: identifier.toLowerCase() };

    const place = await Place.findOne(query).populate("businessId", "name email contactPhone");

    if (!place) {
      return res.status(404).json({ success: false, message: "Place not found." });
    }

    res.status(200).json({
      success: true,
      data: place,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create a new place listing
 * @route   POST /api/places
 * @access  Private (Vendor / Admin)
 */
export const createPlace = async (req, res) => {
  try {
    const {
      businessId,
      name,
      slug,
      description,
      summary,
      category,
      subcategory,
      location,
      address,
      latitude,
      longitude,
      openingTime,
      closingTime,
      bookingUrl,
      tags,
    } = req.body;

    // Handle uploaded file path if multer processed an image
    let heroImagePath = "";
    let imageUrls = [];
    
    if (req.file) {
      heroImagePath = `/uploads/${req.file.filename}`;
      imageUrls = [heroImagePath];
      console.log("✅ Image uploaded:", req.file.filename, "Path:", heroImagePath);
    } else if (req.body.images) {
      imageUrls = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    // Helper to auto-generate slug if not provided
    const generatedSlug = (slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const place = await Place.create({
      businessId: businessId || req.user?.businessId,
      name,
      title: name,
      slug: generatedSlug,
      description,
      summary,
      category,
      subcategory,
      location,
      address,
      latitude,
      longitude,
      heroImage: heroImagePath,
      coverImage: heroImagePath,
      images: imageUrls,
      openingTime,
      closingTime,
      bookingUrl,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(",")) : [],
      ...req.body, // Include other fields from form
    });

    res.status(201).json({
      success: true,
      message: "Place created successfully!",
      data: place,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A place with this slug or name already exists.",
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update a place listing
 * @route   PUT /api/places/:id
 * @access  Private (Vendor / Admin)
 */
export const updatePlace = async (req, res) => {
  try {
    let place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ success: false, message: "Place not found." });
    }

    // Role Guard: Vendors can only update places tied to their business
    if (
      req.user?.role !== "admin" &&
      place.businessId?.toString() !== req.user?.businessId?.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this listing.",
      });
    }

    // Handle new uploaded image if present
    if (req.file) {
      const heroImagePath = `/uploads/${req.file.filename}`;
      req.body.heroImage = heroImagePath;
      req.body.coverImage = heroImagePath;
      if (!req.body.images || req.body.images.length === 0) {
        req.body.images = [heroImagePath];
      }
      console.log("✅ Updated image:", req.file.filename, "Path:", heroImagePath);
    }

    place = await Place.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Place updated successfully.",
      data: place,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete a place listing
 * @route   DELETE /api/places/:id
 * @access  Private (Admin / Vendor Owner)
 */
export const deletePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ success: false, message: "Place not found." });
    }

    if (
      req.user.role !== "admin" &&
      place.businessId.toString() !== req.user.businessId?.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this listing.",
      });
    }

    await place.deleteOne();

    res.status(200).json({
      success: true,
      message: "Place deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};