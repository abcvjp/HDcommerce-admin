import React, { useContext } from 'react';
import { OrderListContext } from 'src/utils/contexts';
import {
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputLabel,
  Select,
  Typography
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { Search as SearchIcon, RefreshCcw as RefreshIcon } from 'react-feather';
import { CSVLink } from 'react-csv';
import OrderListFilter from './OrderListFilter';

const sortOptions = [
  { name: 'Newest', value: '-createdAt' },
  { name: 'Oldest', value: 'createdAt' },
  { name: 'Updated recenly', value: '-updatedAt' },
  { name: 'Total (Low to High)', value: 'orderTotal' },
  { name: 'Total (High to Low)', value: '-orderTotal' },
];

const createHeader = (label, key) => ({ label, key });
const exportFileHeaders = [
  createHeader('Id', '_id'),
  createHeader('Code', 'code'),
  createHeader('User id', 'userId'),
  createHeader('Status', 'status'),
  createHeader('Order total', 'orderTotal'),
  createHeader('Item total', 'itemTotal'),
  createHeader('Delivery fee', 'deliveryFee'),
  createHeader('Payment status', 'paymentStatus'),
  createHeader('Shipping status', 'deliveryStatus'),
  createHeader('Customer name', 'customerInfo.name'),
  createHeader('Address', 'customerInfo.address'),
  createHeader('Email', 'customerInfo.email'),
  createHeader('Phone number', 'customerInfo.phoneNumber'),
  createHeader('Payment method id', 'paymentMethodId'),
  createHeader('Delivery method id', 'deliveryMethodId'),
  createHeader('Created at', 'createdAt'),
  createHeader('Last update', 'updatedAt')
];

const OrderListToolbar = () => {
  const { state, dispatch } = useContext(OrderListContext);

  const handleSortChange = (event) => {
    dispatch({
      type: 'CHANGE_SORT',
      sort: event.target.value
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
          data={state.orders}
          filename="orders.csv"
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
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box display="flex" alignItems="center">
                      <Box mr={1}>
                        <SearchIcon />
                      </Box>
                      <Typography>Search</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <OrderListFilter />
                  </AccordionDetails>
                </Accordion>
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
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default OrderListToolbar;
