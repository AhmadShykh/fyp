import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import SideBar from "./components/SideBar";
import HistoryPage from "./pages/HistoryPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <Router>
      <div className="d-flex">
        <SideBar />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/HistoryPage" element={<HistoryPage />} />
          <Route path="/SignupPage" element={<SignupPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
