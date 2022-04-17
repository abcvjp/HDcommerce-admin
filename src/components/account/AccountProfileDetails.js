import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Typography
} from '@material-ui/core';
import { closeFullScreenLoading, openFullScreenLoading } from 'src/actions/fullscreenLoading';
import { userApi } from 'src/utils/api';
import { setUser } from 'src/actions/user';

const AccountProfileDetails = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const {
    id, username, full_name, email, phone_number
  } = user;
  const [state, setState] = useState({
    errorMessage: null,
    successMessage: null
  });

  const formik = useFormik({
    initialValues: {
      username: username || '',
      full_name: full_name || '',
      email,
      phone_number: phone_number || ''
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().min(4).max(20).required('Username is required'),
      full_name: Yup.string().min(1).max(50).required('Full name is required'),
      email: Yup.string().min(1).max(50).email('Email is invalid'),
      phone_number: Yup.string().length(10).matches(/^[0-9]+$/, 'Phone number is not valid').length(10)
        .required('Phone number is required'),
    }),
    onSubmit: async (values) => {
      dispatch(openFullScreenLoading());
      try {
        const response = await userApi.updateUserInfo(id, values);
        dispatch(setUser(response.data.result));
        setState({ successMessage: 'Updated user information successfully', errorMessage: null });
      } catch (err) {
        console.log(err);
        setState({ successMessage: null, errorMessage: err.response.data.error.message });
      }
      dispatch(closeFullScreenLoading());
    }
  });
  const {
    values, touched, errors, handleChange, handleBlur, handleSubmit
  } = formik;

  return (
    <Card>
      <CardHeader
        subheader="The information can be edited"
        title="Profile"
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
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            md={6}
            xs={12}
          >
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
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
          >
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
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
          >
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
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
          >
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
          </Grid>

        </Grid>
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
          Save details
        </Button>
      </Box>
    </Card>
  );
};

export default AccountProfileDetails;
