import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { servicesAPI, bookingsAPI } from '../api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalServices: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [servicesRes, bookingsRes] = await Promise.all([
        servicesAPI.getAll(),
        bookingsAPI.getAll(),
      ]);

      const services = servicesRes.data;
      const bookings = bookingsRes.data;

      const completedBookings = bookings.filter((b) => b.status === 'completed');
      const revenue = completedBookings.reduce((sum, b) => sum + parseFloat(b.service_price || 0), 0);

      setStats({
        totalServices: services.length,
        totalBookings: bookings.length,
        pendingBookings: bookings.filter((b) => b.status === 'pending').length,
        completedBookings: completedBookings.length,
        revenue: revenue,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return <div className="loading-container"><div className="loading-spinner"></div></div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-welcome">
        <h1>Welcome, Admin {user?.username}! 👋</h1>
        <p>Manage your PC maintenance business</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon services">🛠️</div>
          <div className="stat-info">
            <h3>{stats.totalServices}</h3>
            <p>Total Services</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bookings">📋</div>
          <div className="stat-info">
            <h3>{stats.totalBookings}</h3>
            <p>Total Bookings</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending">⏳</div>
          <div className="stat-info">
            <h3>{stats.pendingBookings}</h3>
            <p>Pending Bookings</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon completed">✅</div>
          <div className="stat-info">
            <h3>{stats.completedBookings}</h3>
            <p>Completed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon services">💰</div>
          <div className="stat-info">
            <h3>{formatPrice(stats.revenue)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      <div className="grid grid-3 mt-4">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🛠️ Manage Services</h3>
            <p className="card-subtitle">Add, edit, or remove services</p>
          </div>
          <div className="card-body">
            <p>Create and manage the PC maintenance services you offer to customers.</p>
          </div>
          <div className="card-footer">
            <Link to="/admin/services" className="btn btn-primary">Manage Services</Link>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📋 All Bookings</h3>
            <p className="card-subtitle">View and manage customer bookings</p>
          </div>
          <div className="card-body">
            <p>View all customer bookings, update status, and see customer details.</p>
          </div>
          <div className="card-footer">
            <Link to="/admin/bookings" className="btn btn-primary">View Bookings</Link>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📊 Statistics</h3>
            <p className="card-subtitle">Business overview</p>
          </div>
          <div className="card-body">
            <p>You have {stats.pendingBookings} pending bookings that need attention.</p>
          </div>
          <div className="card-footer">
            <Link to="/admin/bookings" className="btn btn-secondary">View Details</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
