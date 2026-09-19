// ============================================================================
// RISE PLATFORM - TYPESCRIPT INTERFACES & DOMAIN MODELS
// Sanjivani University, SET, Dept of Integrated B.Tech (2026-2027)
// ============================================================================

export type RoleType =
  | 'Faculty Coordinator'
  | 'President'
  | 'Vice President'
  | 'Research Head'
  | 'Event Coordinator'
  | 'Secretary'
  | 'Secretary + Event Coordinator'
  | 'Social Media & Publicity Head'
  | 'Member Coordinator'
  | 'Discipline Member'
  | 'RISE Club Member'
  | 'Research Club Member'
  | 'Club Member';

export type RoleGroup = 'faculty' | 'student_leadership' | 'student_lead' | 'member';

export type UserStatus = 'Active' | 'Pending' | 'Suspended' | 'Removed' | 'Inactive';

export interface User {
  id: string;
  memberId: string;
  prn: string;
  name: string;
  email: string;
  phone?: string;
  role: RoleType;
  roleGroup?: RoleGroup;
  department?: string;
  academicYear?: string;
  division?: string;
  status: UserStatus;
  joiningDate?: string;
  photo?: string;
  researchInterests?: string[];
  technicalSkills?: string[];
  bio?: string;
  portfolioLink?: string;
  contributionsCount?: number;
  teams?: string[];
  activeProjects?: string[];
  passwordHash?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  userId?: string;
  fullName: string;
  prn: string;
  email: string;
  phone?: string;
  role: RoleType;
  avatarUrl?: string;
  department?: string;
  bio?: string;
  researchInterests?: string[];
  technicalSkills?: string[];
  portfolioUrl?: string;
}

export interface Role {
  id: string;
  name: RoleType;
  group: RoleGroup;
  description: string;
  canManageMembers?: boolean;
  canCreateMembers?: boolean;
  canDeleteMembers?: boolean;
  canAssignTasks?: boolean;
  canApproveApplications?: boolean;
  canIssueCertificates?: boolean;
}

export interface ResearchItem {
  id: string;
  title: string;
  domain: string;
  abstract: string;
  leadAuthor: string;
  coAuthors?: string[];
  facultyAdvisor?: string;
  status: 'Ongoing' | 'Under Review' | 'Published' | 'Patent Filed';
  journalOrConference?: string;
  doiLink?: string;
  paperUrl?: string;
  date?: string;
  tags?: string[];
}

export interface Project {
  id: string;
  title: string;
  domain: string;
  description: string;
  leadAuthor?: string;
  facultyMentor?: string;
  teamMembers?: string[];
  memberIds?: string[];
  status: 'In Progress' | 'Prototype Ready' | 'Completed' | 'Patent Pending';
  progress: number;
  githubUrl?: string;
  demoUrl?: string;
  tags?: string[];
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: 'Workshop' | 'Symposium' | 'Hackathon' | 'Guest Lecture' | 'Research Talk';
  organizer: string;
  description: string;
  registrationLink?: string;
  maxSeats?: number;
  registeredCount?: number;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'General' | 'Research' | 'Events' | 'Urgent' | 'Opportunities';
  priority: 'Normal' | 'Urgent' | 'Pinned';
  author: string;
  authorRole?: string;
  date: string;
  attachmentLink?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedMemberId?: string;
  team?: string;
  deadline: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Assigned' | 'In Progress' | 'Submitted' | 'Under Review' | 'Completed' | 'Needs Revision';
  progress?: number;
  createdBy: string;
  submissionLink?: string;
  submissionType?: string;
  submissionNotes?: string;
  submittedAt?: string;
  score?: number;
  feedback?: string;
}

export interface Submission {
  id: string;
  taskId: string;
  memberId: string;
  memberName: string;
  linkUrl: string;
  linkType: 'GitHub Repository' | 'Google Drive Document/Folder' | 'arXiv / SSRN Preprint' | 'Figma Design' | 'Video Demo' | 'Other Web Link';
  notes?: string;
  submittedAt: string;
  status?: 'Submitted' | 'Approved' | 'Needs Revision';
  score?: number;
  feedback?: string;
}

export interface Certificate {
  id: string;
  certificateNo: string;
  recipientName: string;
  recipientPrn: string;
  title: string;
  category: string;
  issueDate: string;
  verified: boolean;
}
