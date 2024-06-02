import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Homepage, FileDashboard, FileComponent } from "./pages";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />}></Route>
        <Route path="/Dashboard" element={<FileDashboard />}></Route>
        <Route path="/file/:id" element={<FileComponent />}></Route>
      </Routes>
    </>
  );
}

export default App;
