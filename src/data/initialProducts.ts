import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-car-1',
    name: 'Amaron PRO DIN65 Car Battery',
    brand: 'Amaron',
    model_number: 'AAM-PR-0DIN65',
    category: 'Car Batteries',
    image_url: '/images/products/car-amaron.jpg',
    price: 7499,
    description: 'High performance zero-maintenance car battery engineered with patented Silven X alloy technology for extreme heat resistance and long service life.',
    specifications: [
      { key: 'Capacity', value: '65 Ah' },
      { key: 'Voltage', value: '12V' },
      { key: 'Warranty', value: '66 Months (36F + 30P)' },
      { key: 'Technology', value: 'Silven X Alloy' },
      { key: 'Maintenance', value: 'Zero Maintenance' }
    ],
    is_available: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-car-2',
    name: 'Exide Mileage FML0-ML38B20R Car Battery',
    brand: 'Exide',
    model_number: 'ML38B20R',
    category: 'Car Batteries',
    image_url: '/images/products/car-exide.jpg',
    price: 4500,
    description: 'Robust automotive battery specially formulated with Magic Eye indicator and spill-resistant design for hatchbacks and sedans.',
    specifications: [
      { key: 'Capacity', value: '35 Ah' },
      { key: 'Voltage', value: '12V' },
      { key: 'Warranty', value: '55 Months (30F + 25P)' },
      { key: 'Indicator', value: 'Magic Eye' },
      { key: 'Fitment', value: 'Petrol Hatchbacks & Compact Sedans' }
    ],
    is_available: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-bike-1',
    name: 'Exide Xplore 12XL5L-B Two-Wheeler Battery',
    brand: 'Exide',
    model_number: '12XL5L-B',
    category: 'Bike Batteries',
    image_url: '/images/products/superbike-exide.jpg',
    price: 1350,
    description: 'VRLA maintenance-free motorcycle battery designed with AGM technology to withstand high vibrations and deliver quick self-starts.',
    specifications: [
      { key: 'Capacity', value: '5 Ah' },
      { key: 'Voltage', value: '12V' },
      { key: 'Warranty', value: '48 Months (24F + 24P)' },
      { key: 'Type', value: 'VRLA / AGM Sealed' },
      { key: 'Self-Start', value: 'Instant Cranking Power' }
    ],
    is_available: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-scooty-1',
    name: 'Amaron Pro Rider AP-BTZ5L Scooty Battery',
    brand: 'Amaron',
    model_number: 'AP-BTZ5L',
    category: 'Scooty Batteries',
    image_url: '/images/products/scooty-amaron.jpg',
    price: 1299,
    description: 'Maintenance-free battery custom-crafted for modern automatic scooters including Honda Activa, TVS Jupiter, and Suzuki Access.',
    specifications: [
      { key: 'Capacity', value: '5 Ah' },
      { key: 'Voltage', value: '12V' },
      { key: 'Warranty', value: '48 Months' },
      { key: 'Leak-Proof', value: 'Factory Activated Sealed VRLA' },
      { key: 'Compatible Models', value: 'Activa, Jupiter, Access, Pleasure' }
    ],
    is_available: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-inv-bat-1',
    name: 'Luminous Red Charge RC 18000 Tubular Battery',
    brand: 'Luminous',
    model_number: 'RC 18000',
    category: 'Inverter Batteries',
    image_url: '/images/products/inverter-battery-luminous.jpg',
    price: 14800,
    description: 'Tall tubular inverter battery designed with rugged spine construction and balanced alloy composition for extended power outages.',
    specifications: [
      { key: 'Capacity', value: '150 Ah' },
      { key: 'Voltage', value: '12V' },
      { key: 'Warranty', value: '36 Months (18F + 18P)' },
      { key: 'Battery Type', value: 'Tall Tubular' },
      { key: 'Electrolyte Volume', value: 'High Backup Capacity' }
    ],
    is_available: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-inv-bat-2',
    name: 'Exide Inva Tubular IT500 Plus 150Ah',
    brand: 'Exide',
    model_number: 'IT500 Plus',
    category: 'Inverter Batteries',
    image_url: '/images/products/inverter-battery-exide.jpg',
    price: 16500,
    description: 'Premium tall tubular deep-cycle battery built to withstand frequent and prolonged power cuts with high charge acceptance rate.',
    specifications: [
      { key: 'Capacity', value: '150 Ah' },
      { key: 'Voltage', value: '12V' },
      { key: 'Warranty', value: '66 Months (48F + 18P)' },
      { key: 'Technology', value: 'Tubular Plate Technology' },
      { key: 'Life Expectancy', value: 'Long Deep Cycle Durability' }
    ],
    is_available: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-ups-bat-1',
    name: 'Exide Powersafe Plus EP 12-12 VRLA UPS Battery',
    brand: 'Exide Powersafe',
    model_number: 'EP 12-12',
    category: 'UPS Batteries',
    image_url: '/images/products/ups-battery.jpg',
    price: 2150,
    description: 'Sealed lead acid AGM battery for online and offline UPS systems, EPABX, emergency lighting, and critical telecom equipment.',
    specifications: [
      { key: 'Capacity', value: '12 Ah' },
      { key: 'Voltage', value: '12V' },
      { key: 'Warranty', value: '24 Months' },
      { key: 'Design', value: 'Sealed VRLA AGM' },
      { key: 'Application', value: 'Commercial UPS & Backup' }
    ],
    is_available: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-truck-1',
    name: 'Exide Jai Kisan / Heavy Duty HD-100 Truck Battery',
    brand: 'Exide',
    model_number: 'HD-100',
    category: 'Truck and Heavy Vehicle Batteries',
    image_url: '/images/products/truck-battery.jpg',
    price: null, // Price on enquiry
    description: 'Heavy duty commercial vehicle battery built to endure extreme vibrations, heavy cranking current, and challenging transport environments.',
    specifications: [
      { key: 'Capacity', value: '100 Ah' },
      { key: 'Voltage', value: '12V' },
      { key: 'Warranty', value: '36 Months' },
      { key: 'Heavy Vibration Proof', value: 'Reinforced Polypropylene Case' },
      { key: 'Application', value: 'Trucks, Buses, Tractors, Cranes' }
    ],
    is_available: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-solar-1',
    name: 'Luminous Solar Tubular Battery LPT12150H 150Ah',
    brand: 'Luminous Solar',
    model_number: 'LPT12150H',
    category: 'Solar Batteries',
    image_url: '/images/products/solar-battery.jpg',
    price: 17200,
    description: 'Specialised high efficiency C10 rated solar tubular battery designed for cyclical deep discharges in off-grid and hybrid solar installations.',
    specifications: [
      { key: 'Capacity', value: '150 Ah (C10 Rating)' },
      { key: 'Voltage', value: '12V' },
      { key: 'Warranty', value: '60 Months' },
      { key: 'Discharge Cycles', value: '1500+ Cycles at 80% DOD' },
      { key: 'Application', value: 'Solar Rooftop & Inverter Backup' }
    ],
    is_available: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-inv-1',
    name: 'Luminous Zelio+ 1100 Pure Sine Wave Inverter',
    brand: 'Luminous',
    model_number: 'Zelio+ 1100',
    category: 'Inverters',
    image_url: '/images/products/inverter-luminous.jpg',
    price: 6850,
    description: 'Smart pure sine wave inverter with LED display showing backup time in hours & minutes, battery water level reminder, and bypass switch.',
    specifications: [
      { key: 'Capacity / VA', value: '900 VA' },
      { key: 'Rated Output Power', value: '756 Watts' },
      { key: 'Waveform', value: 'Pure Sine Wave' },
      { key: 'Warranty', value: '24 Months' },
      { key: 'Display', value: 'Smart LED Display with Remaining Time' }
    ],
    is_available: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-inv-2',
    name: 'Microtek Luxe 1400 Pure Sine Wave Inverter',
    brand: 'Microtek',
    model_number: 'Luxe 1400',
    category: 'Inverters',
    image_url: '/images/products/inverter-microtek.jpg',
    price: 7600,
    description: 'Modern aesthetic pure sine wave home UPS featuring micro-controller based intelligent multistage battery charging and overload protection.',
    specifications: [
      { key: 'Capacity / VA', value: '1100 VA' },
      { key: 'Rated Output Power', value: '924 Watts' },
      { key: 'Waveform', value: 'Pure Sine Wave' },
      { key: 'Warranty', value: '24 Months' },
      { key: 'Technology', value: 'DSP Based Intelli-Pure Sine Wave' }
    ],
    is_available: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-other-1',
    name: 'Heavy Duty Modular Dual Battery Trolley / Stand',
    brand: 'NALLU TECH Essentials',
    model_number: 'NT-TR-02',
    category: 'Other Battery Products',
    image_url: '/images/products/battery-trolley.jpg',
    price: 1850,
    description: 'Sturdy acid-proof composite trolley with castor wheels designed for neat housing of inverter and tubular battery setup with ventilation.',
    specifications: [
      { key: 'Material', value: 'Acid Resistant Reinforced Polymer' },
      { key: 'Mobility', value: '5 Heavy Duty Castor Wheels' },
      { key: 'Compatibility', value: 'Single / Double Tubular Batteries' },
      { key: 'Ventilation', value: 'Rear and Side Air Slits' }
    ],
    is_available: true,
    created_at: new Date().toISOString()
  }
];
