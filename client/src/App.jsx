import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/Loader';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

const Home = lazy(() => import('./pages/Home'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const NotFound = lazy(() => import('./pages/NotFound'));

const Login = lazy(() => import('./pages/admin/Login'));
const DashboardLayout = lazy(() => import('./pages/admin/DashboardLayout'));
const Overview = lazy(() => import('./pages/admin/Overview'));
const ProjectsAdmin = lazy(() => import('./pages/admin/ProjectsAdmin'));
const SkillsAdmin = lazy(() => import('./pages/admin/SkillsAdmin'));
const ExperienceAdmin = lazy(() => import('./pages/admin/ExperienceAdmin'));
const ServicesAdmin = lazy(() => import('./pages/admin/ServicesAdmin'));
const BlogAdmin = lazy(() => import('./pages/admin/BlogAdmin'));
const MessagesAdmin = lazy(() => import('./pages/admin/MessagesAdmin'));
const ResumeAdmin = lazy(() => import('./pages/admin/ResumeAdmin'));
const SettingsAdmin = lazy(() => import('./pages/admin/SettingsAdmin'));

function PublicSite() {
  return (
    <div className="min-h-screen font-body">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Overview />} />
              <Route path="projects" element={<ProjectsAdmin />} />
              <Route path="skills" element={<SkillsAdmin />} />
              <Route path="experience" element={<ExperienceAdmin />} />
              <Route path="services" element={<ServicesAdmin />} />
              <Route path="blog" element={<BlogAdmin />} />
              <Route path="messages" element={<MessagesAdmin />} />
              <Route path="resume" element={<ResumeAdmin />} />
              <Route path="settings" element={<SettingsAdmin />} />
            </Route>
            <Route path="/*" element={<PublicSite />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </ThemeProvider>
  );
}
