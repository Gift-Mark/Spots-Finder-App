const placeDetails = {
  'rayfield-resort': {
    id: 'rayfield-resort', title: 'Rayfield Holiday Resort & Water Park', category: 'Resort & Water Sports', verified: true, rating: 4.8, reviewsCount: 132,
    managedBy: 'Plateau Tourism Authority & Partner', address: 'Rayfield Resort Boulevard, Old Airport Road Axis, Jos South, Plateau State',
    weather: { temp: 22, condition: 'Crisp & Breezy' }, tags: ['Family Friendly', 'Boating & Water Sports', 'Outdoor Dining'], status: 'Open Now',
    openingHours: '8:00 AM - 6:30 PM', entryPrice: '₦1,500 Adults / ₦500 Kids', recommendedVisit: '4:00 PM - 6:30 PM (Golden Hour Sunset)', phone: '+234 703 123 4567',
    heroImage: '/images/Rayfield resort 3.webp', overviewHeading: 'An Oasis of Waters & Granite Hills',
    description: ["Tucked away inside the historic suburb of Rayfield, Jos, the Rayfield Holiday Resort stands as one of Plateau State's most cherished recreation treasures."],
    quote: { text: 'There is no sunset in Jos quite like watching the gold rays bounce off the granite hills and reflect across Rayfield Lake.', author: 'JOS PULSE GUIDE' },
    gallery: ['/images/Rayfield Resort.jpg', '/images/Rayfield resort 1.webp', '/images/Rayfield Resort 2.webp', '/images/Rayfield resort 3.webp'],
    visitorTips: ['Bring a Light Cardigan for cool evening winds.', 'Lifejackets are mandatory for all boat rides.'],
    pricing: { adultRate: 1500, kidRate: 500, addons: [{ id: 'cruise', name: '30-Min Lake Cruise', price: 2000 }] }
  },
  'kurra-falls': {
    id: 'kurra-falls', title: 'Kurra Falls & Hydro-Power Eco Sanctuary', category: 'Nature & Adventure', verified: true, rating: 4.9, reviewsCount: 98,
    managedBy: 'Plateau State Tourism Board & NESCO Partner', address: 'Gashish District, Barkin Ladi LGA, Plateau State, Nigeria',
    weather: { temp: 19, condition: 'Cool & Highland Breeze' }, tags: ['Waterfall Treks', 'Eco-Tourism', 'Historic Dam', 'Scenic Hiking'], status: 'Open Daily',
    openingHours: '7:00 AM - 5:30 PM', entryPrice: '₦1,000 Adults / ₦500 Students', recommendedVisit: '10:00 AM - 3:30 PM (Daytime Trekking)', phone: '+234 802 345 6789',
    heroImage: '/images/Kurra-Falls.jpg', overviewHeading: 'Cascading Waters & Granite Canyons',
    description: ['Nestled deep within the lush green highlands of Barkin Ladi, Kurra Falls is one of Plateau State\'s most breathtaking natural wonders.', 'The area features natural lakes, cascading waterfalls plunging through rugged granite canyons, and serene forest paths ideal for daytime hiking and photography.'],
    quote: { text: 'Standing atop the granite ledges at Kurra Falls while mist from the roaring cascades cools the air is the quintessential Plateau adventure.', author: 'JOS PULSE ECO-DISCOVERY GUIDE' },
    gallery: ['/images/Kurra-Falls.jpg', '/images/Rayfield Resort.jpg'],
    visitorTips: ['Sturdy Footwear Required: Rock surfaces near streams can be slippery.', 'Group Excursions: Hire a local guide at the gate for waterfall canyon hikes.'],
    pricing: { adultRate: 1000, kidRate: 500, addons: [{ id: 'guided-trek', name: 'Guided Canyon Trek', price: 2500 }] }
  },
  'jos-museum': {
    id: 'jos-museum', title: 'Jos National Museum & Complex', category: 'Heritage & Culture', verified: true, rating: 4.5, reviewsCount: 19,
    managedBy: 'National Commission for Museums and Monuments', address: 'Museum Hill, Jos City Centre, Jos North LGA, Plateau State',
    weather: { temp: 21, condition: 'Pleasant' }, tags: ['Nok Terracotta', 'Architectural Museum', 'Heritage Exhibits', 'Family Friendly'], status: 'Open Daily',
    openingHours: '9:00 AM - 5:00 PM', entryPrice: '₦500 Adults / ₦200 Students', recommendedVisit: '10:00 AM - 1:00 PM', phone: '+234 700 000 0000',
    heroImage: '/images/Jos Museum.jpg', overviewHeading: "Nigeria's Pioneer Museum of Ancient Pottery & Nok Art",
    description: ["Established in 1952 by Bernard Fagg, the Jos Museum stands as one of the oldest and most historic museum institutions in West Africa. Famous for its priceless collection of ancient Nok terracotta heads and pottery artifacts dating back to 500 BC.", 'The compound also houses the Museum of Traditional Nigerian Architecture (MOTNA), featuring life-sized replicas of historic palaces and mosques from Kano, Zaria, and Benin City.'],
    pricing: { adultRate: 500, kidRate: 200, addons: [{ id: 'guide', name: 'Guided Heritage Tour', price: 1000 }] }
  },
  'tasty-fingers': {
    id: 'tasty-fingers', title: 'Tasty Fingers Restaurant', category: 'Dining & Fine Cuisine', verified: true, rating: 4.6, reviewsCount: 45,
    managedBy: 'Tasty Fingers Culinary Group', address: 'Rayfield Road Axis, Jos South, Plateau State', weather: { temp: 23, condition: 'Pleasant' },
    tags: ['Fine Dining', 'City View', 'Grill & Continental', 'Bar & Lounge'], status: 'Open Now', openingHours: '10:00 AM - 10:30 PM',
    entryPrice: 'Free Admission / Pay per Order', recommendedVisit: '6:00 PM - 9:30 PM (Dinner & City Skyline View)', phone: '+234 812 345 6789',
    heroImage: '/images/tasty-fingers.jpg', overviewHeading: 'Fine Dining with Panoramic Views of Jos',
    description: ['Tasty Fingers Restaurant offers a modern culinary experience blending African flavors with international continental dishes. Situated at an elevated vantage point, guests enjoy sweeping panoramic night views of Jos while dining in a relaxed atmosphere.'],
    pricing: { adultRate: 0, kidRate: 0, addons: [{ id: 'vip-table', name: 'VIP Window Table Reservation', price: 5000 }, { id: 'chapman', name: 'Welcome Drink (Special Chapman)', price: 1500 }] }
  },
  'nzem-berom': {
    id: 'nzem-berom', slug: 'nzem-berom', title: 'Nzem Berom Cultural Festival', category: 'Cultural Festival', verified: true, rating: 4.9, reviewsCount: 112,
    managedBy: 'Berom Educational and Cultural Organisation (BECO)', address: 'Rwang Pam Stadium, Jos City Centre, Plateau State', weather: { temp: 20, condition: 'Highland Festival Breeze' },
    tags: ['Cultural Heritage', 'Royal Procession', 'Music & Dance', 'Local Cuisine'], status: 'Annual Event', openingHours: '9:00 AM - 6:00 PM',
    entryPrice: 'Free Entry', recommendedVisit: '10:00 AM - 3:00 PM', phone: '+234 800 111 2222', heroImage: '/images/nzem-berom.jpg',
    overviewHeading: 'The Grand Celebration of Berom Cultural Heritage',
    description: ['The Nzem Berom is the premier annual cultural carnival of the Berom people of Plateau State. Celebrating the rich music, royal processions, traditional dances, and agricultural harvests of the highlanders.', 'Expect vibrant displays of traditional costumes, royal horse processions, musical performances, and exhibitions of native Berom cuisine and crafts.'],
    quote: { text: 'Experience the pulse of Plateau tradition through royal horse troops, rhythmic drumming, and authentic highland culture.', author: 'PLATEAU HERITAGE GUILD' },
    gallery: ['/images/nzem-berom.jpg'], visitorTips: ['Arrive before 9:30 AM to secure a clear view of the opening royal procession.', 'Photography is welcomed, but respect designated traditional performance areas.'],
    pricing: { adultRate: 0, kidRate: 0, addons: [{ id: 'vip-pavilion', name: 'VIP Grandstand Pavilion Seat', price: 3000 }] }, date: 'October 14, 2026', month: 'OCT', day: '14', venue: 'Rwang Pam Stadium', isFree: true
  },
  'plateau-live-music': {
    id: 'plateau-live-music', slug: 'plateau-live-music', title: 'Plateau Live Music Night', category: 'Concert & Nightlife', verified: true, rating: 4.8, reviewsCount: 64,
    managedBy: 'Plateau Entertainment Forum & Rayfield Waterway', address: 'Rayfield Waterway Resort, Jos South, Plateau State', weather: { temp: 18, condition: 'Cool Highland Evening' },
    tags: ['Live Band', 'Highlife & Afro-Fusion', 'Lakeside View', 'Nightlife'], status: 'Upcoming Event', openingHours: '7:00 PM - 11:30 PM',
    entryPrice: '₦5,000 Regular / ₦15,000 VIP', recommendedVisit: '7:00 PM - 11:00 PM (Full Night Session)', phone: '+234 803 000 1234',
    heroImage: '/images/live-music.jpg', overviewHeading: 'Highland Rhythms & Acoustic Sunset Sessions',
    description: ['An intimate evening of live acoustic performances, Afro-fusion jazz, and contemporary Jos music talent set against the beautiful lakeside view of Waterway Resort.', 'Featuring top local guest artists, craft cocktails, outdoor lounge seating, and an electric atmosphere under the stars.'],
    quote: { text: 'The cool highland breeze mixed with soulful live acoustic highlife at the lakeside is Jos nightlife at its finest.', author: 'JOS PULSE NIGHTLIFE GUIDE' },
    gallery: ['/images/live-music.jpg', '/images/Rayfield Resort.jpg'],
    visitorTips: ['Open Mic Segment: Arrive by 6:30 PM to register for early acoustic slots.', 'Evening Chills: Bring a jacket as temperatures cool down significantly by the lake at night.', 'VIP Seating: Book early for front-row tables with direct stage views.'],
    pricing: { adultRate: 5000, kidRate: 2500, addons: [{ id: 'vip-upgrade', name: 'VIP Table & Welcome Drink Upgrade', price: 10000 }, { id: 'reserved-parking', name: 'Reserved Premium Parking Pass', price: 2000 }] },
    date: 'October 16, 2026', month: 'OCT', day: '16', venue: 'Waterway Resort', isFree: false, organizer: 'Plateau Entertainment Forum'
  },
  'nok-terracotta': {
    id: 'nok-terracotta', slug: 'nok-terracotta', title: 'Nok Terracotta & Heritage Gallery', category: 'Archaeology & Ancient Art', verified: true, rating: 4.9, reviewsCount: 88,
    managedBy: 'National Commission for Museums and Monuments (NCMM)', address: 'Inside Jos National Museum Complex, Jos North LGA, Plateau State', weather: { temp: 21, condition: 'Pleasant & Clear' },
    tags: ['500 BC Artefacts', 'Ancient Sculpture', 'Archaeology', 'Guided Tours'], status: 'Open Daily', openingHours: '9:00 AM - 5:00 PM',
    entryPrice: '₦1,000 Adults / ₦500 Students', recommendedVisit: '10:00 AM - 1:00 PM', phone: '+234 700 000 1111', heroImage: '/images/Nok.jpg',
    overviewHeading: "Africa's Oldest Terracotta Sculptural Legacy",
    description: ['The Nok Terracotta Gallery houses world-renowned sculptures discovered across Plateau and Kaduna States dating back as far as 1500 BC to 500 AD.', "The exhibit features elaborate human figures with detailed hair coils, flared nostrils, and triangular eye openings representing Africa's earliest known iron-smelting civilization."],
    quote: { text: "The Nok culture represents one of West Africa's greatest art-historical legacies.", author: 'ARCHAEOLOGY TODAY' },
    gallery: ['/images/Nok.jpg'], visitorTips: ['Flash photography is prohibited inside the main terracotta gallery.', 'Book an NCMM curator guide at the main lobby for a deep historical breakdown.'],
    pricing: { adultRate: 1000, kidRate: 500, addons: [{ id: 'curator-tour', name: 'Curator-Guided Audio Tour', price: 1500 }] }
  },
  'riyom-rock': {
    id: 'riyom-rock', slug: 'riyom-rock', title: 'Riyom Rock Formation (Three Rocks)', category: 'Geological Wonder & Landmark', verified: true, rating: 4.8, reviewsCount: 74,
    managedBy: 'Riyom Local Government & Plateau Tourism Board', address: 'Riyom Junction, Akwanga-Jos Highway, Riyom LGA, Plateau State', weather: { temp: 20, condition: 'Highland Winds' },
    tags: ['Natural Wonder', 'Geological Landmark', 'Photography', 'Hiking'], status: 'Open Daily', openingHours: '6:00 AM - 6:00 PM',
    entryPrice: 'Free Admission / Local Guide Fee Applies', recommendedVisit: '8:00 AM - 11:00 AM or 4:00 PM - 6:00 PM', phone: '+234 803 999 8888',
    heroImage: '/images/Riyom Rock.jpg', overviewHeading: "Nature's Gravity-Defying Granite Balance",
    description: ["Located in Riyom Local Government Area along the Jos-Akwanga highway, the Riyom Rock Formation is one of Nigeria's most iconic natural geographical landmarks.", 'Massive granite boulders rest delicately balanced on top of one another naturally forming the distinct outline of the geographic map of Plateau State.'],
    quote: { text: "Nature's architecture at its finest—a symbol carved into the very landscape of Plateau State.", author: 'NIGERIAN GEOGRAPHIC JOURNAL' },
    gallery: ['/images/Riyom Rock.jpg'], visitorTips: ['Stop by during morning hours for clear sunlight and optimal photography angles.', 'Always engage a local community guide before climbing nearby ledges.'],
    pricing: { adultRate: 500, kidRate: 200, addons: [{ id: 'rock-guide', name: 'Local Ridge Hike Guide', price: 1500 }] }
  },
  motna: {
    id: 'motna', slug: 'motna', title: 'MOTNA (Museum of Traditional Nigerian Architecture)', category: 'Architecture & Heritage Park', verified: true, rating: 4.7, reviewsCount: 52,
    managedBy: 'National Commission for Museums and Monuments', address: 'Jos Museum Grounds, Museum Hill, Jos Centre, Plateau State', weather: { temp: 22, condition: 'Pleasant' },
    tags: ['Life-size Replicas', 'Kano Wall', 'Zaria Mosque', 'Architectural History'], status: 'Open Daily', openingHours: '9:00 AM - 5:00 PM',
    entryPrice: '₦500 Adults / ₦200 Children', recommendedVisit: '11:00 AM - 2:00 PM', phone: '+234 700 000 2222',
    heroImage: '/images/MOTNA.jpg', overviewHeading: 'Life-Sized Architecture from Across Pre-Colonial Nigeria',
    description: ['MOTNA is an open-air architectural gallery showcasing full-scale replicas of traditional structures from different ethnic groups across Nigeria.', 'Exhibits feature replicas of the ancient Wall of Kano, the Mbari house of the Igbo, the traditional palace structures of Benin, and the Zaria Friday Mosque.'],
    quote: { text: 'A physical walk through centuries of pre-colonial African engineering and architectural mastery.', author: 'HERITAGE ARCHITECTURE REVIEW' },
    gallery: ['/images/MOTNA.jpg'], visitorTips: ['Wear comfortable walking shoes; the open-air complex covers extensive ground.', 'Combine your visit with the adjacent Jos Zoo and Main Museum Gallery.'],
    pricing: { adultRate: 500, kidRate: 200, addons: [{ id: 'architectural-tour', name: 'Architectural History Walk', price: 1000 }] }
  },
  'mazah-waterfall': {
    id: 'mazah-waterfall', title: 'Mazah Waterfall & Highland Trail', category: 'Nature & Hiking', verified: true, rating: 4.8, reviewsCount: 38,
    managedBy: 'Jos North Local Govt & Community Guides', address: 'Mazah Village, Jos North LGA, Plateau State', weather: { temp: 18, condition: 'Cool Highland Breeze' },
    tags: ['Waterfall Trek', 'Mountain Hiking', 'Photography', 'Ecotourism'], status: 'Open Daily', openingHours: '7:00 AM - 5:30 PM',
    entryPrice: 'Free Access / Local Guide Fee Applies', recommendedVisit: '9:00 AM - 2:00 PM (Morning Trek)', phone: '+234 803 111 2233',
    heroImage: '/images/Mazah waterfall.webp', overviewHeading: 'Hidden Highland Cascades in the Hills of Jos North',
    description: ['Tucked away in the serene highlands of Mazah village, just a short drive from Jos city center, Mazah Waterfall is an idyllic natural spot featuring fresh mountain streams cascading over granite rock ledges.', 'The scenic trek to the falls passes through traditional Jarawa settlements, green terraces, and steep rocky paths offering panoramic views of the Jos basin.'],
    quote: { text: 'Mazah offers raw, unadulterated highland scenery and crisp mountain water straight off the Jos plateau rocks.', author: 'JOS TRAIL EXPLORERS' },
    gallery: ['/images/Mazah waterfall.webp'], visitorTips: ['Wear sturdy hiking shoes as the trail down to the waterfall base can be steep.', 'Engage a village youth guide at Mazah center for safe navigation along stream paths.'],
    pricing: { adultRate: 500, kidRate: 200, addons: [{ id: 'trail-guide', name: 'Community Highland Guide', price: 1500 }] }
  },
  'jos-wildlife-park': {
    id: 'jos-wildlife-park', title: 'Jos Wildlife Park', category: 'Wildlife & Nature Park', verified: true, rating: 4.6, reviewsCount: 120,
    managedBy: 'Plateau State Tourism Corporation', address: 'Tudun Wada / Dong Axis, Jos North LGA, Plateau State', weather: { temp: 21, condition: 'Shaded & Breezy' },
    tags: ['Zoo & Sanctuary', 'Pine Forest', 'Family Outing', 'Picnic Grounds'], status: 'Open Daily', openingHours: '9:00 AM - 6:00 PM',
    entryPrice: '₦500 Adults / ₦200 Children', recommendedVisit: '11:00 AM - 4:00 PM', phone: '+234 703 444 5555',
    heroImage: '/images/wildlife park.jpg', overviewHeading: "One of Nigeria's Largest Man-Made Wildlife Sanctuaries",
    description: ["Spanning over 8 square kilometers of pine forests, rolling hills, and natural habitat enclosures, Jos Wildlife Park was established in 1972 and remains one of Plateau State's premier recreation landmarks.", 'The park shelters lions, primates, hippos, crocodiles, and exotic birds, alongside shaded pine forest picnic areas and vantage points overlooking Jos city.'],
    quote: { text: 'Walking beneath the towering pine trees at Jos Wildlife Park is a signature Jos experience.', author: 'PLATEAU TOURISM GUIDE' },
    gallery: ['/images/wildlife park.jpg'], visitorTips: ['Visit the pine forest section near the picnic hills for great outdoor photography.', 'Concession stands and local snack vendors are available near the main gate entrance.'],
    pricing: { adultRate: 500, kidRate: 200, addons: [{ id: 'pine-picnic', name: 'Reserved Pine Forest Pavilion', price: 2000 }] }
  },
  'assop-falls': {
    id: 'assop-falls', title: 'Assop Waterfalls', category: 'Nature & Waterfalls', verified: true, rating: 4.8, reviewsCount: 104,
    managedBy: 'Plateau State Tourism Board', address: 'Hawan Kibo, Jos-Abuja Expressway, Riyom LGA, Plateau State', weather: { temp: 20, condition: 'Cool Spray & Breeze' },
    tags: ['Waterfall Trekking', 'Picnic Spots', 'Photography', 'Nature Trails'], status: 'Open Daily', openingHours: '8:00 AM - 6:00 PM',
    entryPrice: '₦1,000 Adults / ₦500 Students', recommendedVisit: '11:00 AM - 3:00 PM', phone: '+234 802 111 4444',
    heroImage: '/images/assop falls.webp', overviewHeading: 'Cascading Waters along the Plateau Escarpment',
    description: ['Assop Falls is a natural waterfall situated along the Jos-Abuja expressway at the bottom of the Hawan Kibo escarpment.', 'Water cascades over granite rocks into a fresh river pool surrounded by savannah trees, making it a popular picnic spot for road travelers and tourists.'],
    quote: { text: 'A refreshing natural stop where cool mist and roaring waters mark the gateway to the Plateau.', author: 'PLATEAU TOURISM BOARD' },
    gallery: ['/images/assop falls.webp'], visitorTips: ['Exercise caution near wet granite rocks near the waterfall stream.', 'Ideal location for a scenic lunch break when traveling along the Jos-Abuja corridor.'],
    pricing: { adultRate: 1000, kidRate: 500, addons: [{ id: 'picnic-bench', name: 'Riverside Picnic Bench', price: 1500 }] }
  },
  'shere-hills': {
    id: 'shere-hills', title: 'Shere Hills Peak', category: 'Mountain Hiking & Adventure', verified: true, rating: 4.9, reviewsCount: 142,
    managedBy: 'Citizens Cycling & Hiking Guild / Plateau Tourism', address: 'Shere Hills Range, 10km East of Jos City Centre, Plateau State', weather: { temp: 17, condition: 'Highland Peak Chill' },
    tags: ['Rock Climbing', 'Highland Peak', 'Mountain Camping', 'Trail Trekking'], status: 'Open Daily', openingHours: '6:00 AM - 6:00 PM',
    entryPrice: 'Free Access / Guided Hike Fees Apply', recommendedVisit: '6:30 AM - 11:00 AM (Sunrise Hike)', phone: '+234 803 555 6666',
    heroImage: '/images/Shere hills hike.jpg', overviewHeading: 'Highland Ridges Rising Over 1,800 Meters Above Sea Level',
    description: ['Shere Hills forms one of the highest elevated granite rock formations in Plateau State. Located just east of Jos metropolis, the rugged terrain features massive boulders, deep chasms, and mountain trails.', 'It is home to the Citizenship and Leadership Training Centre (CLTC) and serves as the ultimate spot for hikers, rock climbers, and outdoor adventure groups.'],
    quote: { text: 'Reaching Shere Peak gives you an incredible panoramic view across the entire skyline of Jos.', author: 'JOS HIKERS CLUB' },
    gallery: ['/images/Shere hills hike.jpg'], visitorTips: ['Start hikes early in the morning to enjoy cool mountain temperatures.', 'Bring extra drinking water and wind-resistant clothing for the summit.'],
    pricing: { adultRate: 1000, kidRate: 500, addons: [{ id: 'hiking-guide', name: 'Certified Mountain Hiking Guide', price: 2500 }] }
  },
  'solomon-lar-park': {
    id: 'solomon-lar-park', title: 'Solomon Lar Amusement Park', category: 'Parks & Recreation', verified: true, rating: 4.6, reviewsCount: 89,
    managedBy: 'Jos North Park Management', address: 'Off Domkat Bali Road, State Lowcost Axis, Jos North, Plateau State', weather: { temp: 22, condition: 'Mild & Shaded' },
    tags: ['Family Picnic', 'Shaded Trees', 'Quiet Outdoor Walk', 'Photography'], status: 'Open Daily', openingHours: '8:30 AM - 6:30 PM',
    entryPrice: '₦500 Adults / ₦200 Kids', recommendedVisit: '2:00 PM - 5:30 PM', phone: '+234 703 888 9999',
    heroImage: '/images/solomon lar.jpg', overviewHeading: "A Shaded City Park Named After Plateau's Pioneer Governor",
    description: ['Named in honor of Chief Solomon Daushep Lar, this city park offers quiet tree-shaded lawns, walking paths, and peaceful seating areas right within central Jos North.', 'It is a favorite setting for quiet afternoon breaks, family outings, outdoor photography, and small social gatherings.'],
    quote: { text: 'A tranquil green oasis in the middle of Jos city.', author: 'JOS URBAN GUIDE' },
    gallery: ['/images/solomon lar.jpg'], visitorTips: ['Great choice for a peaceful afternoon reading session or outdoor family lunch.', 'Bring a picnic mat to relax on the grass lawns.'],
    pricing: { adultRate: 500, kidRate: 200, addons: [{ id: 'lawn-gazebo', name: 'Private Gazebo Reservation', price: 3000 }] }
  }
};

module.exports = { placeDetails };
