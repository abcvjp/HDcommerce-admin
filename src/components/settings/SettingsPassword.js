import { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Typography
} from '@material-ui/core';
import { openConfirmDialog } from 'src/actions/confirmDialog';
import { closeFullScreenLoading, openFullScreenLoading } from 'src/actions/fullscreenLoading';
import { userApi } from 'src/utils/api';

const SettingsPassword = (props) => {
  const dispatch = useDispatch();

  const [state, setState] = useState({
    errorMessage: null,
    successMessage: null
  });

  const formik = useFormik({
    initialValues: {
      current_password: '',
      new_password: '',
      confirm_new_password: ''
    },
    validationSchema: Yup.object().shape({
      current_password: Yup.string().min(6).max(100).matches(new RegExp('^[a-zA-Z0-9]{3,30}$'), 'Password format is invalid')
        .required('Current password is required'),
      new_password: Yup.string().min(6).max(100).matches(new RegExp('^[a-zA-Z0-9]{3,30}$'), 'Password format is invalid')
        .required('New password is required'),
      confirm_new_password: Yup.string().min(6).max(100).matches(new RegExp('^[a-zA-Z0-9]{3,30}$'), 'Password format is invalid')
        .oneOf([Yup.ref('new_password'), null], 'Does not match with password')
        .required('Confirm new password is required'),
    }),
    onSubmit: async (values) => {
      dispatch(openConfirmDialog({
        message: 'Are you sure want to change your password?',
        onConfirm: async () => {
          dispatch(openFullScreenLoading());
          try {
            await userApi.resetPassword({
              currentPassword: values.current_password,
              newPassword: values.new_password
            });
            setState({ successMessage: 'Your password is changed successfully', errorMessage: null });
          } catch (err) {
            console.log(err);
            setState({ successMessage: null, errorMessage: err.response.data.message });
          }
          dispatch(closeFullScreenLoading());
        }
      }));
    }
  });
  const {
    values, touched, errors, handleChange, handleBlur, handleSubmit
  } = formik;

  return (
    <form {...props}>
      <Card>
        <CardHeader
          subheader="Update password"
          title="Password"
        />
        <Divider />
        <CardContent>
          {state.errorMessage && (
          <Box mb={1}>
            <Typography color="error">
              {state.errorMessage}
            </Typography>
          </Box>
          )}
          {state.successMessage && (
          <Box mb={1}>
            <Typography style={{ color: 'green' }}>
              {state.successMessage}
            </Typography>
          </Box>
          )}
          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            key="current_password"
            label="Current password"
            type="password"
            error={Boolean(touched.current_password && errors.current_password)}
            helperText={touched.current_password && errors.current_password}
            name="current_password"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.current_password}
            required
          />
          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            key="new_password"
            label="New password"
            type="password"
            error={Boolean(touched.new_password && errors.new_password)}
            helperText={touched.new_password && errors.new_password}
            name="new_password"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.new_password}
            required
          />
          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            key="confirm_new_password"
            label="Confirm new password"
            type="password"
            error={Boolean(touched.confirm_new_password && errors.confirm_new_password)}
            helperText={touched.confirm_new_password && errors.confirm_new_password}
            name="confirm_new_password"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.confirm_new_password}
            required
          />
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2
          }}
        >
          <Button
            color="primary"
            variant="contained"
            onClick={handleSubmit}
          >
            Change password
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default SettingsPassword;
