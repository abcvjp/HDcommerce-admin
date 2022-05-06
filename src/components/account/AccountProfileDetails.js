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
    fullName, email, phoneNumber
  } = user;
  const [state, setState] = useState({
    errorMessage: null,
    successMessage: null
  });

  const formik = useFormik({
    initialValues: {
      fullName: fullName || '',
      email,
      phoneNumber: phoneNumber || ''
    },
    validationSchema: Yup.object().shape({
      fullName: Yup.string().min(1).max(50).required('Full name is required'),
      email: Yup.string().min(1).max(50).email('Email is invalid'),
      phoneNumber: Yup.string().min(10)
        .required('Phone number is required'),
    }),
    onSubmit: async (values) => {
      dispatch(openFullScreenLoading());
      try {
        const response = await userApi.updateUserInfo(values);
        dispatch(setUser(response.data.data));
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
