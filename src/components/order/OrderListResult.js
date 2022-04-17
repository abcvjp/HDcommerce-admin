import { useState, useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { OrderListContext } from 'src/utils/contexts';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  Checkbox,
  Button,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  LinearProgress
} from '@material-ui/core';
import { openConfirmDialog } from '../../actions/confirmDialog';

import { orderApi } from '../../utils/api';
import OrderActions from './OrderActions';
import StatusLabel from '../StatusLabel';

const OrderListResults = () => {
  const dispatchGlobal = useDispatch();
  const { state, dispatch } = useContext(OrderListContext);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const { orders } = state;
  const selectedOrders = orders.filter((item) => selectedOrderIds.includes(item.id));

  const handleLimitChange = useCallback((event) => {
    dispatch({
      type: 'CHANGE_PAGE_SIZE',
      pageSize: event.target.value
    });
  }, []);

  const handlePageChange = useCallback((event, newPage) => {
    dispatch({
      type: 'CHANGE_CURRENT_PAGE',
      currentPage: newPage
    });
  }, []);

  const handleSelectAll = (event) => {
    let newSelectedOrderIds;

    if (event.target.checked) {
      newSelectedOrderIds = orders.map((order) => order.id);
    } else {
      newSelectedOrderIds = [];
    }

    setSelectedOrderIds(newSelectedOrderIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedOrderIds.indexOf(id);
    let newSelectedOrderIds = [];

    if (selectedIndex === -1) {
      newSelectedOrderIds = newSelectedOrderIds.concat(selectedOrderIds, id);
    } else if (selectedIndex === 0) {
      newSelectedOrderIds = newSelectedOrderIds.concat(selectedOrderIds.slice(1));
    } else if (selectedIndex === selectedOrderIds.length - 1) {
      newSelectedOrderIds = newSelectedOrderIds.concat(selectedOrderIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedOrderIds = newSelectedOrderIds.concat(
        selectedOrderIds.slice(0, selectedIndex),
        selectedOrderIds.slice(selectedIndex + 1)
      );
    }

    setSelectedOrderIds(newSelectedOrderIds);
  };

  const handleDeleteSelected = useCallback(() => {
    dispatchGlobal(openConfirmDialog({
      message: 'Are you sure want to delete all selected orders?',
      onConfirm: async () => {
        await orderApi.deleteOrders(selectedOrderIds);
        setSelectedOrderIds([]);
        dispatch({
          type: 'TRIGGER_FETCH'
        });
      }
    }));
  }, [selectedOrderIds]);

  const checkConfirmSelected = () => selectedOrders.every((item) => item.status === 'Pending');
  const handleConfirmSelected = () => {
    dispatchGlobal(openConfirmDialog({
      message: 'Are you sure want to comfirm all selected orders?',
      onConfirm: async () => {
        const ordersTemp = selectedOrderIds.map((id) => ({
          id,
          status: 'Handling'
        }));
        await orderApi.updateOrdersStatus(ordersTemp);
        dispatch({
          type: 'UPDATE_ORDERS',
          orders: ordersTemp
        });
        setSelectedOrderIds([]);
      }
    }));
  };

  const checkCancelSelected = () => selectedOrders.every((item) => item.status !== 'Completed' && item.status !== 'Canceled');
  const handleCancelSelected = () => {
    dispatchGlobal(openConfirmDialog({
      message: 'Are you sure want to cancel all selected orders?',
      onConfirm: async () => {
        const ordersTemp = selectedOrderIds.map((id) => ({
          id,
          status: 'Canceled'
        }));
        await orderApi.updateOrdersStatus(ordersTemp);
        dispatch({
          type: 'UPDATE_ORDERS',
          orders: ordersTemp
        });
        setSelectedOrderIds([]);
      }
    }));
  };

  const checkCompletedSelected = () => selectedOrders.every((item) => item.status === 'Handling');
  const handleCompleteSelected = () => {
    dispatchGlobal(openConfirmDialog({
      message: 'Are you sure want to complete all selected orders?',
      onConfirm: async () => {
        const ordersTemp = selectedOrderIds.map((id) => ({
          id,
          status: 'Completed',
          payment_status: 'Paid',
          shipping_status: 'Successfully delivered'
        }));
        await orderApi.updateOrdersStatus(ordersTemp);
        dispatch({
          type: 'UPDATE_ORDERS',
          orders: ordersTemp
        });
        setSelectedOrderIds([]);
      }
    }));
  };

  return (
    <Card>
      <Box sx={{ minWidth: 1050 }}>
        {state.isLoading && <LinearProgress />}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedOrderIds.length === orders.length}
                  color="primary"
                  indeterminate={
                      selectedOrderIds.length > 0
                      && selectedOrderIds.length < orders.length
                    }
                  onChange={handleSelectAll}
                />
              </TableCell>
              {selectedOrderIds.length === 0
                ? (
                  <>
                    <TableCell align="left">
                      Id
                    </TableCell>
                    <TableCell align="left">
                      Created At
                    </TableCell>
                    <TableCell align="left">
                      Customer Info
                    </TableCell>
                    <TableCell align="left">
                      Order Total
                    </TableCell>
                    <TableCell align="left">
                      Status
                    </TableCell>
                    <TableCell align="left">
                      Payment status
                    </TableCell>
                    <TableCell align="left">
                      Shipping status
                    </TableCell>
                    <TableCell align="right">
                      Actions
                    </TableCell>
                  </>
                ) : (
                  <TableCell style={{ width: '100%' }}>
                    <Box display="inline-block">
                      <Button
                        color="primary"
                        size="small"
                        variant="outlined"
                        onClick={handleDeleteSelected}
                      >
                        Delete
                      </Button>
                    </Box>
                    {checkConfirmSelected() && (
                    <Box m={0.5} display="inline-block">
                      <Button
                        color="primary"
                        size="small"
                        variant="outlined"
                        onClick={handleConfirmSelected}
                      >
                        Confirm
                      </Button>
                    </Box>
                    )}
                    {checkCompletedSelected() && (
                    <Box m={0.5} display="inline-block">
                      <Button
                        color="primary"
                        size="small"
                        variant="outlined"
                        onClick={handleCompleteSelected}
                      >
                        Complete
                      </Button>
                    </Box>
                    )}
                    {checkCancelSelected() && (
                    <Box m={0.5} display="inline-block">
                      <Button
                        color="primary"
                        size="small"
                        variant="outlined"
                        onClick={handleCancelSelected}
                      >
                        Cancel
                      </Button>
                    </Box>
                    )}
                  </TableCell>
                )}
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                hover
                key={order.id}
                selected={selectedOrderIds.indexOf(order.id) !== -1}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedOrderIds.indexOf(order.id) !== -1}
                    onChange={(event) => handleSelectOne(event, order.id)}
                    value="true"
                  />
                </TableCell>
                <TableCell align="left">
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex'
                    }}
                  >
                    <Link
                      component={RouterLink}
                      to={order.id}
                    >
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {order.id}
                      </Typography>
                    </Link>
                  </Box>
                </TableCell>
                <TableCell align="left">
                  {(new Date(order.createdAt)).toLocaleString('en-US')}
                </TableCell>
                <TableCell
                  align="left"
                  style={{
                    whiteSpace: 'normal',
                    wordWrap: 'break-word'
                  }}
                >
                  {`${order.customer_name} - ${order.email} - ${order.phone_number}`}
                </TableCell>
                <TableCell align="left">
                  {order.order_total}
                </TableCell>
                <TableCell align="left">
                  <StatusLabel status={order.status} size="small" />
                </TableCell>
                <TableCell align="left">
                  <StatusLabel status={order.payment_status} size="small" />
                </TableCell>
                <TableCell align="left">
                  <StatusLabel status={order.shipping_status} size="small" />
                </TableCell>
                <TableCell align="right">
                  <OrderActions orderId={order.id} status={order.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <TablePagination
        component="div"
        count={state.count}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={state.currentPage}
        rowsPerPage={state.pageSize}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

export default OrderListResults;
