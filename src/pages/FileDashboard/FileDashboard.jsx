import React, { useState } from "react";

import { FileCard } from "../../components";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Homepage() {
  const [files, setFiles] = useState(null);
  function parseDate(dateStr) {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day); // Months are zero-based in JS Date
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
      setFiles(dataArray);
    });
  }, []);
  return (
    <div className="min-h-screen bg-[#262a33]">
      {/* <div className=" bg-[#1A1D24] w-full flex justify-center px-2 py-6 sm:py-5 ">
        <img src={logo} className="h-[30px] sm:h-[30px]" />
        <h1 className="text-lg text-center pl-3 sm:font-semibold text-slate-50 sm:text-2xl">
          Secure File Backup & Restore
        </h1>
      </div> */}
      <Link to="/">
        <div className="text-slate-50 p-4 text-xl">{"<< "}Back To Home</div>
      </Link>
      {files && files.length > 0 ? (
        <>
          <div className="text-slate-50 flex justify-center  pt-4">
            <h2 className="sm:text-3xl font-semibold text-2xl">
              Uploaded Files
            </h2>
          </div>
          <div className="text-slate-50 flex flex-col items-center pt-4">
            <div className="table w-11/12 sm:w-2/3 bg-[#2e323c] rounded-lg mb-10">
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
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Homepage;
