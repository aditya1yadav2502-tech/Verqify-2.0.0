import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

/* Layouts */
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import StudentLayout from './layouts/StudentLayout';
import CompanyLayout from './layouts/CompanyLayout';

/* Public Pages */
import LandingPage from './pages/LandingPage';
import StudentProfile from './pages/StudentProfile';
import HowItWorks from './pages/public/HowItWorks';
import ForCompanies from './pages/public/ForCompanies';
import Pricing from './pages/public/Pricing';
import About from './pages/public/About';
import { PrivacyPolicy, TermsOfService, Contact } from './pages/public/Legal';

/* Auth Pages */
import SignUp from './pages/auth/SignUp';
import LogIn from './pages/auth/LogIn';
import CompanyLogin from './pages/auth/CompanyLogin';

/* Student Pages */
import StudentDashboard from './pages/student/StudentDashboard';
import BuildProfile from './pages/student/BuildProfile';
import MyFingerprint from './pages/student/MyFingerprint';
import ProofVerification from './pages/student/ProofVerification';
import VisibilitySettings from './pages/student/VisibilitySettings';
import Analytics from './pages/student/Analytics';

/* Company Pages */
import CompanyDashboard from './pages/company/CompanyDashboard';
import SavedCandidates from './pages/company/SavedCandidates';
import Messages from './pages/company/Messages';

function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <Routes>
        {/* Public Routes with Navbar & Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/s/:username" element={<StudentProfile />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/companies" element={<ForCompanies />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Auth Routes with Minimal Layout */}
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/company/login" element={<CompanyLogin />} />
        </Route>

        {/* Student Dashboard Routes */}
        <Route element={<StudentLayout />}>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/dashboard/profile" element={<BuildProfile />} />
          <Route path="/dashboard/fingerprint" element={<MyFingerprint />} />
          <Route path="/dashboard/proof" element={<ProofVerification />} />
          <Route path="/dashboard/settings" element={<VisibilitySettings />} />
          <Route path="/dashboard/analytics" element={<Analytics />} />
        </Route>

        {/* Company Dashboard Routes */}
        <Route element={<CompanyLayout />}>
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route path="/company/saved" element={<SavedCandidates />} />
          <Route path="/company/messages" element={<Messages />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
