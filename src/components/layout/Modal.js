import React from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.scss';
import { ReactComponent as CloseIcon } from '../icons/times-circle-solid.svg';

const Modal = props => {
  return ReactDOM.createPortal(
    <div className={styles.modalWrap}>
      <div className={styles.modal}>
        <CloseIcon onClick={props.onDismiss} />
        <div className={styles.header}>{props.title}</div>
        <div className={styles.content}>{props.content}</div>
        <div className={styles.actions}>{props.actions}</div>
      </div>
    </div>,
    document.querySelector('#modal')
  );
};

export default Modal;
