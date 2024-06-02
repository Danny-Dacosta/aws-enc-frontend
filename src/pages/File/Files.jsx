import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

function FileComponent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileRef = useRef(null);

  const [data, setData] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [keyError, setKeyError] = useState();
  const [deleteOn, setDeleteOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloadOn, setDownloadOn] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = () => {
    fileRef.current.click();
  };

  const handleDelete = async () => {
    if (privateKey) {
      const formData = new FormData();
      formData.append("privateKey", privateKey);
      formData.append("fileId", id);
      formData.append("email", data.email);
      setLoading(true);

      try {
        const response = await axios.post(
          "https://secure-backend-5kwp.onrender.com/delete",
          formData
        );
        setSuccess(true);
        setPrivateKey(null);
        setTimeout(() => {
          navigate("/Dashboard");
        }, 2000);
      } catch (error) {
        console.error(error); // Log the error for debugging purposes
        setKeyError(true);
      } finally {
        setLoading(false); // Ensure loading state is turned off
      }
    }
    console.log("Delete");
  };

  const handleDownload = async () => {
    if (privateKey) {
      const formData = new FormData();
      formData.append("privateKey", privateKey);
      formData.append("fileId", id);
      formData.append("email", data.email);
      setLoading(true);

      try {
        const response = await axios.post(
          "https://secure-backend-5kwp.onrender.com/download",
          formData,
          {
            responseType: "blob",
          }
        );

        const blob = new Blob([response.data], {
          type: "application/octet-stream",
        });

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);

        link.download = data.originalfilename;
        link.click();

        setSuccess(true);
        setPrivateKey(null);
      } catch (error) {
        console.error(error);
        setKeyError(true);
      } finally {
        setTimeout(() => {
          navigate("/Dashboard");
        }, 10000);
        setLoading(false);
      }
    }
    console.log("Download");
  };

  const handleFile = (event) => {
    const selectedFile = event.target.files[0];
    setPrivateKey(selectedFile);
  };

  const formatsize = (size, round = 0) => {
    size = parseInt(size);
    if (size >= 1024 * 1024) {
      return (size / (1024 * 1024)).toFixed(round) + " MB";
    } else if (size >= 1024) {
      return (size / 1024).toFixed(round) + " KB";
    } else {
      return size + " B";
    }
  };

  useEffect(() => {
    axios
      .get(`https://secure-backend-5kwp.onrender.com/file/` + id)
      .then((res) => {
        setData(res.data);
      });
  }, []);

  return (
    <>
      <div className="min-h-screen bg-[#262a33]">
        <Link to="/Dashboard">
          <div className="text-slate-50 p-4 text-xl">{"<< "}Back To Files</div>
        </Link>
        {data && !(deleteOn || downloadOn) ? (
          <>
            <div className="flex justify-center ">
              <div className="input bg-[#2e323c] flex flex-col  justify-center items-center rounded-2xl border-[#8C9FFF] border-solid border-2 sm:w-1/2 sm:min-h-48 sm:m-2 w-11/12 min-h-60 m-1  p-2">
                <div className="text-slate-50 sm:w-11/12 space-y-2 text-base flex flex-col items-center break-all p-2 pt-5 pb-5 ">
                  <div className="text-center sm:w-full">
                    Name: {data.originalfilename}
                  </div>
                  <div className="text-center sm:w-full">
                    Author: {data.email}
                  </div>
                  <div className="text-center sm:w-full">
                    Date Uploaded: {data.datecreated}
                  </div>
                  <div className="text-center sm:w-full">
                    File Type: {data.mimetype}
                  </div>
                  <div className="text-center sm:w-full">
                    Size: {formatsize(data.filesize, 3)}
                  </div>
                  <div className="text-center sm:w-full">
                    Compressed Size: {formatsize(data.compressedfilesize, 3)}
                  </div>
                  <div className="flex sm:flex-row pt-2  flex-col  justify-center sm:space-x-3">
                    <div
                      className="button text-center cursor-pointer bg-[#657ee4] w-[120px] p-2 mt-5  text-sm rounded-lg hover:bg-[#5372f1]"
                      onClick={() => {
                        setDownloadOn(true);
                      }}
                    >
                      Download File
                    </div>
                    <div
                      className="button text-center cursor-pointer bg-[#657ee4] w-[120px] p-2 mt-5 text-sm rounded-lg hover:bg-[#5372f1]"
                      onClick={() => {
                        setDeleteOn(true);
                      }}
                    >
                      Delete File
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
        {data && deleteOn ? (
          <>
            <div className="flex justify-center ">
              <div className="input bg-[#2e323c] flex flex-col  justify-center items-center  rounded-2xl border-[#8C9FFF] border-solid border-2 sm:w-1/2 sm:min-h-48 sm:m-2 w-11/12 min-h-60 m-1  p-2">
                <div className="text-center text-2xl text-slate-50 font-semibold pt-3 sm:w-full">
                  Delete File
                </div>
                <div className="text-slate-50 sm:w-11/12 space-y-2 text-base flex flex-col items-center break-all p-2 pt-5 pb-5 ">
                  <div className="text-center sm:w-full">
                    Name: {data.originalfilename}
                  </div>
                </div>
                {!privateKey & !success ? (
                  <>
                    <div>
                      <div
                        className="button text-center cursor-pointer text-slate-50 bg-[#657ee4] p-3 text-sm rounded-lg hover:bg-[#5372f1]"
                        onClick={handleFileChange}
                      >
                        Upload Private Key
                      </div>
                      <input
                        type="file"
                        accept=".pem"
                        onChange={handleFile}
                        className="hidden"
                        ref={fileRef}
                      />
                    </div>
                  </>
                ) : (
                  <></>
                )}
                {privateKey ? (
                  <>
                    <div className="text-slate-50 text-center">
                      Private Key: {privateKey.name}
                    </div>
                    <div className="flex sm:flex-row pt-2  flex-col text-slate-50  justify-center sm:space-x-3 pb-5">
                      <div
                        className="button text-center bg-[#657ee4] w-[120px] p-2 mt-5  text-sm rounded-lg hover:bg-[#5372f1]"
                        onClick={() => {
                          setKeyError(false);
                          setPrivateKey(null);
                        }}
                      >
                        Change Key
                      </div>
                      <div
                        className="button text-center bg-[#657ee4] w-[120px] p-2 mt-5 text-sm rounded-lg hover:bg-[#5372f1]"
                        onClick={handleDelete}
                      >
                        Delete File
                      </div>
                    </div>
                    {keyError ? (
                      <>
                        <div className="text-red-500 p-2 text-center">
                          Wrong Key
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <></>
                )}
                {success ? (
                  <div className="text-xl text-green-500 ">
                    Deleted Successfully
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
        {data && downloadOn ? (
          <>
            <div className="flex justify-center ">
              <div className="input bg-[#2e323c] flex flex-col  justify-center items-center rounded-2xl border-[#8C9FFF] border-solid border-2 sm:w-1/2 sm:min-h-48 sm:m-2 w-11/12 min-h-60 m-1  p-2">
                <div className="text-center text-2xl text-slate-50 font-semibold pt-3 sm:w-full">
                  Restore File
                </div>
                <div className="text-slate-50 sm:w-11/12 space-y-2 text-base flex flex-col items-center break-all p-2 pt-5 pb-5 ">
                  <div className="text-center sm:w-full">
                    Name: {data.originalfilename}
                  </div>
                </div>
                {!privateKey & !success ? (
                  <>
                    <div>
                      <div
                        className="button text-center cursor-pointer text-slate-50 bg-[#657ee4] p-3 text-sm rounded-lg hover:bg-[#5372f1]"
                        onClick={handleFileChange}
                      >
                        Upload Private Key
                      </div>
                      <input
                        type="file"
                        accept=".pem"
                        onChange={handleFile}
                        className="hidden"
                        ref={fileRef}
                      />
                    </div>
                  </>
                ) : (
                  <></>
                )}
                {privateKey ? (
                  <>
                    <div className="text-slate-50 text-center">
                      Private Key: {privateKey.name}
                    </div>
                    <div className="flex sm:flex-row pt-2  flex-col text-slate-50  justify-center sm:space-x-3 pb-5">
                      <div
                        className="button text-center cursor-pointer bg-[#657ee4] w-[120px] p-2 mt-5  text-sm rounded-lg hover:bg-[#5372f1]"
                        onClick={() => {
                          setKeyError(false);
                          setPrivateKey(null);
                        }}
                      >
                        Change Key
                      </div>
                      <div
                        className="button text-center cursor-pointer bg-[#657ee4] w-[120px] p-2 mt-5 text-sm rounded-lg hover:bg-[#5372f1]"
                        onClick={handleDownload}
                      >
                        Restore File
                      </div>
                    </div>
                    {keyError ? (
                      <>
                        <div className="text-red-500 p-2 text-center">
                          Wrong Key
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <></>
                )}
                {success ? (
                  <div className="text-xl text-green-500 ">Restoring File</div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default FileComponent;
