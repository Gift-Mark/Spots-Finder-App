const josMuseumImage = '/images/Jos Museum.jpg';
const nokImage = '/images/Nok.jpg';
const riyomRockImage = '/images/Riyom-Rock-2-768x513.jpg';
const nzemBeromImage = '/images/nzem berom.jpg';
const motnaImage = '/images/MOTNA.jpg';

export const heritageItems = [
  {
    id: 'jos-museum',
    title: 'Jos National Museum',
    type: 'featured',
    category: 'Museum',
    rating: '4.9',
    ratingLabel: 'Heritage Rating',
    description:
      'One of the oldest and most important museums in Nigeria, housing significant Nok terracotta artifacts and a vast collection of traditional...',
    image: josMuseumImage,
    link: '/culture/jos-museum',
    icon: '🏛️',
    mapCoords: { top: '40%', left: '53%' },
  },
  {
    id: 'nok-terracottas',
    title: 'The Nok Terracottas',
    type: 'artifact',
    category: 'Artifacts',
    description:
      'Discover the enigmatic clay figures that date back to 500 BC, representing one of the earliest known sculptural traditions in...',
    subtext: 'Museum Gallery',
    image: '/images/Nok.jpg',
    link: '/culture/nok-terracottas',
    icon: '🏺',
    mapCoords: { top: '34%', left: '46%' },
  },
  {
    id: 'riyom-rock',
    title: 'Riyom Rock',
    type: 'card',
    category: 'Historical Site',
    description:
      'A natural wonder and historical landmark that perfectly resembles the map of Plateau state, standing as a testament to geologic...',
    location: 'Riyom Local Govt',
    image: '/images/Riyom Rock.jpg',
    link: '/culture/riyom-rock',
    icon: '⛰️',
    mapCoords: { top: '59%', left: '33%' },
  },
  {
    id: 'nzem-berom',
    title: 'Nzem Berom',
    type: 'card',
    category: 'Traditional Festival',
    description:
      "Experience the vibrant colors, music, and dance of the Berom people's annual cultural festival, celebrating harvest and heritage.",
    date: 'Coming in May',
    image: nzemBeromImage,
    link: '/culture/nzem-berom',
    icon: '🎭',
    mapCoords: { top: '55%', left: '68%' },
  },
  {
    id: 'motna',
    title: 'MOTNA',
    type: 'card',
    category: 'Architecture',
    description:
      'Wander through full-scale replicas of major Nigerian architectural styles, from the Katsina Palace to traditional Mbari houses.',
    location: 'Museum Complex',
    image: '/images/MOTNA.jpg',
    link: '/culture/motna',
    icon: '🏘️',
    mapCoords: { top: '66%', left: '50%' },
  },
];