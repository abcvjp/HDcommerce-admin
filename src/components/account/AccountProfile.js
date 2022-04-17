import { useSelector } from 'react-redux';
import moment from 'moment';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@material-ui/core';

const AccountProfile = (props) => {
  const user = useSelector((state) => state.user);
  return (
    <Card {...props}>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Avatar
            src={user.avatar}
            sx={{
              height: 100,
              width: 100
            }}
          />
          <Typography color="textPrimary" gutterBottom variant="h3">
            {user.username}
          </Typography>
          <Typography color="textSecondary" variant="body1">
            {user.full_name}
          </Typography>
          <Typography color="textSecondary" variant="body1">
            {`Joined from ${moment(user.createdAt).format('YYYY-MM-DD')}`}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button color="primary" fullWidth variant="text">
          Upload picture
        </Button>
      </CardActions>
    </Card>
  );
};

export default AccountProfile;
