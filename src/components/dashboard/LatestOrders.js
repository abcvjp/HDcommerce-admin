import { useState, useEffect } from 'react';
import moment from 'moment';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { orderApi } from 'src/utils/api';
import StatusLabel from '../StatusLabel';

const LatestOrders = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchOrders = async () => {
      const response = await orderApi.getOrders({ limit: 7 });
      setOrders(response.data.data.records);
    };
    fetchOrders();
  }, []);
  return (
    <Card>
      <CardHeader title="Latest Orders" />
      <Divider />
      <Box sx={{ minWidth: 600 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Code
              </TableCell>
              <TableCell>
                Customer
              </TableCell>
              <TableCell sortDirection="desc">
                Date
              </TableCell>
              <TableCell>
                Total
              </TableCell>
              <TableCell>
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                hover
                key={order._id}
              >
                <TableCell>
                  {order.code}
                </TableCell>
                <TableCell>
                  {order.customerInfo.name}
                </TableCell>
                <TableCell>
                  {moment(order.createdAt).format('DD-MM-YYYY HH:mm')}
                </TableCell>
                <TableCell>
                  {order.orderTotal}
                </TableCell>
                <TableCell>
                  <StatusLabel status={order.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2
        }}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
          component={RouterLink}
          to="/management/order"
        >
          View all
        </Button>
      </Box>
    </Card>
  );
};

export default LatestOrders;
