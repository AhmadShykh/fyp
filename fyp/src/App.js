import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import SideBar from "./components/SideBar";
import DashboardPage from "./pages/DashboardPage";
import HistoryPage from "./pages/HistoryPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProcessPage from "./pages/ProcessPage";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <Router>
      <div className="d-flex">
        <SideBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/LoginPage" element={<LoginPage />} />
          <Route path="/HistoryPage" element={<HistoryPage />} />
          <Route path="/SignupPage" element={<SignupPage />} />
          <Route path="/ProcessPage" element={<ProcessPage />} />
          <Route path="/DashboardPage" element={<DashboardPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
