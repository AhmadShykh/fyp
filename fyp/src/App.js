import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import SideBar from "./components/SideBar";
import HistoryPage from "./pages/HistoryPage";

function App() {
  return (
    <Router>
      <div className="d-flex">
        <SideBar />
        <Routes>
          <Route path="/HistoryPage" element={<HistoryPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
