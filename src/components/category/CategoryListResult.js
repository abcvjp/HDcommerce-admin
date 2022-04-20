import { useState, useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { CategoryListContext } from 'src/utils/contexts';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  Checkbox,
  Button,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  LinearProgress
} from '@material-ui/core';
import { openConfirmDialog } from 'src/actions/confirmDialog';

import { categoryApi } from 'src/utils/api';
import StatusLabel from '../StatusLabel';

const CategoryListResults = () => {
  const dispatchGlobal = useDispatch();
  const { state, dispatch } = useContext(CategoryListContext);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const { categories } = state;
  // const selectedCategories = categories.filter((item) => selectedCategoryIds.includes(item.id));

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
    let newSelectedCategoryIds;

    if (event.target.checked) {
      newSelectedCategoryIds = categories.map((category) => category._id);
    } else {
      newSelectedCategoryIds = [];
    }

    setSelectedCategoryIds(newSelectedCategoryIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCategoryIds.indexOf(id);
    let newSelectedCategoryIds = [];

    if (selectedIndex === -1) {
      newSelectedCategoryIds = newSelectedCategoryIds.concat(selectedCategoryIds, id);
    } else if (selectedIndex === 0) {
      newSelectedCategoryIds = newSelectedCategoryIds.concat(selectedCategoryIds.slice(1));
    } else if (selectedIndex === selectedCategoryIds.length - 1) {
      newSelectedCategoryIds = newSelectedCategoryIds.concat(selectedCategoryIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedCategoryIds = newSelectedCategoryIds.concat(
        selectedCategoryIds.slice(0, selectedIndex),
        selectedCategoryIds.slice(selectedIndex + 1)
      );
    }

    setSelectedCategoryIds(newSelectedCategoryIds);
  };

  const handleDeleteSelected = useCallback(() => {
    dispatchGlobal(openConfirmDialog({
      message: 'Are you sure want to delete all selected categories?',
      onConfirm: async () => {
        await categoryApi.deleteCategories(selectedCategoryIds);
        setSelectedCategoryIds([]);
        dispatch({
          type: 'TRIGGER_FETCH'
        });
      }
    }));
  }, [selectedCategoryIds]);

  // const checkPublishSelected = () => selectedCategories.every((item) => item.published === false);
  // const handlePublishSelected = () => {
  // dispatchGlobal(openConfirmDialog({
  // message: 'Are you sure want to publish all selected categories?',
  // onConfirm: async () => {
  // const categoriesTemp = selectedCategoryIds.map((id) => ({
  // id,
  // published: true
  // }));
  // await categoryApi.updateCategories(categoriesTemp);
  // dispatch({
  // type: 'UPDATE_CATEGORIES',
  // categories: categoriesTemp
  // });
  // setSelectedCategoryIds([]);
  // }
  // }));
  // };

  // const checkHideSelected = () => selectedCategories.every((item) => item.published === true);
  // const handleHideSelected = () => {
  // dispatchGlobal(openConfirmDialog({
  // message: 'Are you sure want to publish all selected categories?',
  // onConfirm: async () => {
  // const categoriesTemp = selectedCategoryIds.map((id) => ({
  // id,
  // published: false
  // }));
  // await categoryApi.updateCategories(categoriesTemp);
  // dispatch({
  // type: 'UPDATE_CATEGORIES',
  // categories: categoriesTemp
  // });
  // setSelectedCategoryIds([]);
  // }
  // }));
  // };

  return (
    <Card>
      <Box sx={{ minWidth: 1050 }}>
        {state.isLoading && <LinearProgress />}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedCategoryIds.length === categories.length}
                  color="primary"
                  indeterminate={
                      selectedCategoryIds.length > 0
                      && selectedCategoryIds.length < categories.length
                    }
                  onChange={handleSelectAll}
                />
              </TableCell>
              {selectedCategoryIds.length === 0
                ? (
                  <>
                    <TableCell>
                      Name
                    </TableCell>
                    <TableCell>
                      Path
                    </TableCell>
                    <TableCell>
                      Published
                    </TableCell>
                    <TableCell>
                      Created At
                    </TableCell>
                    <TableCell align="right">
                      Actions
                    </TableCell>
                  </>
                ) : (
                  <TableCell>
                    <Button
                      color="primary"
                      size="small"
                      variant="outlined"
                      onClick={handleDeleteSelected}
                    >
                      Delete
                    </Button>
                  </TableCell>
                )}
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow
                hover
                key={category._id}
                selected={selectedCategoryIds.indexOf(category._id) !== -1}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCategoryIds.indexOf(category._id) !== -1}
                    onChange={(event) => handleSelectOne(event, category._id)}
                    value="true"
                  />
                </TableCell>
                <TableCell>
                  <Link
                    target="_blank"
                    href={`${process.env.REACT_APP_APP_BASE}/${category.slug}`}
                  >
                    <Typography
                      color="textPrimary"
                      variant="body1"
                    >
                      {category.name}
                    </Typography>
                  </Link>
                </TableCell>
                <TableCell>
                  {category.path.join(' - ')}
                </TableCell>
                <TableCell>
                  {category.isPublic ? <StatusLabel status="Published" /> : <StatusLabel status="Unpublished" />}
                </TableCell>
                <TableCell>
                  {new Date(category.createdAt).toLocaleString('en-us')}
                </TableCell>
                <TableCell align="right">
                  <Box m={0.5} display="inline-block">
                    <Button
                      color="primary"
                      component={RouterLink}
                      size="small"
                      to={`${category._id}/edit`}
                      variant="outlined"
                    >
                      Edit
                    </Button>
                  </Box>
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

export default CategoryListResults;
