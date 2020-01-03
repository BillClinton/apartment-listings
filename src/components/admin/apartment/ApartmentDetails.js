import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as EditIcon } from '../../icons/edit-solid.svg';
import { ReactComponent as DeleteIcon } from '../../icons/minus-circle-solid.svg';

const ApartmentDetails = ({ apartment }) => {
  console.log('Apartment Details');
  return (
    <li>
      <div>{apartment.name}</div>
      <div>{apartment.rent}</div>
      <div>
        <Link to={`/admin/apartments/edit/${apartment.id}`}>
          <EditIcon className="edit" />
        </Link>
        <Link to={`/admin/apartments/delete/${apartment.id}`}>
          <DeleteIcon className="delete" />
        </Link>
      </div>
    </li>
  );
};

export default ApartmentDetails;
