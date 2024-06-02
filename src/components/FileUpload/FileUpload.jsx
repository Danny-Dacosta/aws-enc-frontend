import React, { useState, useRef } from "react";
import uploadlogo from "../../assets/upload.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function FileUpload() {
  function DropComponent() {
    return (
      <>
        <div
          className="background  mt-10 flex justify-center items-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleClick}
        >
          <div className="input bg-[#2e323c] flex flex-col space-y-2 justify-center items-center cursor-pointer rounded-2xl border-[#000] hover:border-[#8C9FFF] border-dashed border-2 sm:w-1/2 sm:min-h-48 sm:m-2 w-5/6 min-h-60 m-1  p-5">
            <img
              src={uploadlogo}
              alt="upload icon"
              className="h-[50px] sm:h-[60px] "
            />
            <h2 className="sm:text-lg text-sm text-center flex justify-center flex-col sm:w-2/3 w-5/6 text-slate-50">
              Drag file here or click to select file
            </h2>
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              ref={fileRef}
            />
          </div>
        </div>
      </>
    );
  }
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState(null);
  const [otpSection, setOtpSection] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [uploadError, setuploadError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpVerifySection, setOtpVerifySection] = useState(false);
  const [otp, setOtp] = useState(null);
  const [otpVerify, setOtpVerify] = useState(null);
  const fileRef = useRef(null);
  const [submitFile, setSubmitFile] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    setFile(droppedFile);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setSubmitFile(false);
    setFile(selectedFile);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleClick = () => {
    fileRef.current.click();
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSendOtp = async () => {
    setOtpVerifySection(true);
    setOtpError(false);
    try {
      // console.log(email, file.name);
      const filename = file.name;
      const response = await axios.post(
        "https://otpgen-tril.onrender.com/send-otp",
        {
          email,
          filename,
        }
      );
    } catch (error) {
      setError(`Error sending OTP: ${error}`);
    }
  };

  const handleOtpChange = (event) => {
    setOtp(event.target.value);
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(
        "https://otpgen-tril.onrender.com/verify-otp",
        {
          email,
          otp,
        }
      );

      if (response.status == 200) {
        setOtpVerify(true);
      }
    } catch (error) {
      setOtpError(true);
      setOtpVerify(false);
    }
  };

  const formatFileName = (fileName) => {
    if (fileName.length > 20) {
      const extension = fileName.split(".").pop();
      const truncatedName = fileName.substring(0, 15) + "..";
      return truncatedName + "." + extension;
    }
    return fileName;
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    var location = "";
    if (file && otpVerify) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("email", email);
      setLoading(true);

      try {
        const response = await axios.post(
          "https://secure-backend-5kwp.onrender.com/upload",
          formData,
          email
        );
        location = response.data.fileId;
      } catch (error) {
        setuploadError(true);
        console.error(error);
      } finally {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
          navigate(`/file/` + location);
        }, 1000);
      }
    }
  };

  return (
    <>
      {!file ? (
        <>
          <DropComponent></DropComponent>
        </>
      ) : null}
      {file && !submitFile ? (
        <>
          <div className="background sm:mt-10 mt-10 flex justify-center items-center">
            <div className="input bg-[#2e323c] flex flex-col space-y-2 justify-center items-center  rounded-2xl border-[#8C9FFF] border-solid border-2 sm:w-1/2 sm:min-h-48 sm:m-2 w-5/6 min-h-60 m-1  p-5">
              <img
                src={uploadlogo}
                alt="upload icon"
                className="h-[50px] sm:h-[60px]"
              />
              <div className="text-slate-50 sm:w-2/3  text-sm flex flex-col  items-center">
                <div className="text-center">
                  File Name: {formatFileName(file.name)}
                </div>
                <div className="text-center">
                  File Size: {(file.size / 1024).toFixed(2)} KB
                </div>
                <div className="text-center">File Type: {file.type}</div>
                <div className="flex sm:flex-row pt-2  flex-col  justify-center sm:space-x-3">
                  <div
                    className="button text-center cursor-pointer bg-[#657ee4] w-[120px] p-2  text-sm rounded-lg hover:bg-[#5372f1]"
                    onClick={() => {
                      setFile(null);
                    }}
                  >
                    Change File
                  </div>
                  <div
                    className="button text-center cursor-pointer bg-[#657ee4] w-[120px] p-2 mt-2 sm:mt-0 text-sm rounded-lg hover:bg-[#5372f1]"
                    onClick={() => {
                      setOtpSection(true);
                      setSubmitFile(true);
                    }}
                  >
                    Submit File
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
      {file && otpSection && !otpVerify ? (
        <>
          <div className="background sm:mt-10 mt-10 flex justify-center items-center">
            <div className="input bg-[#2e323c] flex flex-col space-y-2 justify-center items-center rounded-2xl border-[#8C9FFF] border-solid border-2 sm:w-1/2 sm:min-h-48 sm:m-2 w-11/12 min-h-60 m-1  p-5">
              <img
                src={uploadlogo}
                alt="upload icon"
                className="h-[50px] sm:h-[60px]"
              />
              <div className="text-slate-50 sm:w-2/3 w-full  text-sm flex flex-col  items-center">
                <div className="text-center">Enter Email to Verify</div>
                <div className="w-full flex justify-center pt-5 pb-5">
                  <input
                    type="text"
                    id="email"
                    className="bg-transparent border-b-2 p-1 border-[#657ee4] cursor-pointer focus:outline-none w-1/2 min-w-[200px] text-center"
                    onChange={(e) => {
                      handleEmailChange(e);
                    }}
                  />
                </div>

                <div className="flex sm:flex-row pt-1  flex-col  justify-center sm:space-x-3 ">
                  <div
                    className="button text-center cursor-pointer bg-[#657ee4] w-[120px] p-2 sm:mt-0 text-sm rounded-lg hover:bg-[#5372f1]"
                    onClick={handleSendOtp}
                  >
                    Send OTP
                  </div>
                </div>
              </div>
              {otpVerifySection ? (
                <div className="text-slate-50 sm:w-2/3 w-full pt-3  text-sm flex flex-col  items-center">
                  <div className="text-center">Enter OTP to Verify</div>
                  <div className="w-full flex justify-center pt-5 pb-5">
                    <input
                      type="text"
                      maxLength={6}
                      className="bg-transparent border-b-2 p-1  border-[#657ee4] focus:outline-none w-1/2 max-w-[200px] text-center"
                      onChange={(e) => {
                        handleOtpChange(e);
                      }}
                    />
                  </div>

                  <div className="flex sm:flex-row pt-1  flex-col  justify-center sm:space-x-3 ">
                    <div
                      className="button text-center bg-[#657ee4] cursor-pointer w-[120px] p-2 sm:mt-0 text-sm rounded-lg hover:bg-[#5372f1]"
                      onClick={handleVerifyOtp}
                    >
                      Verify OTP
                    </div>
                  </div>
                  {otpError ? (
                    <div className="text-red-500 p-2 text-center">
                      Wrong OTP
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </>
      ) : null}
      {file && otpVerify ? (
        <>
          <div className="background sm:mt-10 mt-10 flex justify-center items-center">
            <div className="input bg-[#2e323c] flex flex-col space-y-2 justify-center items-center  rounded-2xl border-[#8C9FFF] border-solid border-2 sm:w-1/2 sm:min-h-48 sm:m-2 w-5/6 min-h-60 m-1  p-5">
              <img
                src={uploadlogo}
                alt="upload icon"
                className="h-[50px] sm:h-[60px]"
              />
              <div className="text-slate-50 sm:w-2/3  text-sm flex flex-col  items-center">
                <div className="text-center">
                  File Name: {formatFileName(file.name)}
                </div>
                <div className="text-center">
                  File Size: {(file.size / 1024).toFixed(2)} KB
                </div>
                <div className="text-center">File Type: {file.type}</div>
                <div className="text-center">Author: {email}</div>
                {!success && !loading ? (
                  <div className="flex sm:flex-row pt-2  flex-col  justify-center sm:space-x-3">
                    <div
                      className="button text-center cursor-pointer bg-[#657ee4] w-[120px] p-2  text-sm rounded-lg hover:bg-[#5372f1]"
                      onClick={handleFileUpload}
                    >
                      Submit File
                    </div>
                  </div>
                ) : null}
                {loading ? (
                  <div className="text-xl p-2 text-[#657ee4] ">
                    Sending File
                  </div>
                ) : (
                  <></>
                )}
                {success ? (
                  <div className="text-xl p-2 text-green-500 ">Sent File</div>
                ) : (
                  <></>
                )}
                {uploadError ? (
                  <>
                    <div className="text-red-500 p-2 text-center">
                      File Upload Failed
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

export default FileUpload;
