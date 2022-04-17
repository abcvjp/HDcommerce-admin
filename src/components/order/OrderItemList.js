import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  TableRow,
  Box,
  Avatar,
  Typography
} from '@material-ui/core';
import { Link } from 'react-router-dom';

const OrderItemList = ({ items }) => (
  <TableContainer>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Product</TableCell>
          <TableCell align="left">Price</TableCell>
          <TableCell align="left">Quantity</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.product_id} hover>
            <TableCell>
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  padding: 2
                }}
              >
                <Avatar
                  src={item.product_thumbnail}
                  sx={{ mr: 2 }}
                  variant="rounded"
                />
                <Typography
                  color="textPrimary"
                  variant="body1"
                  component={Link}
                  to={`/management/product/${item.product_id}/edit`}
                >
                  {item.product_name}
                </Typography>
              </Box>
            </TableCell>
            <TableCell align="left">{`$${item.price}`}</TableCell>
            <TableCell align="left">{item.quantity}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);
OrderItemList.propTypes = {
  items: PropTypes.array.isRequired
};
export default OrderItemList;
