import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography
} from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { red, green } from '@material-ui/core/colors';
import PropTypes from 'prop-types';
import { Sell } from '@material-ui/icons';

const TotalOrder = ({ data }) => (
  <Card
    sx={{ height: '100%' }}
  >
    <CardContent>
      <Grid
        container
        spacing={3}
        sx={{ justifyContent: 'space-between' }}
      >
        <Grid item>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="h6"
          >
            NEW ORDERS
          </Typography>
          <Typography
            color="textPrimary"
            variant="h3"
          >
            {data.now}
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: red[600],
              height: 56,
              width: 56
            }}
          >
            <Sell />
          </Avatar>
        </Grid>
      </Grid>
      <Box
        sx={{
          pt: 2,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {(data.now < data.before) ? <ArrowDownwardIcon sx={{ color: red[900] }} /> : <ArrowUpwardIcon sx={{ color: green[900] }} />}
        <Typography
          sx={{
            color: (data.now < data.before) ? red[900] : green[900],
            mr: 1
          }}
          variant="body2"
        >
          {parseInt(((data.now - data.before) * 100) / data.before, 10)}
          %
        </Typography>
        <Typography
          color="textSecondary"
          variant="caption"
        >
          Since last month
        </Typography>
      </Box>
    </CardContent>
  </Card>
);
TotalOrder.propTypes = {
  data: PropTypes.shape({
    now: PropTypes.number.isRequired,
    before: PropTypes.number.isRequired,
  })
};

export default TotalOrder;
