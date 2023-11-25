"use client";

import React from "react";

import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";

const MyEditor = ({ ...props }) => {
  const FroalaEditor =
    typeof window !== "undefined"
      ? require("react-froala-wysiwyg").default
      : () => null;

  const [model, setModel] = React.useState("");

  React.useEffect(() => {
    setModel(props.value)
  }, [props.value])

  const handleModelChange = (model) => {
    setModel(model);
    props.onChange(model);
  };

  return (
    <FroalaEditor
      tag="textarea"
      model={model}
      onModelChange={handleModelChange}
    />
  );
};

export default MyEditor;
