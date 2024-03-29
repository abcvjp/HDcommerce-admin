import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Typography
} from '@material-ui/core';
import { orange } from '@material-ui/core/colors';
import InsertChartIcon from '@material-ui/icons/InsertChartOutlined';
import PropTypes from 'prop-types';

const FulfillmentRate = ({ data }) => (
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
            FULFILLMENT RATE
          </Typography>
          <Typography
            color="textPrimary"
            variant="h3"
          >
            {data}
            %
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: orange[600],
              height: 56,
              width: 56
            }}
          >
            <InsertChartIcon />
          </Avatar>
        </Grid>
      </Grid>
      <Box sx={{ pt: 3 }}>
        <LinearProgress
          value={data}
          variant="determinate"
        />
      </Box>
    </CardContent>
  </Card>
);

FulfillmentRate.propTypes = {
  data: PropTypes.number.isRequired
};

export default FulfillmentRate;
