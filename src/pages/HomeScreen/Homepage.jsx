import React, { useState } from "react";
import logo from "../../assets/logo.svg";
import { FileUpload, FileCard } from "../../components";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Homepage() {
  const [files, setFiles] = useState(null);
  function parseDate(dateStr) {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  }
  useEffect(() => {
    axios.get("https://secure-backend-5kwp.onrender.com/files").then((res) => {
      const data = res.data;

      const dataArray = Object.keys(data).map((key) => {
        return { key, ...data[key] };
      });
      dataArray.sort(
        (a, b) => parseDate(b.datecreated) - parseDate(a.datecreated)
      );
      console.log(dataArray);
      setFiles(dataArray.slice(0, 3));
    });
  }, []);
  return (
    <div className="min-h-screen bg-[#262a33]">
      <div className=" bg-[#1A1D24] w-full flex justify-center px-2 py-6 sm:py-5 ">
        <img src={logo} className="h-[30px] sm:h-[30px]" />
        <h1 className="text-lg text-center pl-3 sm:font-semibold text-slate-50 sm:text-2xl">
          Secure File Backup & Restore
        </h1>
      </div>
      <FileUpload />
      {files && files.length > 0 ? (
        <>
          <div className="text-slate-50 flex justify-center  pt-4">
            <h2 className="sm:text-3xl font-semibold text-xl">
              Recent Uploaded Files
            </h2>
          </div>
          <div className="text-slate-50 flex flex-col items-center pt-4">
            <div className="table w-11/12 sm:w-2/3 bg-[#2e323c] rounded-lg ">
              <div className="bg-[#1a1d24] flex flex-row p-2 rounded-t-lg">
                <div className="w-3/6 text-sm">Name</div>
                <div className="w-1/6 text-sm">Size</div>
                <div className="w-2/6 text-sm">Uploaded on</div>
              </div>
              {files.map((element) => (
                <Link to={`/file/` + element.key} key={element.key}>
                  <FileCard
                    key={element.key}
                    fileid={element.key}
                    filename={element.originalfilename}
                    size={element.filesize}
                    date={element.datecreated}
                    length={
                      screen.width > 1000
                        ? "30"
                        : screen.width > 700
                        ? "20"
                        : "10"
                    }
                  ></FileCard>
                </Link>
              ))}
            </div>
            <Link to="/Dashboard">
              <div className="p-2 mt-5 mb-5 text-sm rounded-lg bg-[#657ee4] hover:bg-[#3f54a8] cursor-pointer">
                See all Files {">"}
              </div>
            </Link>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Homepage;
