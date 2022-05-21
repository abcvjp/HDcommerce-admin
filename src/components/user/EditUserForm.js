import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  FormControlLabel,
  Checkbox
} from '@material-ui/core';

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { closeFullScreenLoading, openFullScreenLoading } from 'src/actions/fullscreenLoading';
import { userApi } from '../../utils/api';

const EditUserForm = ({ userId }) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    user: null,
    error: null,
    isOpenResult: false
  });

  const handleResultOpen = () => {
    setState((prevState) => ({ ...prevState, isOpenResult: true }));
  };
  const handleResultClose = () => {
    setState((prevState) => ({ ...prevState, isOpenResult: false }));
  };

  useEffect(() => {
    const fetchUser = async () => {
      const response = await userApi.getUserById(userId);
      setState((prevState) => ({
        ...prevState,
        user: response.data.data,
      }));
    };
    fetchUser();
  }, []);

  const { user } = state;

  const onSubmit = async (values) => {
    dispatch(openFullScreenLoading());
    await userApi.updateUser(userId, { ...values }).then((res) => res.data).then(() => {
      handleResultOpen();
    }).catch((err) => {
      setState((prevState) => ({ ...prevState, error: err.response ? err.response.data.error.message : err.message }));
    });
    dispatch(closeFullScreenLoading());
  };

  return (
    user
      ? (
        <Paper sx={{ padding: 2 }}>
          <Box sx={{ mb: 3 }}>
            <Typography
              color="textPrimary"
              variant="h2"
            >
              {`Edit info for '
                    ${user.email}
                    '`}
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
              fullName: user.fullName || '',
              email: user.email,
              phoneNumber: user.phoneNumber || '',
              isEnabled: user.isEnabled
            }}
            validationSchema={Yup.object().shape({
              fullName: Yup.string().min(1).max(50).required('Full name is required'),
              email: Yup.string().min(1).max(50).email('Email is invalid'),
              phoneNumber: Yup.string().min(10)
                .required('Phone number is required')
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
                  InputLabelProps={{ shrink: true, color: 'primary' }}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  key="fullName"
                  label="Full name"
                  error={Boolean(touched.fullName && errors.fullName)}
                  helperText={touched.fullName && errors.fullName}
                  name="fullName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.fullName}
                  required
                />

                <TextField
                  InputLabelProps={{ shrink: true, color: 'primary' }}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  key="email"
                  label="Email"
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  required
                />

                <TextField
                  InputLabelProps={{ shrink: true, color: 'primary' }}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  key="phoneNumber"
                  label="Phone number"
                  error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                  helperText={touched.phoneNumber && errors.phoneNumber}
                  name="phoneNumber"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.phoneNumber}
                  required
                />
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
                <Box sx={{ py: 2 }}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Edit user
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
          <Dialog open={state.isOpenResult} onClose={handleResultClose}>
            <DialogContent>
              <DialogContentText style={{ color: 'green' }}>
                User is updated successfully
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </Paper>
      ) : <></>
  );
};

EditUserForm.propTypes = {
  userId: PropTypes.string.isRequired
};
export default EditUserForm;
