import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as EditIcon } from '../../icons/edit-solid.svg';
import { ReactComponent as DeleteIcon } from '../../icons/minus-circle-solid.svg';

const UserDetails = ({ user, onDelete }) => {
  return (
    <li>
      <div>{user.name}</div>
      <div>{user.surname}</div>
      <div>{user.email}</div>
      <div>
        <Link to={`/admin/users/edit/${user.id}`}>
          <EditIcon />
        </Link>
        <a role="button" onClick={() => onDelete(user.id)}>
          <DeleteIcon className="delete" />
        </a>
      </div>
    </li>
  );
};

export default UserDetails;
