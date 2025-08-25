# Operations & Service Delivery Management System

## Overview

The Operations Management System provides comprehensive tracking and management of vendor mapping, confirmation, and service delivery for all bookings in the Marhaba Haji application. This system ensures that every booking is properly tracked from vendor assignment to service delivery completion.

## Key Features

### 1. Vendor Management
- **Vendor Mapping**: Track when vendors are assigned to bookings
- **Vendor Confirmation**: Monitor vendor confirmation status
- **Vendor Information**: Store vendor contact details and notes
- **Priority Levels**: Set urgency levels for different bookings
- **Status Tracking**: Real-time status updates (not_mapped → mapped → confirmed → rejected)

### 2. Service Delivery Tracking
- **Delivery Status**: Track service delivery progress
- **Due Dates**: Set and monitor delivery deadlines
- **Delivery Confirmation**: Record delivery completion details
- **Overdue Alerts**: Identify delayed deliveries
- **Progress Tracking**: Visual progress indicators for each service

### 3. Operations Dashboard
- **Real-time Metrics**: View key performance indicators
- **Priority Alerts**: Highlight urgent actions required
- **Progress Tracking**: Visual progress indicators for each service
- **Filtering & Search**: Find specific bookings quickly

## Database Schema

### Core Tables

#### `orders` table enhancements:
```sql
vendor_status_json JSONB DEFAULT '{}'
service_delivery_json JSONB DEFAULT '{}'
operations_notes TEXT
priority_level TEXT DEFAULT 'low'
assigned_operator_id UUID
last_operation_update TIMESTAMP
```

#### `operations_tracking` table:
```sql
booking_id UUID
service_type TEXT
vendor_status JSONB
service_delivery_status JSONB
operations_notes TEXT
priority_level TEXT
assigned_operator_id UUID
```

#### `operations_audit_log` table:
```sql
booking_id UUID
service_type TEXT
action_type TEXT
previous_status JSONB
new_status JSONB
operator_id UUID
notes TEXT
```

## JSON Structure Examples

### Vendor Status JSON
```json
{
  "flight": {
    "vendor_name": "Saudi Airlines",
    "vendor_contact": "+966-123456789",
    "vendor_email": "bookings@saudiairlines.com",
    "mapped_date": "2024-01-16",
    "confirmed_date": "2024-01-18",
    "confirmation_status": "confirmed",
    "notes": "Flight confirmed with seat allocation",
    "priority_level": "medium"
  },
  "hotel": {
    "vendor_name": "Hilton Suites Makkah",
    "vendor_contact": "+966-123456790",
    "vendor_email": "reservations@hiltonmakkah.com",
    "mapped_date": "2024-01-17",
    "confirmed_date": "2024-01-19",
    "confirmation_status": "confirmed",
    "notes": "Hotel rooms confirmed and allocated",
    "priority_level": "medium"
  }
}
```

### Service Delivery JSON
```json
{
  "flight": {
    "service_delivered": true,
    "delivery_date": "2024-03-15",
    "due_date": "2024-03-15",
    "delivery_notes": "Flight departed on time",
    "delivery_confirmation": "Boarding passes issued",
    "delivery_status": "delivered"
  },
  "hotel": {
    "service_delivered": true,
    "delivery_date": "2024-03-15",
    "due_date": "2024-03-15",
    "delivery_notes": "Hotel check-in completed",
    "delivery_confirmation": "Room keys provided",
    "delivery_status": "delivered"
  }
}
```

## Usage Guide

### 1. Accessing Operations Management
- Navigate to the Control Panel
- Click on "Bookings Manager"
- The enhanced interface now includes vendor tracking and service delivery columns

### 2. Managing Vendor Status
1. Click the "User Check" icon (👤) in the Actions column
2. Fill in vendor details:
   - Vendor Name
   - Vendor Contact
   - Vendor Email
   - Mapped Date
   - Confirmation Status
   - Priority Level
   - Notes
3. Click "Update Vendor Status"

### 3. Managing Service Delivery
1. Click the "Truck" icon (🚚) in the Actions column
2. Fill in delivery details:
   - Due Date
   - Delivery Status
   - Service Delivered (Yes/No)
   - Delivery Date (if delivered)
   - Delivery Notes
   - Delivery Confirmation
3. Click "Update Delivery Status"

### 4. Understanding Status Indicators

#### Vendor Status Colors:
- 🟢 **Green**: Confirmed
- 🟡 **Yellow**: Mapped/Pending
- 🔴 **Red**: Not Mapped/Rejected

#### Delivery Status Colors:
- 🟢 **Green**: Delivered
- 🟡 **Yellow**: In Progress/Pending
- 🔴 **Red**: Overdue

#### Priority Levels:
- 🟢 **Green**: Low
- 🟡 **Yellow**: Medium
- 🟠 **Orange**: High
- 🔴 **Red**: Urgent

## Workflow Process

### 1. Booking Creation
When a booking is created, the system automatically:
- Sets initial vendor status to "not_mapped"
- Sets initial delivery status to "pending"
- Assigns default priority level "low"

### 2. Vendor Mapping Process
1. **Not Mapped** → Operator assigns vendor
2. **Mapped** → Vendor is assigned but not confirmed
3. **Confirmed** → Vendor confirms the booking
4. **Rejected** → Vendor rejects the booking

### 3. Service Delivery Process
1. **Pending** → Service not yet started
2. **In Progress** → Service is being delivered
3. **Delivered** → Service completed successfully
4. **Overdue** → Service past due date

## API Integration

### Update Vendor Status
```typescript
const updateVendorStatus = async (bookingId: string, serviceType: string, vendorStatus: VendorStatus) => {
  const { data, error } = await supabase
    .from('orders')
    .update({
      vendor_status_json: {
        ...existingVendorStatus,
        [serviceType]: vendorStatus
      },
      last_operation_update: new Date().toISOString()
    })
    .eq('id', bookingId);
};
```

### Update Service Delivery
```typescript
const updateServiceDelivery = async (bookingId: string, serviceType: string, deliveryStatus: ServiceDeliveryStatus) => {
  const { data, error } = await supabase
    .from('orders')
    .update({
      service_delivery_json: {
        ...existingDeliveryStatus,
        [serviceType]: deliveryStatus
      },
      last_operation_update: new Date().toISOString()
    })
    .eq('id', bookingId);
};
```

## Monitoring & Alerts

### Key Metrics to Monitor:
1. **Pending Vendor Mapping**: Bookings without assigned vendors
2. **Pending Confirmation**: Vendors mapped but not confirmed
3. **Overdue Deliveries**: Services past due date
4. **Urgent Bookings**: High priority bookings requiring attention

### Alert Triggers:
- Vendor not mapped within 24 hours of booking
- Vendor not confirmed within 48 hours of mapping
- Service delivery overdue
- High priority bookings without action

## Best Practices

### 1. Vendor Management
- Always map vendors within 24 hours of booking creation
- Set appropriate priority levels based on travel dates
- Maintain detailed notes for each vendor interaction
- Follow up on pending confirmations regularly

### 2. Service Delivery
- Set realistic due dates for each service
- Update delivery status promptly when services are completed
- Document delivery confirmations with proof
- Monitor overdue services daily

### 3. Communication
- Use the notes field to document all interactions
- Update status immediately after any changes
- Communicate with customers about delivery progress
- Escalate urgent issues to management

## Troubleshooting

### Common Issues:

1. **Vendor Status Not Updating**
   - Check if the booking ID is correct
   - Verify the service type matches the expected format
   - Ensure all required fields are filled

2. **Delivery Status Issues**
   - Confirm the due date is set correctly
   - Check if the delivery date is after the due date
   - Verify the delivery confirmation details

3. **Priority Level Not Reflecting**
   - Check the priority level validation
   - Ensure the booking has the correct priority assigned
   - Verify the UI is displaying the correct priority

## Future Enhancements

### Planned Features:
1. **Automated Notifications**: Email/SMS alerts for status changes
2. **Vendor Portal**: Direct vendor access for status updates
3. **Mobile App**: Operations management on mobile devices
4. **Advanced Analytics**: Detailed reporting and insights
5. **Integration APIs**: Connect with vendor systems directly

### Performance Optimizations:
1. **Caching**: Cache frequently accessed booking data
2. **Indexing**: Optimize database queries for large datasets
3. **Real-time Updates**: WebSocket connections for live updates
4. **Batch Operations**: Bulk status updates for efficiency

## Support

For technical support or questions about the Operations Management System:
- Check the system logs for error messages
- Review the audit log for recent changes
- Contact the development team for complex issues
- Refer to this documentation for common solutions
