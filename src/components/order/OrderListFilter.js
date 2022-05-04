import React, { useContext } from 'react';
import { OrderListContext } from 'src/utils/contexts';
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

const statuses = ['Creating', 'Pending', 'Handling', 'Completed', 'Canceled', 'Failed'];
const paymentStatuses = ['Unpaid', 'Paid'];
const shippingStatuses = ['Undelivered', 'Delivering', 'Success', 'Delivery failed'];

const useStyles = makeStyles(() => ({
  field: {
    width: '33%'
  }
}));

const OrderListFilter = () => {
  const classes = useStyles();
  const { state, dispatch } = useContext(OrderListContext);
  return (
    <Formik
      initialValues={{ ...state.filters }}
      validationSchema={Yup.object().shape({
        _id: Yup.string(),
        fullName: Yup.string().trim().min(1).max(100),
        email: Yup.string().trim().email(),
        phoneNumber: Yup.string().length(10).matches(/^[0-9]+$/),
        status: Yup.mixed().oneOf(['Creating', 'Pending', 'Handling', 'Completed', 'Canceled', 'Failed']),
        paymentStatus: Yup.mixed().oneOf(['Unpaid', 'Paid']),
        shippingStatus: Yup.mixed().oneOf(['Undelivered', 'Delivering', 'Success', 'Delivery failed']),
        startDate: Yup.date(),
        endDate: Yup.date()
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
                label="Order Id"
                name="id"
                margin="dense"
                size="small"
                id="id"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values._id}
                variant="outlined"
              />
            </Grid>
            <Grid item key="name" className={classes.field}>
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
            <Grid item key="status" className={classes.field}>
              <TextField
                error={Boolean(touched.status && errors.status)}
                helperText={touched.status && errors.status}
                label="Status"
                name="status"
                margin="dense"
                size="small"
                fullWidth
                select
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.status}
                variant="outlined"
              >
                <MenuItem key="All" value="">All</MenuItem>
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item key="paymentStatus" className={classes.field}>
              <TextField
                error={Boolean(touched.paymentStatus && errors.paymentStatus)}
                helperText={touched.paymentStatus && errors.paymentStatus}
                label="Payment Status"
                name="paymentStatus"
                margin="dense"
                size="small"
                fullWidth
                select
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.paymentStatus}
                variant="outlined"
                className={classes.field}
              >
                <MenuItem key="All" value="">All</MenuItem>
                {paymentStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item key="deliveryStatus" className={classes.field}>
              <TextField
                error={Boolean(touched.deliveryStatus && errors.deliveryStatus)}
                helperText={touched.deliveryStatus && errors.deliveryStatus}
                label="Shipping Status"
                name="deliveryStatus"
                margin="dense"
                size="small"
                fullWidth
                select
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.deliveryStatus}
                variant="outlined"
                className={classes.field}
              >
                <MenuItem key="All" value="">All</MenuItem>
                {shippingStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item key="startDate" className={classes.field}>
              <TextField
                error={Boolean(touched.startDate && errors.startDate)}
                helperText={touched.startDate && errors.startDate}
                label="Start Date"
                name="startDate"
                type="date"
                margin="dense"
                size="small"
                fullWidth
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.startDate}
                variant="outlined"
                className={classes.field}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item key="endDate" className={classes.field}>
              <TextField
                error={Boolean(touched.endDate && errors.endDate)}
                helperText={touched.endDate && errors.endDate}
                label="End Date"
                name="endDate"
                type="date"
                margin="dense"
                size="small"
                fullWidth
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.endDate}
                variant="outlined"
                className={classes.field}
                InputLabelProps={{
                  shrink: true,
                }}
              />
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

export default OrderListFilter;
