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
  FormControlLabel,
  Checkbox,
  DialogActions
} from '@material-ui/core';

import { useNavigate } from 'react-router';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useCategories } from 'src/utils/customHooks';
import { closeFullScreenLoading, openFullScreenLoading } from 'src/actions/fullscreenLoading';
import { categoryApi } from '../../utils/api';

const EditCategoryForm = ({ categoryId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [categories] = useCategories();
  const [state, setState] = useState({
    category: null,
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

  useEffect(() => {
    if (categories.length > 0) {
      setState((prevState) => ({
        ...prevState,
        category: categories.find((category) => category._id === categoryId)
      }));
    }
  }, [categories]);

  const { category } = state;

  const onSubmit = async (values) => {
    dispatch(openFullScreenLoading());
    await categoryApi.editCategory(categoryId, { ...values }).then((res) => res.data).then(() => {
      handleResultOpen();
    }).catch((err) => {
      setState((prevState) => ({ ...prevState, error: err.response ? err.response.data.message : err.message }));
    });
    dispatch(closeFullScreenLoading());
  };

  return (
    category
      ? (
        <Paper sx={{ padding: 2 }}>
          <Box sx={{ mb: 3 }}>
            <Typography
              color="textPrimary"
              variant="h2"
            >
              {`Edit Category '
                    ${category.name}
                    '`}
            </Typography>
          </Box>
          {state.error && (
            <Box mb={2}>
              <Typography color="red">
                Error:
                {' '}
                {state.error}
              </Typography>
            </Box>
          )}
          <Formik
            initialValues={{
              name: category.name,
              parentId: category.parentId || '',
              description: category.description,
              isPublic: true,
              metaTitle: category.metaTitle,
              metaDescription: category.metaDescription || '',
              metaKeywords: category.metaKeywords || ''
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
              metaDescription: Yup.string()
                .nullable(true).trim()
                .min(20)
                .max(255),
              metaKeywords: Yup.string()
                .nullable(true).trim()
                .min(1)
                .max(150)
                .lowercase()
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
                  disabled
                >
                  {categories.map((item) => (
                    <MenuItem key={item._id} value={item._id}>
                      {item.path.join(' -> ')}
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
                <Box sx={{ py: 2 }}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Edit category
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
          <Dialog open={state.isOpenResult} onClose={handleResultClose}>
            <DialogContent>
              <DialogContentText style={{ color: 'green' }}>
                Category is updated successfully
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                color="primary"
                variant="contained"
                onClick={handleContinue}
              >
                Continue edit category
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
        </Paper>
      ) : <></>
  );
};

EditCategoryForm.propTypes = {
  categoryId: PropTypes.string.isRequired
};
export default EditCategoryForm;
