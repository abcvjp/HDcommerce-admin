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
  { name: 'Newest', value: 'day' },
  { name: 'Oldest', value: '-day' },
  { name: 'Updated recently', value: '-updatedAt' },
  { name: 'Total (Low to High)', value: 'orderTotal' },
  { name: 'Total (High to Low)', value: '-orderTotal' },
];

const groupByOptions = [
  { name: 'Day', value: 'day' },
  { name: 'Week', value: 'week' },
  { name: 'Month', value: 'month' },
  { name: 'Year', value: 'year' }
];

const createHeader = (label, key) => ({ label, key });
const exportFileHeaders = [
  createHeader('Time unit', '_id'),
  createHeader('Number of orders', 'orderNumber'),
  createHeader('Number of completed orders', 'completedOrder'),
  createHeader('Number of items', 'itemNumber'),
  // createHeader('Item total ($)', 'item_total'),
  createHeader('Delivery fee total ($)', 'deliveryFee'),
  createHeader('Order total ($)', 'orderTotal'),
  createHeader('Revenue', 'revenue')
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
                        <Grid item key="startDate">
                          <TextField
                            error={Boolean(touched.startDate && errors.startDate)}
                            helperText={touched.startDate && errors.startDate}
                            label="Start Date"
                            name="startDate"
                            type="date"
                            margin="normal"
                            size="small"
                            fullWidth
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.startDate}
                            variant="outlined"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                        <Grid item key="endDate">
                          <TextField
                            error={Boolean(touched.endDate && errors.endDate)}
                            helperText={touched.endDate && errors.endDate}
                            label="End Date"
                            name="endDate"
                            type="date"
                            margin="normal"
                            size="small"
                            fullWidth
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.endDate}
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
                  value={state.type}
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
