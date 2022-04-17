import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useDropzone } from 'react-dropzone';
import {
  Link,
  Typography,
  colors,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  root: {},
  dropZone: {
    border: '1px dashed grey',
    padding: 24,
    outline: 'none',
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: colors.grey[50],
      opacity: 0.5,
      cursor: 'pointer'
    }
  },
  dragActive: {
    backgroundColor: colors.grey[50],
    opacity: 0.5
  },
  image: {
    width: 130
  },
  info: {
    marginTop: 8
  }
}));

const FilesDropzone = (props) => {
  const { dropOptions, handleDrop, ...rest } = props;

  const classes = useStyles();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    ...dropOptions,
    onDrop: handleDrop
  });

  return (
    <div
      {...rest}
      className={classes.root}
    >
      <div
        className={clsx({
          [classes.dropZone]: true,
          [classes.dragActive]: isDragActive
        })}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div>
          <img
            alt="Select file"
            className={classes.image}
            src="/images/undraw_add_file2_gvbb.svg"
          />
        </div>
        <div>
          <Typography
            gutterBottom
            variant="h4"
          >
            Select files
          </Typography>
          <Typography
            className={classes.info}
            color="textSecondary"
            variant="body1"
          >
            Drop files here or click
            {' '}
            <Link underline="always">browse</Link>
            {' '}
            thorough your machine
          </Typography>
        </div>
      </div>
    </div>
  );
};

FilesDropzone.propTypes = {
  handleDrop: PropTypes.func,
  dropOptions: PropTypes.object
};

export default FilesDropzone;
