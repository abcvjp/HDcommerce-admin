import React, { useContext } from 'react';
import { UserListContext } from 'src/utils/contexts';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  TextField,
  Button,
  Grid,
  MenuItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const enableOptions = [
  { name: 'All', value: '' },
  { name: 'Enabled', value: true },
  { name: 'Disabled', value: false }
];

const useStyles = makeStyles(() => ({
  field: {
    width: '33%'
  }
}));

const UserListFilter = () => {
  const classes = useStyles();
  const { state, dispatch } = useContext(UserListContext);
  return (
    <Formik
      initialValues={{ ...state.filters }}
      validationSchema={Yup.object().shape({
        id: Yup.string().uuid(),
        username: Yup.string().trim().min(4).max(20),
        email: Yup.string().trim().email(),
        full_name: Yup.string().trim().min(1).max(50),
        phone_number: Yup.string().length(10).matches(/^[0-9]+$/),
        enable: Yup.bool()
      })}
      onSubmit={(values) => dispatch({ type: 'SET_FILTERS', filters: values })}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        touched,
        values
      }) => (
        <form onSubmit={handleSubmit}>
          <Grid container justifyContent="flex-start" wrap="wrap" spacing={2}>
            <Grid item key="id" className={classes.field}>
              <TextField
                error={Boolean(touched.id && errors.id)}
                fullWidth
                helperText={touched.id && errors.id}
                label="User Id"
                name="id"
                margin="dense"
                size="small"
                id="id"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.id}
                variant="outlined"
              />
            </Grid>
            <Grid item key="username" className={classes.field}>
              <TextField
                error={Boolean(touched.username && errors.username)}
                fullWidth
                helperText={touched.username && errors.username}
                label="Username"
                name="username"
                margin="dense"
                size="small"
                username="username"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
                variant="outlined"
              />
            </Grid>
            <Grid item key="full_name" className={classes.field}>
              <TextField
                error={Boolean(touched.full_name && errors.full_name)}
                fullWidth
                helperText={touched.full_name && errors.full_name}
                label="Customer name"
                name="full_name"
                margin="dense"
                size="small"
                full_name="full_name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.full_name}
                variant="outlined"
              />
            </Grid>
            <Grid item key="email" className={classes.field}>
              <TextField
                error={Boolean(touched.email && errors.email)}
                fullWidth
                helperText={touched.email && errors.email}
                label="Email"
                name="email"
                margin="dense"
                size="small"
                email="email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                variant="outlined"
              />
            </Grid>
            <Grid item key="phone_number" className={classes.field}>
              <TextField
                error={Boolean(touched.phone_number && errors.phone_number)}
                fullWidth
                helperText={touched.phone_number && errors.phone_number}
                label="Phone number"
                name="phone_number"
                margin="dense"
                size="small"
                phone_number="phone_number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phone_number}
                variant="outlined"
              />
            </Grid>
            <Grid item key="enable" className={classes.field}>
              <TextField
                error={Boolean(touched.enable && errors.enable)}
                helperText={touched.enable && errors.enable}
                label="Enable"
                name="enable"
                margin="dense"
                size="small"
                fullWidth
                select
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.enable}
                variant="outlined"
              >
                {enableOptions.map((option) => (
                  <MenuItem key={option.name} value={option.value}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Box sx={{ py: 2 }}>
            <Button
              color="primary"
              type="submit"
              variant="contained"
            >
              Search
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default UserListFilter;
