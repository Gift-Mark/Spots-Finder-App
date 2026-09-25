import { Link, useLocation } from 'react-router-dom';
import '../CSS/Header.css';

const Header = () => {
  const location = useLocation();

  // Updated navigation categories matching the UI
  const navLinks = [
    { name: 'Explore', path: '/explore' },
    { name: 'Culture & Heritage', path: '/culture' },
    { name: 'Sports', path: '/sports' }, // Changed from Golf & Sports
    { name: 'Dining', path: '/dining' },
    { name: 'Events', path: '/events' },
  ];

  return (
    <header className="jp-header">
      <div className="jp-header-container">
        
        {/* Brand Logo */}
        <Link to="/" className="jp-brand-logo">
          <span className="jp-logo-text">
            Jos <span className="jp-logo-accent">Pulse</span>
          </span>
        </Link>

        {/* Navigation Bar */}
        <nav className="jp-nav">
          <ul className="jp-nav-menu">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`jp-nav-link ${isActive ? 'active' : ''}`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Direct Action Buttons matching UI (Register & Login) */}
        <div className="jp-header-actions">
          <Link to="/register" className="jp-action-link">
            Register
          </Link>
          <Link to="/login" className="jp-btn-login">
            Login
          </Link>
        </div>

      </div>
    </header>
  );
};

export default Header;