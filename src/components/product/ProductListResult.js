import { useState, useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { ProductListContext } from 'src/utils/contexts';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  Checkbox,
  Avatar,
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
import { openConfirmDialog } from '../../actions/confirmDialog';

import { productApi } from '../../utils/api';
import StatusLabel from '../StatusLabel';

const ProductListResults = () => {
  const dispatchGlobal = useDispatch();
  const { state, dispatch } = useContext(ProductListContext);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const { products } = state;

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
    let newSelectedProductIds;

    if (event.target.checked) {
      newSelectedProductIds = products.map((product) => product._id);
    } else {
      newSelectedProductIds = [];
    }

    setSelectedProductIds(newSelectedProductIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedProductIds.indexOf(id);
    let newSelectedProductIds = [];

    if (selectedIndex === -1) {
      newSelectedProductIds = newSelectedProductIds.concat(selectedProductIds, id);
    } else if (selectedIndex === 0) {
      newSelectedProductIds = newSelectedProductIds.concat(selectedProductIds.slice(1));
    } else if (selectedIndex === selectedProductIds.length - 1) {
      newSelectedProductIds = newSelectedProductIds.concat(selectedProductIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedProductIds = newSelectedProductIds.concat(
        selectedProductIds.slice(0, selectedIndex),
        selectedProductIds.slice(selectedIndex + 1)
      );
    }

    setSelectedProductIds(newSelectedProductIds);
  };

  const handleDeleteSelected = () => {
    dispatchGlobal(openConfirmDialog({
      message: 'Are you sure want to delete all selected products?',
      onConfirm: async () => {
        await productApi.deleteProducts(selectedProductIds);
        setSelectedProductIds([]);
        dispatch({
          type: 'TRIGGER_FETCH'
        });
      }
    }));
  };

  const handleDisableSelected = () => {
    dispatchGlobal(openConfirmDialog({
      message: 'Are you sure want to disable all selected products?',
      onConfirm: async () => {
        const productsToDisable = selectedProductIds.map((id) => ({
          id,
          isEnabled: false
        }));
        await productApi.updateProducts(productsToDisable);
        selectedProductIds.forEach((id) => {
          products[products.findIndex((item) => item._id === id)].isEnabled = false; //eslint-disable-line
        });
        setSelectedProductIds([]);
      }
    }));
  };

  const handleEnableSelected = () => {
    dispatchGlobal(openConfirmDialog({
      message: 'Are you sure want to enable all selected products?',
      onConfirm: async () => {
        const productsToEnable = selectedProductIds.map((id) => ({
          id,
          isEnabled: true
        }));
        await productApi.updateProducts(productsToEnable);
        selectedProductIds.forEach((id) => {
          products[products.findIndex((item) => item._id === id)].isEnabled = true; //eslint-disable-line
        });
        setSelectedProductIds([]);
      }
    }));
  };

  return (
    <Card>
      <Box sx={{ minWidth: 1050 }}>
        {state.isLoading && <LinearProgress />}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedProductIds.length === products.length}
                  color="primary"
                  indeterminate={
                      selectedProductIds.length > 0
                      && selectedProductIds.length < products.length
                    }
                  onChange={handleSelectAll}
                />
              </TableCell>
              {selectedProductIds.length === 0
                ? (
                  <>
                    <TableCell>
                      Name
                    </TableCell>
                    <TableCell>
                      Category
                    </TableCell>
                    <TableCell>
                      Enabled
                    </TableCell>
                    <TableCell>
                      Published
                    </TableCell>
                    <TableCell>
                      Price
                    </TableCell>
                    <TableCell>
                      Quantity
                    </TableCell>
                    <TableCell>
                      Sold
                    </TableCell>
                    <TableCell align="right">
                      Actions
                    </TableCell>
                  </>
                ) : (
                  <TableCell>
                    <Box m={0.5} display="inline-block">
                      <Button
                        color="primary"
                        size="small"
                        variant="outlined"
                        onClick={handleDeleteSelected}
                      >
                        Delete
                      </Button>
                    </Box>
                    <Box m={0.5} display="inline-block">
                      <Button
                        color="primary"
                        size="small"
                        variant="outlined"
                        onClick={handleDisableSelected}
                      >
                        Disable
                      </Button>
                    </Box>
                    <Box m={0.5} display="inline-block">
                      <Button
                        color="primary"
                        size="small"
                        variant="outlined"
                        onClick={handleEnableSelected}
                      >
                        Enable
                      </Button>
                    </Box>
                  </TableCell>
                )}
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow
                hover
                key={product._id}
                selected={selectedProductIds.indexOf(product._id) !== -1}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedProductIds.indexOf(product._id) !== -1}
                    onChange={(event) => handleSelectOne(event, product._id)}
                    value="true"
                  />
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                    }}
                  >
                    <Avatar
                      src={product.thumbnail ? product.thumbnail : null}
                      sx={{ mr: 2 }}
                      variant="rounded"
                    />
                    <Link
                      target="_blank"
                      href={`${process.env.REACT_APP_APP_BASE}/product/${product.slug}`}
                    >
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {product.name}
                      </Typography>
                    </Link>
                  </Box>
                </TableCell>
                <TableCell>
                  <Link component={RouterLink} to={`/management/category/${product.category._id}/edit`}>
                    {product.category.name}
                  </Link>
                </TableCell>
                <TableCell>
                  {product.isEnabled
                    ? <StatusLabel status="ENABLED" />
                    : <StatusLabel status="DISABLED" />}
                </TableCell>
                <TableCell>
                  {product.isPublic
                    ? <StatusLabel status="Published" />
                    : <StatusLabel status="Unpublished" />}
                </TableCell>
                <TableCell>
                  {product.price}
                </TableCell>
                <TableCell>
                  {product.stockQuantity}
                </TableCell>
                <TableCell>
                  {product.soldQuantity}
                </TableCell>
                <TableCell align="right">
                  <Box m={0.5} display="inline-block">
                    <Button
                      color="primary"
                      component={RouterLink}
                      size="small"
                      to={`${product._id}/edit`}
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

export default ProductListResults;
