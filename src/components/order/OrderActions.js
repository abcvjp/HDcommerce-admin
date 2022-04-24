import React, { useContext } from 'react';
import { useNavigate } from 'react-router';

import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { Button, ButtonGroup } from '@material-ui/core';
import { orderApi } from 'src/utils/api';

import { openConfirmDialog } from 'src/actions/confirmDialog';
import { OrderListContext } from 'src/utils/contexts';

const OrderActions = ({
  orderId, status
}) => {
  const dispatchGlobal = useDispatch();
  const navigate = useNavigate();
  const { dispatch } = useContext(OrderListContext);
  const handleConfirmOrder = () => {
    dispatchGlobal(openConfirmDialog({
      message: 'Are you sure want to confirm this order?',
      onConfirm: async () => {
        await orderApi.confirmOrder(orderId);
        dispatch({
          type: 'UPDATE_ORDER',
          order: { _id: orderId, status: 'Handling' }
        });
      }
    }));
  };
  const handleCompleteOrder = () => {
    dispatchGlobal(openConfirmDialog({
      message: 'Are you sure want to complete this order?',
      onConfirm: async () => {
        await orderApi.completeOrder(orderId);
        dispatch({
          type: 'UPDATE_ORDER',
          order: {
            _id: orderId,
            status: 'Completed',
            paymentStatus: 'Paid',
            deliveryStatus: 'SUCCESS'
          }
        });
      }
    }));
  };
  const handleCancelOrder = () => {
    dispatchGlobal(openConfirmDialog({
      message: 'Are you sure want to cancel this order?',
      onConfirm: async () => {
        await orderApi.cancelOrder(orderId);
        dispatch({
          type: 'UPDATE_ORDER',
          order: { _id: orderId, status: 'Canceled' }
        });
      }
    }));
  };
  const handleViewOrder = () => {
    navigate(orderId);
  };
  return (
    <ButtonGroup color="primary" aria-label="outlined primary button group">
      <Button onClick={handleViewOrder}>
        View
      </Button>
      {status === 'Pending' && (
        <Button onClick={handleConfirmOrder}>
          Confirm
        </Button>
      )}
      {status === 'Handling' && (
      <Button onClick={handleCompleteOrder}>
        Complete
      </Button>
      )}
      {status !== 'Completed' && status !== 'Canceled' && (
      <Button onClick={handleCancelOrder}>
        Cancel
      </Button>
      )}
    </ButtonGroup>
  );
};
OrderActions.propTypes = {
  orderId: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired
};
export default OrderActions;
