import type { DiecastItem, UserProfile } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr-collector-01',
  email: 'swayam@castvault.io',
  handle: 'SwayamGupta',
  displayName: 'Swayam Gupta',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  bio: 'Lead Creator of CastVault. 1:64 JDM collector & 1:18 High-End Resin connoisseur.',
  preferredCurrency: 'USD',
  garageVisibility: 'private',
  shareToken: 'cv_live_9f8a3b12c4e5',
  createdAt: new Date().toISOString()
};

export const SAMPLE_GARAGE_ITEMS: DiecastItem[] = [
  {
    id: 'item-01',
    vehicleMake: 'Nissan',
    vehicleModel: 'Skyline GT-R R34 V-Spec II',
    manufacturerId: 'm-minigt',
    customManufacturer: 'Mini GT',
    scale: '1:64',
    releaseYear: 2023,
    condition: 'Mint in Box',
    purchasePrice: 16.99,
    estimatedValue: 45.00,
    currency: 'USD',
    serialNumber: 'Chassis #042/500',
    notes: 'Bayside Blue paint code TV2. Right hand drive with detailed RB26DETT twin-turbo engine cover.',
    photos: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1000&q=80'
    ],
    isPrimaryPhotoIndex: 0,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 10).toISOString()
  },
  {
    id: 'item-02',
    vehicleMake: 'Porsche',
    vehicleModel: '911 GT3 RS (992)',
    manufacturerId: 'm-autoart',
    customManufacturer: 'AUTOart',
    scale: '1:18',
    releaseYear: 2024,
    condition: 'Mint in Box',
    purchasePrice: 289.00,
    estimatedValue: 340.00,
    currency: 'USD',
    serialNumber: 'SN-ART-992-0198',
    notes: 'Weissach Package in Pyro Red with magnesium forged wheels and active rear DRS wing.',
    photos: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80'
    ],
    isPrimaryPhotoIndex: 0,
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 8).toISOString()
  },
  {
    id: 'item-03',
    vehicleMake: 'Datsun',
    vehicleModel: '510 Pro Street Kaido House',
    manufacturerId: 'm-kaidohouse',
    customManufacturer: 'Kaido House',
    scale: '1:64',
    releaseYear: 2022,
    condition: 'Blister Pack / Carded',
    purchasePrice: 21.99,
    estimatedValue: 55.00,
    currency: 'USD',
    serialNumber: 'KH-001-CHASE',
    notes: 'Designed by Jun Imai. Opening hood reveals detailed twin-carb inline-4 with red valve cover.',
    photos: [
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1000&q=80'
    ],
    isPrimaryPhotoIndex: 0,
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 6).toISOString()
  },
  {
    id: 'item-04',
    vehicleMake: 'Lamborghini',
    vehicleModel: 'Diablo VT 6.0',
    manufacturerId: 'm-kyosho',
    customManufacturer: 'Kyosho',
    scale: '1:18',
    releaseYear: 2021,
    condition: 'Mint in Box',
    purchasePrice: 195.00,
    estimatedValue: 260.00,
    currency: 'USD',
    serialNumber: 'KYO-08342G',
    notes: 'Arancio Atlas (Metallic Orange) with tan leather interior and pop-up headlight mechanism.',
    photos: [
      'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1000&q=80'
    ],
    isPrimaryPhotoIndex: 0,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'item-05',
    vehicleMake: 'Ferrari',
    vehicleModel: 'F40 LM Competizione',
    manufacturerId: 'm-bbr',
    customManufacturer: 'BBR Models',
    scale: '1:18',
    releaseYear: 2023,
    condition: 'Mint in Box',
    purchasePrice: 380.00,
    estimatedValue: 450.00,
    currency: 'USD',
    serialNumber: 'Limited #018/200',
    notes: 'Resin masterpiece on carbon display plinth. Ensamble 24h Le Mans spec with sliding Lexan windows.',
    photos: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1000&q=80'
    ],
    isPrimaryPhotoIndex: 0,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'item-06',
    vehicleMake: 'Hot Wheels RLC',
    vehicleModel: '1972 Skyline H/T 2000GT-R',
    manufacturerId: 'm-hotwheels',
    customManufacturer: 'Hot Wheels',
    scale: '1:64',
    releaseYear: 2022,
    condition: 'Blister Pack / Carded',
    purchasePrice: 30.00,
    estimatedValue: 85.00,
    currency: 'USD',
    serialNumber: 'RLC-2022-14920',
    notes: 'Spectraflame Shadow Chrome with Real Riders 8-spoke wheels and acrylic protective blister.',
    photos: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80'
    ],
    isPrimaryPhotoIndex: 0,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'item-07',
    vehicleMake: 'Ford',
    vehicleModel: 'GT40 MK II #2 (1966 Le Mans Winner)',
    manufacturerId: 'm-spark',
    customManufacturer: 'Spark Models',
    scale: '1:43',
    releaseYear: 2020,
    condition: 'Mint in Box',
    purchasePrice: 75.00,
    estimatedValue: 110.00,
    currency: 'USD',
    serialNumber: 'SPK-LM1966-02',
    notes: 'Bruce McLaren & Chris Amon winning chassis in matte black with white racing stripes.',
    photos: [
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1000&q=80'
    ],
    isPrimaryPhotoIndex: 0,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];
