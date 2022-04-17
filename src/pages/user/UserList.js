import {
  useEffect, useReducer
} from 'react';
import { userApi } from 'src/utils/api';
import UserListToolbar from 'src/components/user/UserListToolbar';
import UserListResults from 'src/components/user/UserListResult';
import { UserListContext } from 'src/utils/contexts';
import Page from '../../components/Page';

const initialState = {
  users: [],
  pageSize: 10,
  currentPage: 0,
  count: 10,
  triggerFetch: Date.now(),
  filters: {
    id: '',
    email: '',
    username: '',
    full_name: '',
    phone_number: '',
    enable: undefined
  },
  sort: '',
  isLoading: false
};

function userListReducer(state, action) {
  switch (action.type) {
    case 'CHANGE_PAGE_SIZE':
      return {
        ...state,
        pageSize: action.pageSize,
        currentPage: 0
      };
    case 'CHANGE_CURRENT_PAGE':
      return {
        ...state,
        currentPage: action.currentPage
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: action.filters,
        currentPage: 0,
        triggerFetch: Date.now()
      };
    case 'CHANGE_SORT':
      return {
        ...state,
        sort: action.sort
      };
    case 'SET_USERS':
      return {
        ...state,
        users: action.users,
        count: action.count
      };
    case 'TRIGGER_FETCH':
      return {
        ...state,
        currentPage: 0,
        triggerFetch: Date.now()
      };
    case 'REFRESH':
      return {
        ...state,
        triggerFetch: Date.now()
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: true
      };
    case 'SET_UNLOADING':
      return {
        ...state,
        isLoading: false
      };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map((i) => {
          if (i.id === action.user.id) {
            return { ...i, ...action.user };
          } return i;
        })
      };
    case 'UPDATE_USERS': {
      const newUsers = state.users.slice();
      action.users.forEach((user) => {
        const index = newUsers.findIndex((curUser) => curUser.id === user.id);
        if (index !== -1) {
          newUsers[index] = { ...newUsers[index], ...user };
        }
      });
      return {
        ...state,
        users: newUsers
      };
    }
    default:
      return state;
  }
}

const UserList = () => {
  const [state, dispatch] = useReducer(userListReducer, initialState);

  useEffect(() => {
    const fetchUsers = async () => {
      dispatch({ type: 'SET_LOADING' });
      const { filters } = state;
      try {
        const response = await userApi.getUsers({
          current_page: state.currentPage + 1,
          page_size: state.pageSize,
          ...filters,
          sort: state.sort
        });
        dispatch({
          type: 'SET_USERS',
          users: response.data.data,
          count: response.data.pagination.count
        });
      } catch (err) {
        console.log(err);
      }
      dispatch({ type: 'SET_UNLOADING' });
    };
    fetchUsers();
  }, [state.pageSize, state.currentPage, state.filters, state.sort, state.triggerFetch]);

  return (
    <Page
      title="Users"
      context={UserListContext}
      contextValue={{ state, dispatch }}
      toolbar={(
        <UserListToolbar />
      )}
      main={(
        <UserListResults />
      )}
    />
  );
};

export default UserList;
