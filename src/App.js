import "./App.css";
import LotList from "./components/LotList";
import PartDetails from "./components/PartDetails";
import { LotProvider } from "./context/LotContext";
import LotForm from "./components/LotForm";
import "bootstrap/dist/css/bootstrap.min.css";
import PartAdd from "./components/PartAdd";
import Navigation from "./components/Navigation";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import BrowserRouter
import Banding from "./components/Banding";
import Drilling from "./components/Drilling";
import Sizing from "./components/Sizing";
import SizingList from "./components/SizingList";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function App() {
  return (
    <LotProvider>
      <Router>
        {" "}
        {/* This is the BrowserRouter that wraps everything */}
        <Navigation /> {/* Add Navigation component */}
        <Routes>
          {" "}
          {/* Define the routes inside here */}
          <Route path="/" element={<LotList />} /> {/* Route for LotList */}
          <Route path="/lotform" element={<LotForm />} />{" "}
          {/* Route for LotForm */}
          <Route path="/partdetails" element={<PartDetails />} />{" "}
          {/* Route for PartDetails */}
          <Route path="/partadd" element={<PartAdd />} />{" "}
          {/* Route for PartAdd */}
          <Route path="/sizing" element={<Sizing />} />
          <Route path="/sizinglist" element={<SizingList />} />
          <Route path="/banding" element={<Banding />} />
          <Route path="/drilling" element={<Drilling />} />
        </Routes>
      </Router>
    </LotProvider>
  );
}

export default App;
