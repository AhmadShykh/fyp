import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import SideBar from "./components/SideBar";
import { AuthProvider } from "./context/AuthContext";
import Cancel from "./pages/Cancel";
import DashboardPage from "./pages/DashboardPage";
import HistoryPage from "./pages/HistoryPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProcessPage from "./pages/ProcessPage";
import SignupPage from "./pages/SignupPage";
import SubscriptionPlans from "./pages/SubscriptionPlans";
import Success from "./pages/Success";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="d-flex">
          <SideBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/LoginPage" element={<LoginPage />} />
            <Route path="/SignupPage" element={<SignupPage />} />

            <Route
              path="/DashboardPage"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/SubscriptionPlans"
              element={
                <ProtectedRoute>
                  <SubscriptionPlans />
                </ProtectedRoute>
              }
            />

            <Route
              path="/Success"
              element={
                <ProtectedRoute>
                  <Success />
                </ProtectedRoute>
              }
            />

            <Route
              path="/Cancel"
              element={
                <ProtectedRoute>
                  <Cancel />
                </ProtectedRoute>
              }
            />

            <Route
              path="/HistoryPage"
              element={
                <ProtectedRoute>
                  <HistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ProcessPage"
              element={
                <ProtectedRoute>
                  <ProcessPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
