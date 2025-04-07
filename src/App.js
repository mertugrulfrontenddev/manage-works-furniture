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
import PartDelete from "./components/PartDelete";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import SizingHistory from "./components/SizingHistory";
import BandingHistory from "./components/BandingHistory";
import DrillingHistory from "./components/DrillingHistory";

import CurveBanding from "./components/CurveBanding";
import CurveHistory from "./components/CurveHistory";
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
          <Route path="/partdelete" element={<PartDelete />} />
          <Route path="/sizinghistory" element={<SizingHistory />} />
          <Route path="/bandinghistory" element={<BandingHistory />} />
          <Route path="/drillinghistory" element={<DrillingHistory />} />
          <Route path="/curvebanding" element={<CurveBanding />} />
          <Route path="/curvehistory" element={<CurveHistory />} />
        </Routes>
      </Router>
    </LotProvider>
  );
}

export default App;
