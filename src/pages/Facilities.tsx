import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Calendar, Clock, Wifi, Coffee, Car, Shield } from 'lucide-react';

import facility1 from '@/assets/facility-1.jpg';
import facility2 from '@/assets/facility-2.jpg';
import facility3 from '@/assets/facility-3.jpg';

interface Facility {
  id: string;
  name: string;
  type: string;
  capacity: number;
  availability: 'available' | 'occupied' | 'maintenance';
  image: string;
  description: string;
  amenities: string[];
  location: string;
  pricePerHour: number;
}

const facilities: Facility[] = [
  {
    id: '1',
    name: 'Executive Conference Room',
    type: 'Conference Room',
    capacity: 12,
    availability: 'available',
    image: facility1,
    description: 'Premium conference room with state-of-the-art AV equipment, perfect for board meetings and client presentations.',
    amenities: ['4K Display', 'Video Conferencing', 'Whiteboard', 'Coffee Service', 'WiFi'],
    location: 'Floor 15, North Wing',
    pricePerHour: 150
  },
  {
    id: '2',
    name: 'Open Collaboration Space',
    type: 'Work Space',
    capacity: 20,
    availability: 'occupied',
    image: facility2,
    description: 'Modern open workspace designed for team collaboration and creative brainstorming sessions.',
    amenities: ['Standing Desks', 'Writable Walls', 'WiFi', 'Phone Booths', 'Kitchenette'],
    location: 'Floor 8, Central Area',
    pricePerHour: 80
  },
  {
    id: '3',
    name: 'Executive Lounge',
    type: 'Lounge',
    capacity: 8,
    availability: 'available',
    image: facility3,
    description: 'Sophisticated lounge area for informal meetings, client entertainment, and networking events.',
    amenities: ['Premium Seating', 'Bar Service', 'WiFi', 'Entertainment System', 'Catering'],
    location: 'Floor 20, Executive Level',
    pricePerHour: 200
  }
];

const availabilityConfig = {
  available: { label: 'Available', color: 'bg-green-500', textColor: 'text-green-700' },
  occupied: { label: 'Occupied', color: 'bg-red-500', textColor: 'text-red-700' },
  maintenance: { label: 'Maintenance', color: 'bg-yellow-500', textColor: 'text-yellow-700' }
};

const amenityIcons: { [key: string]: any } = {
  'WiFi': Wifi,
  'Coffee Service': Coffee,
  'Parking': Car,
  'Security': Shield,
  'Video Conferencing': Users
};

const Facilities = () => {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="glass-card w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MapPin className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Our Facilities</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our premium workspace facilities designed for productivity and collaboration
          </p>
        </motion.div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {facilities.map((facility, index) => (
            <motion.div
              key={facility.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="premium-card overflow-hidden h-full">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={facility.image} 
                    alt={facility.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{facility.name}</CardTitle>
                      <Badge variant="secondary">{facility.type}</Badge>
                    </div>
                    <Badge 
                      className={`${availabilityConfig[facility.availability].color} text-white`}
                    >
                      {availabilityConfig[facility.availability].label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">{facility.description}</p>
                  
                  {/* Facility Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span>{facility.capacity} people</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="truncate">{facility.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>${facility.pricePerHour}/hr</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>Book Now</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h4 className="font-medium mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {facility.amenities.map((amenity) => {
                        const Icon = amenityIcons[amenity] || Wifi;
                        return (
                          <div 
                            key={amenity}
                            className="glass-card px-3 py-1 rounded-lg text-xs flex items-center space-x-1"
                          >
                            <Icon className="h-3 w-3" />
                            <span>{amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    variant={facility.availability === 'available' ? 'premium' : 'secondary'}
                    className="w-full"
                    disabled={facility.availability !== 'available'}
                  >
                    {facility.availability === 'available' ? (
                      <>
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Facility
                      </>
                    ) : facility.availability === 'occupied' ? (
                      'Currently Occupied'
                    ) : (
                      'Under Maintenance'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Booking Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Card className="premium-card bg-gradient-to-br from-primary/5 to-primary-glow/5">
            <CardHeader>
              <CardTitle className="text-center">Facility Booking Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
              <div className="text-center">
                <div className="glass-card w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Operating Hours</h4>
                <p className="text-muted-foreground">24/7 Access Available</p>
              </div>
              <div className="text-center">
                <div className="glass-card w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Advance Booking</h4>
                <p className="text-muted-foreground">Up to 30 days ahead</p>
              </div>
              <div className="text-center">
                <div className="glass-card w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Group Discounts</h4>
                <p className="text-muted-foreground">15% off for 4+ hours</p>
              </div>
              <div className="text-center">
                <div className="glass-card w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Security</h4>
                <p className="text-muted-foreground">24/7 monitored access</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Facilities;