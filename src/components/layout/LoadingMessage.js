import React from 'react';
import styles from './LoadingMessage.module.scss';
import { ReactComponent as Spinner } from '../icons/spinner-solid.svg';

const LoadingMessage = () => {
  return (
    <div className={styles.LoadingMessage}>
      <Spinner />
      Loading...
    </div>
  );
};

export default LoadingMessage;
