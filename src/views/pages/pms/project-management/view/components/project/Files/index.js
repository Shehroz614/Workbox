import React, { useRef, useState } from "react";
import avatarDoc from "@src/assets/images/avatars/avatar-doc.png";
import avatarVideo from "@src/assets/images/avatars/avatar-video.svg";
import { Button } from "reactstrap";

function Files({ project }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const files = e.target.files;
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const handleFileDelete = (index) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
  };

  return (
    <div>
      <h2>Files</h2>

      <div className="w-100 d-flex">
        <input
          type="file"
          id="fileInput"
          className="hidden"
          onChange={handleFileUpload}
          multiple
          ref={fileInputRef}
        />
        <Button
          color="primary"
          className="ml-auto"
          htmlFor="fileInput"
          onClick={() => fileInputRef.current.click()}
        >
          Upload Files
        </Button>
      </div>

      <div className="file-thumbnails">
        {uploadedFiles.length > 0 ? (
          uploadedFiles.map((file, index) => (
            <div key={index} className="file-thumbnail">
              {file.type.startsWith("image/") ? (
                <img src={URL.createObjectURL(file)} alt={file.name} />
              ) : file.type.startsWith("video/") ? (
                <div className="file-placeholder">
                  <img src={avatarVideo} alt={file?.name?.slice(0,15)} />
                </div>
              ) : (
                <div className="file-placeholder">
                  <img src={avatarDoc} alt={file?.name?.slice(0,15)} />
                </div>
              )}
              <p>{file?.name?.slice(0,15)}</p>
              <button onClick={() => handleFileDelete(index)}>Delete</button>
            </div>
          ))
        ) : (
          <div className="w-100 d-flex">
            <span className="mx-auto my-5">No Files</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Files;
