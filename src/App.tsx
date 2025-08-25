import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import MainLayout from "./layouts/MainLayout";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import OtpVerification from "./pages/OtpVerification";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

import LeaguePage from "./pages/League";
import Competitions from "./pages/Competitions";
import TeamsPage from "./pages/TeamsPage";
import PlayersPage from "./pages/PlayersPage";
import ClubsPage from "./pages/ClubsPage";
import GradesPage from "./pages/GradesPage";
import FixturesPage from "./pages/FixturesPage";

import CostAnalysisPage from "./pages/CostAnalysisPage";
import SportsManagementPage from "./pages/SportsManagementPage";
import MessagePage from "./pages/MessagePage";
import SettingsPage from "./pages/SettingsPage";

import PageNotFound from "./components/PageNotFound";

export default function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leagues" element={<LeaguePage />} />
            <Route path="/competitions" element={<Competitions />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/players" element={<PlayersPage />} />
            <Route path="/grades" element={<GradesPage />} />
            <Route path="/clubs" element={<ClubsPage />} />
            <Route path="/grades" element={<GradesPage />} />
            <Route path="/fixtures" element={<FixturesPage />} />
            <Route path="/cost-analysis" element={<CostAnalysisPage />} />
            <Route path="/sports-management" element={<SportsManagementPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/message" element={<MessagePage />} />
          </Route>
        </Route>

        {/* 404 Handling */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}