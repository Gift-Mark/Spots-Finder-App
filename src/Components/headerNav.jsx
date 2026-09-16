import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEllipsisVertical} from '@fortawesome/free-solid-svg-icons';
import '../CSS/Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Primary Desktop Categories
  const navLinks = [
    { name: 'Explore', path: '/explore' },
    { name: 'Culture & Heritage', path: '/culture' },
    { name: 'Golf & Sports', path: '/golf' },
    { name: 'Restaurants & Diners', path: '/dining' },
    { name: 'Lounges & Bars', path: '/nightlife' },
    { name: 'Events', path: '/events' },
  ];

  //Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsMenuOpen(false);
    navigate('/login');
  };
  return (
    <header className="jp-header">
      <div className="jp-header-container">
        
        {/* Brand Logo */}
        <Link to="/" className="jp-brand-logo">
          <span className="jp-logo-text">
            Jos <span className="jp-logo-accent">Pulse</span>
          </span>
        </Link>

        {/* Desktop Navigation Bar */}
        <nav>
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

        {/* Right Action Controls */}
        <div className="jp-header-actions" ref={dropdownRef}>
           <button
            type="button"
            className={`jp-menu-dots-btn ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle user navigation menu"
            aria-expanded={isMenuOpen}
          >
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </button>

          {/* Action Dropdown Menu */}
          {isMenuOpen && (
            <div className="jp-dropdown-menu">
              <Link
                to="/login"
                className="jp-dropdown-item jp-dropdown-signin"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>

              <Link
                to="/"
                className="jp-dropdown-item jp-dropdown-guest"
                onClick={() => setIsMenuOpen(false)}
              >
                Continue as Guest
              </Link>

              <Link
                to="/register"
                className="jp-dropdown-item jp-dropdown-join"
                onClick={() => setIsMenuOpen(false)}
              >
                Join
              </Link>

              <button
                type="button"
                className="jp-dropdown-item jp-dropdown-logout"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;