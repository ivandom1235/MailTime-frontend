import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleSelectPage from "./pages/RoleSelectPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AddExecutivePage from "./pages/AddExecutivePage";
import AdminPasswordPage from "./pages/AdminPasswordPage";
import AdminOutboundMailsPage from "./pages/AdminOutboundMailsPage";
import AdminEditOutboundMailPage from "./pages/AdminEditOutboundMailPage";
import ExecutiveLoginPage from "./pages/ExecutiveLoginPage";
import ExecutiveDashboardPage from "./pages/ExecutiveDashboardPage";
import IncomingMailPage from "./pages/IncomingMailPage";
import OutboundMailPage from "./pages/outboundMailPage";
import OutboundReportPage from "./pages/OutboundReportPage";
import OutgoingMailPage from "./pages/OutgoingMailPage";
import OutgoingMailPageSign from "./pages/OutgoingMailPageSign";

function App() {
  const adminRoute = (page) => (
    <ProtectedRoute allowedRole="admin">{page}</ProtectedRoute>
  );
  const executiveRoute = (page) => (
    <ProtectedRoute allowedRole="executive">{page}</ProtectedRoute>
  );

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/require-role" element={<RoleSelectPage />} />
      <Route path="/select-role" element={<RoleSelectPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={adminRoute(<AdminDashboardPage />)} />
      <Route path="/admin/add-executive" element={adminRoute(<AddExecutivePage />)} />
      <Route path="/admin/executives/new" element={adminRoute(<AddExecutivePage />)} />
      <Route path="/admin/password" element={adminRoute(<AdminPasswordPage />)} />
      <Route path="/admin/outbound-report" element={adminRoute(<OutboundReportPage mode="admin" />)} />
      <Route path="/admin/outbound-mails" element={adminRoute(<AdminOutboundMailsPage />)} />
      <Route path="/admin/outbound-mails/:trackingNumber" element={adminRoute(<AdminEditOutboundMailPage />)} />
      <Route path="/executive/login" element={<ExecutiveLoginPage />} />
      <Route path="/executive" element={executiveRoute(<ExecutiveDashboardPage />)} />
      <Route path="/incoming-mail" element={executiveRoute(<IncomingMailPage />)} />
      <Route path="/executive/incoming-mail" element={executiveRoute(<IncomingMailPage />)} />
      <Route path="/executive/outbound-mail" element={executiveRoute(<OutboundMailPage />)} />
      <Route path="/executive/outbound-report" element={executiveRoute(<OutboundReportPage />)} />
      <Route path="/outgoing-mail" element={executiveRoute(<OutgoingMailPage />)} />
      <Route
        path="/sign/outgoing/:draftId"
        element={<OutgoingMailPageSign />}
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
