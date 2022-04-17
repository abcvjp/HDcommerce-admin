import React from 'react';
import { useParams } from 'react-router';
import Page from '../../components/Page';
import EditCategoryForm from '../../components/category/EditCategoryForm';

const EditCategory = () => {
  const { categoryId } = useParams();
  return (
    <Page
      title="Edit Category"
      main={<EditCategoryForm categoryId={categoryId} />}
    />
  );
};

export default EditCategory;
