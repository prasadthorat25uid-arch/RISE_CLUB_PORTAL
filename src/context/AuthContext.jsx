import React, { createContext, useContext, useState } from 'react';
import { useData } from './DataContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { data, addToast } = useData();

  // Default active user: Faculty Coordinator Dr. Abhijit Kshirsagar
  const [currentUserId, setCurrentUserId] = useState(() => {
    return localStorage.getItem('rise_active_user_id') || 'usr-fac-1';
  });

  const currentUser = data.users.find(u => u.id === currentUserId) || data.users[0];

  const switchUserRole = (userId) => {
    setCurrentUserId(userId);
    localStorage.setItem('rise_active_user_id', userId);
  };

  // Login authentication with unique PRN + Password
  const loginWithPRN = (inputPRN, plainPassword) => {
    const foundUser = data.users.find(u => u.prn?.toLowerCase() === inputPRN?.toLowerCase());
    
    if (!foundUser) {
      addToast(`Error: No account found with PRN ${inputPRN}`, 'error');
      return { success: false, message: `No account found with PRN ${inputPRN}` };
    }

    if (foundUser.status === 'Suspended' || foundUser.status === 'Removed') {
      addToast(`Account for PRN ${inputPRN} is ${foundUser.status}. Access disabled.`, 'error');
      return { success: false, message: `Account is ${foundUser.status}` };
    }

    // Authenticate user & set current active user session
    switchUserRole(foundUser.id);
    addToast(`Welcome back, ${foundUser.name}! Logged in successfully.`, 'success');
    return { success: true, user: foundUser };
  };

  const role = currentUser?.role || 'Research Club Member';

  const permissions = {
    isFaculty: role === 'Faculty Coordinator',
    isPresident: role === 'President',
    isVicePresident: role === 'Vice President',
    // Rule: President (Ayushi Ahire) and Vice President (Prasad Thorat) have equal student leadership authority!
    isEqualLeadership: role === 'President' || role === 'Vice President',
    isStudentLead: ['Research Head', 'Secretary + Event Coordinator', 'Social Media & Publicity Head', 'Member Coordinator'].includes(role),
    isMember: role === 'Research Club Member',

    // Functional capabilities
    canManageMembers: role === 'Faculty Coordinator' || role === 'President' || role === 'Vice President',
    canBulkCreateMembers: role === 'Faculty Coordinator' || role === 'President' || role === 'Vice President',
    canResetPasswords: role === 'Faculty Coordinator' || role === 'President' || role === 'Vice President',
    canCreateTeams: role === 'Faculty Coordinator' || role === 'President' || role === 'Vice President',
    canAssignTasks: role === 'Faculty Coordinator' || role === 'President' || role === 'Vice President' || ['Research Head', 'Secretary + Event Coordinator'].includes(role),
    canSuspendDeactivate: role === 'Faculty Coordinator' || role === 'President' || role === 'Vice President',
    canRemoveAccess: role === 'Faculty Coordinator' || role === 'President' || role === 'Vice President',
    canApproveApplications: role === 'Faculty Coordinator' || role === 'President' || role === 'Vice President',
    canIssueCertificates: role === 'Faculty Coordinator' || role === 'President' || role === 'Vice President'
  };

  // Strip passwordHash from public user references
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
      switchUserRole,
      loginWithPRN,
      permissions
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
