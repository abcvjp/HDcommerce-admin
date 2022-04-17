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

const statuses = ['Pending', 'Handling', 'Completed', 'Canceled'];
const paymentStatuses = ['Unpaid', 'Paid'];
const shippingStatuses = ['Undelivered', 'Delivering', 'Successfully delivered', 'Delivery failed'];

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
        id: Yup.string().uuid(),
        customer_name: Yup.string().trim().min(1).max(100),
        email: Yup.string().trim().email(),
        phone_number: Yup.string().length(10).matches(/^[0-9]+$/),
        status: Yup.mixed().oneOf(['Pending', 'Handling', 'Completed', 'Canceled']),
        payment_status: Yup.mixed().oneOf(['Unpaid', 'Paid']),
        shipping_status: Yup.mixed().oneOf(['Undelivered', 'Delivering', 'Successfully delivered', 'Delivery failed']),
        start_date: Yup.date(),
        end_date: Yup.date()
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
                value={values.id}
                variant="outlined"
              />
            </Grid>
            <Grid item key="name" className={classes.field}>
              <TextField
                error={Boolean(touched.customer_name && errors.customer_name)}
                fullWidth
                helperText={touched.customer_name && errors.customer_name}
                label="Customer name"
                name="customer_name"
                margin="dense"
                size="small"
                customer_name="customer_name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.customer_name}
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
            <Grid item key="payment_status" className={classes.field}>
              <TextField
                error={Boolean(touched.payment_status && errors.payment_status)}
                helperText={touched.payment_status && errors.payment_status}
                label="Payment Status"
                name="payment_status"
                margin="dense"
                size="small"
                fullWidth
                select
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.payment_status}
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
            <Grid item key="shipping_status" className={classes.field}>
              <TextField
                error={Boolean(touched.shipping_status && errors.shipping_status)}
                helperText={touched.shipping_status && errors.shipping_status}
                label="Shipping Status"
                name="shipping_status"
                margin="dense"
                size="small"
                fullWidth
                select
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.shipping_status}
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
            <Grid item key="start_date" className={classes.field}>
              <TextField
                error={Boolean(touched.start_date && errors.start_date)}
                helperText={touched.start_date && errors.start_date}
                label="Start Date"
                name="start_date"
                type="date"
                margin="dense"
                size="small"
                fullWidth
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.start_date}
                variant="outlined"
                className={classes.field}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item key="end_date" className={classes.field}>
              <TextField
                error={Boolean(touched.end_date && errors.end_date)}
                helperText={touched.end_date && errors.end_date}
                label="End Date"
                name="end_date"
                type="date"
                margin="dense"
                size="small"
                fullWidth
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.end_date}
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
