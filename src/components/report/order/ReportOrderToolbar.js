import React, { useContext } from 'react';
import { ReportOrderContext } from 'src/utils/contexts';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  InputLabel,
  TextField,
  Select,
} from '@material-ui/core';
import { RefreshCcw as RefreshIcon } from 'react-feather';

import { CSVLink } from 'react-csv';

const sortOptions = [
  { name: 'Newest', value: 'day.desc' },
  { name: 'Oldest', value: 'day.asc' },
  { name: 'Updated recenly', value: 'updatedAt.desc' },
  { name: 'Total (Low to High)', value: 'order_total.asc' },
  { name: 'Total (High to Low)', value: 'order_total.desc' },
];

const groupByOptions = [
  { name: 'Day', value: 'day' },
  { name: 'Week', value: 'week' },
  { name: 'Month', value: 'month' },
  { name: 'Year', value: 'year' }
];

const createHeader = (label, key) => ({ label, key });
const exportFileHeaders = [
  createHeader('Time', 'time'),
  createHeader('Number of orders', 'orders_number'),
  createHeader('Number of completed orders', 'completed_orders_number'),
  createHeader('Number of items', 'items_number'),
  createHeader('Item total ($)', 'item_total'),
  createHeader('Shipping fee total ($)', 'shipping_fee'),
  createHeader('Order total ($)', 'order_total'),
  createHeader('Expected profit ($)', 'expected_profit')
];

const ReportOrderToolbar = () => {
  const { state, dispatch } = useContext(ReportOrderContext);

  const handleSortChange = (event) => {
    dispatch({
      type: 'CHANGE_SORT',
      sort: event.target.value
    });
  };

  const handleGroupByChange = (event) => {
    dispatch({
      type: 'CHANGE_GROUP_BY',
      groupBy: event.target.value
    });
  };

  return (
    <Box>
      <Box
        key={1}
        sx={{
          display: 'flex',
          justifyContent: 'flex-end'
        }}
      >
        <CSVLink
          headers={exportFileHeaders}
          data={state.reports}
          filename="order-reports.csv"
        >
          <Button key="export" sx={{ mx: 1 }}>
            Export
          </Button>
        </CSVLink>

        <Button
          key="refresh"
          color="primary"
          variant="contained"
          sx={{ mx: 1 }}
          onClick={() => dispatch({ type: 'REFRESH' })}
        >
          <RefreshIcon />
        </Button>
      </Box>
      <Box key={2} sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Grid container spacing={2} direction="column">
              <Grid item key="filters">
                <Formik
                  initialValues={{ ...state.filters }}
                  validationSchema={Yup.object().shape({
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
                        <Grid item key="start_date">
                          <TextField
                            error={Boolean(touched.start_date && errors.start_date)}
                            helperText={touched.start_date && errors.start_date}
                            label="Start Date"
                            name="start_date"
                            type="date"
                            margin="normal"
                            size="small"
                            fullWidth
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.start_date}
                            variant="outlined"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                        <Grid item key="end_date">
                          <TextField
                            error={Boolean(touched.end_date && errors.end_date)}
                            helperText={touched.end_date && errors.end_date}
                            label="End Date"
                            name="end_date"
                            type="date"
                            margin="normal"
                            size="small"
                            fullWidth
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.end_date}
                            variant="outlined"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                        <Grid item key="submit">
                          <Box sx={{ py: 2 }}>
                            <Button
                              color="primary"
                              type="submit"
                              variant="contained"
                            >
                              Apply
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </form>
                  )}
                </Formik>
              </Grid>
              <Grid item key="sort">
                <InputLabel>Sort</InputLabel>
                <Select
                  native
                  value={state.sort}
                  onChange={handleSortChange}
                >
                  {
                    sortOptions.map((element) => <option key={element.name} value={element.value}>{element.name}</option>)
                  }
                </Select>
              </Grid>
              <Grid item key="groupBy">
                <InputLabel>Group By</InputLabel>
                <Select
                  native
                  value={state.group_by}
                  onChange={handleGroupByChange}
                >
                  {
                    groupByOptions.map((element) => <option key={element.name} value={element.value}>{element.name}</option>)
                  }
                </Select>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default ReportOrderToolbar;
