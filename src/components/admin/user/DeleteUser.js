import React, { useContext } from 'react';
import Modal from '../../layout/Modal';

const DeleteUser = ({ userId, onConfirmDelete, onDismissModal }) => {
  const actions = (
    <>
      <button onClick={() => onConfirmDelete(userId)}>Delete</button>
      <button onClick={() => onDismissModal()}>Cancel</button>
    </>
  );

  return userId ? (
    <Modal
      title="Delete User"
      content="Are you sure you want to delete this user?"
      actions={actions}
      onDismiss={onDismissModal}
    />
  ) : null;
};

export default DeleteUser;
