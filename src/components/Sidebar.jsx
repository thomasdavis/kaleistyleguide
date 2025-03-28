import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useStylesheets } from '../hooks/useStylesheets';
import '../styles/components/Sidebar.scss';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { stylesheets, categories, isLoading } = useStylesheets();
  
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.kalei-sidebar')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <aside className={`kalei-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="kalei-sidebar-header">
        <h1 className="kalei-logo">Kalei</h1>
        <button 
          className="kalei-menu-toggle" 
          onClick={toggleSidebar}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>
      
      <nav className="kalei-nav">
        <Link to="/" className="kalei-nav-home">
          Home
        </Link>
        
        <div className="kalei-stylesheets-label">Stylesheets</div>
        
        {isLoading ? (
          <div>Loading stylesheets...</div>
        ) : (
          <ul className="kalei-nav-list">
            {/* Main stylesheet entry */}
            {stylesheets.length > 0 && (
              <li>
                <NavLink 
                  to={`/style/${stylesheets[0].id}`} 
                  className={({ isActive }) => 
                    `kalei-nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  {stylesheets[0].name}
                </NavLink>
              </li>
            )}
            
            {/* Categories and their stylesheets */}
            {categories.map((category, index) => (
              <li key={index} className="kalei-nav-category">
                <h3>{category.name}</h3>
                <ul>
                  {category.sheets.map((sheet, idx) => (
                    <li key={idx}>
                      <NavLink 
                        to={`/style/${sheet.id}`} 
                        className={({ isActive }) => 
                          `kalei-nav-link ${isActive ? 'active' : ''}`
                        }
                      >
                        {sheet.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;