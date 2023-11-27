import React from "react";
import dynamic from "next/dynamic";
import 'react-quill/dist/quill.snow.css';

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const MyEditor = ({ ...props }) => {
  const [model, setModel] = React.useState("");

  React.useEffect(() => {
    setModel(props.value);
  }, [props.value]);

  const handleModelChange = (model) => {
    setModel(model);
    props.onChange(model);
  };

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link"],
      ["clean"],
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  };
  /*
   * Quill editor formats
   * See https://quilljs.com/docs/formats/
   */
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
  ];

  return (
    <QuillNoSSRWrapper modules={modules} formats={formats} theme="snow" />

    // <FroalaEditor
    //   tag="textarea"
    //   model={model}
    //   onModelChange={handleModelChange}
    // />
  );
};

export default MyEditor;
