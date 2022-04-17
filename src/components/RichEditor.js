import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';

const useStyles = makeStyles(() => ({
  error: {
    color: 'red'
  }
}));

const RichEditor = ({
  touched,
  error,
  label,
  initialContent,
  fieldName,
  setFieldValue
}) => {
  const classes = useStyles();

  // convert initial html to draftjs
  const blocksFromHtml = htmlToDraft(initialContent);
  const { contentBlocks, entityMap } = blocksFromHtml;
  const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
  const initialState = EditorState.createWithContent(contentState);

  const [editorState, setEditorState] = useState(
    initialState || EditorState.createEmpty()
  );

  const onEditorStateChange = (state) => {
    setEditorState(state);
  };
  const onBlur = () => {
    setFieldValue(
      fieldName,
      draftToHtml(convertToRaw(editorState.getCurrentContent()))
    );
  };

  return (
    <>
      <Box mb={1}>
        <Typography color="#8c8c8c">{label}</Typography>
      </Box>
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        onBlur={onBlur}
        editorStyle={{
          minWidth: '37px',
          minHeight: '200px',
          maxHeight: '700px',
          overFlow: 'auto',
          border: '1px solid #bfbfbf',
          padding: '5px'
        }}
      />
      {touched && error ? <div className={classes.error}>{error}</div> : null}
    </>
  );
};

RichEditor.propTypes = {
  touched: PropTypes.bool,
  error: PropTypes.string,
  label: PropTypes.string,
  initialContent: PropTypes.string,
  fieldName: PropTypes.string,
  setFieldValue: PropTypes.func
};

export default RichEditor;
