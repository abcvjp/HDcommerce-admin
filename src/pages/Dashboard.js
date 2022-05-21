import { Helmet } from 'react-helmet';
import {
  Box,
  Container,
  Grid
} from '@material-ui/core';
import Revenue from 'src/components/dashboard/Revenue';
import LatestOrders from 'src/components/dashboard//LatestOrders';
import LatestProducts from 'src/components/dashboard//LatestProducts';
import Sales from 'src/components/dashboard//Sales';
import FulfillmentRate from 'src/components/dashboard/FulfillmentRate';
import { useEffect, useState } from 'react';
import reportApi from 'src/utils/api/reportApi';
import TotalOrder from 'src/components/dashboard/TotalOrder';

const Dashboard = () => {
  const [saleData, setSaleData] = useState({
    days: [],
    months: []
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response1, response2] = await Promise.all([reportApi.getOrderReport({ limit: 7, type: 'day' }),
          reportApi.getOrderReport({ limit: 7, type: 'month' })]);
        setSaleData({
          days: response1.data.data.records,
          months: response2.data.data.records
        });
        console.log(saleData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <Helmet>
        <title>
          Dashboard |
          {' '}
          {process.env.REACT_APP_APP_NAME}
        </title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              lg={4}
              sm={6}
              xl={4}
              xs={12}
            >
              {saleData.months.length > 1 && (
              <Revenue data={{
                revenueToday: saleData.months[0].revenue,
                revenueYesterday: saleData.months[1].revenue
              }}
              />
              )}
            </Grid>
            <Grid
              item
              lg={4}
              sm={6}
              xl={4}
              xs={12}
            >
              {saleData.months.length > 1 && (
              <TotalOrder data={{
                now: saleData.months[0].orderNumber,
                before: saleData.months[1].orderNumber
              }}
              />
              )}
            </Grid>
            <Grid
              item
              lg={4}
              sm={6}
              xl={4}
              xs={12}
            >
              {saleData.months.length > 1 && (
              <FulfillmentRate data={parseInt((saleData.months[0].completedOrder * 100) / saleData.months[0].orderNumber, 10)} />
              )}
            </Grid>
            <Grid
              item
              lg={8}
              md={12}
              xl={8}
              xs={12}
            >
              {saleData.days
              && <Sales data={saleData.days} />}
            </Grid>
            <Grid
              item
              lg={4}
              md={6}
              xl={4}
              xs={12}
            >
              <LatestProducts sx={{ height: '100%' }} />
            </Grid>
            <Grid
              item
              lg={8}
              md={12}
              xl={8}
              xs={12}
            >
              <LatestOrders />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;
