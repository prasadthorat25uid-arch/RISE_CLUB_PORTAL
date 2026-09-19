import React, { createContext, useContext, useState } from 'react';
import { useData } from './DataContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { data, addToast } = useData();

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('rise_is_authenticated') === 'true';
  });

  const [currentUserId, setCurrentUserId] = useState(() => {
    return localStorage.getItem('rise_active_user_id') || 'usr-fac-1';
  });

  const currentUser = data.users.find(u => u.id === currentUserId) || data.users[0];

  const switchUserRole = (userId) => {
    setCurrentUserId(userId);
    setIsAuthenticated(true);
    localStorage.setItem('rise_active_user_id', userId);
    localStorage.setItem('rise_is_authenticated', 'true');
  };

  // Login authentication supporting unique PRN OR Email + Password
  const loginWithPRN = (inputCredential, plainPassword) => {
    const cred = inputCredential?.toLowerCase().trim();
    const foundUser = data.users.find(u => 
      u.prn?.toLowerCase() === cred || u.email?.toLowerCase() === cred
    );
    
    if (!foundUser) {
      addToast(`Error: No member account found matching PRN/Email '${inputCredential}'`, 'error');
      return { success: false, message: `No account found matching '${inputCredential}'` };
    }

    if (foundUser.status === 'Suspended' || foundUser.status === 'Removed') {
      addToast(`Account for ${foundUser.name} is ${foundUser.status}. Access disabled.`, 'error');
      return { success: false, message: `Account is ${foundUser.status}` };
    }

    setCurrentUserId(foundUser.id);
    setIsAuthenticated(true);
    localStorage.setItem('rise_active_user_id', foundUser.id);
    localStorage.setItem('rise_is_authenticated', 'true');

    addToast(`Welcome back, ${foundUser.name}! Logged in to your personal profile.`, 'success');
    return { success: true, user: foundUser };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('rise_is_authenticated');
    addToast('Logged out successfully.', 'info');
  };

  const role = currentUser?.role || 'RISE Club Member';

  const permissions = {
    isFaculty: role === 'Faculty Coordinator',
    isPresident: role === 'President',
    isResearchHead: role === 'Research Head',
    isEventCoordinator: role === 'Event Coordinator',
    isSocialHead: role === 'Social Media & Publicity Head',
    isSecretary: role === 'Secretary',
    isMemberCoordinator: role === 'Member Coordinator',
    isStudentLead: ['Research Head', 'Event Coordinator', 'Social Media & Publicity Head', 'Secretary', 'Member Coordinator'].includes(role),
    isMember: role === 'RISE Club Member' || role === 'Research Club Member' || role === 'Club Member',

    // Role-based functional capabilities (Admins: Faculty Coordinator, President)
    canManageMembers: role === 'Faculty Coordinator' || role === 'President' || role === 'Member Coordinator',
    canCreateMemberProfile: role === 'Faculty Coordinator' || role === 'President' || role === 'Member Coordinator',
    canDeleteMemberProfile: role === 'Faculty Coordinator' || role === 'President',
    canBulkCreateMembers: role === 'Faculty Coordinator' || role === 'President',
    canResetPasswords: role === 'Faculty Coordinator' || role === 'President',
    canCreateTeams: role === 'Faculty Coordinator' || role === 'President',
    canAssignTasks: role === 'Faculty Coordinator' || role === 'President' || ['Research Head', 'Event Coordinator', 'Secretary', 'Member Coordinator'].includes(role),
    canSuspendDeactivate: role === 'Faculty Coordinator' || role === 'President',
    canRemoveAccess: role === 'Faculty Coordinator' || role === 'President',
    canApproveApplications: role === 'Faculty Coordinator' || role === 'President' || role === 'Member Coordinator',
    canIssueCertificates: role === 'Faculty Coordinator' || role === 'President'
  };

  const safeUser = currentUser ? {
    id: currentUser.id,
    memberId: currentUser.memberId,
    prn: currentUser.prn,
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    role: currentUser.role,
    department: currentUser.department,
    academicYear: currentUser.academicYear,
    division: currentUser.division,
    status: currentUser.status,
    joiningDate: currentUser.joiningDate,
    photo: currentUser.photo,
    researchInterests: currentUser.researchInterests,
    technicalSkills: currentUser.technicalSkills,
    bio: currentUser.bio,
    teams: currentUser.teams
  } : null;

  return (
    <AuthContext.Provider value={{
      currentUser: safeUser,
      currentUserId,
      isAuthenticated,
      switchUserRole,
      loginWithPRN,
      logout,
      permissions
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
