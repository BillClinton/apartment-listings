import React, { useContext } from 'react';
import { UserStore } from '../../../contexts/UserStore';
import EditUserForm from './EditUserForm';
import LoadingMessage from '../../layout/LoadingMessage';

const EditUser = ({ match }) => {
  const { store } = useContext(UserStore);
  const id = match.params.id;
  let user = store.edit;

  if (!user || user.id !== id) {
    user = null;
    store.loadOne(id);
  }

  return user ? <EditUserForm user={user} /> : <LoadingMessage />;
};

export default EditUser;
