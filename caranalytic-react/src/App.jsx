import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.css'; // Create this file for custom animations

const App = () => {
  const location = useLocation();

  return (
    <div>
      <nav style={styles.nav}>

        <div style={styles.brand}>RodTalad</div>

        <ul style={styles.navLinks}>


          {/*Dashboard*/}
          <li style={styles.navItem}>
            <Link
              to="/"
              style={location.pathname === '/' ? styles.activeLink : styles.link}
            >
              Dashboard
            </Link>
          </li>


          {/*Browse Cars*/}
          <li style={styles.navItem}>
            <Link
                to="/browse-cars"
                style={location.pathname === '/browse-cars' ? styles.activeLink : styles.link}
            >
                Browse Cars
            </Link>
            </li>


          {/*Hightlighted Cars*/}
          <li style={styles.navItem}>
            <Link
              to="/highlighted-cars"
              style={location.pathname === '/highlighted-cars' ? styles.activeLink : styles.link}
            >
              Highlighted Cars
            </Link>
          </li>



        </ul>
      </nav>
      <hr style={styles.separator} />
      <TransitionGroup>
        <CSSTransition
          key={location.key}
          classNames="fade"
          timeout={300}
        >
          <Outlet />
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#2c2c2c',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  brand: {
    fontSize: '28px',
    fontWeight: '600',
    fontFamily: '"Poppins", sans-serif',
    color: '#ffffff',
    letterSpacing: '1px',
  },
  navLinks: {
    listStyle: 'none',
    display: 'flex',
    gap: '25px',
  },
  navItem: {
    margin: '0',
  },
  link: {
    textDecoration: 'none',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '500',
    fontFamily: '"Poppins", sans-serif',
    transition: 'color 0.3s ease',
  },
  activeLink: {
    textDecoration: 'none',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    fontFamily: '"Poppins", sans-serif',
    borderBottom: '2px solid #ffffff', // Highlight the active link
  },
  separator: {
    margin: '0',
    border: 'none',
    borderBottom: '1px solid #e0e0e0',
  },
};

export default App;
