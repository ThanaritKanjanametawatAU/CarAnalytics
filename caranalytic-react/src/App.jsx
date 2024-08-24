import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.css'; // Create this file for custom animations

const App = () => {
  const location = useLocation();

  return (
      <div>

        {/*Navigation Bar*/}
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
            {/*<li style={styles.navItem}>*/}
            {/*  <Link*/}
            {/*    to="/highlighted-cars"*/}
            {/*    style={location.pathname === '/highlighted-cars' ? styles.activeLink : styles.link}*/}
            {/*  >*/}
            {/*    Highlighted Cars*/}
            {/*  </Link>*/}
            {/*</li>*/}


          </ul>
        </nav>


        {/*Content*/}
        <div style={styles.content}>
          <TransitionGroup>
            <CSSTransition
                key={location.key}
                classNames="fade"
                timeout={300}
            >
              <Outlet/>
            </CSSTransition>
          </TransitionGroup>
        </div>


      </div>
  );
};


const styles = {
  nav: {
    position: 'fixed', // Make the nav bar fixed at the top
    top: 0, // Align it to the top of the page
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#2c2c2c',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 1000, // Ensure it stays on top of other elements
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
  content: {
    paddingTop: '80px', // Adjust this value based on your nav bar height
  },
};


export default App;
