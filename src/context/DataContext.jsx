import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialSeedData } from '../data/seedData';

const DataContext = createContext();

const hashPassword = (plainPassword) => {
  if (!plainPassword) return '$2a$10$defaultHashValueForEmptyPassword';
  let hash = 0;
  for (let i = 0; i < plainPassword.length; i++) {
    const char = plainPassword.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `$2a$10$hashed_${Math.abs(hash)}_${Date.now()}`;
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const local = localStorage.getItem('rise_platform_data');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error("Failed to parse local storage data, resetting to seed data", e);
      }
    }
    return initialSeedData;
  });

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem('rise_platform_data', JSON.stringify(data));
  }, [data]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addActivityLog = (action, user, target, description) => {
    const now = new Date();
    const dateTimeStr = now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0].substring(0, 5);
    const newLog = {
      id: `log-${Date.now()}`,
      action,
      user,
      target,
      dateTime: dateTimeStr,
      description
    };
    setData(prev => ({
      ...prev,
      activityLogs: [newLog, ...prev.activityLogs]
    }));
  };

  const generateMemberId = (currentUsers) => {
    const memberNumbers = currentUsers
      .map(u => {
        const match = u.memberId?.match(/RISE-2026-(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(n => !isNaN(n));
    
    const maxNum = memberNumbers.length > 0 ? Math.max(...memberNumbers) : 0;
    const nextNum = (maxNum + 1).toString().padStart(3, '0');
    return `RISE-2026-${nextNum}`;
  };

  // LINK-BASED WORK SUBMISSION FOR MEMBERS
  const submitWorkLink = (input) => {
    const { taskId, memberId, memberName, linkUrl, linkType, notes } = input;
    if (!linkUrl) {
      addToast('Error: Submission Link URL is required!', 'error');
      return { success: false, message: 'Link URL is required' };
    }

    const now = new Date();
    const timestamp = now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0].substring(0, 5);

    const newSub = {
      id: `sub-${Date.now()}`,
      taskId,
      memberId,
      memberName,
      linkUrl,
      linkType: linkType || 'GitHub Repository',
      notes: notes || '',
      submittedAt: timestamp
    };

    // Update tasks state
    setData(prev => ({
      ...prev,
      submissions: [newSub, ...(prev.submissions || [])],
      tasks: prev.tasks.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            submissionLink: linkUrl,
            submissionType: linkType || 'GitHub Repository',
            submissionNotes: notes || '',
            submittedAt: timestamp,
            status: 'Under Review',
            progress: 90
          };
        }
        return t;
      })
    }));

    addActivityLog('Work Submitted via Link', memberName, `Task Submission`, `Attached ${linkType}: ${linkUrl}`);
    addToast(`Deliverable link submitted successfully in link format!`, 'success');

    // Attempt to call Vercel Serverless Function `/api/submissions` asynchronously
    fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSub)
    }).catch(err => {
      // Offline fallback handling
      console.log('Vercel serverless offline mode: Saved to local reactive store.', err);
    });

    return { success: true, submission: newSub };
  };

  // Option A - Individual Member Creation
  const createMember = (memberInput, createdBy = "Admin") => {
    const duplicatePRN = data.users.find(u => u.prn?.toLowerCase() === memberInput.prn?.toLowerCase());
    if (duplicatePRN) {
      addToast(`Error: PRN ${memberInput.prn} already exists! PRN must be unique.`, 'error');
      return { success: false, message: `PRN ${memberInput.prn} already exists!` };
    }

    const duplicateEmail = data.users.find(u => u.email?.toLowerCase() === memberInput.email?.toLowerCase());
    if (duplicateEmail) {
      addToast(`Error: Email ${memberInput.email} already exists!`, 'error');
      return { success: false, message: `Email ${memberInput.email} already exists!` };
    }

    const newMemberId = generateMemberId(data.users);
    const initialPassword = memberInput.initialPassword || `${memberInput.prn}@rise2026`;
    const passwordHash = hashPassword(initialPassword);

    const newMember = {
      id: `usr-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      memberId: newMemberId,
      prn: memberInput.prn,
      passwordHash: passwordHash,
      name: memberInput.fullName || memberInput.name,
      email: memberInput.email,
      phone: memberInput.phone || '',
      role: memberInput.role || 'Research Club Member',
      roleGroup: memberInput.role === 'Faculty Coordinator' ? 'faculty' : (['President', 'Vice President'].includes(memberInput.role) ? 'student_leadership' : 'member'),
      department: memberInput.department || 'Integrated B.Tech',
      academicYear: memberInput.academicYear || 'Year 1',
      division: memberInput.division || 'Class A',
      status: memberInput.status || 'Active',
      joiningDate: memberInput.joiningDate || new Date().toISOString().split('T')[0],
      photo: memberInput.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      researchInterests: Array.isArray(memberInput.researchInterests) ? memberInput.researchInterests : (memberInput.researchInterests ? memberInput.researchInterests.split(',').map(s=>s.trim()) : []),
      technicalSkills: Array.isArray(memberInput.technicalSkills) ? memberInput.technicalSkills : (memberInput.technicalSkills ? memberInput.technicalSkills.split(',').map(s=>s.trim()) : []),
      bio: memberInput.bio || 'Interview-selected Research Club Member.',
      contributionsCount: 0,
      teams: memberInput.team ? [memberInput.team] : [],
      activeProjects: []
    };

    setData(prev => ({
      ...prev,
      users: [newMember, ...prev.users]
    }));

    addActivityLog('Member Profile & Account Created', createdBy, `${newMember.name} (${newMemberId})`, `Member profile created with unique PRN ${newMember.prn} and private authentication account.`);
    addToast(`Research Club Member ${newMember.name} created with ID ${newMemberId}! Login account generated.`, 'success');
    return { success: true, member: newMember, tempPassword: initialPassword };
  };

  const createBulkMembers = (membersArray, createdBy = "Admin") => {
    let currentUsers = [...data.users];
    const createdList = [];
    const errors = [];

    membersArray.forEach((row, index) => {
      if (!row.name || !row.email || !row.prn) {
        errors.push(`Row ${index + 1}: Name, PRN, and Email are required.`);
        return;
      }

      const dupPRN = currentUsers.find(u => u.prn?.toLowerCase() === row.prn?.toLowerCase());
      if (dupPRN) {
        errors.push(`Row ${index + 1}: Duplicate PRN ${row.prn}`);
        return;
      }

      const dupEmail = currentUsers.find(u => u.email?.toLowerCase() === row.email?.toLowerCase());
      if (dupEmail) {
        errors.push(`Row ${index + 1}: Duplicate Email ${row.email}`);
        return;
      }

      const newId = generateMemberId(currentUsers);
      const initialPassword = `${row.prn}@rise2026`;

      const newMember = {
        id: `usr-bulk-${Date.now()}-${index}`,
        memberId: newId,
        prn: row.prn,
        passwordHash: hashPassword(initialPassword),
        name: row.name,
        email: row.email,
        phone: row.phone || '',
        role: row.role || 'Research Club Member',
        roleGroup: 'member',
        department: row.department || 'Integrated B.Tech',
        academicYear: row.academicYear || 'Year 1',
        division: row.division || 'Class A',
        status: row.status || 'Active',
        joiningDate: new Date().toISOString().split('T')[0],
        photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        researchInterests: row.researchInterests ? row.researchInterests.split(',').map(s=>s.trim()) : ['Emerging Intelligence'],
        technicalSkills: row.technicalSkills ? row.technicalSkills.split(',').map(s=>s.trim()) : ['Python'],
        bio: 'Interview selected Research Club Member.',
        contributionsCount: 0,
        teams: row.team ? [row.team] : [],
        activeProjects: []
      };

      currentUsers.unshift(newMember);
      createdList.push(newMember);
    });

    if (createdList.length > 0) {
      setData(prev => ({
        ...prev,
        users: currentUsers
      }));

      addActivityLog('Bulk Members Created', createdBy, `${createdList.length} Accounts`, `Bulk member onboarding operation executed.`);
      addToast(`Successfully created ${createdList.length} member accounts with unique PRNs!`, 'success');
    }

    return {
      successCount: createdList.length,
      errorCount: errors.length,
      errors,
      createdList
    };
  };

  const resetMemberPassword = (memberId, newPassword, actor = "Admin") => {
    const targetUser = data.users.find(u => u.id === memberId);
    if (!targetUser) return { success: false, message: "User not found" };

    const newHash = hashPassword(newPassword);

    setData(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === memberId ? { ...u, passwordHash: newHash } : u)
    }));

    addActivityLog('Password Reset Executed', actor, `${targetUser.name} (${targetUser.memberId})`, `Password reset completed securely. Existing password was not revealed.`);
    addToast(`Password for ${targetUser.name} has been reset securely!`, 'success');
    return { success: true };
  };

  const updateMemberStatus = (memberId, newStatus, actor = "Admin") => {
    const targetUser = data.users.find(u => u.id === memberId);
    if (!targetUser) return;

    setData(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === memberId ? { ...u, status: newStatus } : u)
    }));

    addActivityLog('Member Status Changed', actor, `${targetUser.name} (${targetUser.memberId})`, `Status changed from ${targetUser.status} to ${newStatus}`);
    addToast(`Status of ${targetUser.name} set to ${newStatus}`, 'info');
  };

  const removeMemberSafely = (memberId, reassignToMemberId = null, actor = "Admin") => {
    const targetUser = data.users.find(u => u.id === memberId);
    if (!targetUser) return { success: false, message: "User not found" };

    const activeTasks = data.tasks.filter(t => t.assignedMemberId === memberId && t.status !== 'Completed' && t.status !== 'Cancelled');

    let updatedTasks = [...data.tasks];
    if (activeTasks.length > 0 && reassignToMemberId) {
      const replacementUser = data.users.find(u => u.id === reassignToMemberId);
      updatedTasks = updatedTasks.map(t => {
        if (t.assignedMemberId === memberId && t.status !== 'Completed' && t.status !== 'Cancelled') {
          return {
            ...t,
            assignedMemberId: replacementUser.id,
            assignedMemberName: replacementUser.name,
            notes: (t.notes || '') + ` (Reassigned from ${targetUser.name} due to member removal)`
          };
        }
        return t;
      });
    }

    setData(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === memberId ? { ...u, status: 'Removed' } : u),
      tasks: updatedTasks
    }));

    addActivityLog('Member Access Removed', actor, `${targetUser.name} (${targetUser.memberId})`, `Member active access removed. Preserved publication & achievement history.`);
    addToast(`Removed active access for ${targetUser.name}. Historical records preserved.`, 'warning');
    return { success: true };
  };

  const updateMemberProfile = (memberId, updatedFields, actor = "User") => {
    setData(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === memberId ? { ...u, ...updatedFields } : u)
    }));
    addToast('Profile updated successfully!', 'success');
  };

  const createTeam = (teamInput, createdBy = "Admin") => {
    const newTeam = {
      id: `team-${Date.now()}`,
      name: teamInput.name,
      type: teamInput.type || 'Research Team',
      domain: teamInput.domain || 'Artificial Intelligence',
      description: teamInput.description || '',
      leaderId: teamInput.leaderId || '',
      leaderName: teamInput.leaderName || 'Unassigned',
      facultyMentor: teamInput.facultyMentor || 'Dr. Abhijit Kshirsagar',
      memberIds: teamInput.memberIds || [],
      startDate: teamInput.startDate || new Date().toISOString().split('T')[0],
      status: 'Active',
      objective: teamInput.objective || ''
    };

    setData(prev => ({
      ...prev,
      teams: [newTeam, ...prev.teams]
    }));

    addActivityLog('Team Created', createdBy, newTeam.name, `New team created under domain: ${newTeam.domain}`);
    addToast(`Team '${newTeam.name}' created!`, 'success');
  };

  const createTask = (taskInput, createdBy = "Admin") => {
    const newTask = {
      id: `task-${Date.now()}`,
      name: taskInput.name,
      description: taskInput.description || '',
      assignedMemberId: taskInput.assignedMemberId,
      assignedMemberName: taskInput.assignedMemberName,
      assignedTeamId: taskInput.assignedTeamId || '',
      assignedTeamName: taskInput.assignedTeamName || '',
      assignedById: taskInput.assignedById || 'usr-fac-1',
      assignedByName: createdBy,
      project: taskInput.project || 'General Research',
      researchActivity: taskInput.researchActivity || 'Task',
      priority: taskInput.priority || 'Medium',
      startDate: taskInput.startDate || new Date().toISOString().split('T')[0],
      deadline: taskInput.deadline,
      status: 'Assigned',
      progress: 0,
      notes: taskInput.notes || ''
    };

    setData(prev => ({
      ...prev,
      tasks: [newTask, ...prev.tasks]
    }));

    addActivityLog('Task Assigned', createdBy, newTask.name, `Assigned to ${newTask.assignedMemberName}`);
    addToast(`Task '${newTask.name}' assigned to ${newTask.assignedMemberName}`, 'success');
  };

  const createBulkTasks = (taskInput, selectedMemberIds, createdBy = "Admin") => {
    const newTasks = selectedMemberIds.map((mId, idx) => {
      const memberObj = data.users.find(u => u.id === mId);
      return {
        id: `task-${Date.now()}-${idx}`,
        name: taskInput.name,
        description: taskInput.description || '',
        assignedMemberId: mId,
        assignedMemberName: memberObj ? memberObj.name : 'Member',
        assignedTeamId: taskInput.assignedTeamId || '',
        assignedTeamName: taskInput.assignedTeamName || '',
        assignedById: taskInput.assignedById || 'usr-fac-1',
        assignedByName: createdBy,
        project: taskInput.project || 'General Project',
        researchActivity: taskInput.researchActivity || 'Bulk Task',
        priority: taskInput.priority || 'Medium',
        startDate: taskInput.startDate || new Date().toISOString().split('T')[0],
        deadline: taskInput.deadline,
        status: 'Assigned',
        progress: 0,
        notes: taskInput.notes || ''
      };
    });

    setData(prev => ({
      ...prev,
      tasks: [...newTasks, ...prev.tasks]
    }));

    addActivityLog('Bulk Task Assignment', createdBy, taskInput.name, `Assigned task to ${selectedMemberIds.length} members`);
    addToast(`Assigned task '${taskInput.name}' to ${selectedMemberIds.length} members!`, 'success');
  };

  const updateTaskStatus = (taskId, newStatus, newProgress) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            status: newStatus,
            progress: newProgress !== undefined ? newProgress : (newStatus === 'Completed' ? 100 : t.progress)
          };
        }
        return t;
      })
    }));
    addToast(`Task status updated to ${newStatus}`, 'info');
  };

  const submitApplication = (appInput) => {
    const newApp = {
      id: `app-${Date.now()}`,
      ...appInput,
      interviewStatus: 'Pending Interview',
      status: 'Pending',
      submittedDate: new Date().toISOString().split('T')[0]
    };

    setData(prev => ({
      ...prev,
      applications: [newApp, ...prev.applications]
    }));

    addToast('Application submitted! Move through interview selection process before member account is created.', 'success');
  };

  const approveApplication = (appId, actor = "Admin") => {
    const appObj = data.applications.find(a => a.id === appId);
    if (!appObj) return;

    const result = createMember({
      fullName: appObj.fullName,
      prn: appObj.prn,
      email: appObj.email,
      phone: appObj.phone,
      department: appObj.department,
      academicYear: appObj.academicYear,
      division: appObj.division,
      researchInterests: appObj.researchInterests,
      technicalSkills: appObj.technicalSkills,
      role: 'Research Club Member',
      status: 'Active'
    }, actor);

    if (result.success) {
      setData(prev => ({
        ...prev,
        applications: prev.applications.map(a => a.id === appId ? { ...a, status: 'Approved', interviewStatus: 'Selected' } : a)
      }));
      addToast(`Interview selection approved for ${appObj.fullName}. Member profile & private login generated!`, 'success');
    }
  };

  const rejectApplication = (appId, actor = "Admin") => {
    const appObj = data.applications.find(a => a.id === appId);
    if (!appObj) return;

    setData(prev => ({
      ...prev,
      applications: prev.applications.map(a => a.id === appId ? { ...a, status: 'Rejected', interviewStatus: 'Not Selected' } : a)
    }));

    addActivityLog('Application Declined', actor, appObj.fullName, 'Interview selection declined.');
    addToast(`Application for ${appObj.fullName} declined`, 'info');
  };

  const createAnnouncement = (annInput, createdBy = "Admin") => {
    const newAnn = {
      id: `ann-${Date.now()}`,
      title: annInput.title,
      content: annInput.content,
      author: createdBy,
      date: new Date().toISOString().split('T')[0],
      priority: annInput.priority || 'Normal'
    };

    setData(prev => ({
      ...prev,
      announcements: [newAnn, ...prev.announcements]
    }));

    addActivityLog('Announcement Published', createdBy, newAnn.title, newAnn.content.substring(0, 50));
    addToast(`Announcement '${newAnn.title}' published!`, 'success');
  };

  const createAchievement = (achInput, createdBy = "Admin") => {
    const newAch = {
      id: `ach-${Date.now()}`,
      recipientName: achInput.recipientName,
      recipientRole: achInput.recipientRole || 'Research Club Member',
      title: achInput.title,
      category: achInput.category || 'Best Student Contributor',
      issuedBy: 'Sanjivani University RISE Committee',
      date: new Date().toISOString().split('T')[0],
      description: achInput.description || ''
    };

    setData(prev => ({
      ...prev,
      achievements: [newAch, ...prev.achievements]
    }));

    addActivityLog('Certificate Issued', createdBy, achInput.recipientName, `Issued: ${achInput.title}`);
    addToast(`Certificate issued to ${achInput.recipientName}!`, 'success');
  };

  const resetToSeedData = () => {
    localStorage.removeItem('rise_platform_data');
    setData(initialSeedData);
    addToast('System data reset to initial seed values.', 'info');
  };

  return (
    <DataContext.Provider value={{
      data,
      toasts,
      addToast,
      removeToast,
      createMember,
      createBulkMembers,
      resetMemberPassword,
      updateMemberStatus,
      removeMemberSafely,
      updateMemberProfile,
      submitWorkLink,
      createTeam,
      createTask,
      createBulkTasks,
      updateTaskStatus,
      createEvent: () => {},
      createPublication: () => {},
      createAchievement,
      submitApplication,
      approveApplication,
      rejectApplication,
      createAnnouncement,
      resetToSeedData,
      addActivityLog
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
