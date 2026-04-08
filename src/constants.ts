import { CalendarMonth, Note } from './types';

export const MONTHS_DATA: Record<string, CalendarMonth> = {
  '2024-01': {
    name: 'January',
    year: 2024,
    heroImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=2070&auto=format&fit=crop',
    heroTitle: 'Republic & Heritage',
    heroSubtitle: 'Volume IV • Issue I • India',
    themeColor: '#FF9933', // Saffron
  },
  '2024-02': {
    name: 'February',
    year: 2024,
    heroImage: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=2070&auto=format&fit=crop',
    heroTitle: 'Vasant & Yellow Fields',
    heroSubtitle: 'Volume IV • Issue II • India',
    themeColor: '#FFD700', // Gold/Yellow
  },
  '2024-03': {
    name: 'March',
    year: 2024,
    heroImage: 'https://images.unsplash.com/photo-1595928642581-f50f4f3453a5?q=80&w=2070&auto=format&fit=crop',
    heroTitle: 'Festival of Colors',
    heroSubtitle: 'Volume IV • Issue III • India',
    themeColor: '#E91E63', // Pink
  },
  '2024-04': {
    name: 'April',
    year: 2024,
    heroImage: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=2070&auto=format&fit=crop',
    heroTitle: 'Harvest & New Year',
    heroSubtitle: 'Volume IV • Issue IV • India',
    themeColor: '#4CAF50', // Green
  },
  '2024-05': {
    name: 'May',
    year: 2024,
    heroImage: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=2070&auto=format&fit=crop',
    heroTitle: 'Summer Heat & Mangoes',
    heroSubtitle: 'Volume IV • Issue V • India',
    themeColor: '#FF5722', // Deep Orange
  },
  '2024-06': {
    name: 'June',
    year: 2024,
    heroImage: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=2070&auto=format&fit=crop',
    heroTitle: 'Monsoon Arrival',
    heroSubtitle: 'Volume IV • Issue VI • India',
    themeColor: '#009688', // Teal
  },
  '2024-07': {
    name: 'July',
    year: 2024,
    heroImage: 'https://images.unsplash.com/photo-1536323760109-ca8c07450053?q=80&w=2070&auto=format&fit=crop',
    heroTitle: 'Mist & Mountains',
    heroSubtitle: 'Volume IV • Issue VII • India',
    themeColor: '#3F51B5', // Indigo
  },
  '2024-08': {
    name: 'August',
    year: 2024,
    heroImage: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=2070&auto=format&fit=crop',
    heroTitle: 'Independence & Freedom',
    heroSubtitle: 'Volume IV • Issue VIII • India',
    themeColor: '#138808', // India Green
  },
  '2024-09': {
    name: 'September',
    year: 2024,
    heroImage: 'https://images.unsplash.com/photo-1561488132-8367d0f882ad?q=80&w=2070&auto=format&fit=crop',
    heroTitle: 'Ganesh Chaturthi',
    heroSubtitle: 'Volume IV • Issue IX • India',
    themeColor: '#D32F2F', // Red
  },
  '2024-10': {
    name: 'October',
    year: 2024,
    heroImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2070&auto=format&fit=crop',
    heroTitle: 'Festival of Lights',
    heroSubtitle: 'Volume IV • Issue X • India',
    themeColor: '#FFC107', // Amber
  },
  '2024-11': {
    name: 'November',
    year: 2024,
    heroImage: 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?q=80&w=2070&auto=format&fit=crop',
    heroTitle: 'Winter Harvest',
    heroSubtitle: 'Volume IV • Issue XI • India',
    themeColor: '#795548', // Brown
  },
  '2024-12': {
    name: 'December',
    year: 2024,
    heroImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop',
    heroTitle: 'Year End Reflections',
    heroSubtitle: 'Volume IV • Issue XII • India',
    themeColor: '#607D8B', // Blue Grey
  },
};

export const INITIAL_NOTES: Note[] = [
  {
    id: '1',
    date: '2024-01-26T00:00:00.000Z',
    content: 'Republic Day Parade: Witness the heritage and strength of the nation.',
    isPinned: true,
    type: 'editorial'
  },
  {
    id: '2',
    date: '2024-01-14T00:00:00.000Z',
    content: 'Makar Sankranti: Kite flying and traditional sweets.',
    type: 'reflection'
  },
  {
    id: '3',
    date: '2024-03-25T00:00:00.000Z',
    content: 'Holi: Celebration of colors and joy with family.',
    type: 'reflection'
  },
];

export const HOLIDAYS: Record<string, string> = {
  '2024-01-01': 'New Year\'s Day',
  '2024-01-14': 'Makar Sankranti',
  '2024-01-26': 'Republic Day',
  '2024-03-08': 'Maha Shivaratri',
  '2024-03-25': 'Holi',
  '2024-04-11': 'Eid-ul-Fitr',
  '2024-04-17': 'Ram Navami',
  '2024-05-23': 'Buddha Purnima',
  '2024-08-15': 'Independence Day',
  '2024-10-02': 'Gandhi Jayanti',
  '2024-10-12': 'Dussehra',
  '2024-10-31': 'Diwali',
  '2024-12-25': 'Christmas',
};
