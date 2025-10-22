import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/sidePages/sidebar/Sidebar.jsx';
import Home from './components/allPages/HomePage/Home.jsx';
import Faq from './components/otherPages/Faq.jsx';
import './App.css';
import Membership from './components/otherPages/Membership.jsx';
import Policy from './components/otherPages/Policy.jsx';
import Contacts from './components/otherPages/Contact.jsx';
import Dmca from './components/otherPages/Dmca.jsx';
import Donate from './components/otherPages/Donate.jsx';
import Header from './components/sidePages/header/Header.jsx';
import Login from './components/User/Login.jsx';
import { AuthProvider } from './components/hooks/AuthContext.jsx';
import Signup from './components/User/SignUp.jsx';
import SearchResults from './components/sidePages/SearchResults/SearchResults.jsx';
import Setting from './components/profilePages/Setting.jsx';
import Profile from './components/profilePages/Profile.jsx';
import ScrollProgressBar from './components/profilePages/ScrollProgressBar.jsx';
import RequestPage from './components/User/Request/RequestPage.jsx';
import AdminAction from './components/User/Request/Admin/AdminAction.jsx';
import PcGames from './components/allPages/PcPage/PcGames.jsx';
import PcSoftwares from './components/allPages/PcPage/PcSoftwares.jsx';
import Android from './components/allPages/AndroidPage/Android.jsx';
import AndroidSoftwares from './components/allPages/AndroidPage/AndroidSoftwares.jsx';
import PpssppIso from './components/allPages/PsPage/PpssppIso.jsx';
import Ps2Iso from './components/allPages/PsPage/Ps2Iso.jsx';
import Ps3Iso from './components/allPages/PsPage/Ps3Iso.jsx';
import MacSoftwares from './components/allPages/MacPage/MacSoftwares.jsx';
import MacGames from './components/allPages/MacPage/MacGames.jsx';
import MacExclusives from './components/allPages/MacPage/MacExclusives.jsx';
import SingleApp from './components/allPages/SinglePage/SingleApp.jsx';
import UpdateApps from './components/Admin/UpdateApps.jsx';
import PaidGameAdminPage from './components/Admin/PaidGameAdminPage.jsx';
import CreateApps from './components/Admin/CreateApps.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex min-h-screen">
          {/* Sidebar on the left */}
          <Sidebar />

          {/* Main content area */}
          <main className="flex-1 w-full transition-all duration-300">
            <div className="container mx-auto px-4 py-8">

              <div>
                <ScrollProgressBar />
              </div>

              {/* 🔥 GLOBAL HEADER - appears on all pages */}
              <div className="mb-6">
                <Header />
              </div>

              <Routes>

                {/* Admin Pages  */}
                <Route path="/admin/apps/new" element={<CreateApps />} />
                <Route path="/admin/apps/update/:id" element={<UpdateApps />} />
                <Route path="/admin/apps/paid" element={<PaidGameAdminPage />} />

                {/*Game Request Pages */}
                <Route path="/request" element={<RequestPage />} />
                <Route path="/request/admin" element={<AdminAction />} />

                {/* main Pages */}
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/category/mac/games" element={<MacGames />} />
                <Route path="/category/mac/games/exclusive" element={<MacExclusives />} />
                <Route path="/category/mac/softwares" element={<MacSoftwares />} />
                <Route path="/category/pc/games" element={<PcGames />} />
                <Route path="/category/pc/softwares" element={<PcSoftwares />} />
                <Route path="/category/android/games" element={<Android />} />
                <Route path="/category/android/softwares" element={<AndroidSoftwares />} />
                <Route path="/category/ppsspp/iso" element={<PpssppIso />} />
                <Route path="/category/ps2/iso" element={<Ps2Iso />} />
                <Route path="/category/ps3/iso" element={<Ps3Iso />} />
                <Route path='/download/:platform/:slug/:id' element={<SingleApp />} />


                {/* registration pages  */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* profile pages */}
                <Route path="/settings" element={<Setting />} />
                <Route path="/profile" element={<Profile />} />


                {/* other Pages */}
                <Route path="/faq" element={<Faq />} />
                <Route path="/membership" element={<Membership />} />
                <Route path="/policy" element={<Policy />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/copyright-holders" element={<Dmca />} />
                <Route path="/donate" element={<Donate />} />


              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
