import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { useFormik } from 'formik';

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
  DialogActions,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';

import { useCategories } from 'src/utils/customHooks';
import { useNavigate } from 'react-router';
import { productApi } from 'src/utils/api';
// import { uploadProductImages } from 'src/firebase';
import { uploadImages } from 'src/utils/imageUploader';
import { closeFullScreenLoading, openFullScreenLoading } from 'src/actions/fullscreenLoading';
import ProductImageList from './ProductImageList';
import ProductUploadImage from './ProductUploadImage';
import RichEditor from '../RichEditor';

const AddProductForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [categories] = useCategories();
  const [images, setImages] = useState([]);
  const [state, setState] = useState({
    isLoading: false,
    error: null,
    isOpenResult: false
  });

  const handleAddImages = (imagesToUp) => {
    setImages((prev) => ([...prev].concat(imagesToUp.map((i) => ({ ...i, url: URL.createObjectURL(i.file) })))));
  };

  const handleUpdateImages = (newImages) => {
    setImages(newImages);
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

  const onSubmit = useCallback(async (values, images) => { // eslint-disable-line
    dispatch(openFullScreenLoading());
    try {
      const imageURLs = await uploadImages(images);
      await productApi.createProduct({
        ...values,
        images: imageURLs.map((url, i) => ({
          url,
          alt: images[i].alt === '' ? null : images[i].alt,
          title: images[i].title === '' ? null : images[i].title,
        }))
      });
      handleResultOpen();
    } catch (err) {
      console.log(err);
      setState((prevState) => ({ ...prevState, error: err.response ? err.response.data.error.message : err.message }));
    }
    dispatch(closeFullScreenLoading());
  });

  const formik = useFormik({
    initialValues: {
      enable: true,
      published: true,
      name: '',
      category_id: '',
      title: '',
      price: '',
      root_price: '',
      quantity: '',
      short_description: '',
      description: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: ''
    },
    validationSchema: Yup.object().shape({
      enable: Yup.boolean(),
      published: Yup.boolean(),
      name: Yup.string().trim().min(1).max(200)
        .required('Name is required'),
      category_id: Yup.string().uuid().required('Cateogory is required'),
      title: Yup.string().trim().min(1).max(255)
        .required('Title is requried'),
      price: Yup.number().positive().min(0).required('Price is required'),
      root_price: Yup.number().positive().min(0).required('Root price is required'),
      quantity: Yup.number().integer().positive().min(1)
        .required('Quantity is required'),
      short_description: Yup.string().trim().min(20).max(300)
        .required('Short description is required'),
      description: Yup.string().min(20).required('Description is required'),
      meta_title: Yup.string().trim().min(1).max(150)
        .required('Meta title is required'),
      meta_description: Yup.string().trim().min(20).max(255)
        .nullable(true),
      meta_keywords: Yup.string().trim().min(1).max(150)
        .nullable(true)
    }),
    onSubmit: async (values) => {
      await onSubmit(values, images);
    },
    validateOnChange: false,
    validateOnBlur: true
  });

  const {
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    isSubmitting,
    touched,
    values
  } = formik;
  return (
    <>
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
        <Paper sx={{ padding: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              Product Information
            </Typography>
          </Box>

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
            error={Boolean(touched.category_id && errors.category_id)}
            helperText={touched.category_id && errors.category_id}
            label="Category"
            margin="normal"
            fullWidth
            name="category_id"
            select
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.category_id}
            variant="outlined"
            required
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.path}
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
                error={Boolean(touched.root_price && errors.root_price)}
                helperText={touched.root_price && errors.root_price}
                label="Root Price"
                margin="normal"
                type="number"
                name="root_price"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.root_price}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item>
              <TextField
                error={Boolean(touched.quantity && errors.quantity)}
                helperText={touched.quantity && errors.quantity}
                label="Quantity"
                margin="normal"
                type="number"
                name="quantity"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.quantity}
                variant="outlined"
                required
              />
            </Grid>
          </Grid>
          <TextField
            error={Boolean(touched.short_description && errors.short_description)}
            fullWidth
            helperText={touched.short_description && errors.short_description}
            label="Short Description"
            margin="normal"
            name="short_description"
            onBlur={handleBlur}
            onChange={handleChange}
            type="short_description"
            value={values.short_description}
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
                checked={values.enable}
                onChange={handleChange}
                margin="normal"
                name="enable"
              />
            )}
            label="Enable?"
          />
          <FormControlLabel
            control={(
              <Checkbox
                checked={values.published}
                onChange={handleChange}
                margin="normal"
                name="published"
              />
            )}
            label="Publish?"
          />

          <TextField
            error={Boolean(touched.meta_title && errors.meta_title)}
            fullWidth
            helperText={touched.meta_title && errors.meta_title}
            label="Meta title"
            margin="normal"
            name="meta_title"
            onBlur={handleBlur}
            onChange={handleChange}
            type="meta_title"
            value={values.meta_title}
            variant="outlined"
            required
          />
          <TextField
            error={Boolean(touched.meta_description && errors.meta_description)}
            fullWidth
            helperText={touched.meta_description && errors.meta_description}
            label="Meta description"
            margin="normal"
            name="meta_description"
            onBlur={handleBlur}
            onChange={handleChange}
            type="meta_description"
            value={values.meta_description}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.meta_keywords && errors.meta_keywords)}
            fullWidth
            helperText={touched.meta_keywords && errors.meta_keywords}
            label="Meta keywords"
            margin="normal"
            name="meta_keywords"
            onBlur={handleBlur}
            onChange={handleChange}
            type="meta_keyword"
            value={values.meta_keywords}
            variant="outlined"
          />
        </Paper>
        <Paper sx={{ my: 4, padding: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              Product Images
            </Typography>
          </Box>
          <Box mb={2}>
            <ProductUploadImage handleAddImages={handleAddImages} />
            {images.length > 0
              && (
                <ProductImageList
                  imageList={images}
                  handleUpdateImages={handleUpdateImages}
                />
              )}
          </Box>
        </Paper>
        <Box>
          <Button
            color="primary"
            disabled={isSubmitting}
            size="large"
            type="submit"
            variant="contained"
          >
            Add Product
          </Button>
        </Box>
      </form>
      <Dialog open={state.isOpenResult} onClose={handleResultClose}>
        <DialogContent>
          <DialogContentText style={{ color: 'green' }}>
            Product is created successfully
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            onClick={handleContinue}
          >
            Continue add product
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
  );
};

export default AddProductForm;
