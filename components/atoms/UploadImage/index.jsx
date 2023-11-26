import Image from "next/image";
import React, { useEffect } from "react";
import ImageUploading from "react-images-uploading";

export function UploadImage({ isEdit, onImageUploadFile, ...props }) {
  console.log("🚀 ~ file: index.jsx:6 ~ UploadImage ~ props:", props);
  const [images, setImages] = React.useState([]);
  console.log("🚀 ~ file: index.jsx:8 ~ UploadImage ~ images:", images);
  const maxNumber = 69;

  useEffect(() => {
    if (props.value && isEdit) {
      let payload = null;
      if (typeof props.value === "string") {
        payload = {
          data_url: props.value,
        };
      } else {
        payload = props.value[0]
      }
      setImages([payload]);
    }
  }, [props.value]);

  const onImageChange = (imageList, addUpdateIndex) => {
    console.log(
      "🚀 ~ file: index.jsx:21 ~ onImageChange ~ imageList:",
      imageList
    );
    setImages(imageList);
    onImageUploadFile(imageList);
    
    if (props.onChange) {
      props.onChange(imageList);
    }
  };

  const onImageRemoveState = (index) => {
    setImages((prevImages) => {
      const filteredImages = prevImages.filter((_, i) => i !== index);
      if (props.onChange) {
        props.onChange(filteredImages);
      }
      return filteredImages;
    });
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
          <div
            className={`border-dashed border-2 ${
              imageList.length === 0 && `h-[40vh]`
            } w-full flex justify-center items-center 2xl:h-[58vh]`}
          >
            {imageList.length === 0 ? (
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
            ) : (
              imageList.map((image, index) => {
                return (
                  <div key={index} className="relative w-full h-full p-6 ">
                    <div className="relative w-full aspect-video">
                      <Image
                        src={image["data_url"]}
                        alt="image"
                        layout="fill"
                        objectFit="scale-down"
                      />
                      <>{console.log(">>", imageList)}</>
                    </div>
                    <div className="absolute bottom-0 left-0 flex justify-around items-center w-full px-4 py-2">
                      <div
                        onClick={() => onImageUpdate(index)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Update
                      </div>
                      <div
                        onClick={() => {
                          onImageRemoveState(index);
                          onImageRemove(index);
                          onImageRemoveAll();
                          props.onChange(null);
                        }}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Remove
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </ImageUploading>
    </div>
  );
}
