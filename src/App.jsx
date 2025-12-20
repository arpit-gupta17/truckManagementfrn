import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/views/login';
import ManageCompany from './components/views/ManageCompany';
import AddCompany from './components/views/AddCompany';
import Dashboard from './components/views/EachCompany/Dashboard';
import UnidentifiedEvents from './components/views/EachCompany/UnidentifiedEvents';
import DOT from './components/views/EachCompany/DotManagement/Dot';
import AddDriver from './components/views/EachCompany/CompanyManagement/driverManagement/AddDriver';
import CompanyManagement from './components/views/EachCompany/CompanyManagement';
import DeviceManagement from './components/views/EachCompany/DeviceManagement';
import AddDevice from './components/views/EachCompany/Devices/AddDevices';
import VehicleManagement from './components/views/EachCompany/CompanyManagement/vehicleManagement/VehicleManagement';
import VehicleForm from './components/views/EachCompany/CompanyManagement/vehicleManagement/AddVehicle';
import DriverManagement from './components/views/EachCompany/CompanyManagement/driverManagement/DriverManagement';
import TerminalDashboard from './components/views/EachCompany/CompanyManagement/terminalManagement/TerminalManagement';
import AddTerminalForm from './components/views/EachCompany/CompanyManagement/terminalManagement/AddTerminal';
import ErrorManagement from './components/views/EachCompany/ErrorsManagement';
import LogsPage from './components/views/EachCompany/LogBook/DriverManagement';
import LogPageSummary from './components/views/EachCompany/LogBook/LogBookSummary';
import DVIRManagement from './components/views/EachCompany/LogBook/DVIRManagement';
import DriverLogBook from './components/views/EachCompany/LogBook/DriverLogBook';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/ManageCompany" element={<ManageCompany />} />
        <Route path="/AddCompany" element={<AddCompany />} />

        <Route path="/dashboard/:id" element={<Dashboard />} />
        <Route path="/dashboard/:id/UnidentifiedEvents" element={<UnidentifiedEvents />} />
        <Route path="/dashboard/:id/DOT" element={<DOT />} />

        <Route path="/dashboard/:id/CompanyManagement" element={<CompanyManagement />} />
        <Route path="/dashboard/:id/DeviceManagement" element={<DeviceManagement />} />
        <Route path="/dashboard/:id/Devices/AddDevices" element={<AddDevice />} />

        <Route path="/dashboard/:id/Manage/VehicleManagement" element={<VehicleManagement />} />
        <Route path="/dashboard/:id/Manage/VehicleManagement/AddVehicle" element={<VehicleForm />} />
        <Route path="/dashboard/:id/Manage/VehicleManagement/DriverManagement" element={<DriverManagement />} />
        <Route path="/dashboard/:id/Manage/VehicleManagement/AddDriver" element={<AddDriver />} />

        <Route path="/dashboard/:id/Manage/TerminalManagement" element={<TerminalDashboard />} />
        <Route path="/dashboard/:id/Manage/TerminalManagement/AddTerminal" element={<AddTerminalForm />} />

        <Route path="/dashboard/:id/ErrorsManagement" element={<ErrorManagement />} />

        <Route path="/dashboard/:id/LogBook" element={<LogsPage />} />
        <Route path="/dashboard/:id/LogBook/LogBookSummary" element={<LogPageSummary />} />
        <Route path="/dashboard/:id/LogBook/Summary/:driverId" element={<LogPageSummary />} />
        <Route path="/dashboard/:id/LogBook/DriverLogBook/:driverId" element={<DriverLogBook />} />
        <Route path="/dashboard/:id/LogBook/DVIR" element={<DVIRManagement />} />
      </Routes>
    </Router>
  );
}

export default App;


/*
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your React pages from EachCompany folder
import Login from './components/views/login';
import ManageCompany from './components/views/ManageCompany';
import AddCompany from './components/views/AddCompany';
import Dashboard from './components/views/EachCompany/Dashboard';
import UnidentifiedEvents from './components/views/EachCompany/UnidentifiedEvents';
import DOT from './components/views/EachCompany/DotManagement/Dot';
import AddDriver from './components/views/EachCompany/CompanyManagement/driverManagement/AddDriver';
import CompanyManagement from './components/views/EachCompany/CompanyManagement';
import DeviceManagement from './components/views/EachCompany/DeviceManagement';
import AddDevice from './components/views/EachCompany/Devices/AddDevices';
import VehicleManagement from './components/views/EachCompany/CompanyManagement/vehicleManagement/VehicleManagement';
import VehicleForm from './components/views/EachCompany/CompanyManagement/vehicleManagement/AddVehicle';
import DriverManagement from './components/views/EachCompany/CompanyManagement/driverManagement/DriverManagement';
import TerminalDashboard from './components/views/EachCompany/CompanyManagement/terminalManagement/TerminalManagement';
import AddTerminalForm from './components/views/EachCompany/CompanyManagement/terminalManagement/AddTerminal';
import ErrorManagement from './components/views/EachCompany/ErrorsManagement';
//import ELDDashboard from './components/views/EachCompany/LogBook/LogsPage';
import LogsPage from './components/views/EachCompany/LogBook/DriverManagement';
import LogPageSummary from './components/views/EachCompany/LogBook/LogBookSummary';
import DVIRManagement from './components/views/EachCompany/LogBook/DVIRManagement';
import DriverLogBook from './components/views/EachCompany/LogBook/DriverLogBook';


// Add more as needed

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/ManageCompany" element={<ManageCompany />} />
        <Route path="/AddCompany" element={<AddCompany />} />
        <Route path="/dashboard/:id" element={<Dashboard />} />
        <Route path="/dashboard/:id/LogBook" element={<LogsPage/>} />
        <Route path="/dashboard/:id/LogBook/LogBookSummary" element={<LogPageSummary/>} />
        <Route path="/dashboard/:id/UnidentifiedEvents" element={<UnidentifiedEvents />} />
        <Route path="/dashboard/:id/DOT" element={<DOT />} />
        <Route path="/dashboard/:id/CompanyManagement" element={<CompanyManagement />} />
        <Route path="/dashboard/:id/DeviceManagement" element={<DeviceManagement />} />
        <Route path="/dashboard/:id/Devices/AddDevices" element={<AddDevice />} />
        <Route path="/dashboard/:id/Manage/VehicleManagement" element={<VehicleManagement />} />
        <Route path="/dashboard/:id/Manage/VehicleManagement/AddVehicle" element={<VehicleForm />} />
        <Route path="/dashboard/:id/Manage/VehicleManagement/DriverManagement" element={<DriverManagement />} />
        <Route path="/dashboard/:id/Manage/VehicleManagement/AddDriver" element={<AddDriver />} />
        <Route path="/dashboard/:id/Manage/TerminalManagement" element={<TerminalDashboard />} />
        <Route path="/dashboard/:id/Manage/TerminalManagement/AddTerminal" element={<AddTerminalForm />} />
        <Route path="/dashboard/:id/ErrorsManagement" element={<ErrorManagement />} />
        <Route path="/dashboard/:id/LogBook/Summary/:driverId" element={<LogPageSummary />} />
        <Route path="/dashboard/:id/LogBook/DriverLogBook/:driverId" element={<DriverLogBook />} />
        <Route path="/dashboard/:id/LogBook/DVIR" element={<DVIRManagement />} />
        
        <Route
  path="/dashboard/:id/LogBook/DriverLogBook/:driverId"
  element={<DriverLogBook />}
  
/>

      </Routes>
    </Router>
  );
}

export default App;
*/