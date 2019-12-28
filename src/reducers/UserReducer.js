import {
  CREATE_USER,
  READ_USER,
  READ_USERS,
  UPDATE_USER,
  DELETE_USER
} from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case CREATE_USER: {
      return {
        ...state,
        users: [...state.users, action.payload.user]
      };
    }

    case READ_USER: {
      return { ...state, user: action.payload };
    }

    case READ_USERS: {
      console.log('read users');
      console.log(action.payload);
      return { ...state, users: action.payload };
    }

    case UPDATE_USER: {
      const users = state.users;
      const user = action.payload;
      const index = users.findIndex(item => item.id === user.id);

      if (~index) {
        users[index] = user;
        return { ...state, users, user: null };
      }
      return { ...state };
    }

    case DELETE_USER: {
      const users = state.users.filter(apt => apt.id !== action.payload);
      return { ...state, users: users };
    }

    default:
      return state;
  }
};
