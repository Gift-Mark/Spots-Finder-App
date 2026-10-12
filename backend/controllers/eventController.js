import Event from "../models/Events.js";

/**
 * @desc    Get all events with optional filters (category, status, search, date range)
 * @route   GET /api/events
 * @access  Public
 */
export const getAllEvents = async (req, res) => {
  try {
    const { category, status, search, page = 1, limit = 10 } = req.query;

    const query = {};

    if (category) query.category = category;
    query.status = status || "upcoming";

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { organizer: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const events = await Event.find(query)
      .populate("placeId", "name location address coverImage latitude longitude")
      .sort({ eventDate: 1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await Event.countDocuments(query);

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: events,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single event by slug or ID
 * @route   GET /api/events/:identifier
 * @access  Public
 */
export const getEventByIdentifier = async (req, res) => {
  try {
    const { identifier } = req.params;

    const query = identifier.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: identifier }
      : { slug: identifier.toLowerCase() };

    const event = await Event.findOne(query).populate("placeId", "name address location latitude longitude");

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create a new event (Powers 'Create New Event' in VendorDashboard)
 * @route   POST /api/events
 * @access  Private (Vendor / Admin)
 */
export const createEvent = async (req, res) => {
  try {
    const {
      placeId,
      title,
      description,
      eventDate,
      startTime,
      endTime,
      category,
      image,
      ticketPrice,
      availableTickets,
      slug,
      organizer,
      ticketUrl,
      sourceUrl,
      currency,
      recurrenceMonth,
      recurrenceDay,
    } = req.body;

    const generatedSlug = (slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const event = await Event.create({
      placeId,
      title,
      description,
      eventDate,
      startTime,
      endTime,
      category,
      image: image || "",
      ticketPrice: ticketPrice || 0,
      availableTickets: availableTickets || 0,
      slug: generatedSlug,
      organizer: organizer || "",
      ticketUrl: ticketUrl || "",
      sourceUrl: sourceUrl || "",
      currency: currency || "NGN",
      recurrenceMonth: recurrenceMonth || null,
      recurrenceDay: recurrenceDay || null,
      status: "upcoming",
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully!",
      data: event,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "An event with this title or slug already exists.",
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update an event
 * @route   PUT /api/events/:id
 * @access  Private (Vendor / Admin)
 */
export const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Event updated successfully.",
      data: event,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete an event
 * @route   DELETE /api/events/:id
 * @access  Private (Vendor / Admin)
 */
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: "Event cancelled / deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};