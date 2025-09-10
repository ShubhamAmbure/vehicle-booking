import { useEffect, useState } from "react";
import api from "../api";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cancelId, setCancelId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/bookings");
      setBookings(res.data);
    } catch (err) {
      setError("Failed to fetch bookings");
      console.error('Error fetching bookings:', err);
    }
    setLoading(false);
  }

  async function handleCancel(id) {
    setCancelId(id);
    setError("");
    try {
      await api.delete(`/bookings/${id}`);
      setBookings(bookings.filter(b => b._id !== id));
    } catch (err) {
      setError("Failed to cancel booking");
    }
    setCancelId(null);
  }

  return (
    <div className="bookings-page">
      <h2>My Bookings</h2>
      {loading && <div className="bookings-loading">Loading...</div>}
      {error && <div className="message">{error}</div>}
      {bookings.length === 0 && !loading && <div className="no-bookings">No bookings found.</div>}
      {bookings.length > 0 && (
        <div className="bookings-table-container">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>From</th>
                <th>To</th>
                <th>Start</th>
                <th>End</th>
                <th>Customer</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, idx) => (
                <tr key={b._id} className={idx % 2 === 0 ? 'booking-row-even' : 'booking-row-odd'}>
                  <td>{typeof b.vehicleId === 'object' && b.vehicleId !== null ? b.vehicleId.name : b.vehicleId}</td>
                  <td>{b.fromPincode}</td>
                  <td>{b.toPincode}</td>
                  <td>{new Date(b.startTime).toLocaleString()}</td>
                  <td>{new Date(b.endTime).toLocaleString()}</td>
                  <td>{b.customerId}</td>
                  <td style={{textAlign:'center'}}>
                    <button className="button button-secondary booking-cancel-btn" disabled={cancelId===b._id} onClick={()=>handleCancel(b._id)}>
                      {cancelId===b._id ? "Cancelling..." : "Cancel"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
