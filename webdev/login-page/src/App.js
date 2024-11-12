import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import OTP from "./pages/OTP";
import ForgotPassword from "./pages/ForgotPassword";
import CreateAccount from "./pages/CreateAccount";
import TicketBoardStaff from "./pages/TicketBoardStaff";
import TicketListStaff from "./pages/TicketListStaff";
import TicketAssign from "./pages/TicketAssignModal";
import ParentComponent from './components/ParentComponent'; // Adjust the path as needed
import AdminBoard from "./pages/AdminBoard";
import AdminList from "./pages/AdminList";
import AddMisStaff from "./pages/AddMisStaffModal";


const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/account/create" element={<CreateAccount />} />
                    <Route path="/account/forgot-password" element={<ForgotPassword />} />
                    <Route path="/account/otp" element={<OTP />} />
                    
                    <Route path="/staff/tickets" element={<TicketBoardStaff />} />
                    <Route path="/staff/list" element={<TicketListStaff />} />
                    <Route path="/staff/assign" element={<TicketAssign />} />
                    <Route path="/admin/board" element={<AdminBoard />} />
                    <Route path="/admin/list" element={<AdminList />} />
                    <Route path="/add-mis-staff" element={<AddMisStaff />} />
                    {/* Add the ParentComponent for ticket management */}
                    <Route path="/staff/manage" element={<ParentComponent />} />
                    
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
