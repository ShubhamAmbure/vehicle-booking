(async () => {
  try {
    const base = 'http://localhost:4000/api';

    console.log('Creating vehicle...');
    let res = await fetch(base + '/vehicles', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Truck A', capacityKg: 1000, tyres: 6 }),
    });
    const vehicle = await res.json();
    console.log('Created vehicle:', vehicle);

    const params = new URLSearchParams({
      capacityRequired: '500',
      fromPincode: '400001',
      toPincode: '400050',
      startTime: '2025-11-25T10:00',
    });

    console.log('Querying available vehicles...');
    res = await fetch(base + '/vehicles/available?' + params.toString());
    const avail = await res.json();
    console.log('Available response:', avail);

    if (avail.vehicles && avail.vehicles.length > 0) {
      const vid = avail.vehicles[0]._id;
      console.log('Creating booking for vehicle:', vid);
      res = await fetch(base + '/bookings', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          vehicleId: vid,
          fromPincode: '400001',
          toPincode: '400050',
          startTime: '2025-11-25T10:00',
          customerId: 'cust123',
        }),
      });
      const booking = await res.json();
      console.log('Booking created:', booking);
    } else {
      console.log('No available vehicles to book');
    }
  } catch (err) {
    console.error('Smoke test failed:', err);
    process.exit(1);
  }
})();
