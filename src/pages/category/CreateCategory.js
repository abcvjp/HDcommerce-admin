import React from 'react';
import Page from '../../components/Page';
import CreateCategoryForm from '../../components/category/CreateCategoryForm';

const CreateCategory = () => (
  <Page
    title="Create Category"
    main={<CreateCategoryForm />}
  />
);

export default CreateCategory;
