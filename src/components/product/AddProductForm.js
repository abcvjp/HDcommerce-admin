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
  Tabs,
  Tab,
} from '@material-ui/core';

import { useCategories } from 'src/utils/customHooks';
import { useNavigate } from 'react-router';
import { productApi } from 'src/utils/api';
// import { uploadProductImages } from 'src/firebase';
import { uploadImages } from 'src/utils/imageUploader';
import { closeFullScreenLoading, openFullScreenLoading } from 'src/actions/fullscreenLoading';
import { yellow } from '@material-ui/core/colors';
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
  const [tab, setTab] = useState(1);

  const handleChangeTab = (event, newValue) => {
    setTab(newValue);
  };

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
      isEnabled: true,
      isPublic: true,
      name: '',
      categoryId: '',
      title: '',
      price: '',
      originalPrice: '',
      stockQuantity: '',
      shortDescription: '',
      description: '',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: ''
    },
    validationSchema: Yup.object().shape({
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
        .nullable(true),
      metaKeywords: Yup.string().trim().min(1).max(150)
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
      <Box sx={{
        marginBottom: 2, width: '100%', display: 'flex', justifyContent: 'center'
      }}
      >
        <Typography
          variant="h3"
        >
          Add new product
        </Typography>
      </Box>
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

        <Box sx={{ bgcolor: yellow[600] }}>
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
        <Paper sx={{ padding: 2, marginTop: 0, marginBottom: 2 }} elevation={0}>

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
                label="Stock quantity"
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
                name="isEnabled?"
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
            label="Public?"
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
            value={values.metaDescription}
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
            value={values.metaKeywords}
            variant="outlined"
          />
        </Paper>
        )}
        {(tab === 2) && (
        <Paper sx={{ padding: 2, marginTop: 0, marginBottom: 2 }} elevation={0}>
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
        )}
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
