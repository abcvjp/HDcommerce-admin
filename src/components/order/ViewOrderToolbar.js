import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from '@material-ui/core';

const ViewOrderToolbar = () => (
  <Box>
    <Box
      key={1}
      sx={{
        display: 'flex',
        justifyContent: 'flex-end'
      }}
    >
      <Button key="export" sx={{ mx: 1 }}>
        Export
      </Button>
      <Button
        key="add product"
        color="primary"
        variant="contained"
        component={RouterLink}
        to="edit"
      >
        Edit order
      </Button>
    </Box>
    <Box key={2} sx={{ mt: 3 }}>
      <Card>
        <CardContent>
          <Typography>View order</Typography>
        </CardContent>
      </Card>
    </Box>
  </Box>
);

export default ViewOrderToolbar;
