import {
  useEffect, useReducer
} from 'react';
import { categoryApi } from 'src/utils/api';
import CategoryListToolbar from 'src/components/category/CategoryListToolbar';
import CategoryListResults from 'src/components/category/CategoryListResult';
import { CategoryListContext } from 'src/utils/contexts';
import Page from '../../components/Page';

const initialState = {
  categories: [],
  pageSize: 10,
  currentPage: 0,
  count: 10,
  searchValue: '',
  triggerFetch: Date.now(),
  filters: {
    isPublic: '',
  },
  sort: '',
  isLoading: false
};

function categoryListReducer(state, action) {
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
    case 'CHANGE_SEARCH_VALUE':
      return {
        ...state,
        searchValue: action.searchValue
      };
    case 'SET_SEARCH':
      return {
        ...state,
        searchValue: action.searchValue,
        triggerFetch: Date.now()
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
    case 'CHANGE_PUBLISHED':
      return {
        ...state,
        filters: {
          ...state.filters,
          isPublic: action.isPublic
        },
        currentPage: 0
      };
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.categories,
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
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map((i) => {
          if (i.id === action.category._id) {
            return { ...i, ...action.category };
          } return i;
        })
      };
    case 'UPDATE_CATEGORIES': {
      const newCategories = state.categories.slice();
      action.categories.forEach((category) => {
        const index = newCategories.findIndex((curCategory) => curCategory._id === category._id);
        if (index !== -1) {
          newCategories[index] = { ...newCategories[index], ...category };
        }
      });
      return {
        ...state,
        categories: newCategories
      };
    }
    default:
      return state;
  }
}

const CategoryList = () => {
  const [state, dispatch] = useReducer(categoryListReducer, initialState);

  const fetchCategories = async () => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const queryParams = {
        skip: state.currentPage * state.pageSize,
        limit: state.pageSize,
        ...state.filters,
        sort: state.sort
      };
      console.log(queryParams);
      if (state.searchValue && state.searchValue.length > 4) {
        queryParams.keyword = state.searchValue;
      }
      const response = await categoryApi.getAll(queryParams);
      dispatch({
        type: 'SET_CATEGORIES',
        categories: response.data.data.records,
        count: response.data.data.count
      });
    } catch (err) {
      if (err.response && err.response.status === 404) {
        dispatch({
          type: 'SET_CATEGORIES',
          categories: [],
          count: 0
        });
      }
      console.log(err);
    }
    dispatch({ type: 'SET_UNLOADING' });
  };

  // const searchCategories = async () => {
  // dispatch({ type: 'SET_LOADING' });
  // try {
  // const response = await categoryApi.searchCategories({
  // q: state.searchValue,
  // current_page: state.currentPage + 1,
  // page_size: state.pageSize,
  // ...state.filters,
  // sort: state.sort
  // });
  // dispatch({
  // type: 'SET_CATEGORIES',
  // categories: response.data.data,
  // count: response.data.pagination.count
  // });
  // } catch (err) {
  // if (err.response && err.response.status === 404) {
  // dispatch({
  // type: 'SET_CATEGORIES',
  // categories: [],
  // count: 0
  // });
  // }
  // console.log(err);
  // }
  // dispatch({ type: 'SET_UNLOADING' });
  // };

  useEffect(() => {
    fetchCategories();
  }, [state.pageSize, state.currentPage, state.filters, state.sort, state.triggerFetch]);

  return (
    <Page
      title="Categories"
      context={CategoryListContext}
      contextValue={{ state, dispatch }}
      toolbar={(
        <CategoryListToolbar />
      )}
      main={(
        <CategoryListResults />
      )}
    />
  );
};

export default CategoryList;
