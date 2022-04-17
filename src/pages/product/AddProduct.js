import React from 'react';
import Page from 'src/components/Page';
import AddProductForm from 'src/components/product/AddProductForm';

const AddProduct = () => (
  <Page
    title="Add Product"
    main={<AddProductForm />}
  />
);

export default AddProduct;
