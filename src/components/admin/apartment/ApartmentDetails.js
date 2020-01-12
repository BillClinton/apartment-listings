import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as EditIcon } from '../../icons/edit-solid.svg';
import { ReactComponent as DeleteIcon } from '../../icons/minus-circle-solid.svg';

const ApartmentDetails = ({ apartment, onDelete }) => {
  console.log('Apartment Details');
  return (
    <li>
      <div>{apartment.name}</div>
      <div>{apartment.rent}</div>
      <div>
        <Link to={`/admin/apartments/edit/${apartment.id}`}>
          <EditIcon className="edit" />
        </Link>
        <a onClick={() => onDelete(apartment.id)}>
          <DeleteIcon className="delete" />
        </a>
      </div>
    </li>
  );
};

export default ApartmentDetails;
