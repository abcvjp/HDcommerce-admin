import { useState, useEffect } from 'react';
import { categoryApi } from './api';

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategory = async () => {
      const response = await categoryApi.getAll();
      setCategories(response.data.data);
    };
    fetchCategory();
  }, []);
  return [categories, setCategories];
};

export {
  useCategories // eslint-disable-line
};
