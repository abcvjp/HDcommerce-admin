import React from 'react';
import { useParams } from 'react-router';
import EditProductForm from 'src/components/product/EditProductForm';
import Page from '../../components/Page';

const EditProduct = () => {
  const { productId } = useParams();
  return (
    <Page
      title="Edit Product"
      main={<EditProductForm productId={productId} />}
    />
  );
};

export default EditProduct;
