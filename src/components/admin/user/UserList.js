import React, { useContext, useState } from 'react';
import { UserStore } from '../../../contexts/UserStore';
import UserDetails from './UserDetails';
import DeleteUser from './DeleteUser';
import NewButton from './NewButton';
import LoadingMessage from '../../layout/LoadingMessage';
import styles from './styles/UserList.module.scss';

const UserList = () => {
  const { store } = useContext(UserStore);
  const users = store.data;

  const [deleteId, setDeleteId] = useState(false);
  const onDismissModal = () => setDeleteId(false);
  const onDelete = id => setDeleteId(id);
  const onConfirmDelete = id => {
    setDeleteId(false);
    store.destroy(id);
  };

  return (
    <div className="user-list">
      <h1 className={styles.pageTitle}>
        User List
        <NewButton />
      </h1>
      <ul className={styles.list}>
        <li>
          <div>Name</div>
          <div>Surname</div>
          <div>Email</div>
          <div>Actions</div>
        </li>
        {users.length ? (
          users.map(user => {
            return (
              <UserDetails user={user} key={user.id} onDelete={onDelete} />
            );
          })
        ) : (
          <LoadingMessage />
        )}
        <DeleteUser
          userId={deleteId}
          onConfirmDelete={onConfirmDelete}
          onDismissModal={onDismissModal}
        />
      </ul>
    </div>
  );
};

export default UserList;
