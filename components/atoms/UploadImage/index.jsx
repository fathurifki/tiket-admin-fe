import React, { useEffect } from "react";
import ImageUploading from "react-images-uploading";

export function UploadImage({isEdit, onImageUploadFile, ...props }) {
  const [images, setImages] = React.useState([]);
  const maxNumber = 69;

  useEffect(() => {
    if (props.value && isEdit) {
      const payload = {
        data_url: props.value,
      };
      setImages([payload]);
    }
  }, [props.value]);

  const onImageChange = (imageList, addUpdateIndex) => {
    // data for submit
    setImages(imageList);

    // Call the onChange function with the new value
    onImageUploadFile(imageList);
    props?.onChange(imageList);
  };

  return (
    <div className="App">
      <ImageUploading
        value={images}
        onChange={onImageChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div className="border-dashed border-2 h-[40vh] w-full flex justify-center items-center 2xl:h-[58vh]">
            {imageList.length === 0 && (
              <div
                style={
                  isDragging
                    ? { fontSize: "20px", transition: "all 0.5s ease" }
                    : undefined
                }
                onClick={onImageUpload}
                {...dragProps}
              >
                Click or Drop here
              </div>
            )}
            {imageList.map((image, index) => (
              <div
                key={index}
                className="relative w-full h-full p-6 aspect-w-16 aspect-h-9 sm:aspect-h-7 md:aspect-h-5"
              >
                <img
                  src={image["data_url"]}
                  alt=""
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 flex justify-around items-center w-full px-4 py-2">
                  <button
                    onClick={() => onImageUpdate(index)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => onImageRemove(index)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
    </div>
  );
}
