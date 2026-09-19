import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Upload, FileText, CheckCircle2, AlertTriangle, Plus, Trash2, ShieldCheck, ArrowRight } from 'lucide-react';

export const CreateMultipleMembers = () => {
  const { data, createMember, createBulkMembers } = useData();
  const { currentUser, permissions } = useAuth();

  const [creationMode, setCreationMode] = useState('optionB'); // 'optionA' or 'optionB'

  // Option A State (Individual Form)
  const [individualForm, setIndividualForm] = useState({
    fullName: '',
    prn: '',
    email: '',
    phone: '',
    department: 'Integrated B.Tech',
    academicYear: 'Year 1',
    division: 'Class A',
    role: 'Club Member',
    team: 'AI & GenAI Research Team',
    researchInterests: 'Generative AI, Computer Vision',
    technicalSkills: 'Python, PyTorch',
    status: 'Active'
  });

  // Option B State (Bulk Inline Table Rows)
  const [bulkRows, setBulkRows] = useState([
    { prn: 'PRN2026021', name: 'Kabir Verma', email: 'kabir.verma@sanjivani.edu.in', department: 'Integrated B.Tech', academicYear: 'Year 2', role: 'Club Member', team: 'AI & GenAI Research Team', status: 'Active' },
    { prn: 'PRN2026022', name: 'Tanvi Joshi', email: 'tanvi.joshi@sanjivani.edu.in', department: 'Integrated B.Tech', academicYear: 'Year 1', role: 'Club Member', team: 'Smart Agriculture & Healthcare Team', status: 'Active' },
    { prn: 'PRN2026023', name: 'Omkar Shinde', email: 'omkar.shinde@sanjivani.edu.in', department: 'Integrated B.Tech', academicYear: 'Year 2', role: 'Club Member', team: 'Autonomous Systems Team', status: 'Active' }
  ]);

  const [bulkSummaryResult, setBulkSummaryResult] = useState(null);

  // Option A Submit
  const handleIndividualSubmit = (e) => {
    e.preventDefault();
    const result = createMember(individualForm, currentUser.name);
    if (result.success) {
      setIndividualForm({
        fullName: '',
        prn: '',
        email: '',
        phone: '',
        department: 'Integrated B.Tech',
        academicYear: 'Year 1',
        division: 'Class A',
        role: 'Club Member',
        team: 'AI & GenAI Research Team',
        researchInterests: '',
        technicalSkills: '',
        status: 'Active'
      });
    }
  };

  // Bulk Row Actions
  const handleAddRow = () => {
    setBulkRows(prev => [
      ...prev,
      { prn: `PRN20260${Math.floor(Math.random()*90 + 30)}`, name: '', email: '', department: 'Integrated B.Tech', academicYear: 'Year 1', role: 'Club Member', team: 'AI & GenAI Research Team', status: 'Active' }
    ]);
  };

  const handleRemoveRow = (index) => {
    setBulkRows(prev => prev.filter((_, i) => i !== index));
  };

  const handleRowChange = (index, field, value) => {
    setBulkRows(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  // CSV File Import Parser
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      
      const parsedRows = [];
      // Skip header if contains 'name' or 'prn'
      const startIdx = lines[0].toLowerCase().includes('name') || lines[0].toLowerCase().includes('prn') ? 1 : 0;

      for (let i = startIdx; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim().replace(/^"(.*)"$/, '$1'));
        if (cols.length >= 3) {
          parsedRows.push({
            name: cols[0] || '',
            prn: cols[1] || '',
            email: cols[2] || '',
            department: cols[3] || 'Integrated B.Tech',
            academicYear: cols[4] || 'Year 1',
            role: cols[5] || 'Club Member',
            team: cols[6] || 'AI Team',
            status: cols[7] || 'Active'
          });
        }
      }

      if (parsedRows.length > 0) {
        setBulkRows(parsedRows);
        alert(`Parsed ${parsedRows.length} member records from CSV file!`);
      }
    };
    reader.readAsText(file);
  };

  // Submit Bulk Creation
  const handleBulkSubmit = () => {
    if (bulkRows.length === 0) {
      alert("Please add at least one member row.");
      return;
    }

    const result = createBulkMembers(bulkRows, currentUser.name);
    setBulkSummaryResult(result);
  };

  if (!permissions?.canCreateMemberProfile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white font-outfit">Access Restricted</h2>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Research Club Member profiles and authentication accounts can only be created by the <strong>Faculty Coordinator (Dr. Abhijit Kshirsagar)</strong>, <strong>President (Ayushi Ahire)</strong>, and <strong>Vice President (Prasad Thorat)</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-outfit">
            Create Club Member Accounts
          </h1>
          <p className="text-xs text-slate-400">
            Authorized for Faculty Coordinator, President, and Vice President
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setCreationMode('optionA')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              creationMode === 'optionA'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Option A – Individual Creation
          </button>
          <button
            onClick={() => setCreationMode('optionB')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              creationMode === 'optionB'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Option B – Bulk Member Creation
          </button>
        </div>
      </div>

      {/* OPTION A: INDIVIDUAL MEMBER FORM */}
      {creationMode === 'optionA' && (
        <form onSubmit={handleIndividualSubmit} className="glass-panel p-8 rounded-3xl space-y-6 border border-slate-800">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 font-outfit">
            Option A: Single Member Account Creation Form
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="Student Full Name"
                value={individualForm.fullName}
                onChange={e => setIndividualForm({ ...individualForm, fullName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Student ID / PRN *</label>
              <input
                type="text"
                required
                placeholder="e.g. PRN2026077"
                value={individualForm.prn}
                onChange={e => setIndividualForm({ ...individualForm, prn: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="student@sanjivani.edu.in"
                value={individualForm.email}
                onChange={e => setIndividualForm({ ...individualForm, email: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
              <input
                type="text"
                value={individualForm.department}
                onChange={e => setIndividualForm({ ...individualForm, department: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Academic Year</label>
              <select
                value={individualForm.academicYear}
                onChange={e => setIndividualForm({ ...individualForm, academicYear: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="Year 1">Year 1</option>
                <option value="Year 2">Year 2</option>
                <option value="Year 3">Year 3</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Official Role</label>
              <select
                value={individualForm.role}
                onChange={e => setIndividualForm({ ...individualForm, role: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="Club Member">Club Member</option>
                <option value="Research Head">Research Head</option>
                <option value="Secretary">Secretary</option>
                <option value="Event Coordinator">Event Coordinator</option>
                <option value="Member Coordinator">Member Coordinator</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Member & Generate Member ID</span>
          </button>
        </form>
      )}

      {/* OPTION B: BULK MEMBER CREATION */}
      {creationMode === 'optionB' && (
        <div className="space-y-6">
          
          {/* CSV File Upload Banner */}
          <div className="glass-panel p-6 rounded-3xl border border-dashed border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-base font-bold text-white font-outfit">Upload CSV / Excel Data File</h3>
              <p className="text-xs text-slate-400">Import multiple student rows automatically (Format: Name, PRN, Email, Dept, Year, Role, Team, Status)</p>
            </div>
            
            <label className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 cursor-pointer font-bold text-xs transition-all">
              <Upload className="w-4 h-4 text-amber-400" />
              <span>Choose CSV File</span>
              <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
            </label>
          </div>

          {/* Bulk Summary Result Notification */}
          {bulkSummaryResult && (
            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Bulk Creation Summary Executed Successfully!</span>
              </div>
              <div className="text-xs text-emerald-200 space-y-1 font-mono">
                <p>✓ {bulkSummaryResult.successCount} Members Selected → {bulkSummaryResult.successCount} Accounts Created → {bulkSummaryResult.successCount} Member IDs Generated</p>
                {bulkSummaryResult.errorCount > 0 && (
                  <p className="text-rose-300">⚠ {bulkSummaryResult.errorCount} skipped due to validation errors (duplicate PRN or Email)</p>
                )}
              </div>
            </div>
          )}

          {/* Inline Multi-Row Table Editor */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-outfit">Add Multiple Members Manually / Preview Rows</h3>
              <button
                onClick={handleAddRow}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Row</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="p-2">#</th>
                    <th className="p-2">PRN / Student ID *</th>
                    <th className="p-2">Full Name *</th>
                    <th className="p-2">Email *</th>
                    <th className="p-2">Academic Year</th>
                    <th className="p-2">Assigned Team</th>
                    <th className="p-2">Status</th>
                    <th className="p-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {bulkRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="p-2 font-mono text-slate-500">{idx + 1}</td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.prn}
                          onChange={e => handleRowChange(idx, 'prn', e.target.value)}
                          className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono w-32 focus:border-amber-500"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.name}
                          onChange={e => handleRowChange(idx, 'name', e.target.value)}
                          className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white w-40 focus:border-amber-500"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="email"
                          value={row.email}
                          onChange={e => handleRowChange(idx, 'email', e.target.value)}
                          className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white w-48 focus:border-amber-500"
                        />
                      </td>
                      <td className="p-2">
                        <select
                          value={row.academicYear}
                          onChange={e => handleRowChange(idx, 'academicYear', e.target.value)}
                          className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                        >
                          <option value="Year 1">Year 1</option>
                          <option value="Year 2">Year 2</option>
                          <option value="Year 3">Year 3</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.team}
                          onChange={e => handleRowChange(idx, 'team', e.target.value)}
                          className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white w-36"
                        />
                      </td>
                      <td className="p-2">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                          Active
                        </span>
                      </td>
                      <td className="p-2 text-center">
                        <button
                          onClick={() => handleRemoveRow(idx)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-800">
              <span className="text-xs text-slate-400">
                Total Rows Selected: <strong className="text-amber-400 font-bold">{bulkRows.length} Members</strong>
              </span>

              <button
                onClick={handleBulkSubmit}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold text-xs shadow-xl flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create All Accounts ({bulkRows.length})</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
