import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./PlaceDetail.module.css";

const mockPlaces = {
  "rayfield-resort": {
    id: "rayfield-resort",
    title: "Rayfield Holiday Resort & Water Park",
    category: "Resort & Water Sports",
    verified: true,
    rating: 4.8,
    reviewsCount: 132,
    managedBy: "Plateau Tourism Authority & Partner",
    address: "Rayfield Resort Boulevard, Old Airport Road Axis, Jos South, Plateau State",
    weather: { temp: 22, condition: "Crisp & Breezy" },
    tags: ["Family Friendly", "Boating & Water Sports", "Outdoor Dining"],
    status: "Open Now",
    openingHours: "8:00 AM - 6:30 PM",
    entryPrice: "₦500 Adults / ₦300 Kids",
    recommendedVisit: "4:00 PM - 6:30 PM (Golden Hour Sunset)",
    phone: "+234 703 123 4567",
    heroImage: "/images/Rayfield resort 3.webp",
    overviewHeading: "An Oasis of Waters & Granite Hills",
    description: [
      "Tucked away inside the historic suburb of Rayfield, Jos, the Rayfield Holiday Resort stands as one of Plateau State's most cherished recreation treasures.",
    ],
    quote: {
      text: "There is no sunset in Jos quite like watching the gold rays bounce off the granite hills and reflect across Rayfield Lake.",
      author: "JOS PULSE GUIDE",
    },
    gallery: [
      "/images/Rayfield Resort.jpg",
      "/images/Rayfield resort 1.webp",
      "/images/Rayfield Resort 2.webp",
      "/images/Rayfield resort 3.webp"
    ],
    visitorTips: [
      "Bring a Light Cardigan for cool evening winds.",
      "Lifejackets are mandatory for all boat rides."
    ],
    highlights: [
      { icon: "🚤", title: "30-Min Lake Cruise", desc: "Guided powerboat and pontoon rides around Rayfield Lake." },
      { icon: "🏖️", title: "Waterfront Cabanas", desc: "Private shaded lakeside huts for family picnics & social groups." },
      { icon: "🍽️", title: "Lakeside Grill & Bar", desc: "Fresh suya, grilled fish, chapman drinks, and local dining." },
      { icon: "🅿️", title: "Secured Vehicle Parking", desc: "Monitored parking bay with on-site security." },
      { icon: "🏄", title: "Jet Ski Rentals", desc: "High-speed water sport rentals for thrill seekers." },
      { icon: "🎡", title: "Children's Play Zone", desc: "Dedicated slides, swings, and safe recreation lawns." }
    ],
    pricing: {
      adultRate: 500,
      kidRate: 300,
      addons: [{ id: "cruise", name: "30-Min Lake Cruise", price: 2000 }]
    }
  },

  "kurra-falls": {
    id: "kurra-falls",
    title: "Kurra Falls & Hydro-Power Eco Sanctuary",
    category: "Nature & Adventure",
    verified: true,
    rating: 4.9,
    reviewsCount: 98,
    managedBy: "Plateau State Tourism Board & NESCO Partner",
    address: "Gashish District, Barkin Ladi LGA, Plateau State, Nigeria",
    weather: { temp: 19, condition: "Cool & Highland Breeze" },
    tags: ["Waterfall Treks", "Eco-Tourism", "Historic Dam", "Scenic Hiking"],
    status: "Open Daily",
    openingHours: "7:00 AM - 5:30 PM",
    entryPrice: "₦1,000 Adults / ₦500 Students",
    recommendedVisit: "10:00 AM - 3:30 PM (Daytime Trekking)",
    phone: "+234 802 345 6789",
    heroImage: "/images/Kurra-Falls.jpg",
    overviewHeading: "Cascading Waters & Granite Canyons",
    description: [
      "Nestled deep within the lush green highlands of Barkin Ladi, Kurra Falls is one of Plateau State's most breathtaking natural wonders.",
      "The area features natural lakes, cascading waterfalls plunging through rugged granite canyons, and serene forest paths ideal for daytime hiking and photography."
    ],
    quote: {
      text: "Standing atop the granite ledges at Kurra Falls while mist from the roaring cascades cools the air is the quintessential Plateau adventure.",
      author: "JOS PULSE ECO-DISCOVERY GUIDE",
    },
    gallery: ["/images/Kurra-Falls.jpg", "/images/Rayfield Resort.jpg"],
    visitorTips: [
      "Sturdy Footwear Required: Rock surfaces near streams can be slippery.",
      "Group Excursions: Hire a local guide at the gate for waterfall canyon hikes."
    ],
    highlights: [
      { icon: "🌊", title: "Cascading Waterfalls", desc: "Multi-tiered natural rock waterfalls." },
      { icon: "🥾", title: "Guided Canyon Trails", desc: "Marked routes across granite formations." },
      { icon: "📸", title: "Scenic Photography Ledges", desc: "Unmatched vantage points for nature photography." },
      { icon: "⚡", title: "Historic Hydro Dam View", desc: "Heritage hydro-electricity installations." }
    ],
    pricing: {
      adultRate: 1000,
      kidRate: 500,
      addons: [{ id: "guided-trek", name: "Guided Canyon Trek", price: 2500 }]
    }
  },

  "jos-museum": {
    id: "jos-museum",
    title: "Jos National Museum & Complex",
    category: "Heritage & Culture",
    verified: true,
    rating: 4.5,
    reviewsCount: 19,
    managedBy: "National Commission for Museums and Monuments",
    address: "Museum Hill, Jos City Centre, Jos North LGA, Plateau State",
    weather: { temp: 21, condition: "Pleasant" },
    tags: ["Nok Terracotta", "Architectural Museum", "Heritage Exhibits", "Family Friendly"],
    status: "Open Daily",
    openingHours: "9:00 AM - 5:00 PM",
    entryPrice: "₦500 Adults / ₦200 Students",
    recommendedVisit: "10:00 AM - 1:00 PM",
    phone: "+234 700 000 0000",
    heroImage: "/images/Jos Museum.jpg",
    overviewHeading: "Nigeria's Pioneer Museum of Ancient Pottery & Nok Art",
    description: [
      "Established in 1952 by Bernard Fagg, the Jos Museum stands as one of the oldest and most historic museum institutions in West Africa. Famous for its priceless collection of ancient Nok terracotta heads and pottery artifacts dating back to 500 BC.",
      "The compound also houses the Museum of Traditional Nigerian Architecture (MOTNA), featuring life-sized replicas of historic palaces and mosques from Kano, Zaria, and Benin City."
    ],
    highlights: [
      { icon: "🏺", title: "Nok Terracotta Vaults", desc: "Centuries-old ancient pottery artifacts." },
      { icon: "🏛️", title: "MOTNA Architecture Park", desc: "Full-sized replica structures of pre-colonial Nigeria." },
      { icon: "🎧", title: "Audio Guided Tours", desc: "Curated historical narrative headsets." }
    ],
    pricing: {
      adultRate: 500,
      kidRate: 200,
      addons: [{ id: "guide", name: "Guided Heritage Tour", price: 1000 }]
    }
  },

  "tasty-fingers": {
    id: "tasty-fingers",
    title: "Tasty Fingers Restaurant",
    category: "Dining & Fine Cuisine",
    verified: true,
    rating: 4.6,
    reviewsCount: 45,
    managedBy: "Tasty Fingers Culinary Group",
    address: "Rayfield Road Axis, Jos South, Plateau State",
    weather: { temp: 23, condition: "Pleasant" },
    tags: ["Fine Dining", "City View", "Grill & Continental", "Bar & Lounge"],
    status: "Open Now",
    openingHours: "10:00 AM - 10:30 PM",
    entryPrice: "Free Admission / Pay per Order",
    recommendedVisit: "6:00 PM - 9:30 PM (Dinner & City Skyline View)",
    phone: "+234 812 345 6789",
    heroImage: "/images/Tasty Fingers.webp",
    overviewHeading: "Fine Dining with Panoramic Views of Jos",
    description: [
      "Tasty Fingers Restaurant offers a modern culinary experience blending African flavors with international continental dishes. Situated at an elevated vantage point, guests enjoy sweeping panoramic night views of Jos while dining in a relaxed atmosphere."
    ],
    highlights: [
      { icon: "🍷", title: "VIP Window Seating", desc: "Tables overlooking the Jos skyline." },
      { icon: "🥩", title: "Continental & Local Grill", desc: "Premium steaks, suya platters, and seafood." },
      { icon: "🍹", title: "Signature Cocktail Lounge", desc: "Handcrafted mocktails, chapman, and drinks." }
    ],
    pricing: {
      adultRate: 0,
      kidRate: 0,
      addons: [
        { id: "vip-table", name: "VIP Window Table Reservation", price: 5000 },
        { id: "chapman", name: "Welcome Drink (Special Chapman)", price: 1500 }
      ]
    }
  },

  "nzem-berom": {
    id: "nzem-berom",
    slug: "nzem-berom",
    title: "Nzem Berom Cultural Festival",
    category: "Cultural Festival",
    verified: true,
    rating: 4.9,
    reviewsCount: 112,
    managedBy: "Berom Educational and Cultural Organisation (BECO)",
    address: "Rwang Pam Stadium, Jos City Centre, Plateau State",
    weather: { temp: 20, condition: "Highland Festival Breeze" },
    tags: ["Cultural Heritage", "Royal Procession", "Music & Dance", "Local Cuisine"],
    status: "Annual Event",
    openingHours: "9:00 AM - 6:00 PM",
    entryPrice: "Free Entry",
    recommendedVisit: "10:00 AM - 3:00 PM",
    phone: "+234 800 111 2222",
    heroImage: "/images/nzem berom.jpg",
    overviewHeading: "The Grand Celebration of Berom Cultural Heritage",
    description: [
      "The Nzem Berom is the premier annual cultural carnival of the Berom people of Plateau State. Celebrating the rich music, royal processions, traditional dances, and agricultural harvests of the highlanders.",
      "Expect vibrant displays of traditional costumes, royal horse processions, musical performances, and exhibitions of native Berom cuisine and crafts."
    ],
    quote: {
      text: "Experience the pulse of Plateau tradition through royal horse troops, rhythmic drumming, and authentic highland culture.",
      author: "PLATEAU HERITAGE GUILD"
    },
    gallery: ["/images/nzem-berom.jpg"],
    visitorTips: [
      "Arrive before 9:30 AM to secure a clear view of the opening royal procession.",
      "Photography is welcomed, but respect designated traditional performance areas."
    ],
    highlights: [
      { icon: "👑", title: "Royal Horse Procession", desc: "Traditional royal parade and cultural displays." },
      { icon: "🥁", title: "Highland Drumming & Dance", desc: "Live Berom folk music and dance troupes." },
      { icon: "🍲", title: "Heritage Food Court", desc: "Authentic highland dishes and local crafts." }
    ],
    pricing: {
      adultRate: 0,
      kidRate: 0,
      addons: [
        { id: "vip-pavilion", name: "VIP Grandstand Pavilion Seat", price: 3000 }
      ]
    },
    date: "October 14, 2026",
    month: "OCT",
    day: "14",
    venue: "Rwang Pam Stadium",
    isFree: true
  },

  "plateau-live-music": {
    id: "plateau-live-music",
    slug: "plateau-live-music",
    title: "Plateau Live Music Night",
    category: "Concert & Nightlife",
    verified: true,
    rating: 4.8,
    reviewsCount: 64,
    managedBy: "Plateau Entertainment Forum & Rayfield Waterway",
    address: "Rayfield Waterway Resort, Jos South, Plateau State",
    weather: { temp: 18, condition: "Cool Highland Evening" },
    tags: ["Live Band", "Highlife & Afro-Fusion", "Lakeside View", "Nightlife"],
    status: "Upcoming Event",
    openingHours: "7:00 PM - 11:30 PM",
    entryPrice: "₦5,000 Regular / ₦15,000 VIP",
    recommendedVisit: "7:00 PM - 11:00 PM (Full Night Session)",
    phone: "+234 803 000 1234",
    heroImage: "/images/live-music.jpg",
    overviewHeading: "Highland Rhythms & Acoustic Sunset Sessions",
    description: [
      "An intimate evening of live acoustic performances, Afro-fusion jazz, and contemporary Jos music talent set against the beautiful lakeside view of Waterway Resort.",
      "Featuring top local guest artists, craft cocktails, outdoor lounge seating, and an electric atmosphere under the stars."
    ],
    quote: {
      text: "The cool highland breeze mixed with soulful live acoustic highlife at the lakeside is Jos nightlife at its finest.",
      author: "JOS PULSE NIGHTLIFE GUIDE"
    },
    gallery: [
      "/images/live-music.jpg",
      "/images/Rayfield Resort.jpg"
    ],
    visitorTips: [
      "Open Mic Segment: Arrive by 6:30 PM to register for early acoustic slots.",
      "Evening Chills: Bring a jacket as temperatures cool down significantly by the lake at night.",
      "VIP Seating: Book early for front-row tables with direct stage views."
    ],
    highlights: [
      { icon: "🎸", title: "Acoustic & Live Band", desc: "Soulful Afro-fusion and live guitar performances." },
      { icon: "🍹", title: "Lakeside Cocktail Bar", desc: "Craft drinks, cold beverages, and finger foods." },
      { icon: "🛋️", title: "VIP Lounge Area", desc: "Reserved plush seating close to the main stage." }
    ],
    pricing: {
      adultRate: 5000,
      kidRate: 2500,
      addons: [
        { id: "vip-upgrade", name: "VIP Table & Welcome Drink Upgrade", price: 10000 },
        { id: "reserved-parking", name: "Reserved Premium Parking Pass", price: 2000 }
      ]
    },
    date: "October 16, 2026",
    month: "OCT",
    day: "16",
    venue: "Waterway Resort",
    isFree: false,
    organizer: "Plateau Entertainment Forum"
  },

  "nok-terracotta": {
    id: "nok-terracotta",
    slug: "nok-terracotta",
    title: "Nok Terracotta & Heritage Gallery",
    category: "Archaeology & Ancient Art",
    verified: true,
    rating: 4.9,
    reviewsCount: 88,
    managedBy: "National Commission for Museums and Monuments (NCMM)",
    address: "Inside Jos National Museum Complex, Jos North LGA, Plateau State",
    weather: { temp: 21, condition: "Pleasant & Clear" },
    tags: ["500 BC Artefacts", "Ancient Sculpture", "Archaeology", "Guided Tours"],
    status: "Open Daily",
    openingHours: "9:00 AM - 5:00 PM",
    entryPrice: "₦1,000 Adults / ₦500 Students",
    recommendedVisit: "10:00 AM - 1:00 PM",
    phone: "+234 700 000 1111",
    heroImage: "/images/Nok.jpg",
    overviewHeading: "Africa's Oldest Terracotta Sculptural Legacy",
    description: [
      "The Nok Terracotta Gallery houses world-renowned sculptures discovered across Plateau and Kaduna States dating back as far as 1500 BC to 500 AD.",
      "The exhibit features elaborate human figures with detailed hair coils, flared nostrils, and triangular eye openings representing Africa's earliest known iron-smelting civilization."
    ],
    quote: {
      text: "The Nok culture represents one of West Africa's greatest art-historical legacies.",
      author: "ARCHAEOLOGY TODAY"
    },
    gallery: ["/images/Nok.jpg"],
    visitorTips: [
      "Flash photography is prohibited inside the main terracotta gallery.",
      "Book an NCMM curator guide at the main lobby for a deep historical breakdown."
    ],
    highlights: [
      { icon: "🏺", title: "Original Nok Statues", desc: "500 BC clay sculptures." },
      { icon: "📜", title: "Archaeological Timeline", desc: "Detailed timeline of Plateau excavations." }
    ],
    pricing: {
      adultRate: 1000,
      kidRate: 500,
      addons: [{ id: "curator-tour", name: "Curator-Guided Audio Tour", price: 1500 }]
    }
  },

  "riyom-rock": {
    id: "riyom-rock",
    slug: "riyom-rock",
    title: "Riyom Rock Formation (Three Rocks)",
    category: "Geological Wonder & Landmark",
    verified: true,
    rating: 4.8,
    reviewsCount: 74,
    managedBy: "Riyom Local Government & Plateau Tourism Board",
    address: "Riyom Junction, Akwanga-Jos Highway, Riyom LGA, Plateau State",
    weather: { temp: 20, condition: "Highland Winds" },
    tags: ["Natural Wonder", "Geological Landmark", "Photography", "Hiking"],
    status: "Open Daily",
    openingHours: "6:00 AM - 6:00 PM",
    entryPrice: "Free Admission / Local Guide Fee Applies",
    recommendedVisit: "8:00 AM - 11:00 AM or 4:00 PM - 6:00 PM",
    phone: "+234 803 999 8888",
    heroImage: "/images/Riyom Rock.jpg",
    overviewHeading: "Nature's Gravity-Defying Granite Balance",
    description: [
      "Located in Riyom Local Government Area along the Jos-Akwanga highway, the Riyom Rock Formation is one of Nigeria's most iconic natural geographical landmarks.",
      "Massive granite boulders rest delicately balanced on top of one another naturally forming the distinct outline of the geographic map of Plateau State."
    ],
    quote: {
      text: "Nature's architecture at its finest—a symbol carved into the very landscape of Plateau State.",
      author: "NIGERIAN GEOGRAPHIC JOURNAL"
    },
    gallery: ["/images/Riyom Rock.jpg"],
    visitorTips: [
      "Stop by during morning hours for clear sunlight and optimal photography angles.",
      "Always engage a local community guide before climbing nearby ledges."
    ],
    highlights: [
      { icon: "🗿", title: "Balanced Granite Formations", desc: "Famous natural sculpture rock stack." },
      { icon: "🥾", title: "Community Trail Guided Hike", desc: "Excursions with local village guides." }
    ],
    pricing: {
      adultRate: 500,
      kidRate: 200,
      addons: [{ id: "rock-guide", name: "Local Ridge Hike Guide", price: 1500 }]
    }
  },

  "motna": {
    id: "motna",
    slug: "motna",
    title: "MOTNA (Museum of Traditional Nigerian Architecture)",
    category: "Architecture & Heritage Park",
    verified: true,
    rating: 4.7,
    reviewsCount: 52,
    managedBy: "National Commission for Museums and Monuments",
    address: "Jos Museum Grounds, Museum Hill, Jos Centre, Plateau State",
    weather: { temp: 22, condition: "Pleasant" },
    tags: ["Life-size Replicas", "Kano Wall", "Zaria Mosque", "Architectural History"],
    status: "Open Daily",
    openingHours: "9:00 AM - 5:00 PM",
    entryPrice: "₦500 Adults / ₦200 Children",
    recommendedVisit: "11:00 AM - 2:00 PM",
    phone: "+234 700 000 2222",
    heroImage: "/images/MOTNA.jpg",
    overviewHeading: "Life-Sized Architecture from Across Pre-Colonial Nigeria",
    description: [
      "MOTNA is an open-air architectural gallery showcasing full-scale replicas of traditional structures from different ethnic groups across Nigeria.",
      "Exhibits feature replicas of the ancient Wall of Kano, the Mbari house of the Igbo, the traditional palace structures of Benin, and the Zaria Friday Mosque."
    ],
    quote: {
      text: "A physical walk through centuries of pre-colonial African engineering and architectural mastery.",
      author: "HERITAGE ARCHITECTURE REVIEW"
    },
    gallery: ["/images/MOTNA.jpg"],
    visitorTips: [
      "Wear comfortable walking shoes; the open-air complex covers extensive ground.",
      "Combine your visit with the adjacent Jos Zoo and Main Museum Gallery."
    ],
    highlights: [
      { icon: "🏰", title: "Full-Scale Replicas", desc: "Ancient Kano Wall and Zaria Mosque." },
      { icon: "🚶‍♂️", title: "Open-Air Heritage Trail", desc: "Walking paths through regional building styles." }
    ],
    pricing: {
      adultRate: 500,
      kidRate: 200,
      addons: [{ id: "architectural-tour", name: "Architectural History Walk", price: 1000 }]
    }
  },

  "mazah-waterfall": {
    id: "mazah-waterfall",
    title: "Mazah Waterfall & Highland Trail",
    category: "Nature & Hiking",
    verified: true,
    rating: 4.8,
    reviewsCount: 38,
    managedBy: "Jos North Local Govt & Community Guides",
    address: "Mazah Village, Jos North LGA, Plateau State",
    weather: { temp: 18, condition: "Cool Highland Breeze" },
    tags: ["Waterfall Trek", "Mountain Hiking", "Photography", "Ecotourism"],
    status: "Open Daily",
    openingHours: "7:00 AM - 5:30 PM",
    entryPrice: "Free Access / Local Guide Fee Applies",
    recommendedVisit: "9:00 AM - 2:00 PM (Morning Trek)",
    phone: "+234 803 111 2233",
    heroImage: "/images/Mazah waterfall.webp",
    overviewHeading: "Hidden Highland Cascades in the Hills of Jos North",
    description: [
      "Tucked away in the serene highlands of Mazah village, just a short drive from Jos city center, Mazah Waterfall is an idyllic natural spot featuring fresh mountain streams cascading over granite rock ledges.",
      "The scenic trek to the falls passes through traditional Jarawa settlements, green terraces, and steep rocky paths offering panoramic views of the Jos basin."
    ],
    quote: {
      text: "Mazah offers raw, unadulterated highland scenery and crisp mountain water straight off the Jos plateau rocks.",
      author: "JOS TRAIL EXPLORERS"
    },
    gallery: ["/images/Mazah waterfall.webp"],
    visitorTips: [
      "Wear sturdy hiking shoes as the trail down to the waterfall base can be steep.",
      "Engage a village youth guide at Mazah center for safe navigation along stream paths."
    ],
    highlights: [
      { icon: "⛰️", title: "Mountain Trail Hike", desc: "Exhilarating trek through highland villages." },
      { icon: "💦", title: "Freshwater Cascades", desc: "Cool, natural mountain stream pools." }
    ],
    pricing: {
      adultRate: 500,
      kidRate: 200,
      addons: [{ id: "trail-guide", name: "Community Highland Guide", price: 1500 }]
    }
  },

  "jos-wildlife-park": {
    id: "jos-wildlife-park",
    title: "Jos Wildlife Park",
    category: "Wildlife & Nature Park",
    verified: true,
    rating: 4.6,
    reviewsCount: 120,
    managedBy: "Plateau State Tourism Corporation",
    address: "Tudun Wada / Dong Axis, Jos North LGA, Plateau State",
    weather: { temp: 21, condition: "Shaded & Breezy" },
    tags: ["Zoo & Sanctuary", "Pine Forest", "Family Outing", "Picnic Grounds"],
    status: "Open Daily",
    openingHours: "9:00 AM - 6:00 PM",
    entryPrice: "₦500 Adults / ₦200 Children",
    recommendedVisit: "11:00 AM - 4:00 PM",
    phone: "+234 703 444 5555",
    heroImage: "/images/wildlife park.jpg",
    overviewHeading: "One of Nigeria's Largest Man-Made Wildlife Sanctuaries",
    description: [
      "Spanning over 8 square kilometers of pine forests, rolling hills, and natural habitat enclosures, Jos Wildlife Park was established in 1972 and remains one of Plateau State's premier recreation landmarks.",
      "The park shelters lions, primates, hippos, crocodiles, and exotic birds, alongside shaded pine forest picnic areas and vantage points overlooking Jos city."
    ],
    quote: {
      text: "Walking beneath the towering pine trees at Jos Wildlife Park is a signature Jos experience.",
      author: "PLATEAU TOURISM GUIDE"
    },
    gallery: ["/images/wildlife park.jpg"],
    visitorTips: [
      "Visit the pine forest section near the picnic hills for great outdoor photography.",
      "Concession stands and local snack vendors are available near the main gate entrance."
    ],
    highlights: [
      { icon: "🌲", title: "Pine Forest Picnic Grounds", desc: "Cool shaded forest paths for relaxation." },
      { icon: "🦁", title: "Wildlife Enclosures", desc: "Lions, primates, hippos, and exotic birds." }
    ],
    pricing: {
      adultRate: 500,
      kidRate: 200,
      addons: [{ id: "pine-picnic", name: "Reserved Pine Forest Pavilion", price: 2000 }]
    }
  },

  "assop-falls": {
    id: "assop-falls",
    title: "Assop Waterfalls",
    category: "Nature & Waterfalls",
    verified: true,
    rating: 4.8,
    reviewsCount: 104,
    managedBy: "Plateau State Tourism Board",
    address: "Hawan Kibo, Jos-Abuja Expressway, Riyom LGA, Plateau State",
    weather: { temp: 20, condition: "Cool Spray & Breeze" },
    tags: ["Waterfall Trekking", "Picnic Spots", "Photography", "Nature Trails"],
    status: "Open Daily",
    openingHours: "8:00 AM - 6:00 PM",
    entryPrice: "₦1,000 Adults / ₦500 Students",
    recommendedVisit: "11:00 AM - 3:00 PM",
    phone: "+234 802 111 4444",
    heroImage: "/images/assop falls.webp",
    overviewHeading: "Cascading Waters along the Plateau Escarpment",
    description: [
      "Assop Falls is a natural waterfall situated along the Jos-Abuja expressway at the bottom of the Hawan Kibo escarpment.",
      "Water cascades over granite rocks into a fresh river pool surrounded by savannah trees, making it a popular picnic spot for road travelers and tourists."
    ],
    quote: {
      text: "A refreshing natural stop where cool mist and roaring waters mark the gateway to the Plateau.",
      author: "PLATEAU TOURISM BOARD"
    },
    gallery: ["/images/assop falls.webp"],
    visitorTips: [
      "Exercise caution near wet granite rocks near the waterfall stream.",
      "Ideal location for a scenic lunch break when traveling along the Jos-Abuja corridor."
    ],
    highlights: [
      { icon: "🏞️", title: "Riverside Picnic Benches", desc: "Shaded seating right by the cascade." },
      { icon: "🌊", title: "Natural Waterfall Spray", desc: "Refreshing mountain mist." }
    ],
    pricing: {
      adultRate: 1000,
      kidRate: 500,
      addons: [{ id: "picnic-bench", name: "Riverside Picnic Bench", price: 1500 }]
    }
  },

  "shere-hills": {
    id: "shere-hills",
    title: "Shere Hills Peak",
    category: "Mountain Hiking & Adventure",
    verified: true,
    rating: 4.9,
    reviewsCount: 142,
    managedBy: "Citizens Cycling & Hiking Guild / Plateau Tourism",
    address: "Shere Hills Range, 10km East of Jos City Centre, Plateau State",
    weather: { temp: 17, condition: "Highland Peak Chill" },
    tags: ["Rock Climbing", "Highland Peak", "Mountain Camping", "Trail Trekking"],
    status: "Open Daily",
    openingHours: "6:00 AM - 6:00 PM",
    entryPrice: "Free Access / Guided Hike Fees Apply",
    recommendedVisit: "6:30 AM - 11:00 AM (Sunrise Hike)",
    phone: "+234 803 555 6666",
    heroImage: "/images/Shere hills hike.jpg",
    overviewHeading: "Highland Ridges Rising Over 1,800 Meters Above Sea Level",
    description: [
      "Shere Hills forms one of the highest elevated granite rock formations in Plateau State. Located just east of Jos metropolis, the rugged terrain features massive boulders, deep chasms, and mountain trails.",
      "It is home to the Citizenship and Leadership Training Centre (CLTC) and serves as the ultimate spot for hikers, rock climbers, and outdoor adventure groups."
    ],
    quote: {
      text: "Reaching Shere Peak gives you an incredible panoramic view across the entire skyline of Jos.",
      author: "JOS HIKERS CLUB"
    },
    gallery: ["/images/Shere hills hike.jpg"],
    visitorTips: [
      "Start hikes early in the morning to enjoy cool mountain temperatures.",
      "Bring extra drinking water and wind-resistant clothing for the summit."
    ],
    highlights: [
      { icon: "⛰️", title: "1,800m Highland Peak", desc: "Highest elevation viewpoints over Jos." },
      { icon: "🧭", title: "Certified Trail Guides", desc: "Experienced guides for rock climbing & trekking." }
    ],
    pricing: {
      adultRate: 1000,
      kidRate: 500,
      addons: [{ id: "hiking-guide", name: "Certified Mountain Hiking Guide", price: 2500 }]
    }
  },

  "solomon-lar-park": {
    id: "solomon-lar-park",
    title: "Solomon Lar Amusement Park",
    category: "Parks & Recreation",
    verified: true,
    rating: 4.6,
    reviewsCount: 89,
    managedBy: "Jos North Park Management",
    address: "Off Domkat Bali Road, State Lowcost Axis, Jos North, Plateau State",
    weather: { temp: 22, condition: "Mild & Shaded" },
    tags: ["Family Picnic", "Shaded Trees", "Quiet Outdoor Walk", "Photography"],
    status: "Open Daily",
    openingHours: "8:30 AM - 6:30 PM",
    entryPrice: "₦500 Adults / ₦200 Kids",
    recommendedVisit: "2:00 PM - 5:30 PM",
    phone: "+234 703 888 9999",
    heroImage: "/images/solomon lar.jpg",
    overviewHeading: "A Shaded City Park Named After Plateau's Pioneer Governor",
    description: [
      "Named in honor of Chief Solomon Daushep Lar, this city park offers quiet tree-shaded lawns, walking paths, and peaceful seating areas right within central Jos North.",
      "It is a favorite setting for quiet afternoon breaks, family outings, outdoor photography, and small social gatherings."
    ],
    quote: {
      text: "A tranquil green oasis in the middle of Jos city.",
      author: "JOS URBAN GUIDE"
    },
    gallery: ["/images/solomon lar.jpg"],
    visitorTips: [
      "Great choice for a peaceful afternoon reading session or outdoor family lunch.",
      "Bring a picnic mat to relax on the grass lawns."
    ],
    highlights: [
      { icon: "🌳", title: "Shaded Tree Lawns", desc: "Spacious green lawns for outdoor relaxation." },
      { icon: "🏛️", title: "Private Gazebos", desc: "Reserved covered spots for family events." }
    ],
    pricing: {
      adultRate: 500,
      kidRate: 200,
      addons: [{ id: "lawn-gazebo", name: "Private Gazebo Reservation", price: 3000 }]
    }
  }
};

export function PlaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const normalizedId = String(id || '').toLowerCase();
  const aliasMap = {
    'nok-terracottas': 'nok-terracotta',
    'nok-terracotta': 'nok-terracotta',
    'motna': 'motna',
    'riyom-rock': 'riyom-rock',
    'jos-museum': 'jos-museum'
  };

  const place = mockPlaces[normalizedId] || mockPlaces[aliasMap[normalizedId]] || mockPlaces["rayfield-resort"];

  // Tab State: "about" vs "highlights"
  const [activeTab, setActiveTab] = useState("about");

  // Reservation State
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState([]);

  // Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [generatedTicketRef, setGeneratedTicketRef] = useState("");

  // Weather State
  const [liveWeather, setLiveWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const apiKey = "ddc295c8c24b246a862468fe4b6c9dbb";
    const city = "Jos,NG";


    const fetchWeather = async () => {
      try {
        const res = await
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`, {
      signal: controller.signal
    });
    const data = await res .json ();

        if (data.main) {
          setLiveWeather({
            temp: Math.round(data.main.temp),
            condition: data.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`
          });
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error("Failed to fetch weather data:", err);
        }
        } finally {
          if (!controller.signal.aborted)   {
            setWeatherLoading(false);
          }    
         }
      };
      fetchWeather();

    return () => controller.abort();
  }, [place?.id]);
  if (!place) {
    return <div className={styles.loader}>Place not found</div>;
  }

  // Calculate pricing
  const adultCost = adults * (place.pricing?.adultRate || 0);
  const kidCost = kids * (place.pricing?.kidRate || 0);
  const addonCost = selectedAddons.reduce((sum, item) => sum + item.price, 0);
  const totalEstimate = adultCost + kidCost + addonCost;

  const handleAddonToggle = (addon) => {
    if (selectedAddons.some((a) => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handleOpenCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const handleConfirmReservation = (e) => {
    e.preventDefault();
    if (!guestName || !guestEmail || !guestPhone) {
      alert("Please fill in all contact fields to complete your reservation.");
      return;
    }

    const randomTicketNum = `JP-PASS-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedTicketRef(randomTicketNum);
    setIsCheckoutOpen(false);
    setIsSuccessModalOpen(true);
  };

  const defaultHighlights = [
    { icon: "✨", title: "Scenic Views", desc: "Sweeping landscape views of the Plateau terrain." },
    { icon: "🛡️️", title: "Verified Venue", desc: "Regularly inspected for safety and customer standards." },
    { icon: "🅿️", title: "On-site Parking", desc: "Safe parking spaces available for visitors." },
    { icon: "👨‍👩‍👧", title: "Family Friendly", desc: "Environment suitable for all age groups." }
  ];

  const displayHighlights = (place.highlights && place.highlights.length > 0) 
    ? place.highlights 
    : defaultHighlights;

  return (
    <div className={styles.container}>
      {/* Hero Header */}
      <div className={styles.heroBanner}>
        <img className={styles.heroImage} src={place.heroImage} alt="" aria-hidden="true" />
        <div className={styles.heroOverlay}>
          <div className={styles.heroTopRow}>
            <button onClick={() => navigate(-1)} className={styles.backButton}>
              ← Back to Discovery
            </button>
            <div className={styles.heroActions}>
              <button className={styles.circleBtn} title="Save to bookmarks">🔖</button>
              <button className={styles.circleBtn} title="Share link">🔗</button>
            </div>
          </div>

          <div className={styles.heroBottomRow}>
            <div className={styles.leftInfo}>
              <div className={styles.badgeGroup}>
                <span className={styles.categoryBadge}>{place.category}</span>
                {place.verified && (
                  <span className={styles.verifiedBadge}>✓ Verified Venue</span>
                )}
              </div>
              <h1 className={styles.title}>{place.title}</h1>
              <div className={styles.subMeta}>
                <span>⭐ {place.rating} ({place.reviewsCount} reviews)</span>
                <span>•</span>
                <span>{place.managedBy}</span>
              </div>
              <p className={styles.address}>📍 {place.address}</p>
            </div>

            <div className={styles.weatherCard}>
              <small>Live Weather</small>
              {weatherLoading ? (
                <div>Loading weather...</div>
              ) : liveWeather ? (
                <div className={styles.tempVal}>
                  {liveWeather.icon && <img src={liveWeather.icon} alt="" width="24" height="24" />}
                  {liveWeather.temp}°C <span style={{ textTransform: "capitalize" }}>{liveWeather.condition}</span>
                </div>
              ) : (
                <div className={styles.tempVal}>
                  ⛅ {place.weather?.temp}°C <span>{place.weather?.condition}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      {place.tags && (
        <div className={styles.tagsContainer}>
          {place.tags.map((tag, i) => (
            <span key={i} className={styles.tagPill}>{tag}</span>
          ))}
        </div>
      )}

      {/* Metrics Grid */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricItem}>
          <small>OPENING HOURS</small>
          <p><strong>• {place.status}</strong><br />{place.openingHours}</p>
        </div>
        <div className={styles.metricItem}>
          <small>ENTRY / TICKET</small>
          <p><strong>{place.entryPrice}</strong></p>
        </div>
        <div className={styles.metricItem}>
          <small>RECOMMENDED VISIT</small>
          <p>{place.recommendedVisit}</p>
        </div>
        <div className={styles.metricItem}>
          <small>DIRECT HOTLINE</small>
          <p>{place.phone}</p>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className={styles.mainGrid}>
        <div className={styles.leftContent}>
          {/* FUNCTIONAL TABS NAV */}
          <div className={styles.tabNav}>
            <button
              type="button"
              className={activeTab === "about" ? styles.activeTab : ""}
              onClick={() => setActiveTab("about")}
            >
              About the Spot
            </button>
            <button
              type="button"
              className={activeTab === "highlights" ? styles.activeTab : ""}
              onClick={() => setActiveTab("highlights")}
            >
              Highlights & Amenities
            </button>
          </div>

          {/* TAB 1: ABOUT THE SPOT */}
          {activeTab === "about" && (
            <div className={styles.tabBody}>
              <h2>{place.overviewHeading}</h2>
              {place.description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}

              {place.quote && (
                <div className={styles.quoteBox}>
                  <p>"{place.quote.text}"</p>
                  <small>— {place.quote.author}</small>
                </div>
              )}

              {place.gallery && (
                <div className={styles.galleryGrid}>
                  {place.gallery.map((img, idx) => (
                    <img key={idx} src={img} alt={`${place.title} view ${idx + 1}`} />
                  ))}
                </div>
              )}

              {place.visitorTips && (
                <div className={styles.tipsBox}>
                  <h3>💡 Local Visitor Tips</h3>
                  <ul>
                    {place.visitorTips.map((tip, idx) => (
                      <li key={idx}>✓ {tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FUNCTIONAL HIGHLIGHTS & AMENITIES */}
          {activeTab === "highlights" && (
            <div className={styles.tabBody}>
              <h2>Highlights & Featured Amenities</h2>
              <p>Key facilities, experience add-ons, and visitor comforts available at {place.title}:</p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '16px',
                marginTop: '20px'
              }}>
                {displayHighlights.map((item, idx) => (
                  <div key={idx} style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}>
                    <span style={{ fontSize: '28px' }}>{item.icon}</span>
                    <strong style={{ fontSize: '16px', color: '#0F172A' }}>{item.title}</strong>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: '32px',
                padding: '20px',
                backgroundColor: '#F8FAFC',
                border: '1px dashed #CBD5E1',
                borderRadius: '12px'
              }}>
                <h4 style={{ margin: '0 0 8px', color: '#0F172A' }}>🔒 Safety & Visitor Guidelines</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
                  All featured experiences and amenity access strictly adhere to Plateau Tourism Board safety standards. On-site staff are available to assist with special equipment, group reservations, and emergency assistance.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* FUNCTIONAL RESERVE PASS & TABLE SIDEBAR */}
        <div className={styles.rightSidebar}>
          <div className={styles.bookingCard}>
            <small>STANDARD ENTRY / PASS</small>
            <div className={styles.priceHeading}>
              <h2>
                {place.pricing?.adultRate === 0 
                  ? "Free Entry" 
                  : `₦${(place.pricing?.adultRate || 0).toLocaleString()}`}
              </h2>
              <span className={styles.instantBadge}>Instant Ticket</span>
            </div>

            <div className={styles.fieldGroup}>
              <label>Reservation Date</label>
              <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)} 
              />
            </div>

            <div className={styles.counterRow}>
              <div>
                <strong>Adults</strong>
                <small>₦{place.pricing?.adultRate || 0}</small>
              </div>
              <div className={styles.counterBtns}>
                <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))}>-</button>
                <span>{adults}</span>
                <button type="button" onClick={() => setAdults(adults + 1)}>+</button>
              </div>
            </div>

            <div className={styles.counterRow}>
              <div>
                <strong>Kids</strong>
                <small>₦{place.pricing?.kidRate || 0}</small>
              </div>
              <div className={styles.counterBtns}>
                <button type="button" onClick={() => setKids(Math.max(0, kids - 1))}>-</button>
                <span>{kids}</span>
                <button type="button" onClick={() => setKids(kids + 1)}>+</button>
              </div>
            </div>

            {place.pricing?.addons && place.pricing.addons.length > 0 && (
              <div className={styles.addonsSection}>
                <label>Optional Experiences & Table Upgrades</label>
                {place.pricing.addons.map((addon) => (
                  <div key={addon.id} className={styles.addonRow}>
                    <input
                      type="checkbox"
                      id={addon.id}
                      checked={selectedAddons.some((a) => a.id === addon.id)}
                      onChange={() => handleAddonToggle(addon)}
                    />
                    <label htmlFor={addon.id}>{addon.name}</label>
                    <span>+₦{addon.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.totalRow}>
              <span>Estimated Total</span>
              <strong>₦{totalEstimate.toLocaleString()}</strong>
            </div>

            <button 
              type="button" 
              className={styles.reserveBtn} 
              onClick={handleOpenCheckout}
            >
              Reserve Pass & Get Tickets
            </button>
          </div>
        </div>
      </div>

      {/* CHECKOUT MODAL */}
      {isCheckoutOpen && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modalContainer}>
            <div style={modalStyles.header}>
              <h3 style={{ margin: 0, color: '#0F172A' }}>Complete Your Reservation</h3>
              <button 
                onClick={() => setIsCheckoutOpen(false)}
                style={modalStyles.closeBtn}
              >
                ✕
              </button>
            </div>

            <div style={modalStyles.summaryBox}>
              <strong>{place.title}</strong>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748B' }}>
                Date: {selectedDate} | Guests: {adults} Adult(s), {kids} Kid(s)
              </p>
              {selectedAddons.length > 0 && (
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#F97316' }}>
                  Add-ons: {selectedAddons.map(a => a.name).join(', ')}
                </p>
              )}
              <div style={{ marginTop: '8px', fontWeight: 'bold', color: '#0F172A' }}>
                Total payable: ₦{totalEstimate.toLocaleString()}
              </div>
            </div>

            <form onSubmit={handleConfirmReservation} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
              <div>
                <label style={modalStyles.label}>Full Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Pam Chollom"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  style={modalStyles.input}
                />
              </div>

              <div>
                <label style={modalStyles.label}>Email Address (To receive E-Ticket)</label>
                <input 
                  type="email" 
                  required 
                  placeholder="pam@example.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  style={modalStyles.input}
                />
              </div>

              <div>
                <label style={modalStyles.label}>Phone Number</label>
                <input 
                  type="tel" 
                  required 
                  placeholder="+234 800 000 0000"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  style={modalStyles.input}
                />
              </div>

              <button type="submit" style={modalStyles.confirmBtn}>
                Confirm Reservation & Issue Pass
              </button>
            </form>
          </div>
        </div>
      )}

      {/* E-TICKET CONFIRMATION MODAL */}
      {isSuccessModalOpen && (
        <div style={modalStyles.overlay}>
          <div style={{ ...modalStyles.modalContainer, textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎟️</div>
            <h3 style={{ margin: '0 0 8px', color: '#0F172A' }}>Reservation Confirmed!</h3>
            <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#64748B' }}>
              Your digital entry pass has been issued and sent to <strong>{guestEmail}</strong>.
            </p>

            <div style={{
              backgroundColor: '#FFF7ED',
              border: '2px dashed #F97316',
              borderRadius: '12px',
              padding: '20px',
              margin: '16px 0'
            }}>
              <small style={{ color: '#C2410C', fontWeight: 'bold' }}>OFFICIAL E-TICKET VOUCHER</small>
              <h4 style={{ margin: '6px 0', fontSize: '18px', color: '#0F172A' }}>{generatedTicketRef}</h4>
              
              {/* QR Code Graphic */}
              <div style={{ margin: '12px 0' }}>
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${generatedTicketRef}`} 
                  alt="QR Ticket Code" 
                  style={{ borderRadius: '8px', border: '1px solid #CBD5E1' }}
                />
              </div>

              <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.5' }}>
                <strong>{place.title}</strong><br />
                Date: {selectedDate} | Pass for {adults + kids} Person(s)<br />
                Presenter: {guestName}
              </div>
            </div>

            <button 
              type="button" 
              onClick={() => setIsSuccessModalOpen(false)}
              style={modalStyles.confirmBtn}
            >
              Done & Save Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// INLINE STYLES FOR POPUP MODALS
const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '28px',
    maxWidth: '480px',
    width: '100%',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    fontFamily: '"Inter", sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#64748B'
  },
  summaryBox: {
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    padding: '14px'
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: '6px'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  confirmBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#F97316',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '8px'
  }
};

export default PlaceDetail;