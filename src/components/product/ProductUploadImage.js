import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import {
  Button,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import { formatBytes } from 'src/utils/functions';
import FilesDropzone from '../FileDropzone';

const useStyles = makeStyles(() => ({
  list: {
    maxHeight: 320
  },
  actions: {
    marginTop: 2,
    display: 'flex',
    justifyContent: 'flex-end',
    '& > * + *': {
      marginLeft: 2
    }
  }
}));

const ProductUploadImage = ({ handleAddImages }) => {
  const classes = useStyles();
  const initialState = {
    files: [],
    alt: '',
    title: ''
  };
  const [state, setState] = useState(initialState);
  const { files, alt, title } = state;

  const handleRemoveAll = () => {
    setState((prev) => ({ ...prev, files: [] }));
  };

  const onAddImage = () => {
    handleAddImages(files.map((file) => ({
      file,
      name: `${uuid()}.${file.name.split('.').pop()}`,
      alt,
      title
    })));
    setState(initialState);
  };

  return (
    <div>
      <FilesDropzone
        dropOptions={{
          accept: 'image/jpeg, image/jpg, image/png'
        }}
        handleDrop={(acceptedFiles) => {
          setState((prev) => ({ ...prev, files: files.concat(acceptedFiles) }));
        }}
      />
      {files.length > 0 && (
        <>
          <List className={classes.list}>
            {files.map((file, i) => (
              <ListItem
                divider={i < files.length - 1}
                key={uuid()}
              >
                <ListItemIcon>
                  <FileCopyIcon />
                </ListItemIcon>
                <ListItemText
                  primary={file.name}
                  primaryTypographyProps={{ variant: 'h7' }}
                  secondary={formatBytes(file.size)}
                />
              </ListItem>
            ))}
          </List>
          <div className={classes.actions}>
            <Button
              onClick={handleRemoveAll}
              size="small"
            >
              Remove all
            </Button>
          </div>
        </>
      )}
      <TextField
        key="alt"
        fullWidth
        label="Alt"
        margin="dense"
        onChange={(e) => setState((prev) => ({ ...prev, alt: e.target.value }))}
        value={alt}
        variant="outlined"
      />
      <TextField
        key="title"
        fullWidth
        label="Title"
        margin="dense"
        onChange={(e) => setState((prev) => ({ ...prev, title: e.target.value }))}
        value={title}
        variant="outlined"
      />
      <Box sx={{ py: 1 }}>
        <Button
          variant="contained"
          component="label"
          onClick={onAddImage}
        >
          Add
        </Button>
      </Box>
    </div>
  );
};
ProductUploadImage.propTypes = {
  handleAddImages: PropTypes.func
};
export default ProductUploadImage;
