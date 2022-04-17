import React, { useContext } from 'react';
import { useNavigate } from 'react-router';

import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { Button, ButtonGroup } from '@material-ui/core';
import { userApi } from 'src/utils/api';

import { openConfirmDialog } from 'src/actions/confirmDialog';
import { UserListContext } from 'src/utils/contexts';

const UserActions = ({
  userId, userEnable
}) => {
  const dispatchGlobal = useDispatch();
  const navigate = useNavigate();
  const { dispatch } = useContext(UserListContext);
  const handleEnableUser = () => {
    dispatchGlobal(openConfirmDialog({
      message: 'Are you sure want to enable this user?',
      onConfirm: async () => {
        await userApi.enableUser(userId);
        dispatch({
          type: 'UPDATE_USER',
          user: { id: userId, enable: true }
        });
      }
    }));
  };
  const handleDisableUser = () => {
    dispatchGlobal(openConfirmDialog({
      message: 'Are you sure want to disable this user?',
      onConfirm: async () => {
        await userApi.disableUser(userId);
        dispatch({
          type: 'UPDATE_USER',
          user: {
            id: userId,
            enable: false
          }
        });
      }
    }));
  };
  const handleEditUser = () => {
    navigate(`${userId}/edit`);
  };
  return (
    <ButtonGroup color="primary" aria-label="outlined primary button group">
      <Button onClick={handleEditUser}>
        Edit
      </Button>
      {!userEnable && (
        <Button onClick={handleEnableUser}>
          Enable
        </Button>
      )}
      {userEnable && (
      <Button onClick={handleDisableUser}>
        Disable
      </Button>
      )}
    </ButtonGroup>
  );
};
UserActions.propTypes = {
  userId: PropTypes.string.isRequired,
  userEnable: PropTypes.bool.isRequired
};
export default UserActions;
