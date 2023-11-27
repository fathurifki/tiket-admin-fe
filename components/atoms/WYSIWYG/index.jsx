"use client";

import React from "react";
import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";

const MyEditor = ({ ...props }) => {

  const [model, setModel] = React.useState("");
  let [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    setLoaded(true)
  }, [])

  React.useEffect(() => {
    setModel(props.value);
  }, [props.value]);

  const handleModelChange = (model) => {
    setModel(model);
    props.onChange(model);
  };

  if (loaded) {
    return (
      <FroalaEditor
        tag="textarea"
        model={model}
        onModelChange={handleModelChange}
      />
    );
  }
  return null;
};

export default MyEditor;
