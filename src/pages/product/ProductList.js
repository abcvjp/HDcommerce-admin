import {
  useEffect, useReducer
} from 'react';
import ProductListToolbar from 'src/components/product/ProductListToolbar';
import { productApi } from 'src/utils/api';
import ProductListResults from 'src/components/product/ProductListResult';
import { ProductListContext } from 'src/utils/contexts';
import Page from '../../components/Page';

const initialState = {
  products: [],
  pageSize: 10,
  currentPage: 0,
  count: 10,
  searchValue: '',
  triggerFetch: Date.now(),
  filters: {
    isEnabled: undefined,
    inStock: undefined,
    isPublic: undefined,
    categoryId: undefined
  },
  sort: '',
  isLoading: false
};

function productListReducer(state, action) {
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
    case 'CHANGE_SORT':
      return {
        ...state,
        sort: action.sort
      };
    case 'CHANGE_ENABLE':
      return {
        ...state,
        filters: {
          ...state.filters,
          isEnabled: action.isEnabled,
        },
        currentPage: 0
      };
    case 'CHANGE_INSTOCK':
      return {
        ...state,
        filters: {
          ...state.filters,
          inStock: action.inStock
        },
        currentPage: 0
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
    case 'CHANGE_CATEGORY':
      return {
        ...state,
        filters: {
          ...state.filters,
          categoryId: action.categoryId
        },
        currentPage: 0
      };
    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.products,
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
    default:
      return state;
  }
}

const ProductList = () => {
  const [state, dispatch] = useReducer(productListReducer, initialState);

  const fetchProducts = async () => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const queryParams = {
        skip: state.currentPage * state.pageSize,
        limit: state.pageSize,
        // categoryId: state.filters.categoryId,
        includeCategory: true,
        isEnabled: state.filters.isEnabled,
        // stockQuantity: state.filters.inStock,
        isPublic: state.filters.isPublic,
        sort: state.sort
      };
      if (state.searchValue && state.searchValue.length > 4) {
        queryParams.keyword = state.searchValue;
      }
      if (state.filters.categoryId) {
        queryParams.categoryId = state.filters.categoryId;
      }
      switch (state.filters.inStock) {
        case 'true':
          queryParams['stockQuantity[gt]'] = 0;
          break;
        case 'false':
          queryParams['stockQuantity[eq]'] = 0;
          break;
        default:
          break;
      }
      const response = await productApi.getAll(queryParams);
      dispatch({
        type: 'SET_PRODUCTS',
        products: response.data.data.records,
        count: response.data.data.count
      });
    } catch (err) {
      if (err.response && err.response.status === 404) {
        dispatch({
          type: 'SET_PRODUCTS',
          products: [],
          count: 0
        });
      }
      console.log(err);
    }
    dispatch({ type: 'SET_UNLOADING' });
  };

  // const searchProducts = async () => {
  // dispatch({ type: 'SET_LOADING' });
  // try {
  // const response = await productApi.searchProducts({
  // q: state.searchValue,
  // current_page: state.currentPage + 1,
  // page_size: state.pageSize,
  // category_id: state.filters.categoryId,
  // enable: state.filters.enable,
  // in_stock: state.filters.inStock,
  // published: state.filters.published,
  // sort: state.sort
  // });
  // dispatch({
  // type: 'SET_PRODUCTS',
  // products: response.data.data,
  // count: response.data.pagination.count
  // });
  // } catch (err) {
  // if (err.response && err.response.status === 404) {
  // dispatch({
  // type: 'SET_PRODUCTS',
  // products: [],
  // count: 0
  // });
  // }
  // console.log(err);
  // }
  // dispatch({ type: 'SET_UNLOADING' });
  // };

  useEffect(() => {
    // if (state.searchValue.length > 4) { searchProducts(); } else { fetchProducts(); }
    fetchProducts();
  }, [state.pageSize, state.currentPage, state.filters, state.sort, state.triggerFetch]);

  return (
    <Page
      title="Products"
      context={ProductListContext}
      contextValue={{ state, dispatch }}
      toolbar={(
        <ProductListToolbar />
      )}
      main={(
        <ProductListResults />
      )}
    />
  );
};

export default ProductList;
