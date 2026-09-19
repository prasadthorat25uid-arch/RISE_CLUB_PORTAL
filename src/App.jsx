import React, { useState } from 'react';
import { DataProvider } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { NotificationToast } from './components/NotificationToast';

// Public Pages
import { Home } from './pages/public/Home';
import { About } from './pages/public/About';
import { ResearchPage } from './pages/public/ResearchPage';
import { ProjectsPage } from './pages/public/ProjectsPage';
import { EventsPage } from './pages/public/EventsPage';
import { PublicationsPage } from './pages/public/PublicationsPage';
import { TeamPage } from './pages/public/TeamPage';
import { AchievementsPage } from './pages/public/AchievementsPage';
import { JoinRisePage } from './pages/public/JoinRisePage';
import { LoginPage } from './pages/public/LoginPage';

// Admin & Role Dashboards
import { FacultyDashboard } from './pages/admin/FacultyDashboard';
import { PresidentVPDashboard } from './pages/admin/PresidentVPDashboard';
import { MemberDashboard } from './pages/admin/MemberDashboard';
import { MemberManagement } from './pages/admin/MemberManagement';
import { CreateMultipleMembers } from './pages/admin/CreateMultipleMembers';
import { TeamManagement } from './pages/admin/TeamManagement';
import { TaskManagement } from './pages/admin/TaskManagement';
import { ApplicationsManagement } from './pages/admin/ApplicationsManagement';
import { CertificatesManagement } from './pages/admin/CertificatesManagement';
import { AnnouncementsManagement } from './pages/admin/AnnouncementsManagement';
import { DashboardShell } from './components/DashboardShell';

const AppContent = () => {
  const getTabFromHash = () => {
    const hash = window.location.hash.replace(/^#\/?/, '').trim();
    return hash || 'home';
  };

  const [activeTab, setActiveTabState] = useState(() => getTabFromHash());
  const { isAuthenticated, permissions } = useAuth();

  const setActiveTab = (tab) => {
    window.location.hash = `#/${tab}`;
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  React.useEffect(() => {
    const handleHashChange = () => {
      const tab = getTabFromHash();
      setActiveTabState(tab);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isPrivateRoute = [
    'dashboard-faculty', 'dashboard-pres-vp', 'dashboard-member',
    'manage-members', 'create-members', 'manage-teams', 'manage-tasks',
    'manage-applications', 'issue-certificates', 'manage-announcements'
  ].includes(activeTab);

  const renderActiveView = () => {
    // Private route guard: Require authentication for dashboards & management portals
    if (isPrivateRoute && !isAuthenticated) {
      return <LoginPage setActiveTab={setActiveTab} />;
    }

    switch (activeTab) {
      // Public Pages
      case 'home':
        return <Home setActiveTab={setActiveTab} />;
      case 'about':
        return <About />;
      case 'research':
        return <ResearchPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'events':
        return <EventsPage />;
      case 'publications':
        return <PublicationsPage />;
      case 'team':
        return <TeamPage />;
      case 'achievements':
        return <AchievementsPage />;
      case 'join':
        return <JoinRisePage setActiveTab={setActiveTab} />;
      case 'login':
        return <LoginPage setActiveTab={setActiveTab} />;

      // Private Role Portals (Guarded)
      case 'dashboard-faculty':
        return <FacultyDashboard setActiveTab={setActiveTab} />;
      case 'dashboard-pres-vp':
        return <PresidentVPDashboard setActiveTab={setActiveTab} />;
      case 'dashboard-member':
        return <MemberDashboard />;

      // Private Management Pages (Guarded)
      case 'manage-members':
        return <MemberManagement setActiveTab={setActiveTab} />;
      case 'create-members':
        return <CreateMultipleMembers />;
      case 'manage-teams':
        return <TeamManagement />;
      case 'manage-tasks':
        return <TaskManagement />;
      case 'manage-applications':
        return <ApplicationsManagement />;
      case 'issue-certificates':
        return <CertificatesManagement />;
      case 'manage-announcements':
        return <AnnouncementsManagement />;

      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  };

  // Dedicated responsive Dashboard Layout for Authenticated Portals
  if (isPrivateRoute && isAuthenticated) {
    return (
      <DashboardShell activeTab={activeTab} setActiveTab={setActiveTab}>
        <div className="p-4 sm:p-8">
          {renderActiveView()}
        </div>
        <NotificationToast />
      </DashboardShell>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1">
        {renderActiveView()}
      </main>

      <Footer setActiveTab={setActiveTab} />
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <DataProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </DataProvider>
  );
}
