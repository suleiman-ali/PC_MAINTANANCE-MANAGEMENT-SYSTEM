import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingsAPI } from '../api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getAll();
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    setCancelling(bookingId);
    try {
      await bookingsAPI.cancel(bookingId);
      fetchBookings();
    } catch (err) {
      alert('Failed to cancel booking');
    } finally {
      setCancelling(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'badge-pending',
      confirmed: 'badge-confirmed',
      completed: 'badge-completed',
      cancelled: 'badge-cancelled',
    };
    return statusClasses[status] || 'badge-pending';
  };

  if (loading) {
    return <div className="loading-container"><div className="loading-spinner"></div></div>;
  }

  return (
    <div className="my-bookings-page">
      <div className="page-header flex-between">
        <div>
          <h1 className="page-title">📋 My Bookings</h1>
          <p className="page-subtitle">View and manage your service bookings</p>
        </div>
        <Link to="/services" className="btn btn-primary">
          Book New Service
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3 className="empty-state-title">No Bookings Yet</h3>
          <p>You haven't made any bookings yet. Browse our services to book a PC maintenance appointment.</p>
          <Link to="/services" className="btn btn-primary mt-3">
            Browse Services
          </Link>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-item">
              <div className="booking-info">
                <h3 className="booking-service-name">{booking.service_name}</h3>
                <div className="booking-meta">
                  <span className="booking-meta-item">
                    📅 {formatDate(booking.preferred_date)}
                  </span>
                  <span className="booking-meta-item">
                    💰 {formatPrice(booking.service_price)}
                  </span>
                  <span className="booking-meta-item">
                    📍 {booking.address}
                  </span>
                  <span className="booking-meta-item">
                    📱 {booking.phone}
                  </span>
                </div>
                <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
                  <strong>Problem:</strong> {booking.problem_description}
                </p>
              </div>
              <div className="booking-status">
                <span className={`badge ${getStatusBadge(booking.status)}`}>
                  {booking.status}
                </span>
                <div className="booking-actions">
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      disabled={cancelling === booking.id}
                      className="btn btn-small btn-danger"
                    >
                      {cancelling === booking.id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
