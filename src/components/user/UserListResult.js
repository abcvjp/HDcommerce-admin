import { useState, useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { UserListContext } from 'src/utils/contexts';
import {
  Box,
  Card,
  Checkbox,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  LinearProgress,
  Avatar
} from '@material-ui/core';
import { openConfirmDialog } from '../../actions/confirmDialog';

import { userApi } from '../../utils/api';
import StatusLabel from '../StatusLabel';
import UserActions from './UserActions';

const UserListResults = () => {
  const dispatchGlobal = useDispatch();
  const { state, dispatch } = useContext(UserListContext);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const { users } = state;

  const handleLimitChange = useCallback((event) => {
    dispatch({
      type: 'CHANGE_PAGE_SIZE',
      pageSize: event.target.value
    });
  }, []);

  const handlePageChange = useCallback((event, newPage) => {
    dispatch({
      type: 'CHANGE_CURRENT_PAGE',
      currentPage: newPage
    });
  }, []);

  const handleSelectAll = (event) => {
    let newSelectedUserIds;

    if (event.target.checked) {
      newSelectedUserIds = users.map((user) => user.id);
    } else {
      newSelectedUserIds = [];
    }

    setSelectedUserIds(newSelectedUserIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedUserIds.indexOf(id);
    let newSelectedUserIds = [];

    if (selectedIndex === -1) {
      newSelectedUserIds = newSelectedUserIds.concat(selectedUserIds, id);
    } else if (selectedIndex === 0) {
      newSelectedUserIds = newSelectedUserIds.concat(selectedUserIds.slice(1));
    } else if (selectedIndex === selectedUserIds.length - 1) {
      newSelectedUserIds = newSelectedUserIds.concat(selectedUserIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedUserIds = newSelectedUserIds.concat(
        selectedUserIds.slice(0, selectedIndex),
        selectedUserIds.slice(selectedIndex + 1)
      );
    }

    setSelectedUserIds(newSelectedUserIds);
  };

  const handleDeleteSelected = useCallback(() => {
    dispatchGlobal(openConfirmDialog({
      message: 'Are you sure want to delete all selected users?',
      onConfirm: async () => {
        await userApi.deleteUsers(selectedUserIds);
        setSelectedUserIds([]);
        dispatch({
          type: 'TRIGGER_FETCH'
        });
      }
    }));
  }, [selectedUserIds]);

  return (
    <Card>
      <Box sx={{ minWidth: 1050 }}>
        {state.isLoading && <LinearProgress />}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedUserIds.length === users.length}
                  color="primary"
                  indeterminate={
                      selectedUserIds.length > 0
                      && selectedUserIds.length < users.length
                    }
                  onChange={handleSelectAll}
                />
              </TableCell>
              {selectedUserIds.length === 0
                ? (
                  <>
                    <TableCell align="left">
                      Avatar
                    </TableCell>
                    <TableCell align="left">
                      Full name
                    </TableCell>
                    <TableCell align="left">
                      User name
                    </TableCell>
                    <TableCell align="left">
                      Email
                    </TableCell>
                    <TableCell align="left">
                      Phone
                    </TableCell>
                    <TableCell align="left">
                      Enable
                    </TableCell>
                    <TableCell align="left">
                      Registration date
                    </TableCell>
                    <TableCell align="right">
                      Actions
                    </TableCell>
                  </>
                ) : (
                  <TableCell>
                    <Box display="inline-block">
                      <Button
                        color="primary"
                        size="small"
                        variant="outlined"
                        onClick={handleDeleteSelected}
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                )}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                hover
                key={user.id}
                selected={selectedUserIds.indexOf(user.id) !== -1}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedUserIds.indexOf(user.id) !== -1}
                    onChange={(event) => handleSelectOne(event, user.id)}
                    value="true"
                  />
                </TableCell>
                <TableCell align="left">
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex'
                    }}
                  >
                    <Avatar
                      src={user.avatar}
                      sx={{ mr: 2 }}
                    />
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <Typography
                    color="textPrimary"
                    variant="body1"
                  >
                    {user.full_name}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  {user.username}
                </TableCell>
                <TableCell
                  align="left"
                  style={{
                    whiteSpace: 'normal',
                    wordWrap: 'break-word'
                  }}
                >
                  {user.email}
                </TableCell>
                <TableCell align="left">
                  {user.phone_number}
                </TableCell>
                <TableCell align="left">
                  <StatusLabel status={user.enable ? 'ENABLED' : 'DISABLED'} size="small" />
                </TableCell>
                <TableCell align="left">
                  {moment(user.createdAt).format('YYYY-MM-DD')}
                </TableCell>
                <TableCell align="right">
                  <UserActions userId={user.id} userEnable={user.enable} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <TablePagination
        component="div"
        count={state.count}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={state.currentPage}
        rowsPerPage={state.pageSize}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

export default UserListResults;
