import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Paper,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  FormControlLabel,
  Checkbox,
  DialogActions,
  Tabs,
  Tab
} from '@material-ui/core';

import { useCategories } from 'src/utils/customHooks';
import { productApi } from 'src/utils/api';
import { useNavigate } from 'react-router';
// import { uploadProductImages } from 'src/firebase';
import { uploadImages } from 'src/utils/imageUploader';

import { closeFullScreenLoading, openFullScreenLoading } from 'src/actions/fullscreenLoading';
import { isArrayEmpty } from 'src/utils/functions';
import { yellow } from '@material-ui/core/colors';
import ProductUploadImage from './ProductUploadImage';
import ProductImageList from './ProductImageList';
import RichEditor from '../RichEditor';

const EditProductForm = ({ productId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [categories] = useCategories();
  const [state, setState] = useState({
    product: null,
    images: [],
    error: null,
    isOpenResult: false
  });
  const [tab, setTab] = useState(1);
  const { product } = state;

  const handleChangeTab = (event, newValue) => {
    setTab(newValue);
  };

  const handleUpdateImages = async (newImages) => {
    dispatch(openFullScreenLoading());
    try {
      await productApi.editProduct(productId, {
        images: newImages.map((image) => ({
          url: image.url,
          alt: image.alt,
          title: image.title
        })),
      });
      setState((prev) => ({
        ...prev,
        images: newImages
      }));
    } catch (err) {
      console.log(err);
    }
    dispatch(closeFullScreenLoading());
  };

  const handleAddImages = async (imagesToUp) => {
    dispatch(openFullScreenLoading());
    try {
      const imageURLs = await uploadImages(imagesToUp);
      const newImages = [...state.images].concat(imagesToUp.map((image, i) => ({
        url: imageURLs[i],
        alt: image.alt === '' ? null : image.alt,
        title: image.title === '' ? null : image.title
      })));
      await handleUpdateImages(newImages);
    } catch (err) {
      console.log(err);
    }
    dispatch(closeFullScreenLoading());
  };

  const handleResultOpen = () => {
    setState((prevState) => ({ ...prevState, isOpenResult: true }));
  };
  const handleResultClose = () => {
    setState((prevState) => ({ ...prevState, isOpenResult: false }));
  };
  const handleContinue = () => {
    navigate(0, { replace: true });
  };
  const handleBackToList = () => {
    navigate('/management/product');
  };

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await productApi.getOne(productId);
      const { images, ...product } = response.data.data; // eslint-disable-line
      setState((prevState) => ({
        ...prevState,
        product,
        images
      }));
    };
    fetchProduct();
  }, []);

  const onSubmit = useCallback(async (values) => { // eslint-disable-line
    dispatch(openFullScreenLoading());
    try {
      await productApi.editProduct(productId, { ...values });
      handleResultOpen();
    } catch (err) {
      console.log(err);
      setState((prevState) => ({ ...prevState, error: err.response ? err.response.data.error.message : err.message }));
    }
    dispatch(closeFullScreenLoading());
  });

  return (
    product && (
      <>
        <Box sx={{
          marginBottom: 2, width: '100%', display: 'flex', justifyContent: 'center'
        }}
        >
          <Typography
            variant="h3"
          >
            Edit product
          </Typography>
        </Box>
        <Formik
          initialValues={{
            isEnabled: product.isEnabled,
            isPublic: product.isPublic,
            name: product.name,
            categoryId: product.categoryId,
            title: product.title,
            price: product.price,
            originalPrice: product.originalPrice,
            stockQuantity: product.stockQuantity,
            shortDescription: product.shortDescription,
            description: product.description,
            metaTitle: product.title,
            metaDescription: product.metaDescription || '',
            metaKeywords: product.metaKeywords || ''
          }}
          validationSchema={Yup.object().shape({
            isEnabled: Yup.boolean(),
            isPublic: Yup.boolean(),
            name: Yup.string().trim().min(1).max(200)
              .required('Name is required'),
            categoryId: Yup.string().required('Cateogory is required'),
            title: Yup.string().trim().min(1).max(255)
              .required('Title is requried'),
            price: Yup.number().positive().min(0).required('Price is required'),
            originalPrice: Yup.number().positive().min(0).required('Root price is required'),
            stockQuantity: Yup.number().integer().positive().min(1)
              .required('Quantity is required'),
            shortDescription: Yup.string().trim().min(20).max(300)
              .required('Short description is required'),
            description: Yup.string().min(20).required('Description is required'),
            metaTitle: Yup.string().trim().min(1).max(150)
              .required('Meta title is required'),
            metaDescription: Yup.string().trim().min(20).max(255)
              .nullable(),
            metaKeywords: Yup.string().trim().min(1).max(150)
              .nullable()
          })}
          onSubmit={onSubmit}
          validateOnBlur
          validateOnChange={false}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
            isSubmitting,
            touched,
            values
          }) => (
            <form onSubmit={handleSubmit}>
              {state.error && (
                <Box mb={2}>
                  <Typography color="secondary">
                    Error:
                    {' '}
                    {state.error}
                  </Typography>
                </Box>
              )}

              <Box sx={{ bgcolor: yellow[600], color: 'white' }}>
                <Tabs
                  value={tab}
                  onChange={handleChangeTab}
                  indicatorColor="primary"
                  textColor="primary"
                >
                  <Tab value={1} label="PRODUCT INFORMATION" />
                  <Tab value={2} label="PRODUCT IMAGES" />
                </Tabs>
              </Box>

              {(tab === 1) && (
              <Paper sx={{ padding: 2, marginTop: 0 }} elevation={0}>
                <TextField
                  error={Boolean(touched.name && errors.name)}
                  fullWidth
                  helperText={touched.name && errors.name}
                  label="Product Name"
                  margin="normal"
                  name="name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="name"
                  value={values.name}
                  variant="outlined"
                  required
                />
                <TextField
                  error={Boolean(touched.title && errors.title)}
                  fullWidth
                  helperText={touched.title && errors.title}
                  label="Product Title"
                  margin="normal"
                  name="title"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="title"
                  value={values.title}
                  variant="outlined"
                  required
                />
                <TextField
                  error={Boolean(touched.categoryId && errors.categoryId)}
                  helperText={touched.categoryId && errors.categoryId}
                  label="Category"
                  margin="normal"
                  fullWidth
                  name="categoryId"
                  select
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.categoryId}
                  variant="outlined"
                  required
                >
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </TextField>
                <Grid container spacing={2} wrap="nowrap">
                  <Grid item>
                    <TextField
                      error={Boolean(touched.price && errors.price)}
                      helperText={touched.price && errors.price}
                      label="Price"
                      margin="normal"
                      type="number"
                      name="price"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.price}
                      variant="outlined"
                      required
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      error={Boolean(touched.originalPrice && errors.originalPrice)}
                      helperText={touched.originalPrice && errors.originalPrice}
                      label="Root Price"
                      margin="normal"
                      type="number"
                      name="originalPrice"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.originalPrice}
                      variant="outlined"
                      required
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      error={Boolean(touched.stockQuantity && errors.stockQuantity)}
                      helperText={touched.stockQuantity && errors.stockQuantity}
                      label="Quantity"
                      margin="normal"
                      type="number"
                      name="stockQuantity"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.stockQuantity}
                      variant="outlined"
                      required
                    />
                  </Grid>
                </Grid>
                <TextField
                  error={Boolean(touched.shortDescription && errors.shortDescription)}
                  fullWidth
                  helperText={touched.shortDescription && errors.shortDescription}
                  label="Short Description"
                  margin="normal"
                  name="shortDescription"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="shortDescription"
                  value={values.shortDescription}
                  variant="outlined"
                  multiline
                  minRows={3}
                  required
                />
                <Box mt={2} mb={2}>
                  <RichEditor
                    error={errors.description}
                    touched={touched.description}
                    label="Description*"
                    initialContent={values.description}
                    fieldName="description"
                    setFieldValue={setFieldValue}
                  />
                </Box>

                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={values.isEnabled}
                      onChange={handleChange}
                      margin="normal"
                      name="isEnabled"
                    />
                  )}
                  label="Enabled?"
                />
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={values.isPublic}
                      onChange={handleChange}
                      margin="normal"
                      name="isPublic"
                    />
                  )}
                  label="Published?"
                />

                <TextField
                  error={Boolean(touched.metaTitle && errors.metaTitle)}
                  fullWidth
                  helperText={touched.metaTitle && errors.metaTitle}
                  label="Meta title"
                  margin="normal"
                  name="metaTitle"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="metaTitle"
                  value={values.metaTitle}
                  variant="outlined"
                  required
                />
                <TextField
                  error={Boolean(touched.metaDescription && errors.metaDescription)}
                  fullWidth
                  helperText={touched.metaDescription && errors.metaDescription}
                  label="Meta description"
                  margin="normal"
                  name="metaDescription"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="metaDescription"
                  value={values.metaDescription || ''}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.metaKeywords && errors.metaKeywords)}
                  fullWidth
                  helperText={touched.metaKeywords && errors.metaKeywords}
                  label="Meta keywords"
                  margin="normal"
                  name="metaKeywords"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="meta_keyword"
                  value={values.metaKeywords || ''}
                  variant="outlined"
                />
                <Box mt={2}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Update Product
                  </Button>
                </Box>
              </Paper>
              )}
              {(tab === 2) && (
              <Paper sx={{ padding: 2, marginTop: 0 }} elevation={0}>
                <Box mb={2}>
                  <ProductUploadImage handleAddImages={handleAddImages} />
                  {state.images && !isArrayEmpty(state.images)
                    && (
                      <ProductImageList
                        imageList={state.images}
                        handleUpdateImages={handleUpdateImages}
                      />
                    )}
                </Box>
              </Paper>
              )}
            </form>
          )}
        </Formik>
        <Dialog open={state.isOpenResult} onClose={handleResultClose}>
          <DialogContent>
            <DialogContentText style={{ color: 'green' }}>
              Product is updated successfully
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              variant="contained"
              onClick={handleContinue}
            >
              Continue edit product
            </Button>
            <Button
              color="secondary"
              variant="contained"
              onClick={handleBackToList}
            >
              Back to product list
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  );
};

EditProductForm.propTypes = {
  productId: PropTypes.string.isRequired
};

export default EditProductForm;
