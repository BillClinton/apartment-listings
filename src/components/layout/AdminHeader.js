import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './AdminHeader.module.scss';
import { ReactComponent as BarsIcon } from '../icons/bars-solid.svg';
import { ReactComponent as CloseIcon } from '../icons/times-circle-solid.svg';

const AdminHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleClass = [styles.menuToggle];
  const myRef = useRef();

  const handleClickOutside = e => {
    if (!myRef.current.contains(e.target)) {
      setIsMenuOpen(false);
    }
  };

  if (isMenuOpen) {
    toggleClass.push(styles.menuToggleActive);
    document.addEventListener('mousedown', handleClickOutside);
  } else {
    document.removeEventListener('mousedown', handleClickOutside);
  }

  return (
    <header className={styles.header}>
      <div className={styles.innerwrap}>
        <div className={styles.brand}>
          <h1>Site Title is</h1>
        </div>

        <nav ref={myRef} className={isMenuOpen ? styles.navActive : ''}>
          <Link to="/">Home</Link>
          <Link to="/admin/apartments">Apartments</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/logout">Logout</Link>
        </nav>
        <div
          className={toggleClass.join(' ')}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <BarsIcon className={styles.menuOpen} />
          <CloseIcon className={styles.menuClose} />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
