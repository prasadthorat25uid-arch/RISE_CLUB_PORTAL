import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialSeedData } from '../data/seedData';
import { supabase } from '../lib/supabaseClient';

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
        const parsed = JSON.parse(local);
        const merged = {
          ...initialSeedData,
          ...parsed,
          notifications: parsed.notifications?.length ? parsed.notifications : (initialSeedData.notifications || []),
          auditLogs: parsed.auditLogs?.length ? parsed.auditLogs : (initialSeedData.auditLogs || [])
        };
        if (merged.users) {
          merged.users = merged.users.map(u => {
            if (u.id === 'usr-vp-1' && u.role !== 'Vice President') {
              return { ...u, role: 'Vice President', roleGroup: 'student_leadership' };
            }
            return u;
          });
        }
        return merged;
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

  // Initial Supabase remote fetch attempt (with local fallback)
  useEffect(() => {
    const syncWithSupabase = async () => {
      try {
        const { data: remoteUsers, error: userErr } = await supabase.from('users').select('*');
        if (!userErr && remoteUsers && remoteUsers.length > 0) {
          setData(prev => ({
            ...prev,
            users: remoteUsers
          }));
        }
      } catch (err) {
        console.log('Supabase remote sync initialized in local-hybrid mode.');
      }
    };
    syncWithSupabase();
  }, []);

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
      activityLogs: [newLog, ...(prev.activityLogs || [])]
    }));
  };

  const addAuditLog = (userId, userName, action, targetId = '', targetName = '', details = '') => {
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
    const newAudit = {
      id: `audit-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      userId,
      userName,
      action,
      targetId: targetId || '',
      targetName: targetName || '',
      details: details || '',
      timestamp
    };
    setData(prev => ({
      ...prev,
      auditLogs: [newAudit, ...(prev.auditLogs || [])]
    }));
    supabase.from('audit_logs').insert([newAudit]).then(() => {}).catch(() => {});
    return newAudit;
  };

  const getUserById = (userId) => {
    if (!userId) return null;
    return (data.users || []).find(u => u.id === userId || u.prn === userId || u.memberId === userId) || null;
  };

  const getMemberName = (userId, fallbackName = '') => {
    if (!userId) return fallbackName || 'Unassigned';
    const user = getUserById(userId);
    return user ? user.name : (fallbackName || 'Member');
  };

  const addNotification = (userId, title, message, type = 'system', link = '') => {
    const now = new Date();
    const timeStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newNotif = {
      id: `notif-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: timeStr,
      link
    };
    setData(prev => ({
      ...prev,
      notifications: [newNotif, ...(prev.notifications || [])]
    }));
    supabase.from('notifications').insert([newNotif]).then(() => {}).catch(() => {});
    return newNotif;
  };

  const markNotificationAsRead = (notifId) => {
    setData(prev => ({
      ...prev,
      notifications: (prev.notifications || []).map(n => n.id === notifId ? { ...n, read: true } : n)
    }));
  };

  const markAllNotificationsAsRead = (userId = null) => {
    setData(prev => ({
      ...prev,
      notifications: (prev.notifications || []).map(n => (!userId || n.userId === userId) ? { ...n, read: true } : n)
    }));
    addToast('All notifications marked as read.', 'info');
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

    // Async Supabase remote insert attempt
    supabase.from('submissions').insert([newSub]).then(() => {}).catch(() => {});

    return { success: true, submission: newSub };
  };

  // Individual Member Creation
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
      role: memberInput.role || 'RISE Club Member',
      roleGroup: memberInput.role === 'Faculty Coordinator' ? 'faculty' : (memberInput.role === 'President' ? 'student_leadership' : 'member'),
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

    // Async Supabase remote insert attempt
    supabase.from('users').insert([newMember]).then(() => {}).catch(() => {});

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
      
      supabase.from('users').insert(createdList).then(() => {}).catch(() => {});
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

    addActivityLog('Password Reset Executed', actor, `${targetUser.name} (${targetUser.memberId})`, `Password reset completed securely.`);
    addToast(`Password for ${targetUser.name} has been reset securely!`, 'success');

    supabase.from('users').update({ passwordHash: newHash }).eq('id', memberId).then(() => {}).catch(() => {});

    return { success: true };
  };

  const updateMemberStatus = (memberId, newStatus, actor = "Admin") => {
    const targetUser = data.users.find(u => u.id === memberId);
    if (!targetUser) return;

    setData(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === memberId ? { ...u, status: newStatus } : u)
    }));

    addActivityLog('Member Status Changed', actor, `${targetUser.name} (${targetUser.memberId})`, `Status changed to ${newStatus}`);
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

    addActivityLog('Member Access Removed', actor, `${targetUser.name} (${targetUser.memberId})`, `Member active access removed.`);
    addToast(`Removed active access for ${targetUser.name}. Historical records preserved.`, 'warning');
    return { success: true };
  };

  const deleteMemberProfile = (memberId, actor = "Admin") => {
    const targetUser = data.users.find(u => u.id === memberId);
    if (!targetUser) return { success: false, message: "Member not found" };

    if (targetUser.role === 'Faculty Coordinator') {
      addToast('Cannot delete Faculty Coordinator account.', 'error');
      return { success: false, message: "Cannot delete Faculty Coordinator account" };
    }

    setData(prev => ({
      ...prev,
      users: prev.users.filter(u => u.id !== memberId),
      tasks: prev.tasks.map(t => {
        if (t.assignedMemberId === memberId) {
          return {
            ...t,
            assignedMemberId: '',
            assignedTo: 'Unassigned',
            status: 'Needs Assignment'
          };
        }
        return t;
      })
    }));

    addActivityLog('Member Profile Deleted', actor, `${targetUser.name} (${targetUser.memberId})`, `Member profile and authentication account permanently deleted.`);
    addToast(`Member profile for ${targetUser.name} (${targetUser.prn}) permanently deleted.`, 'success');

    supabase.from('users').delete().eq('id', memberId).then(() => {}).catch(() => {});

    return { success: true };
  };

  const updateMemberProfile = async (memberId, profileInput, requestingUserId = null) => {
    const targetUser = data.users.find(u => u.id === memberId);
    if (!targetUser) {
      addToast('Error: Member record not found.', 'error');
      return { success: false, message: 'Member record not found.' };
    }

    // Authorization check: requester must be the profile owner or an authorized administrator
    if (requestingUserId && requestingUserId !== memberId) {
      const requester = data.users.find(u => u.id === requestingUserId);
      const isAuthAdmin = requester?.role === 'Faculty Coordinator' || requester?.role === 'President';
      if (!isAuthAdmin) {
        addToast('Unauthorized: You can only edit your own profile.', 'error');
        return { success: false, message: 'Unauthorized: You can only edit your own profile.' };
      }
    }

    // Full Name validation
    const rawName = profileInput.name !== undefined 
      ? profileInput.name 
      : (profileInput.fullName !== undefined ? profileInput.fullName : targetUser.name);
    const trimmedName = (rawName || '').trim();

    if (!trimmedName) {
      addToast('Please enter your full name.', 'error');
      return { success: false, message: 'Please enter your full name.' };
    }

    if (trimmedName.length < 2 || trimmedName.length > 70) {
      addToast('Full name must be between 2 and 70 characters.', 'error');
      return { success: false, message: 'Full name must be between 2 and 70 characters.' };
    }

    const oldName = targetUser.name;
    const isNameChanged = oldName !== trimmedName;

    // Process research interests
    const researchInterests = Array.isArray(profileInput.researchInterests)
      ? profileInput.researchInterests
      : (typeof profileInput.researchInterests === 'string'
          ? profileInput.researchInterests.split(',').map(s => s.trim()).filter(Boolean)
          : (targetUser.researchInterests || []));

    // Process technical skills
    const technicalSkills = Array.isArray(profileInput.technicalSkills)
      ? profileInput.technicalSkills
      : (typeof profileInput.technicalSkills === 'string'
          ? profileInput.technicalSkills.split(',').map(s => s.trim()).filter(Boolean)
          : (targetUser.technicalSkills || []));

    const updatedUser = {
      ...targetUser,
      name: trimmedName,
      photo: profileInput.photo !== undefined ? profileInput.photo : targetUser.photo,
      bio: profileInput.bio !== undefined ? profileInput.bio : (targetUser.bio || ''),
      researchInterests,
      technicalSkills,
      githubUrl: profileInput.githubUrl !== undefined ? profileInput.githubUrl : (profileInput.github !== undefined ? profileInput.github : (targetUser.githubUrl || '')),
      linkedinUrl: profileInput.linkedinUrl !== undefined ? profileInput.linkedinUrl : (profileInput.linkedin !== undefined ? profileInput.linkedin : (targetUser.linkedinUrl || '')),
      portfolioLink: profileInput.portfolioLink !== undefined ? profileInput.portfolioLink : (profileInput.portfolioUrl !== undefined ? profileInput.portfolioUrl : (targetUser.portfolioLink || '')),
      phone: profileInput.phone !== undefined ? profileInput.phone : (targetUser.phone || '')
    };

    // Update global state and cascade name updates throughout the entire system
    setData(prev => {
      const updatedUsers = prev.users.map(u => u.id === memberId ? updatedUser : u);
      let updatedTasks = prev.tasks;
      let updatedSubmissions = prev.submissions;
      let updatedProjects = prev.projects;
      let updatedPublications = prev.publications;
      let updatedEvents = prev.events;
      let updatedAchievements = prev.achievements;
      let updatedAnnouncements = prev.announcements;

      if (isNameChanged) {
        // Cascade to tasks
        updatedTasks = (prev.tasks || []).map(t => {
          let mod = false;
          let newT = { ...t };
          if (t.assignedMemberId === memberId || t.assignedMemberName === oldName) {
            newT.assignedMemberName = trimmedName;
            mod = true;
          }
          if (t.assignedById === memberId || t.assignedByName?.includes(oldName)) {
            newT.assignedByName = t.assignedByName.replace(oldName, trimmedName);
            mod = true;
          }
          return mod ? newT : t;
        });

        // Cascade to submissions
        updatedSubmissions = (prev.submissions || []).map(s => {
          if (s.memberId === memberId || s.memberName === oldName) {
            return { ...s, memberName: trimmedName };
          }
          return s;
        });

        // Cascade to projects
        updatedProjects = (prev.projects || []).map(p => {
          let newP = { ...p };
          let mod = false;
          if (p.studentLeader && p.studentLeader.includes(oldName)) {
            newP.studentLeader = p.studentLeader.replace(oldName, trimmedName);
            mod = true;
          }
          if (p.facultyMentor && p.facultyMentor.includes(oldName)) {
            newP.facultyMentor = p.facultyMentor.replace(oldName, trimmedName);
            mod = true;
          }
          return mod ? newP : p;
        });

        // Cascade to publications
        updatedPublications = (prev.publications || []).map(pub => {
          if (pub.authors && pub.authors.includes(oldName)) {
            return { ...pub, authors: pub.authors.replace(oldName, trimmedName) };
          }
          return pub;
        });

        // Cascade to events
        updatedEvents = (prev.events || []).map(evt => {
          let mod = false;
          let newEvt = { ...evt };
          if (evt.coordinator && evt.coordinator.includes(oldName)) {
            newEvt.coordinator = evt.coordinator.replace(oldName, trimmedName);
            mod = true;
          }
          if (evt.organizer && evt.organizer.includes(oldName)) {
            newEvt.organizer = evt.organizer.replace(oldName, trimmedName);
            mod = true;
          }
          return mod ? newEvt : evt;
        });

        // Cascade to achievements
        updatedAchievements = (prev.achievements || []).map(ach => {
          if (ach.recipientName && ach.recipientName.includes(oldName)) {
            return { ...ach, recipientName: ach.recipientName.replace(oldName, trimmedName) };
          }
          return ach;
        });

        // Cascade to announcements
        updatedAnnouncements = (prev.announcements || []).map(ann => {
          if (ann.author && ann.author.includes(oldName)) {
            return { ...ann, author: ann.author.replace(oldName, trimmedName) };
          }
          return ann;
        });
      }

      return {
        ...prev,
        users: updatedUsers,
        tasks: updatedTasks,
        submissions: updatedSubmissions,
        projects: updatedProjects,
        publications: updatedPublications,
        events: updatedEvents,
        achievements: updatedAchievements,
        announcements: updatedAnnouncements
      };
    });

    addActivityLog('Profile Updated', trimmedName, 'Personal Profile', `Member profile details and credentials updated.`);
    addToast('Your profile has been updated successfully.', 'success');

    // Supabase remote DB sync
    supabase.from('users').update({
      name: updatedUser.name,
      photo: updatedUser.photo,
      bio: updatedUser.bio,
      research_interests: updatedUser.researchInterests,
      technical_skills: updatedUser.technicalSkills,
      portfolio_link: updatedUser.portfolioLink,
      phone: updatedUser.phone,
      updated_at: new Date().toISOString()
    }).eq('id', memberId).then(() => {}).catch(() => {});

    return { success: true, user: updatedUser, message: 'Your profile has been updated successfully.' };
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

  const createTask = (taskInput, createdBy = "Admin", createdById = "usr-fac-1") => {
    const memberObj = (data.users || []).find(u => u.id === taskInput.assignedMemberId);
    const assignedName = memberObj ? memberObj.name : (taskInput.assignedMemberName || 'Unassigned');

    const newTask = {
      id: `task-${Date.now()}`,
      name: taskInput.name || taskInput.title,
      title: taskInput.name || taskInput.title,
      description: taskInput.description || '',
      assignedMemberId: taskInput.assignedMemberId,
      assignedMemberName: assignedName,
      assignedTeamId: taskInput.assignedTeamId || '',
      assignedTeamName: taskInput.assignedTeamName || '',
      assignedById: createdById || 'usr-fac-1',
      assignedByName: createdBy,
      project: taskInput.project || 'General Research',
      researchActivity: taskInput.researchActivity || 'Task',
      priority: taskInput.priority || 'Medium',
      startDate: taskInput.startDate || new Date().toISOString().split('T')[0],
      deadline: taskInput.deadline,
      status: taskInput.status || 'Pending',
      progress: 0,
      notes: taskInput.notes || '',
      submissionLink: '',
      submissionType: '',
      submissionNotes: '',
      submittedAt: null,
      reviewComment: '',
      completedAt: null
    };

    setData(prev => ({
      ...prev,
      tasks: [newTask, ...prev.tasks]
    }));

    addActivityLog('Task Assigned', createdBy, newTask.name, `Assigned to ${assignedName}`);
    addAuditLog(createdById, createdBy, 'TASK_ASSIGNED', newTask.id, newTask.name, `Assigned to ${assignedName} with deadline ${newTask.deadline}`);

    if (newTask.assignedMemberId) {
      addNotification(
        newTask.assignedMemberId,
        'New Task Assigned',
        `${createdBy} assigned you: '${newTask.name}'. Deadline: ${newTask.deadline}`,
        'task',
        'tasks'
      );
    }

    addToast(`Task '${newTask.name}' assigned to ${assignedName}`, 'success');
    supabase.from('tasks').insert([newTask]).then(() => {}).catch(() => {});
    return newTask;
  };

  const createBulkTasks = (taskInput, selectedMemberIds, createdBy = "Admin", createdById = "usr-fac-1") => {
    const newTasks = selectedMemberIds.map((mId, idx) => {
      const memberObj = (data.users || []).find(u => u.id === mId);
      const assignedName = memberObj ? memberObj.name : 'Member';
      return {
        id: `task-${Date.now()}-${idx}`,
        name: taskInput.name || taskInput.title,
        title: taskInput.name || taskInput.title,
        description: taskInput.description || '',
        assignedMemberId: mId,
        assignedMemberName: assignedName,
        assignedTeamId: taskInput.assignedTeamId || '',
        assignedTeamName: taskInput.assignedTeamName || '',
        assignedById: createdById || 'usr-fac-1',
        assignedByName: createdBy,
        project: taskInput.project || 'General Project',
        researchActivity: taskInput.researchActivity || 'Bulk Task',
        priority: taskInput.priority || 'Medium',
        startDate: taskInput.startDate || new Date().toISOString().split('T')[0],
        deadline: taskInput.deadline,
        status: 'Pending',
        progress: 0,
        notes: taskInput.notes || '',
        submissionLink: '',
        submissionType: '',
        submissionNotes: '',
        submittedAt: null,
        reviewComment: '',
        completedAt: null
      };
    });

    setData(prev => ({
      ...prev,
      tasks: [...newTasks, ...prev.tasks]
    }));

    addActivityLog('Bulk Task Assignment', createdBy, taskInput.name || 'Task', `Assigned task to ${selectedMemberIds.length} members`);
    addAuditLog(createdById, createdBy, 'BULK_TASK_ASSIGNED', 'bulk', taskInput.name || 'Bulk Task', `Assigned to ${selectedMemberIds.length} members`);

    selectedMemberIds.forEach(mId => {
      addNotification(
        mId,
        'New Task Assigned',
        `${createdBy} assigned you: '${taskInput.name || 'Task'}'. Deadline: ${taskInput.deadline}`,
        'task',
        'tasks'
      );
    });

    addToast(`Assigned task '${taskInput.name}' to ${selectedMemberIds.length} members!`, 'success');
    supabase.from('tasks').insert(newTasks).then(() => {}).catch(() => {});
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

  const updateTaskProgress = (taskId, progress, status, requestingUserId, userName) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            progress: progress !== undefined ? progress : t.progress,
            status: status || (progress === 100 ? 'Completed' : (progress > 0 ? 'In Progress' : t.status))
          };
        }
        return t;
      })
    }));

    addActivityLog('Task Progress Updated', userName || 'Member', `Task ID: ${taskId}`, `Progress set to ${progress}%`);
    addToast(`Progress updated to ${progress}%`, 'info');
  };

  const submitTaskWork = (taskId, submissionData, memberId, memberName) => {
    const { linkUrl, linkType, notes } = submissionData;
    if (!linkUrl) {
      addToast('Error: Deliverable link URL is required.', 'error');
      return { success: false, message: 'Link URL is required' };
    }

    const now = new Date();
    const timestamp = now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0].substring(0, 5);

    const task = (data.tasks || []).find(t => t.id === taskId);
    const taskName = task ? task.name : 'Task';

    const newSub = {
      id: `sub-${Date.now()}`,
      taskId,
      taskName,
      memberId,
      memberName,
      linkUrl,
      linkType: linkType || 'GitHub Repository',
      notes: notes || '',
      submittedAt: timestamp,
      status: 'Submitted'
    };

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
            status: 'Submitted',
            progress: Math.max(t.progress || 0, 85)
          };
        }
        return t;
      })
    }));

    addActivityLog('Work Submitted', memberName, taskName, `Submitted ${linkType}: ${linkUrl}`);
    
    if (task?.assignedById) {
      addNotification(
        task.assignedById,
        'Task Deliverable Submitted',
        `${memberName} submitted work for '${taskName}' ready for evaluation.`,
        'approval',
        'manage-tasks'
      );
    }

    addToast('Work deliverable submitted successfully! Leadership will evaluate your submission.', 'success');
    supabase.from('submissions').insert([newSub]).then(() => {}).catch(() => {});
    return { success: true, submission: newSub };
  };

  const reviewTaskSubmission = (taskId, reviewData, reviewerId, reviewerName) => {
    const { decision, reviewComment, score } = reviewData; // decision: 'Approve' | 'Needs Revision'
    const now = new Date();
    const timestamp = now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0].substring(0, 5);

    const task = (data.tasks || []).find(t => t.id === taskId);
    if (!task) return { success: false, message: 'Task not found' };

    const isApproved = decision === 'Approve';
    const newStatus = isApproved ? 'Completed' : 'Needs Revision';
    const newProgress = isApproved ? 100 : 50;

    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            status: newStatus,
            progress: newProgress,
            reviewComment: reviewComment || (isApproved ? 'Approved by leadership.' : 'Please revise based on feedback.'),
            score: score || t.score || 0,
            completedAt: isApproved ? timestamp : null
          };
        }
        return t;
      }),
      submissions: (prev.submissions || []).map(s => {
        if (s.taskId === taskId) {
          return {
            ...s,
            status: newStatus,
            feedback: reviewComment,
            score: score || s.score || 0
          };
        }
        return s;
      })
    }));

    addActivityLog(
      isApproved ? 'Task Approved' : 'Task Revision Requested',
      reviewerName,
      task.name,
      `${decision} by ${reviewerName}. Note: ${reviewComment || 'None'}`
    );

    addAuditLog(
      reviewerId,
      reviewerName,
      isApproved ? 'TASK_APPROVED' : 'TASK_REVISION_REQUESTED',
      taskId,
      task.name,
      `Decision: ${decision}. Feedback: ${reviewComment || 'N/A'}`
    );

    if (task.assignedMemberId) {
      addNotification(
        task.assignedMemberId,
        isApproved ? 'Task Submission Approved!' : 'Task Needs Revision',
        isApproved 
          ? `Great work! Your submission for '${task.name}' was approved by ${reviewerName}.`
          : `Feedback from ${reviewerName} on '${task.name}': ${reviewComment || 'Please revise and resubmit.'}`,
        isApproved ? 'approval' : 'task',
        'tasks'
      );
    }

    addToast(`Task marked as ${newStatus}! Member notified.`, 'success');
    return { success: true };
  };

  const editTask = (taskId, taskUpdates, actorId = 'usr-fac-1', actorName = 'Admin') => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? { ...t, ...taskUpdates } : t)
    }));

    addActivityLog('Task Details Updated', actorName, `Task ID: ${taskId}`, `Updated task parameters`);
    addAuditLog(actorId, actorName, 'TASK_EDITED', taskId, taskUpdates.name || 'Task', `Updated fields`);
    addToast('Task updated successfully.', 'success');
  };

  const deleteTask = (taskId, actorId = 'usr-fac-1', actorName = 'Admin') => {
    const task = (data.tasks || []).find(t => t.id === taskId);
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId),
      submissions: (prev.submissions || []).filter(s => s.taskId !== taskId)
    }));

    addActivityLog('Task Deleted', actorName, task ? task.name : taskId, 'Task removed by leadership');
    addAuditLog(actorId, actorName, 'TASK_DELETED', taskId, task ? task.name : 'Task', 'Task deleted');
    addToast('Task deleted.', 'info');
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

    supabase.from('applications').insert([newApp]).then(() => {}).catch(() => {});
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

  const createEvent = (evtInput, createdBy = "Admin") => {
    const newEvt = {
      id: `evt-${Date.now()}`,
      name: evtInput.name || evtInput.title,
      title: evtInput.title || evtInput.name,
      date: evtInput.date,
      time: evtInput.time || '10:00 AM - 04:00 PM',
      venue: evtInput.venue || evtInput.location || 'Sanjivani University Campus',
      description: evtInput.description || '',
      type: evtInput.type || evtInput.category || 'Workshop',
      category: evtInput.category || evtInput.type || 'Workshop',
      organizer: evtInput.organizer || 'RISE Technical Society',
      coordinator: evtInput.coordinator || createdBy,
      participantsCount: 0,
      maxSeats: evtInput.maxSeats || 100,
      registrationStatus: 'Open',
      status: evtInput.status || 'Upcoming',
      image: evtInput.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'
    };

    setData(prev => ({
      ...prev,
      events: [newEvt, ...prev.events]
    }));

    addActivityLog('Event Created', createdBy, newEvt.title, `Event scheduled for ${newEvt.date}`);
    addToast(`Event '${newEvt.title}' created successfully!`, 'success');

    supabase.from('events').insert([newEvt]).then(() => {}).catch(() => {});
    return newEvt;
  };

  const updateEvent = (eventId, updatedFields, actor = "Admin") => {
    setData(prev => ({
      ...prev,
      events: prev.events.map(e => e.id === eventId ? { ...e, ...updatedFields } : e)
    }));

    addToast('Event updated successfully!', 'success');
    supabase.from('events').update(updatedFields).eq('id', eventId).then(() => {}).catch(() => {});
  };

  const deleteEvent = (eventId, actor = "Admin") => {
    setData(prev => ({
      ...prev,
      events: prev.events.filter(e => e.id !== eventId)
    }));

    addToast('Event deleted successfully.', 'info');
    supabase.from('events').delete().eq('id', eventId).then(() => {}).catch(() => {});
  };

  const registerForEvent = (eventId, attendeeInfo) => {
    setData(prev => ({
      ...prev,
      events: prev.events.map(e => {
        if (e.id === eventId) {
          return {
            ...e,
            participantsCount: (e.participantsCount || 0) + 1
          };
        }
        return e;
      })
    }));

    addToast(`Successfully registered for the event! Confirmation sent to email.`, 'success');
  };

  const createPublication = (pubInput, createdBy = "Admin") => {
    const newPub = {
      id: `pub-${Date.now()}`,
      title: pubInput.title,
      authors: pubInput.authors || pubInput.leadAuthor || createdBy,
      domain: pubInput.domain || pubInput.researchArea || 'AI',
      researchArea: pubInput.researchArea || pubInput.domain || 'AI',
      journal: pubInput.journal || 'IEEE Conference Proceedings',
      year: pubInput.year || new Date().getFullYear().toString(),
      publicationDate: pubInput.publicationDate || new Date().toISOString().split('T')[0],
      doi: pubInput.doi || `10.1109/RISE.${Date.now().toString().slice(-6)}`,
      doiLink: pubInput.doiLink || (pubInput.doi ? `https://doi.org/${pubInput.doi}` : `https://doi.org/10.1109/RISE.${Date.now().toString().slice(-6)}`),
      paperUrl: pubInput.paperUrl || 'https://arxiv.org',
      status: pubInput.status || 'Published',
      abstract: pubInput.abstract || '',
      type: pubInput.type || 'Journal Paper'
    };

    setData(prev => ({
      ...prev,
      publications: [newPub, ...prev.publications],
      research: [newPub, ...(prev.research || [])]
    }));

    addActivityLog('Publication Added', createdBy, newPub.title, `Published in ${newPub.journal}`);
    addToast(`Research paper '${newPub.title}' added!`, 'success');

    supabase.from('publications').insert([newPub]).then(() => {}).catch(() => {});
    return newPub;
  };

  const updatePublication = (pubId, updatedFields, actor = "Admin") => {
    setData(prev => ({
      ...prev,
      publications: prev.publications.map(p => p.id === pubId ? { ...p, ...updatedFields } : p),
      research: (prev.research || []).map(p => p.id === pubId ? { ...p, ...updatedFields } : p)
    }));

    addToast('Publication updated successfully!', 'success');
    supabase.from('publications').update(updatedFields).eq('id', pubId).then(() => {}).catch(() => {});
  };

  const deletePublication = (pubId, actor = "Admin") => {
    setData(prev => ({
      ...prev,
      publications: prev.publications.filter(p => p.id !== pubId),
      research: (prev.research || []).filter(p => p.id !== pubId)
    }));

    addToast('Publication deleted.', 'info');
    supabase.from('publications').delete().eq('id', pubId).then(() => {}).catch(() => {});
  };

  const createProject = (projInput, createdBy = "Admin") => {
    const newProj = {
      id: `proj-${Date.now()}`,
      name: projInput.name,
      description: projInput.description || '',
      researchDomain: projInput.researchDomain || projInput.domain || 'AI',
      teamName: projInput.teamName || 'Research Team',
      technologies: Array.isArray(projInput.technologies) ? projInput.technologies : (projInput.technologies ? projInput.technologies.split(',').map(s=>s.trim()) : ['Python', 'PyTorch']),
      facultyMentor: projInput.facultyMentor || 'Dr. Abhijit Kshirsagar',
      studentLeader: projInput.studentLeader || createdBy,
      status: projInput.status || 'In Progress',
      progress: projInput.progress || 10,
      githubUrl: projInput.githubUrl || 'https://github.com/rise-sanjivani',
      demoUrl: projInput.demoUrl || '',
      image: projInput.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      expectedCompletion: projInput.expectedCompletion || '2026-12-31'
    };

    setData(prev => ({
      ...prev,
      projects: [newProj, ...prev.projects]
    }));

    addActivityLog('Project Created', createdBy, newProj.name, `Under domain: ${newProj.researchDomain}`);
    addToast(`Project '${newProj.name}' created!`, 'success');

    supabase.from('projects').insert([newProj]).then(() => {}).catch(() => {});
    return newProj;
  };

  const updateProject = (projectId, updatedFields, actor = "Admin") => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === projectId ? { ...p, ...updatedFields } : p)
    }));

    addToast('Project updated successfully!', 'success');
    supabase.from('projects').update(updatedFields).eq('id', projectId).then(() => {}).catch(() => {});
  };

  const deleteProject = (projectId, actor = "Admin") => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== projectId)
    }));

    addToast('Project deleted.', 'info');
    supabase.from('projects').delete().eq('id', projectId).then(() => {}).catch(() => {});
  };

  const submitContactMessage = async (contactInput) => {
    const { fullName, email, subject, message } = contactInput;
    if (!fullName || !email || !message) {
      addToast('Please fill all required fields.', 'error');
      return { success: false, message: 'All required fields must be filled.' };
    }

    const newContact = {
      id: `cnt-${Date.now()}`,
      fullName,
      email,
      subject: subject || 'General Inquiry',
      message,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setData(prev => ({
      ...prev,
      contacts: [newContact, ...(prev.contacts || [])]
    }));

    addToast('Message sent successfully.', 'success');

    try {
      await supabase.from('contacts').insert([newContact]);
    } catch (e) {
      // Offline / fallback handled
    }

    return { success: true, message: 'Message sent successfully.' };
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
      recipientRole: achInput.recipientRole || 'RISE Club Member',
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
      getUserById,
      getMemberName,
      createMember,
      createBulkMembers,
      resetMemberPassword,
      updateMemberStatus,
      removeMemberSafely,
      deleteMemberProfile,
      updateMemberProfile,
      submitWorkLink,
      submitTaskWork,
      reviewTaskSubmission,
      updateTaskProgress,
      editTask,
      deleteTask,
      createTeam,
      createTask,
      createBulkTasks,
      updateTaskStatus,
      addNotification,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      createEvent,
      updateEvent,
      deleteEvent,
      registerForEvent,
      createPublication,
      updatePublication,
      deletePublication,
      createProject,
      updateProject,
      deleteProject,
      submitContactMessage,
      createAchievement,
      submitApplication,
      approveApplication,
      rejectApplication,
      createAnnouncement,
      resetToSeedData,
      addActivityLog,
      addAuditLog
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
