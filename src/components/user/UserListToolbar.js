import React, { useContext } from 'react';
import { UserListContext } from 'src/utils/contexts';
// import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputLabel,
  Select,
  Typography
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { Search as SearchIcon, RefreshCcw as RefreshIcon } from 'react-feather';
import { CSVLink } from 'react-csv';
import UserListFilter from './UserListFilter';

const sortOptions = [
  { name: 'Newest', value: '-createdAt' },
  { name: 'Oldest', value: '+createdAt' },
  { name: 'Updated recently', value: '-updatedAt' },
];

const createHeader = (label, key) => ({ label, key });
const exportFileHeaders = [
  createHeader('Id', 'id'),
  createHeader('Role', 'role'),
  createHeader('Enable', 'enable'),
  createHeader('Username', 'username'),
  createHeader('Email', 'email'),
  createHeader('Full name', 'full_name'),
  createHeader('Phone number', 'phone_number'),
  createHeader('Avatar', 'avatar'),
  createHeader('Created at', 'createdAt'),
  createHeader('Last update', 'updatedAt')
];

const UserListToolbar = () => {
  const { state, dispatch } = useContext(UserListContext);

  const handleSortChange = (event) => {
    dispatch({
      type: 'CHANGE_SORT',
      sort: event.target.value
    });
  };

  return (
    <Box>
      <Box
        key={1}
        sx={{
          display: 'flex',
          justifyContent: 'flex-end'
        }}
      >
        <CSVLink
          headers={exportFileHeaders}
          data={state.users}
          filename="users.csv"
        >
          <Button key="export" sx={{ mx: 1 }}>
            Export
          </Button>
        </CSVLink>
        <Button
          key="refresh"
          color="primary"
          variant="contained"
          sx={{ mx: 1 }}
          onClick={() => dispatch({ type: 'REFRESH' })}
        >
          <RefreshIcon />
        </Button>
        {
          // <Button
          // key="add product"
          // color="primary"
          // variant="contained"
          // component={RouterLink}
          // to="add"
        // >
          // Add user
        // </Button>
        }
      </Box>
      <Box key={2} sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Grid container spacing={2} direction="column">
              <Grid item key="filters">
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box display="flex" alignItems="center">
                      <Box mr={1}>
                        <SearchIcon />
                      </Box>
                      <Typography>Search</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <UserListFilter />
                  </AccordionDetails>
                </Accordion>
              </Grid>
              <Grid item key="sort">
                <InputLabel>Sort</InputLabel>
                <Select native value={state.sort} onChange={handleSortChange}>
                  {sortOptions.map((element) => (
                    <option key={element.name} value={element.value}>
                      {element.name}
                    </option>
                  ))}
                </Select>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default UserListToolbar;
