import { useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../CSS/Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // The session lives in localStorage, so the user is derived during render (recomputed
  // on route change) instead of copied into state by an effect, which cascaded renders.
  const user = useMemo(() => {
    const storedUser = localStorage.getItem('user') || localStorage.getItem('jos_pulse_user');
    const token = localStorage.getItem('token') || localStorage.getItem('jos_pulse_token');
    if (!storedUser || !token) return null;
    try {
      return JSON.parse(storedUser);
    } catch {
      return { firstName: 'Account' };
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('jos_pulse_token');
    localStorage.removeItem('user');
    localStorage.removeItem('jos_pulse_user');
    navigate('/login');
  };

  const navLinks = [
    { name: 'Explore', path: '/explore' },
    { name: 'Stays', path: '/stays' },
    { name: 'Culture & Heritage', path: '/culture' },
    { name: 'Flights', path: '/flights' },
    { name: 'Restaurants', path: '/DiningPage' },
    { name: 'Events', path: '/events' },
  ];

  return (
    <header className="jp-header">
      <div className="jp-header-container">
        <Link to="/" className="jp-brand-logo">
          <span className="jp-logo-text">
            Jos <span className="jp-logo-accent">Pulse</span>
          </span>
        </Link>

        <nav className="jp-nav">
          <ul className="jp-nav-menu">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.name}>
                  <Link to={link.path} className={`jp-nav-link ${isActive ? 'active' : ''}`}>
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="jp-header-actions">
          {user ? (
            <div className="jp-user-session">
              <Link to="/userDashboard" className="jp-user-greeting" style={{ textDecoration: 'none' }}>
                Hello, {user.firstName || 'User'}
              </Link>
              <button type="button" onClick={handleLogout} className="jp-btn-login">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/register"
                className={`jp-action-link ${location.pathname === '/register' ? 'active' : ''}`}
              >
                Register
              </Link>
              <Link
                to="/login"
                className={`jp-btn-login ${location.pathname === '/login' ? 'active' : ''}`}
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
