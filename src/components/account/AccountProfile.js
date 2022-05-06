import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
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
import { useState } from 'react';
import { uploadImages } from 'src/utils/imageUploader';
import { userApi } from 'src/utils/api';
import { setUser } from 'src/actions/user';
import { Upload } from 'react-feather';
import { closeFullScreenLoading, openFullScreenLoading } from 'src/actions/fullscreenLoading';

const AccountProfile = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [avatarFile, setAvatarFile] = useState(null);
  const handleUploadAvatar = async () => {
    dispatch(openFullScreenLoading());
    try {
      const [avatarUrl] = await uploadImages([avatarFile]);
      const response = await userApi.updateUserInfo({ avatar: avatarUrl });
      dispatch(setUser(response.data.data));
    } catch (err) {
      console.log(err);
    }
    dispatch(closeFullScreenLoading());
  };
  console.log(avatarFile);
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
            src={avatarFile ? URL.createObjectURL(avatarFile.file) : user.avatar}
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
        {avatarFile ? (
          <Button color="primary" fullWidth variant="contained" disableElevation endIcon={<Upload />} onClick={handleUploadAvatar}>
            UPLOAD NEW AVATAR
          </Button>
        ) : (
          <Button color="primary" fullWidth variant="text" component="label">
            CHOOSE PICTURE
            <input
              type="file"
              accept=".jpg,.png"
              hidden
              onChange={(e) => {
                const file = e.target.files[0];
                const name = `${uuid()}.${file.name.split('.').pop()}`;
                setAvatarFile({ file, name });
              }}
            />
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default AccountProfile;
