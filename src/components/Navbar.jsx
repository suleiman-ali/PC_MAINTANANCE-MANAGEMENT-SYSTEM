import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo">🖥️</div>
          <span className="navbar-title">PC Maintenance</span>
        </Link>

        <div className="navbar-nav">
          {isAdmin ? (
            <>
              <Link 
                to="/admin" 
                className={`navbar-link ${location.pathname === '/admin' ? 'active' : ''}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/admin/services" 
                className={`navbar-link ${location.pathname === '/admin/services' ? 'active' : ''}`}
              >
                Services
              </Link>
              <Link 
                to="/admin/bookings" 
                className={`navbar-link ${location.pathname === '/admin/bookings' ? 'active' : ''}`}
              >
                Bookings
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/dashboard" 
                className={`navbar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/services" 
                className={`navbar-link ${location.pathname === '/services' ? 'active' : ''}`}
              >
                Services
              </Link>
              <Link 
                to="/my-bookings" 
                className={`navbar-link ${location.pathname === '/my-bookings' ? 'active' : ''}`}
              >
                My Bookings
              </Link>
              <Link 
                to="/profile" 
                className={`navbar-link ${location.pathname === '/profile' ? 'active' : ''}`}
              >
                Profile
              </Link>
            </>
          )}
        </div>

        <div className="navbar-user">
          <span className="navbar-username">{user.username}</span>
          <button onClick={handleLogout} className="btn btn-small btn-secondary navbar-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
