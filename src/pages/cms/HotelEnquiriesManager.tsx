import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'closed', label: 'Closed' },
];

export default function HotelEnquiriesManager() {
  const [enquiries, setEnquiries] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEnquiries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('hotel_enquiries')
      .select('*')
      .order('submitted_at', { ascending: false });
    if (error) setError(error.message);
    else setEnquiries(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchEnquiries(); }, []);

  const handleStatusChange = async (id: string, status: string) => {
    await supabase.from('hotel_enquiries').update({ status }).eq('id', id);
    setEnquiries(enquiries => enquiries.map(e => e.id === id ? { ...e, status } : e));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Hotel Enquiries</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Submitted</th>
              <th className="p-2 border">Hotel</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Country Code</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Check In</th>
              <th className="p-2 border">Check Out</th>
              <th className="p-2 border">Rooms</th>
              <th className="p-2 border">Message</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map(e => (
              <tr key={e.id} className="border-b">
                <td className="p-2 border">{e.submitted_at ? new Date(e.submitted_at).toLocaleString() : ''}</td>
                <td className="p-2 border">{e.hotel_name}</td>
                <td className="p-2 border">{e.name}</td>
                <td className="p-2 border">{e.email}</td>
                <td className="p-2 border">{e.country_code}</td>
                <td className="p-2 border">{e.phone}</td>
                <td className="p-2 border">{e.check_in}</td>
                <td className="p-2 border">{e.check_out}</td>
                <td className="p-2 border">{Array.isArray(e.rooms) ? e.rooms.map((r, i) => `Room ${i+1}: ${r.guests} guests`).join(', ') : ''}</td>
                <td className="p-2 border max-w-xs truncate" title={e.message}>{e.message}</td>
                <td className="p-2 border">
                  <select
                    value={e.status}
                    onChange={ev => handleStatusChange(e.id, ev.target.value)}
                    className="border rounded px-1 py-0.5"
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 