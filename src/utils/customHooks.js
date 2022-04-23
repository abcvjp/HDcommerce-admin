import { useState, useEffect } from 'react';
import { categoryApi } from './api';

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategory = async () => {
      const response = await categoryApi.getAll({ includeChildren: true });
      setCategories(response.data.data.records);
    };
    fetchCategory();
  }, []);
  return [categories, setCategories];
};

export {
  useCategories // eslint-disable-line
};
