const places = [
  {
    id: 1,
    section: "vibe",
    slug: "shere-hills-sunset-party",

    title: "Shere Hills Sunset Party",

    image: "../images/Shere hills party 1.jpg",

    location: "Lamingo, Jos",

    latitude: 9.9428,
    longitude: 8.9304,

    address: "Shere Hills Resort, Lamingo, Jos",

    category: ["Party", "Outdoor", "Live Music"],

    subtitle: "This Saturday",

    rating: 4.8,

    reviews: 128,

    percent: "96%",

    open: "4:00 PM",

    close: "11:30 PM",

    phone: "+2348011111111",

    description:
      "Experience one of the most beautiful sunset parties in Jos with live DJs, food, drinks, and breathtaking views of Shere Hills.",

    gallery: [
      "../images/Shere hills party 1.jpg",
      "../images/Crispan Suites.avif",
      "../images/shere hills party 2.jpg",
    ],

    events: [
      {
        title: "Sunset Party",
        date: "26 July",
        time: "5:00 PM",
      },
      {
        title: "Live DJ Session",
        date: "2 August",
        time: "7:00 PM",
      },
    ],
  },

  {
    id: 2,
    section: "trending",
    slug: "rayfield-gardens",

    title: "Rayfield Gardens",

    image: "../images/Rayfield gardens.avif",

    location: "Rayfield, Jos",

    latitude: 9.8406,
    longitude: 8.8995,

    address: "Rayfield Road, Jos",

    category: ["Garden", "Lounge", "Outdoor"],

    badge: "LIVE VIBE",

    badgeClass: "badge-live",

    wrapperClass: "trending-card",

    rating: 4.9,

    reviews: 248,

    percent: "98%",

    open: "6:00 PM",

    close: "2:00 AM",

    phone: "+2348022222222",

    description:
      "One of the most popular nightlife venues in Jos with outdoor seating, DJs and weekend events.",

    gallery: [
      "../images/garden bar.avif",
      "../images/rayfield water.jpg",
      "../images/rayfield bar.jpg",
    ],

    events: [
      {
        title: "Friday Vibes",
        date: "25 July",
        time: "8:00 PM",
      },
      {
        title: "DJ Neptune Live",
        date: "2 August",
        time: "9:00 PM",
      },
    ],
  },

  {
    id: 3,
    section: "trending",
    slug: "plateau-room",

    title: "Plateau Room",

    image: "../images/plateau room.avif",

    location: "Anglo Jos",

    latitude: 9.9183,
    longitude: 8.8892,

    address: "Anglo Jos, Plateau State",

    category: ["Lounge", "Cocktails", "Indoor"],

    badge: "CHILL",

    badgeClass: "badge-chill",

    wrapperClass: "trending-card-plateau",

    rating: 4.7,

    reviews: 184,

    percent: "93%",

    open: "5:00 PM",

    close: "1:00 AM",

    phone: "+2348033333333",

    description:
      "A relaxed premium lounge offering cocktails, music and a comfortable atmosphere for friends and families.",

    gallery: [
      "../images/plateau room.avif",
      "../images/plateu eatery.jpg",
      "../images/plateau eatery.avif",
    ],

    events: [
      {
        title: "Cocktail Night",
        date: "31 July",
        time: "7:00 PM",
      },
    ],
  },

  {
    id: 4,
    section: "recommended",
    slug: "the-rock-lounge",

    title: "The Rock Lounge",

    image: "../images/Net Bar.jpg",

    location: "Rayfield, Jos",

    latitude: 9.8431,
    longitude: 8.8967,

    address: "Rayfield, Jos",

    category: ["Music", "Grill", "Lounge"],

    rating: 4.9,

    reviews: 321,

    percent: "98%",

    open: "5:00 PM",

    close: "2:00 AM",

    phone: "+2348044444444",

    description:
      "A lively venue famous for grilled meals, live music and an energetic nightlife experience.",

    badgeClass: "percentage-badge-cyan",

    gallery: [
      "../images/Net Bar.jpg",
      "../images/Crispan Suites.avif",
      "../images/Grilled Meat.jpg",
    ],

    events: [
      {
        title: "Grill & Groove",
        date: "Every Friday",
        time: "7:30 PM",
      },
    ],
  },

  {
    id: 5,
    section: "recommended",
    slug: "terminus-suya-hub",

    title: "Terminus Suya Hub",

    image: "../images/Terminus Food Hub.jpg",

    location: "Terminus, Jos",

    latitude: 9.9287,
    longitude: 8.8914,

    address: "Terminus Roundabout, Jos",

    category: ["Dining", "Local", "Suya"],

    rating: 4.7,

    reviews: 197,

    percent: "85%",

    open: "12:00 PM",

    close: "12:00 AM",

    phone: "+2348055555555",

    description:
      "Popular local food destination serving freshly grilled suya, barbecue and traditional Nigerian dishes.",

    badgeClass: "percentage-badge-purple",

    showMapButton: true,

    gallery: [
      "../images/Terminus Food Hub.jpg",
      "../images/Grilled Meat.jpg",
      "../images/Suya Festival.jpg",
    ],

    events: [
      {
        title: "Suya Festival",
        date: "10 August",
        time: "6:00 PM",
      },
    ],
  },
  {
    id: 6,
    section: "recommended",
    slug: "chillers-roof-top-bar",

    title: "Chillers Roof Top Bar",

    image:
      "../images/Chillers Roof Top.avif",

    location: "Chillers, Jos",

    latitude: 9.8965,
    longitude: 8.8583,

    address: "Chillers Junction, Jos",

    category: ["Bar", "RoofTop", "Restaurant"],

    rating: 4.9,

    reviews: 250,

    percent: "95%",

    open: "6:00 PM",

    close: "12:00 AM",

    phone: "+234806666666",

    description:
      "Perched above the city, this rooftop lounge combines elegant dining, premium cocktails, and stunning sunset views. It's the ideal spot for date nights, celebrations, or simply unwinding under the stars.",

    badgeClass: "percentage-badge-cyan",

    showMapButton: true,

    gallery: [
      "../images/plateau room.avif",
      "../images/Chillers special.avif",
      "../images/Chillers mocktail.avif",
    ],

    events: [
      {
        title: "Rooftop Sunset Party",
        date: "15 August",
        time: "6:00 PM",
      },
      {
        title: "DJ Vibes Night",
        date: "22 August",
        time: "8:00 PM",
      },
      {
        title: "Cocktail & Jazz Evening",
        date: "29 August",
        time: "7:00 PM",
      },
    ],
  },
];

export default places;
