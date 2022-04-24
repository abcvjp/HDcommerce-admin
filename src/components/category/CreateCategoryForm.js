import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Paper,
  MenuItem,
  TextField,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControlLabel,
  Checkbox
} from '@material-ui/core';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useCategories } from 'src/utils/customHooks';
import { useNavigate } from 'react-router';
import { closeFullScreenLoading, openFullScreenLoading } from 'src/actions/fullscreenLoading';
import { categoryApi } from '../../utils/api';

const CreateCategoryForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [categories] = useCategories();
  const [state, setState] = useState({
    isLoading: false,
    error: null,
    isOpenResult: false
  });

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
    navigate('/management/category');
  };

  const onSubmit = async (values) => {
    dispatch(openFullScreenLoading());
    await categoryApi.createCategory({ ...values }).then((res) => res.data).then(() => {
      handleResultOpen();
    }).catch((err) => {
      setState((prevState) => ({ ...prevState, error: err.response ? err.response.data.error.message : err.message }));
    });
    dispatch(closeFullScreenLoading());
  };
  return (
    <Paper sx={{ padding: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          color="textPrimary"
          variant="h2"
        >
          Create Category
        </Typography>
      </Box>
      {state.error && (
        <Box mb={2}>
          <Typography color="secondary">
            Error:
            {' '}
            {state.error}
          </Typography>
        </Box>
      )}
      <Formik
        initialValues={{
          name: '',
          parentId: '',
          description: '',
          isPublic: true,
          metaTitle: '',
          metaDescription: '',
          metaKeywords: ''
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().trim().min(1).max(50)
            .required('Category name is required'),
          description: Yup.string().trim().min(20).max(255)
            .required('Category description is required'),
          parentId: Yup.string().nullable(),
          isPublic: Yup.boolean().required(),
          metaTitle: Yup.string().trim().min(1).max(150)
            .required('Meta title is required'),
          metaDescription: Yup.string().trim().min(20).max(255)
            .nullable(),
          metaKeywords: Yup.string().trim().min(1).max(150)
            .lowercase()
            .nullable()
        })}
        onSubmit={onSubmit}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values
        }) => (
          <form onSubmit={handleSubmit}>
            <TextField
              error={Boolean(touched.name && errors.name)}
              fullWidth
              helperText={touched.name && errors.name}
              label="Category Name"
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
              error={Boolean(touched.parentId && errors.parentId)}
              helperText={touched.parentId && errors.parentId}
              label="Parent Category"
              margin="normal"
              fullWidth
              name="parentId"
              select
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.parentId}
              variant="outlined"
            >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.path.join(' -> ')}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              error={Boolean(touched.description && errors.description)}
              fullWidth
              helperText={touched.description && errors.description}
              label="Category Description"
              margin="normal"
              name="description"
              onBlur={handleBlur}
              onChange={handleChange}
              type="description"
              value={values.description}
              variant="outlined"
              multiline
              minRows={3}
              required
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
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={isSubmitting}
                size="large"
                type="submit"
                variant="contained"
              >
                Create category
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <Dialog open={state.isOpenResult} onClose={handleResultClose}>
        <DialogContent>
          <DialogContentText style={{ color: 'green' }}>
            Category is created successfully
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            onClick={handleContinue}
          >
            Continue add category
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={handleBackToList}
          >
            Back to category list
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CreateCategoryForm;
