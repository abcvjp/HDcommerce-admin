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
      const response = await orderApi.getOrders({ sort: 'createdAt.desc', page_size: 7 });
      setOrders(response.data.data);
    };
    fetchOrders();
  }, []);
  return (
    <Card>
      <CardHeader title="Latest Orders" />
      <Divider />
      <Box sx={{ minWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell size="small">
                Order ID
              </TableCell>
              <TableCell>
                Customer
              </TableCell>
              <TableCell sortDirection="desc">
                Date
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
                key={order.id}
              >
                <TableCell size="small">
                  {order.id}
                </TableCell>
                <TableCell>
                  {order.customer_name}
                </TableCell>
                <TableCell>
                  {moment(order.createdAt).format('DD/MM/YYYY')}
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
