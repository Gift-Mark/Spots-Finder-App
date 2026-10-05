import { useState } from 'react';

export function BookingModal({ hotel, onClose }) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(hotel.roomTypes[0].type);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  const handleBooking = (e) => {
    e.preventDefault();
    const bookingDetails = {
      hotel: hotel.name,
      room: selectedRoom,
      checkIn,
      checkOut,
      guestName,
      guestPhone,
    };
    
    // Trigger Paystack / Backend Reservation API
    alert(`Booking initiated for ${guestName} at ${hotel.name}! Check-in: ${checkIn}`);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="booking-modal-content">
        <h3>Reserve Your Stay at {hotel.name}</h3>
        <p>📍 {hotel.address}</p>

        <form onSubmit={handleBooking}>
          <label>Select Room Type</label>
          <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
            {hotel.roomTypes.map((room, idx) => (
              <option key={idx} value={room.type}>
                {room.type} - ₦{room.price.toLocaleString()} / night
              </option>
            ))}
          </select>

          <div className="date-inputs">
            <div>
              <label>Check-In Date</label>
              <input type="date" required value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
            </div>
            <div>
              <label>Check-Out Date</label>
              <input type="date" required value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
            </div>
          </div>

          <label>Full Name</label>
          <input type="text" required placeholder="John Doe" value={guestName} onChange={(e) => setGuestName(e.target.value)} />

          <label>Phone Number (WhatsApp)</label>
          <input type="tel" required placeholder="+234 800 000 0000" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} />

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
            <button type="submit" className="btn-confirm">Confirm Reservation ↗</button>
          </div>
        </form>
      </div>
    </div>
  );
}