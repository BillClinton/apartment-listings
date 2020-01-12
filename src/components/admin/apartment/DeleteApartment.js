import React from 'react';
import Modal from '../../layout/Modal';

const DeleteApartment = ({ aptId, onConfirmDelete, onDismissModal }) => {
  const actions = (
    <>
      <button onClick={() => onConfirmDelete(aptId)}>Delete</button>
      <button onClick={() => onDismissModal()}>Cancel</button>
    </>
  );

  return aptId ? (
    <Modal
      title="Delete Apartment"
      content="Are you sure you want to delete this apartment?"
      actions={actions}
      onDismiss={onDismissModal}
    />
  ) : null;
};

export default DeleteApartment;
