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
import MoneyIcon from '@material-ui/icons/Money';
import { red, green } from '@material-ui/core/colors';
import PropTypes from 'prop-types';

const Revenue = ({ data }) => (
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
            REVENUE
          </Typography>
          <Typography
            color="textPrimary"
            variant="h3"
          >
            $
            {data.revenueToday}
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
            <MoneyIcon />
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
        {(data.revenueToday < data.revenueYesterday) ? <ArrowDownwardIcon sx={{ color: red[900] }} /> : <ArrowUpwardIcon sx={{ color: green[900] }} />}
        <Typography
          sx={{
            color: (data.revenueToday < data.revenueYesterday) ? red[900] : green[900],
            mr: 1
          }}
          variant="body2"
        >
          {parseInt(((data.revenueToday - data.revenueYesterday) * 100) / data.revenueYesterday, 10)}
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
Revenue.propTypes = {
  data: PropTypes.shape({
    revenueToday: PropTypes.number.isRequired,
    revenueYesterday: PropTypes.number.isRequired,
  })
};

export default Revenue;
