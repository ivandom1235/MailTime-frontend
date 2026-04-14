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

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/require-role" element={<RoleSelectPage />} />
      <Route path="/select-role" element={<RoleSelectPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/admin/add-executive" element={<AddExecutivePage />} />
      <Route path="/admin/executives/new" element={<AddExecutivePage />} />
      <Route path="/admin/inbound-report" element={<AdminInboundReportPage />} />
      <Route path="/admin/inbound-mails/:trackingNumber" element={<AdminEditInboundMailPage />} />
      <Route path="/admin/outbound-report" element={<OutboundReportPage mode="admin" />} />
      <Route path="/admin/outbound-mails" element={<AdminOutboundMailsPage />} />
      <Route path="/admin/outbound-mails/:trackingNumber" element={<AdminEditOutboundMailPage />} />
      <Route path="/executive/login" element={<ExecutiveLoginPage />} />
      <Route path="/executive" element={<ExecutiveDashboardPage />} />
      <Route path="/incoming-mail" element={<IncomingMailPage />} />
      <Route path="/executive/incoming-mail" element={<IncomingMailPage />} />
      <Route path="/executive/inbound-report" element={<InboundReportPage />} />
      <Route path="/executive/outbound-mail" element={<OutboundMailPage />} />
      <Route path="/executive/edit-outbound" element={<ExecutiveEditOutboundPage />} />
      <Route path="/executive/outbound-report" element={<OutboundReportPage />} />
      <Route path="/outgoing-mail" element={<OutgoingMailPage />} />
      <Route
        path="/sign/outgoing/:draftId"
        element={<OutgoingMailPageSign />}
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
