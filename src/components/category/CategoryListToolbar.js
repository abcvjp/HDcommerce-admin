import React, { useState, useContext } from 'react';
import { CategoryListContext } from 'src/utils/contexts';
import { Link as RouterLink } from 'react-router-dom';
import {
  Grid,
  Box,
  Button,
  IconButton,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  InputLabel,
  Select,
  SvgIcon
} from '@material-ui/core';
import { Search as SearchIcon, RefreshCcw as RefreshIcon, X } from 'react-feather';

import { CSVLink } from 'react-csv';

const publishedOptions = [
  { name: 'All', value: '' },
  { name: 'Published', value: true },
  { name: 'Unpublished', value: false }
];

const createHeader = (label, key) => ({ label, key });
const exportFileHeaders = [
  createHeader('Id', 'id'),
  createHeader('Name', 'name'),
  createHeader('Parent id', 'parent_id'),
  createHeader('Path', 'path'),
  createHeader('Slug', 'slug'),
  createHeader('Published', 'published'),
  createHeader('Description', 'description'),
  createHeader('Meta title', 'meta_title'),
  createHeader('Meta description', 'meta_description'),
  createHeader('Meta keywords', 'meta_keywords'),
  createHeader('Created at', 'createdAt'),
  createHeader('Last update', 'updatedAt')
];

const CategoryListToolbar = (props) => {
  const { state, dispatch } = useContext(CategoryListContext); // eslint-disable-line
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearchEnter = () => {
    if (searchValue.length > 4) {
      dispatch({ type: 'SET_SEARCH', searchValue });
    }
  };

  const handleClearSearch = () => {
    setSearchValue('');
    dispatch({ type: 'SET_SEARCH', searchValue: '' });
  };

  const handlePublishedChange = (event) => {
    dispatch({
      type: 'CHANGE_PUBLISHED',
      isPublic: event.target.value
    });
  };

  return (
    <Box {...props}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end'
        }}
      >
        <CSVLink
          headers={exportFileHeaders}
          data={state.categories}
          filename="products.csv"
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
        <Button
          color="primary"
          variant="contained"
          component={RouterLink}
          to="create"
        >
          Add category
        </Button>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Grid container spacing={2} justifyContent="flex-start" alignItems="flex-end">
              <Grid item key="search">
                <Box sx={{ maxWidth: 600 }}>
                  <TextField
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SvgIcon
                            fontSize="small"
                            color="action"
                          >
                            <SearchIcon />
                          </SvgIcon>
                        </InputAdornment>
                      ),
                      endAdornment: searchValue.length > 4 ? (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClearSearch}>
                            <SvgIcon
                              fontSize="small"
                              color="action"
                            >
                              <X />
                            </SvgIcon>
                          </IconButton>
                        </InputAdornment>
                      ) : null
                    }}
                    placeholder="Search category"
                    variant="outlined"
                    value={searchValue}
                    onChange={handleSearchChange}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        handleSearchEnter();
                      }
                    }}
                  />
                </Box>
              </Grid>

              <Grid item key="isPublic">
                <InputLabel>Published</InputLabel>
                <Select
                  native
                  value={state.filters.isPublic}
                  onChange={handlePublishedChange}
                >
                  {publishedOptions.map((element) => <option key={element.name} value={element.value}>{element.name}</option>)}
                </Select>
              </Grid>

            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default CategoryListToolbar;
