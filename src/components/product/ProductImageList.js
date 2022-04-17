import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { v1 as uuid } from 'uuid';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  IconButton,
  TablePagination,
  Box,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { Delete } from '@material-ui/icons';
import { openConfirmDialog } from 'src/actions/confirmDialog';

// import { deleteImage } from 'src/utils/imageUploader';

const useStyles = makeStyles(() => ({
  root: {
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  imageItem: {
    width: '25%',

  },
  image: {
    maxHeight: '200px',
    maxWidth: '200px'
  },
  titleBar: {
    background: 'transparent'
  },
}));

const ProductImageList = ({ imageList, handleUpdateImages }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [images, setImages] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 8));
  };
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleDeleteImage = (i) => {
    dispatch(openConfirmDialog({
      message: 'Are you sure want to delete this image?',
      onConfirm: async () => {
        // const imageName = images[i].url.substr(images[i].url.lastIndexOf('/') + 1);
        // await deleteImage(imageName);
        const temp = [...images];
        temp.splice(i, 1);
        handleUpdateImages(temp);
      }
    }));
  };

  const handleChangeOrderImage = (index, order) => {
    images[index].order = order;
  };

  const handleUpdateOrder = () => handleUpdateImages(images.sort((a, b) => a.order - b.order));

  useEffect(() => {
    setImages(imageList.map((image, index) => ({ order: index, ...image })));
  }, [imageList]);

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell key="img" align="center">Picture</TableCell>
            <TableCell key="alt" align="center">Alt</TableCell>
            <TableCell key="title" align="center">Title</TableCell>
            <TableCell key="order" align="center">Order</TableCell>
            <TableCell key="action" align="center">Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {images.map((image, index) => (
            <TableRow key={uuid()}>
              <TableCell key="img" align="center">
                <img
                  className={classes.image}
                  src={image.url}
                  alt={image.alt}
                />
              </TableCell>
              <TableCell key="alt" align="center">
                {image.alt}
              </TableCell>
              <TableCell key="title" align="center">
                {image.title}
              </TableCell>
              <TableCell key="order" align="center">
                <TextField
                  type="number"
                  defaultValue={image.order}
                  onChange={(e) => handleChangeOrderImage(index, e.target.value)}
                />
              </TableCell>
              <TableCell key="action" align="center">
                <IconButton onClick={() => handleDeleteImage(index)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box display="flex" justifyContent="space-between">
        <Box sx={{ py: 2 }}>
          <Button
            variant="contained"
            component="label"
            onClick={handleUpdateOrder}
          >
            Update order
          </Button>
        </Box>
        <TablePagination
          component="div"
          count={images.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>
    </>
  );
};
ProductImageList.propTypes = {
  imageList: PropTypes.array.isRequired,
  handleUpdateImages: PropTypes.func
};
export default ProductImageList;
