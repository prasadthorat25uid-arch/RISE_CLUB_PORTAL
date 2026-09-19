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
import { ContactPage } from './pages/public/ContactPage';
import { JoinRisePage } from './pages/public/JoinRisePage';
import { LoginPage } from './pages/public/LoginPage';

// Admin & Role Dashboards
import { FacultyDashboard } from './pages/admin/FacultyDashboard';
import { PresidentDashboard } from './pages/admin/PresidentDashboard';
import { ResearchHeadDashboard } from './pages/admin/ResearchHeadDashboard';
import { EventCoordinatorDashboard } from './pages/admin/EventCoordinatorDashboard';
import { SocialMediaDashboard } from './pages/admin/SocialMediaDashboard';
import { SecretaryDashboard } from './pages/admin/SecretaryDashboard';
import { MemberCoordinatorDashboard } from './pages/admin/MemberCoordinatorDashboard';
import { RiseMemberDashboard } from './pages/admin/RiseMemberDashboard';
import { MemberDashboard } from './pages/admin/MemberDashboard';
import { MemberManagement } from './pages/admin/MemberManagement';
import { CreateMultipleMembers } from './pages/admin/CreateMultipleMembers';
import { TeamManagement } from './pages/admin/TeamManagement';
import { TaskManagement } from './pages/admin/TaskManagement';
import { ApplicationsManagement } from './pages/admin/ApplicationsManagement';
import { CertificatesManagement } from './pages/admin/CertificatesManagement';
import { AnnouncementsManagement } from './pages/admin/AnnouncementsManagement';
import { ProfilePage } from './pages/public/ProfilePage';
import { PublicMemberProfile } from './pages/public/PublicMemberProfile';
import { NotificationsPage } from './pages/public/NotificationsPage';
import { UnauthorizedPage } from './pages/public/UnauthorizedPage';
import { DashboardShell } from './components/DashboardShell';

const AppContent = () => {
  const getRouteInfo = () => {
    let hash = window.location.hash.replace(/^#\/?/, '').trim();
    if (hash.startsWith('dashboard/')) {
      hash = hash.replace('dashboard/', 'dashboard-');
    }

    // Check for member public profile: member/public/:id or member/:id
    const memberPublicMatch = hash.match(/^member\/(?:public\/)?([^/?#]+)$/i);
    if (memberPublicMatch) {
      return { tab: 'member-public', memberId: decodeURIComponent(memberPublicMatch[1]) };
    }

    // Check for member private profile: member/private/:id or member/private
    const memberPrivateMatch = hash.match(/^member\/private(?:\/([^/?#]+))?$/i);
    if (memberPrivateMatch) {
      return { tab: 'profile', memberId: memberPrivateMatch[1] ? decodeURIComponent(memberPrivateMatch[1]) : null };
    }

    return { tab: hash || 'home', memberId: null };
  };

  const [routeInfo, setRouteInfo] = useState(() => getRouteInfo());
  const activeTab = routeInfo.tab;
  const currentMemberId = routeInfo.memberId;
  const { isAuthenticated, currentUser, permissions } = useAuth();

  const setActiveTab = (tab) => {
    window.location.hash = `#/${tab}`;
    setRouteInfo(getRouteInfo());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  React.useEffect(() => {
    const handleHashChange = () => {
      setRouteInfo(getRouteInfo());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isPrivateRoute = [
    'dashboard-faculty', 'dashboard-president', 'dashboard-research',
    'dashboard-events', 'dashboard-social', 'dashboard-secretary',
    'dashboard-members', 'dashboard-member', 'dashboard-pres-vp',
    'profile', 'notifications',
    'manage-members', 'create-members', 'manage-teams', 'manage-tasks',
    'manage-applications', 'issue-certificates', 'manage-announcements'
  ].includes(activeTab);

  const renderActiveView = () => {
    // Private route guard: Require authentication for dashboards & management portals
    if (isPrivateRoute && !isAuthenticated) {
      return <LoginPage setActiveTab={setActiveTab} />;
    }

    const role = currentUser?.role;

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
      case 'members':
      case 'team':
        return <TeamPage setActiveTab={setActiveTab} />;
      case 'member-public':
        return <PublicMemberProfile memberId={currentMemberId} setActiveTab={setActiveTab} />;
      case 'achievements':
        return <AchievementsPage />;
      case 'contact':
        return <ContactPage />;
      case 'join':
        return <JoinRisePage setActiveTab={setActiveTab} />;
      case 'login':
        return <LoginPage setActiveTab={setActiveTab} />;
      case 'unauthorized':
        return <UnauthorizedPage setActiveTab={setActiveTab} />;

      // Universal Authenticated Pages
      case 'profile':
        return <ProfilePage setActiveTab={setActiveTab} targetUserId={currentMemberId} />;
      case 'notifications':
        return <NotificationsPage setActiveTab={setActiveTab} />;

      // Dedicated Role Portals (Guarded)
      case 'dashboard-faculty':
        if (role !== 'Faculty Coordinator') {
          return <UnauthorizedPage setActiveTab={setActiveTab} requestedPath="/dashboard/faculty" />;
        }
        return <FacultyDashboard setActiveTab={setActiveTab} />;

      case 'dashboard-president':
      case 'dashboard-pres-vp':
        if (role !== 'President' && role !== 'Faculty Coordinator') {
          return <UnauthorizedPage setActiveTab={setActiveTab} requestedPath="/dashboard/president" />;
        }
        return <PresidentDashboard setActiveTab={setActiveTab} />;

      case 'dashboard-research':
        if (role !== 'Research Head' && role !== 'President' && role !== 'Faculty Coordinator') {
          return <UnauthorizedPage setActiveTab={setActiveTab} requestedPath="/dashboard/research" />;
        }
        return <ResearchHeadDashboard setActiveTab={setActiveTab} />;

      case 'dashboard-events':
        if (role !== 'Event Coordinator' && role !== 'Secretary' && role !== 'President' && role !== 'Faculty Coordinator') {
          return <UnauthorizedPage setActiveTab={setActiveTab} requestedPath="/dashboard/events" />;
        }
        return <EventCoordinatorDashboard setActiveTab={setActiveTab} />;

      case 'dashboard-social':
        if (role !== 'Social Media & Publicity Head' && role !== 'President' && role !== 'Faculty Coordinator') {
          return <UnauthorizedPage setActiveTab={setActiveTab} requestedPath="/dashboard/social" />;
        }
        return <SocialMediaDashboard setActiveTab={setActiveTab} />;

      case 'dashboard-secretary':
        if (role !== 'Secretary' && role !== 'President' && role !== 'Faculty Coordinator') {
          return <UnauthorizedPage setActiveTab={setActiveTab} requestedPath="/dashboard/secretary" />;
        }
        return <SecretaryDashboard setActiveTab={setActiveTab} />;

      case 'dashboard-members':
        if (role !== 'Member Coordinator' && role !== 'President' && role !== 'Faculty Coordinator') {
          return <UnauthorizedPage setActiveTab={setActiveTab} requestedPath="/dashboard/members" />;
        }
        return <MemberCoordinatorDashboard setActiveTab={setActiveTab} />;

      case 'dashboard-member':
        return <RiseMemberDashboard setActiveTab={setActiveTab} />;

      // Administrative Management Pages (Guarded)
      case 'manage-members':
        if (!permissions?.canManageMembers) {
          return <UnauthorizedPage setActiveTab={setActiveTab} requestedPath="/manage-members" />;
        }
        return <MemberManagement setActiveTab={setActiveTab} />;

      case 'create-members':
        if (!permissions?.canCreateMemberProfile) {
          return <UnauthorizedPage setActiveTab={setActiveTab} requestedPath="/create-members" />;
        }
        return <CreateMultipleMembers />;

      case 'manage-teams':
        if (!permissions?.canCreateTeams) {
          return <UnauthorizedPage setActiveTab={setActiveTab} requestedPath="/manage-teams" />;
        }
        return <TeamManagement />;

      case 'manage-tasks':
        return <TaskManagement />;

      case 'manage-applications':
        if (!permissions?.canApproveApplications) {
          return <UnauthorizedPage setActiveTab={setActiveTab} requestedPath="/manage-applications" />;
        }
        return <ApplicationsManagement />;

      case 'issue-certificates':
        if (!permissions?.canIssueCertificates) {
          return <UnauthorizedPage setActiveTab={setActiveTab} requestedPath="/issue-certificates" />;
        }
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
