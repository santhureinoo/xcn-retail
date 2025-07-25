import { Package } from '../types/package';

// Sample data - in a real app, this would come from an API
export const SAMPLE_PACKAGES: Package[] = [
  {
    id: 'mlbb',
    name: 'Mobile Legend Bang Bang',
    description: 'Mobile Legends: Bang Bang is a multiplayer online battle arena (MOBA) game for mobile devices.',
    price: 2.99,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    type: 'weekly',
    duration: 7,
  },
  // {
  //   id: 'weekly-pass-2',
  //   name: 'Weekly Pass Premium',
  //   description: 'Access to premium features for 7 days',
  //   price: 4.99,
  //   currency: 'USD',
  //   imageUrl: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  //   type: 'weekly',
  //   duration: 7,
  //   featured: true,
  // },
  // {
  //   id: 'monthly-pass-1',
  //   name: 'Monthly Pass Basic',
  //   description: 'Access to basic features for 30 days',
  //   price: 9.99,
  //   currency: 'USD',
  //   imageUrl: 'https://images.unsplash.com/photo-1522069213448-443a614da9b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  //   type: 'monthly',
  //   duration: 30,
  // },
  // {
  //   id: 'monthly-pass-2',
  //   name: 'Monthly Pass Premium',
  //   description: 'Access to premium features for 30 days',
  //   price: 14.99,
  //   currency: 'USD',
  //   imageUrl: 'https://images.unsplash.com/photo-1531315630201-bb15abeb1653?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  //   type: 'monthly',
  //   duration: 30,
  //   featured: true,
  //   discount: 15,
  // },
  // {
  //   id: 'diamond-25',
  //   name: 'Diamond Pack 25',
  //   description: '25 diamonds for in-game purchases',
  //   price: 0.99,
  //   currency: 'USD',
  //   imageUrl: 'https://images.unsplash.com/photo-1518687338977-a84d3086a934?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  //   type: 'diamond',
  //   amount: 25,
  // },
  // {
  //   id: 'diamond-50',
  //   name: 'Diamond Pack 50',
  //   description: '50 diamonds for in-game purchases',
  //   price: 1.99,
  //   currency: 'USD',
  //   imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  //   type: 'diamond',
  //   amount: 50,
  // },
  // {
  //   id: 'diamond-100',
  //   name: 'Diamond Pack 100',
  //   description: '100 diamonds for in-game purchases',
  //   price: 3.99,
  //   currency: 'USD',
  //   imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  //   type: 'diamond',
  //   amount: 100,
  // },
  // {
  //   id: 'diamond-500',
  //   name: 'Diamond Pack 500',
  //   description: '500 diamonds for in-game purchases',
  //   price: 19.99,
  //   currency: 'USD',
  //   imageUrl: 'https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  //   type: 'diamond',
  //   amount: 500,
  //   featured: true,
  //   discount: 10,
  // },
  // {
  //   id: 'diamond-1000',
  //   name: 'Diamond Pack 1000',
  //   description: '1000 diamonds for in-game purchases',
  //   price: 39.99,
  //   currency: 'USD',
  //   imageUrl: 'https://images.unsplash.com/photo-1531315630201-bb15abeb1653?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  //   type: 'diamond',
  //   amount: 1000,
  //   featured: true,
  //   discount: 20,
  // },
  // {
  //   id: 'special-1',
  //   name: 'Beginner Bundle',
  //   description: 'Perfect starter pack with 100 diamonds and 7-day pass',
  //   price: 4.99,
  //   currency: 'USD',
  //   imageUrl: 'https://images.unsplash.com/photo-1563050860-f942d9aa6a76?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  //   type: 'special',
  //   featured: true,
  // },
  // {
  //   id: 'special-2',
  //   name: 'Weekend Booster',
  //   description: 'Double rewards for the weekend and 50 diamonds',
  //   price: 3.99,
  //   currency: 'USD',
  //   imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  //   type: 'special',
  // },
];

// Generate more sample data for infinite scroll demonstration
const cdnImageUrls = [
  'https://images.unsplash.com/photo-1518687338977-a84d3086a934?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1560253023-3ec5d502959f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
];

// for (let i = 1; i <= 30; i++) {
//   SAMPLE_PACKAGES.push({
//     id: `diamond-custom-${i}`,
//     name: `Diamond Pack ${25 * i}`,
//     description: `${25 * i} diamonds for in-game purchases`,
//     price: 0.99 * i,
//     currency: 'USD',
//     imageUrl: cdnImageUrls[i % cdnImageUrls.length],
//     type: 'diamond',
//     amount: 25 * i,
//     featured: i % 7 === 0,
//     discount: i % 10 === 0 ? 10 : undefined,
//   });
// }