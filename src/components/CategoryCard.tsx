import React from 'react';
import { Link } from 'react-router-dom';
import { ProductCategory } from '../types';
import {
  Car,
  Bike,
  Gauge,
  BatteryCharging,
  Server,
  Truck,
  Sun,
  Zap,
  Package,
  ChevronRight,
} from 'lucide-react';

interface CategoryCardProps {
  category: ProductCategory;
  productCount?: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, productCount }) => {
  const getCategoryDetails = (cat: ProductCategory) => {
    switch (cat) {
      case 'Car Batteries':
        return {
          icon: Car,
          description: 'Hatchbacks, Sedans, SUVs & Luxury Cars',
          accent: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        };
      case 'Bike Batteries':
        return {
          icon: Bike,
          description: 'High-cranking maintenance-free bike batteries',
          accent: 'text-blue-600 bg-blue-50 border-blue-100',
        };
      case 'Scooty Batteries':
        return {
          icon: Gauge,
          description: 'Compact VRLA batteries for automatic scooters',
          accent: 'text-teal-600 bg-teal-50 border-teal-100',
        };
      case 'Inverter Batteries':
        return {
          icon: BatteryCharging,
          description: 'Tall tubular deep cycle home backup batteries',
          accent: 'text-amber-600 bg-amber-50 border-amber-100',
        };
      case 'UPS Batteries':
        return {
          icon: Server,
          description: 'Commercial sealed AGM batteries for uninterrupted power',
          accent: 'text-indigo-600 bg-indigo-50 border-indigo-100',
        };
      case 'Truck and Heavy Vehicle Batteries':
        return {
          icon: Truck,
          description: 'Commercial trucks, buses, tractors and cranes',
          accent: 'text-rose-600 bg-rose-50 border-rose-100',
        };
      case 'Solar Batteries':
        return {
          icon: Sun,
          description: 'C10 rated deep-discharge solar tubular batteries',
          accent: 'text-orange-600 bg-orange-50 border-orange-100',
        };
      case 'Inverters':
        return {
          icon: Zap,
          description: 'Pure sine wave smart inverters for home & office',
          accent: 'text-violet-600 bg-violet-50 border-violet-100',
        };
      case 'Other Battery Products':
      default:
        return {
          icon: Package,
          description: 'Trolleys, cables, terminals & custom accessories',
          accent: 'text-slate-700 bg-slate-100 border-slate-200',
        };
    }
  };

  const details = getCategoryDetails(category);
  const Icon = details.icon;

  return (
    <Link
      to={`/products?category=${encodeURIComponent(category)}`}
      className="group relative flex flex-col justify-between p-5 bg-white rounded-xl border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-emerald-500/50 transition-all duration-200 focus:outline-hidden"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${details.accent} group-hover:scale-105 transition-transform duration-200`}>
            <Icon className="w-6 h-6" />
          </div>
          {typeof productCount === 'number' && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
              {productCount} {productCount === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
          {category}
        </h3>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          {details.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-emerald-700 group-hover:text-emerald-800">
        <span>View Products</span>
        <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};

