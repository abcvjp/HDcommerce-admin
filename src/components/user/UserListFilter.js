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
        email: Yup.string().trim().email(),
        fullName: Yup.string().trim().min(1).max(50),
        phoneNumber: Yup.string().min(7).matches(/^[0-9]+$/),
        isEnabled: Yup.bool()
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
            <Grid item key="fullName" className={classes.field}>
              <TextField
                error={Boolean(touched.fullName && errors.fullName)}
                fullWidth
                helperText={touched.fullName && errors.fullName}
                label="Customer name"
                name="fullName"
                margin="dense"
                size="small"
                fullName="fullName"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.fullName}
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
            <Grid item key="phoneNumber" className={classes.field}>
              <TextField
                error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                fullWidth
                helperText={touched.phoneNumber && errors.phoneNumber}
                label="Phone number"
                name="phoneNumber"
                margin="dense"
                size="small"
                phoneNumber="phoneNumber"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phoneNumber}
                variant="outlined"
              />
            </Grid>
            <Grid item key="isEnabled" className={classes.field}>
              <TextField
                error={Boolean(touched.isEnabled && errors.isEnabled)}
                helperText={touched.isEnabled && errors.isEnabled}
                label="Enabled"
                name="isEnabled"
                margin="dense"
                size="small"
                fullWidth
                select
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.isEnabled}
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
