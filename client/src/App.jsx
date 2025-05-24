import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';
import Admin from './pages/Admin';
import AdminUserEdit from './pages/AdminUserEdit';
import PrivateAdminRoute from './components/PrivateAdminRoute';
import PrivateAgentRoute from './components/PrivateAgentRoute';
import AgentDashboard from './components/AgentDashboard';
import AddAgent from './pages/AddAgent';
import AgentAppointments from './pages/AgentAppointments'; // New component

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Public routes */}
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/about' element={<About />} />
        <Route path='/search' element={<Search />} />
        <Route path='/listing/:listingId' element={<Listing />} />
        
        {/* Regular protected routes (authenticated users) */}
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route path='/update-listing/:listingId' element={<UpdateListing />} />
        </Route>
        
        {/* Agent-only routes */}
        <Route element={<PrivateAgentRoute />}>
          <Route path='/agent-dashboard' element={<AgentDashboard />} />
          <Route path='/agent/appointments' element={<AgentAppointments />} />
        </Route>
        
        {/* Admin-only routes */}
        <Route element={<PrivateAdminRoute />}>
          <Route path='/admin' element={<Admin />} />
          <Route path='/admin/user/:userId' element={<AdminUserEdit />} />
          <Route path='/admin/add-agent' element={<AddAgent />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}