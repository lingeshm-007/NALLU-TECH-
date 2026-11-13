export type ProductCategory =
  | 'Car Batteries'
  | 'Bike Batteries'
  | 'Scooty Batteries'
  | 'Inverter Batteries'
  | 'UPS Batteries'
  | 'Truck and Heavy Vehicle Batteries'
  | 'Solar Batteries'
  | 'Inverters'
  | 'Other Battery Products';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Car Batteries',
  'Bike Batteries',
  'Scooty Batteries',
  'Inverter Batteries',
  'UPS Batteries',
  'Truck and Heavy Vehicle Batteries',
  'Solar Batteries',
  'Inverters',
  'Other Battery Products',
];

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  model_number: string;
  category: ProductCategory;
  image_url: string;
  price?: number | null; // In INR. If null or undefined, displays "Price on Enquiry"
  description: string;
  specifications: ProductSpecification[];
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ShopSettings {
  shop_name: string;
  tagline: string;
  experience: string;
  phone: string;
  whatsapp: string;
  maps_url: string;
  address: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

