
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  Plane,
  Star,
  CheckCircle,
  Users,
  MapPin,
  Landmark,
} from 'lucide-react';
import { format } from 'date-fns';
import { useCurrency } from '../contexts/CurrencyContext';
import { convertFromINR } from '@/lib/utils';

interface HajjPackageCardProps {
  pkg: any;
}

const HajjPackageCard = ({ pkg }: HajjPackageCardProps) => {
  const { currency } = useCurrency();
  
  const inclusionsToShow = (pkg.inclusions || []).slice(0, 3);
  const moreInclusions = (pkg.inclusions || []).length - inclusionsToShow.length;
  
  // Parse prices from JSON string
  let parsedPrice = 0;
  try {
    const prices = typeof pkg.prices === 'string' ? JSON.parse(pkg.prices) : pkg.prices;
    parsedPrice = parseInt(prices?.sharing?.adult || '0');
  } catch (error) {
    console.error('Error parsing price:', error);
  }
  
  const { value, symbol } = convertFromINR(parsedPrice, currency);
  
  const getPackageCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'premium':
      case 'vip':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'luxury':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'family':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'youth':
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'senior':
        return 'bg-gradient-to-r from-indigo-500 to-purple-500';
      case 'economy':
      case 'budget':
        return 'bg-gradient-to-r from-gray-500 to-slate-600';
      default:
        return 'bg-gradient-to-r from-emerald-500 to-teal-600';
    }
  };

  return (
    <Card className="group relative h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white rounded-2xl">
      {/* Image Section */}
      <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden">
        <img
          src={pkg.featured_image || '/public/placeholder.svg'}
          alt={pkg.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <Badge className="bg-emerald-600/90 text-white backdrop-blur-sm shadow-lg px-2 py-1 text-xs font-bold">
              Hajj 2025
            </Badge>
            {pkg.package_category && (
              <Badge className={`${getPackageCategoryColor(pkg.package_category)} text-white shadow-lg px-2 py-1 text-xs font-bold`}>
                {pkg.package_category}
              </Badge>
            )}
          </div>
          
          {/* Departure city */}
          {pkg.departure_city && (
            <Badge className="bg-blue-600/90 text-white backdrop-blur-sm shadow-lg px-2 py-1 text-xs font-bold flex items-center gap-1">
              <Plane className="w-3 h-3" />
              {pkg.departure_city}
            </Badge>
          )}
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <Badge className="bg-white/90 text-emerald-700 border border-white/20 shadow-lg px-2 py-1 text-xs font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {pkg.duration}
          </Badge>
          
          {pkg.available_spots && pkg.available_spots <= 10 && (
            <Badge className="bg-red-500/90 text-white shadow-lg px-2 py-1 text-xs font-bold animate-pulse">
              Only {pkg.available_spots} left!
            </Badge>
          )}
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-4 flex flex-col h-full">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-emerald-600 transition-colors">
            {pkg.name}
          </h3>
          
          {/* Date and Maktab info */}
          <div className="flex flex-wrap gap-2 mb-2">
            {pkg.departure_date && (
              <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50 text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                {format(new Date(pkg.departure_date), 'dd MMM yyyy')}
              </Badge>
            )}
            {pkg.maktab_category && (
              <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50 text-xs">
                Maktab {pkg.maktab_category}
              </Badge>
            )}
          </div>
        </div>

        {/* Hotels info */}
        {(pkg.makkah_hotel_name || pkg.madinah_hotel_name) && (
          <div className="mb-3 space-y-1">
            {pkg.makkah_hotel_name && (
              <div className="flex items-center text-xs text-gray-600 bg-gray-50 rounded-lg px-2 py-1">
                <Landmark className="w-3 h-3 mr-1 text-emerald-500 flex-shrink-0" />
                <span className="truncate">{pkg.makkah_hotel_name} ({pkg.makkah_hotel_category})</span>
              </div>
            )}
            {pkg.madinah_hotel_name && (
              <div className="flex items-center text-xs text-gray-600 bg-gray-50 rounded-lg px-2 py-1">
                <Landmark className="w-3 h-3 mr-1 text-emerald-500 flex-shrink-0" />
                <span className="truncate">{pkg.madinah_hotel_name} ({pkg.madinah_hotel_category})</span>
              </div>
            )}
          </div>
        )}

        {/* Inclusions */}
        <div className="mb-4 flex-1">
          <div className="flex flex-wrap gap-1">
            {inclusionsToShow.map((inclusion: string, idx: number) => (
              <Badge
                key={idx}
                variant="outline"
                className="border-emerald-100 text-emerald-700 bg-emerald-50 text-xs px-2 py-1 flex items-center gap-1"
              >
                <CheckCircle className="w-3 h-3" />
                {inclusion}
              </Badge>
            ))}
            {moreInclusions > 0 && (
              <Badge variant="outline" className="border-gray-200 text-gray-600 bg-gray-50 text-xs px-2 py-1">
                +{moreInclusions} more
              </Badge>
            )}
          </div>
        </div>

        {/* Price and CTA */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-lg font-bold text-emerald-600">
                {symbol}{value.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">per person (sharing)</div>
            </div>
            
            {pkg.max_capacity && (
              <div className="text-right">
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Max {pkg.max_capacity}
                </div>
                {pkg.available_spots && (
                  <div className="text-xs text-emerald-600 font-medium">
                    {pkg.available_spots} spots left
                  </div>
                )}
              </div>
            )}
          </div>
          
          <Link to={`/hajj-packages/${pkg.id}`}>
            <Button 
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg"
              size="sm"
            >
              View Package Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default HajjPackageCard;
