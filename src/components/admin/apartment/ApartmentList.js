import React, { useContext, useState } from 'react';
import { ApartmentStore } from '../../../contexts/ApartmentStore';
import ApartmentDetails from './ApartmentDetails';
import DeleteApartment from './DeleteApartment';
import NewButton from './NewButton';
import ReloadButton from './ReloadButton';
import LoadingMessage from '../../layout/LoadingMessage';
import styles from './styles/ApartmentList.module.scss';

const ApartmentList = () => {
  const { store } = useContext(ApartmentStore);
  const apartments = store.data;

  const [deleteId, setDeleteId] = useState(false);
  const onDismissModal = () => setDeleteId(false);
  const onDelete = id => setDeleteId(id);
  const onConfirmDelete = id => {
    setDeleteId(false);
    store.destroy(id);
  };

  console.log('id', deleteId);

  return (
    <div className="apartment-list">
      <h1 className={styles.pageTitle}>
        Apartment List
        <NewButton />
      </h1>
      <ul className={styles.list}>
        <li>
          <div>Name</div>
          <div>Rent</div>
          <div>Actions</div>
        </li>
        {apartments.length ? (
          <>
            {apartments.map(apartment => {
              return (
                <ApartmentDetails
                  apartment={apartment}
                  key={apartment.id}
                  onDelete={onDelete}
                />
              );
            })}
            {/* TODO: incorporate this into ui or lose it */}
            <ReloadButton />
          </>
        ) : (
          <LoadingMessage />
        )}
      </ul>
      <DeleteApartment
        aptId={deleteId}
        onConfirmDelete={onConfirmDelete}
        onDismissModal={onDismissModal}
      />
    </div>
  );
};

export default ApartmentList;
