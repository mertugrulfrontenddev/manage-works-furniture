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
          <Route parth="/banding" element={<Banding />} />
        </Routes>
      </Router>
    </LotProvider>
  );
}

export default App;
