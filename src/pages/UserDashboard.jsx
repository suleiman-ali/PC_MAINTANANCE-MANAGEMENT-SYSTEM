import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { servicesAPI, bookingsAPI } from '../api';

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalServices: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
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

      setStats({
        totalServices: services.length,
        totalBookings: bookings.length,
        pendingBookings: bookings.filter((b) => b.status === 'pending').length,
        completedBookings: bookings.filter((b) => b.status === 'completed').length,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="loading-spinner"></div></div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-welcome">
        <h1>Welcome, {user?.username}! 👋</h1>
        <p>Manage your PC maintenance bookings and services</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon services">🛠️</div>
          <div className="stat-info">
            <h3>{stats.totalServices}</h3>
            <p>Available Services</p>
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
      </div>

      <div className="grid grid-2 mt-4">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🛠️ Browse Services</h3>
            <p className="card-subtitle">View all available PC maintenance services</p>
          </div>
          <div className="card-body">
            <p>Explore our wide range of PC maintenance services including virus removal, hardware repair, software installation, and more.</p>
          </div>
          <div className="card-footer">
            <Link to="/services" className="btn btn-primary">View Services</Link>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📋 My Bookings</h3>
            <p className="card-subtitle">View and manage your service bookings</p>
          </div>
          <div className="card-body">
            <p>Check the status of your bookings, view history, and book new services.</p>
          </div>
          <div className="card-footer">
            <Link to="/my-bookings" className="btn btn-primary">View Bookings</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
