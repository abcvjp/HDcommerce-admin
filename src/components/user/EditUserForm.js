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
    await userApi.updateUserInfo(userId, { ...values }).then((res) => res.data).then(() => {
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
              {`Edit User Info for '
                    ${user.full_name}
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
              username: user.username || '',
              full_name: user.full_name || '',
              email: user.email,
              phone_number: user.phone_number || '',
              enable: user.enable
            }}
            validationSchema={Yup.object().shape({
              username: Yup.string().min(4).max(20).required('Username is required'),
              full_name: Yup.string().min(1).max(50).required('Full name is required'),
              email: Yup.string().min(1).max(50).email('Email is invalid'),
              phone_number: Yup.string().length(10).matches(/^[0-9]+$/, 'Phone number is not valid').length(10)
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
                  key="username"
                  label="User name"
                  error={Boolean(touched.username && errors.username)}
                  helperText={touched.username && errors.username}
                  name="username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.username}
                  required
                />
                <TextField
                  InputLabelProps={{ shrink: true, color: 'primary' }}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  key="full_name"
                  label="Full name"
                  error={Boolean(touched.full_name && errors.full_name)}
                  helperText={touched.full_name && errors.full_name}
                  name="full_name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.full_name}
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
                  key="phone_number"
                  label="Phone number"
                  error={Boolean(touched.phone_number && errors.phone_number)}
                  helperText={touched.phone_number && errors.phone_number}
                  name="phone_number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.phone_number}
                  required
                />
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
