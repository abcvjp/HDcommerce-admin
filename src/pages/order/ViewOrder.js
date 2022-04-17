import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router';
import OrderDetail from 'src/components/order/OrderDetail';
import ViewOrderToolbar from 'src/components/order/ViewOrderToolbar';
import { orderApi } from 'src/utils/api';
import Page from '../../components/Page';

const ViewOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  useEffect(() => {
    const fetchOrder = async () => {
      const response = await orderApi.getOrder(orderId);
      setOrder(response.data.data);
    };
    fetchOrder();
  }, [orderId]);
  return (
    <Page
      title={`Order ${orderId}`}
      toolbar={<ViewOrderToolbar />}
      main={order ? <OrderDetail order={order} /> : <></>}
    />
  );
};

export default ViewOrder;
