
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Eye, Edit, Trash2, Plus, Star } from 'lucide-react';

interface Hotel {
  id: number;
  name: string;
  location: string;
  rating: number;
  pricePerNight: string;
  status: string;
  description: string;
  amenities: string[];
  city: string;
}

const HotelManager = () => {
  const [hotels, setHotels] = useState<Hotel[]>([
    { id: 1, name: 'Hilton Makkah Convention Hotel', location: 'Makkah', rating: 5, pricePerNight: '$299', status: 'Active', description: 'Luxury hotel near Haram', amenities: ['WiFi', 'Pool', 'Spa'], city: 'makkah' },
    { id: 2, name: 'Al Madinah Holiday Inn', location: 'Madinah', rating: 4, pricePerNight: '$199', status: 'Active', description: 'Comfortable stay in Madinah', amenities: ['WiFi', 'Restaurant'], city: 'madinah' },
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);

  const form = useForm({
    defaultValues: {
      name: '',
      location: '',
      rating: 5,
      pricePerNight: '',
      status: 'Active',
      description: '',
      amenities: '',
      city: 'makkah'
    }
  });

  const onSubmit = (data: any) => {
    const newHotel: Hotel = {
      id: editingHotel ? editingHotel.id : Date.now(),
      name: data.name,
      location: data.location,
      rating: Number(data.rating),
      pricePerNight: data.pricePerNight,
      status: data.status,
      description: data.description,
      amenities: data.amenities.split(',').map((item: string) => item.trim()),
      city: data.city
    };

    if (editingHotel) {
      setHotels(hotels.map(hotel => hotel.id === editingHotel.id ? newHotel : hotel));
    } else {
      setHotels([...hotels, newHotel]);
    }

    setIsDialogOpen(false);
    setEditingHotel(null);
    form.reset();
  };

  const handleEdit = (hotel: Hotel) => {
    setEditingHotel(hotel);
    form.reset({
      name: hotel.name,
      location: hotel.location,
      rating: hotel.rating,
      pricePerNight: hotel.pricePerNight,
      status: hotel.status,
      description: hotel.description,
      amenities: hotel.amenities.join(', '),
      city: hotel.city
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setHotels(hotels.filter(hotel => hotel.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Hotel Management</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingHotel(null); form.reset(); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Hotel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingHotel ? 'Edit Hotel' : 'Add New Hotel'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hotel Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter hotel name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select city" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="makkah">Makkah</SelectItem>
                            <SelectItem value="madinah">Madinah</SelectItem>
                            <SelectItem value="riyadh">Riyadh</SelectItem>
                            <SelectItem value="jeddah">Jeddah</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating</FormLabel>
                        <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select rating" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="3">3 Stars</SelectItem>
                            <SelectItem value="4">4 Stars</SelectItem>
                            <SelectItem value="5">5 Stars</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pricePerNight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price per Night</FormLabel>
                        <FormControl>
                          <Input placeholder="$299" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Hotel description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amenities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amenities (comma separated)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="WiFi, Pool, Spa, Restaurant" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 pt-4">
                  <Button type="submit">
                    {editingHotel ? 'Update Hotel' : 'Create Hotel'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Location</th>
                  <th className="text-left p-2">Rating</th>
                  <th className="text-left p-2">Price/Night</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hotels.map(hotel => (
                  <tr key={hotel.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{hotel.name}</td>
                    <td className="p-2">{hotel.location}</td>
                    <td className="p-2">
                      <div className="flex items-center">
                        {Array.from({ length: hotel.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </td>
                    <td className="p-2">{hotel.pricePerNight}</td>
                    <td className="p-2">
                      <Badge variant={hotel.status === 'Active' ? 'default' : 'secondary'}>
                        {hotel.status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(hotel)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(hotel.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HotelManager;
