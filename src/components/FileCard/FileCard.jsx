import React from "react";

function FileCard({
  filename = "nnnnnnnewimage.jpg",
  mimetype = "jpeg",
  date = "24/11/2023",
  author = "dcubedacosta@gmail.com",
  compressedsize = "28425",
  size = "28425",
  fileid = "111111",
  length = 10,
}) {
  const formatsize = (size) => {
    size = parseInt(size);
    if (size >= 1024 * 1024) {
      return (size / (1024 * 1024)).toFixed(0) + " MB";
    } else if (size >= 1024) {
      return (size / 1024).toFixed(0) + " KB";
    } else {
      return size + " B";
    }
  };
  const formatFileName = (fileName, length = 10) => {
    if (fileName.length > length) {
      const extension = fileName.split(".").pop();
      const truncatedName = fileName.substring(0, length) + "..";
      return truncatedName + "." + extension;
    }
    return fileName;
  };

  return (
    <>
      <div className="table w-full border-t-2 border-solid border-[#1a1d24]">
        <div className="flex flex-row p-1 pt-3 pb-3 rounded-t-lg">
          <div className="w-3/6 text-sm">
            {formatFileName(filename, length)}
          </div>
          <div className="w-1/6 text-sm ">{formatsize(size)}</div>
          <div className="w-2/6 text-sm ">{date}</div>
        </div>
      </div>
    </>
  );
}

export default FileCard;
