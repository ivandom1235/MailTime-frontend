import ProtectedRoute from "./components/ProtectedRoute";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RoleSelectPage from "./pages/RoleSelectPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AddExecutivePage from "./pages/AddExecutivePage";
import ExecutiveLoginPage from "./pages/ExecutiveLoginPage";
import ExecutiveDashboardPage from "./pages/ExecutiveDashboardPage";
import IncomingMailPage from "./pages/IncomingMailPage";
import OutboundMailPage from "./pages/outboundMailPage";
import OutgoingMailPage from "./pages/OutgoingMailPage";
import OutgoingMailPageSign from "./pages/OutgoingMailPageSign";
import OutboundReportPage from "./pages/OutboundReportPage";
import InboundReportPage from "./pages/InboundReportPage";
import AdminInboundReportPage from "./pages/AdminInboundReportPage";
import AdminEditInboundMailPage from "./pages/AdminEditInboundMailPage";
import AdminOutboundMailsPage from "./pages/AdminOutboundMailsPage";
import AdminEditOutboundMailPage from "./pages/AdminEditOutboundMailPage";
import ExecutiveEditOutboundPage from "./pages/ExecutiveEditOutboundPage";
import AdminPasswordPage from "./pages/AdminPasswordPage";
import WorkspaceShell from "./components/WorkspaceShell";

function App() {
  return (
    <WorkspaceShell>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/require-role" element={<RoleSelectPage />} />
      <Route path="/select-role" element={<RoleSelectPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboardPage /></ProtectedRoute>} />
      <Route path="/admin/password" element={<ProtectedRoute allowedRole="admin"><AdminPasswordPage /></ProtectedRoute>} />
      <Route path="/admin/add-executive" element={<ProtectedRoute allowedRole="admin"><AddExecutivePage /></ProtectedRoute>} />
      <Route path="/admin/executives/new" element={<ProtectedRoute allowedRole="admin"><AddExecutivePage /></ProtectedRoute>} />
      <Route path="/admin/inbound-report" element={<ProtectedRoute allowedRole="admin"><AdminInboundReportPage /></ProtectedRoute>} />
      <Route path="/admin/inbound-mails/:trackingNumber" element={<ProtectedRoute allowedRole="admin"><AdminEditInboundMailPage /></ProtectedRoute>} />
      <Route path="/admin/outbound-report" element={<ProtectedRoute allowedRole="admin"><OutboundReportPage mode="admin" /></ProtectedRoute>} />
      <Route path="/admin/outbound-mails" element={<ProtectedRoute allowedRole="admin"><AdminOutboundMailsPage /></ProtectedRoute>} />
      <Route path="/admin/outbound-mails/:trackingNumber" element={<ProtectedRoute allowedRole="admin"><AdminEditOutboundMailPage /></ProtectedRoute>} />
      <Route path="/executive/login" element={<ExecutiveLoginPage />} />
      <Route path="/executive" element={<ProtectedRoute allowedRole="executive"><ExecutiveDashboardPage /></ProtectedRoute>} />
      <Route path="/incoming-mail" element={<ProtectedRoute allowedRole="executive"><IncomingMailPage /></ProtectedRoute>} />
      <Route path="/executive/incoming-mail" element={<ProtectedRoute allowedRole="executive"><IncomingMailPage /></ProtectedRoute>} />
      <Route path="/executive/inbound-report" element={<ProtectedRoute allowedRole="executive"><InboundReportPage /></ProtectedRoute>} />
      <Route path="/executive/outbound-mail" element={<ProtectedRoute allowedRole="executive"><OutboundMailPage /></ProtectedRoute>} />
      <Route path="/executive/edit-outbound" element={<ProtectedRoute allowedRole="executive"><ExecutiveEditOutboundPage /></ProtectedRoute>} />
      <Route path="/executive/outbound-report" element={<ProtectedRoute allowedRole="executive"><OutboundReportPage /></ProtectedRoute>} />
      <Route path="/outgoing-mail" element={<ProtectedRoute allowedRole="executive"><OutgoingMailPage /></ProtectedRoute>} />
      <Route
        path="/sign/outgoing/:draftId"
        element={<OutgoingMailPageSign />}
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
    </WorkspaceShell>
  );
}

export default App;
