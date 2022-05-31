import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography
} from '@material-ui/core';
import { setUser } from 'src/actions/user';

import Role from 'src/constants/Roles';

import API from 'src/utils/api/apiClient';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  const handleLoginWithEmailPassword = async (values) => {
    try {
      const response = await API.post('/auth/login', values); // eslint-disable-line
      const { user, accessToken } = response.data.data;
      if (user && user.role === Role.Admin) {
        dispatch(setUser(user));
        localStorage.setItem('access_token', accessToken);
        navigate('/management/dashboard', { replace: true });
      } else {
        setError('Your account does not have permission to access');
      }
    } catch (err) {
      console.log(err.response);
      setError(err.response.data.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          Login |
          {' '}
          {process.env.REACT_APP_APP_NAME}
        </title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: '',
              password: ''
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .min(4)
                .max(255)
                .required('Email is required'),
              password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={handleLoginWithEmailPassword}
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
                <Box sx={{ mb: 2 }}>
                  <Typography align="center" color="textPrimary" variant="h2">
                    Sign in
                  </Typography>
                </Box>
                <Box
                  sx={{
                    pb: 1,
                    pt: 1
                  }}
                >
                  <Typography
                    align="center"
                    color="textSecondary"
                    variant="body1"
                  >
                    Enter your email and password
                  </Typography>
                </Box>
                {error && (
                  <Box
                    sx={{
                      pb: 1,
                      pt: 3
                    }}
                  >
                    <Typography align="left" color="red" variant="body1">
                      {error}
                    </Typography>
                  </Box>
                )}
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Email address"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={values.email}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <Box sx={{ py: 2 }}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign in now
                  </Button>
                </Box>
              </form>
            )}
          </Formik>

        </Container>
      </Box>
    </>
  );
};

export default Login;
