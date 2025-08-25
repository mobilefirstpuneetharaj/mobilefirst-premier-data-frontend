import React, { useMemo, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaEye, FaArrowLeft } from 'react-icons/fa';

import topHeadingIconImg from '../assets/common-top-image-for-all-sub-pages.png'

type Competition = {
  id: string;
  name: string;
  teamCount: number;
  grade: string;
  status: 'Active' | 'Complete' | 'Draft' | 'Ongoing';
  description?: string;
};

type Team = {
  id: string;
  name: string;
  club: string;
  playerCount: number;
};

type Fixture = {
  id: string;
  roundNo: string;
  match: string;
  dateTime: string;
  status: 'Not Started' | 'Ongoing' | 'Complete';
  analyst: string;
};

const initialCompetitions: Competition[] = [
  {
    id: '01',
    name: 'Alberta Australian Football League',
    teamCount: 20,
    grade: 'Under 18',
    status: 'Complete',
    description: 'Sample description for Alberta Australian Football League.',
  },
  {
    id: '02',
    name: 'Alberta Australian Football League',
    teamCount: 20,
    grade: 'Under 18',
    status: 'Ongoing',
    description: 'Sample description for Alberta Australian Football League.',
  },
];

const teamsData: Team[] = [
  { id: '001', name: 'Manchester United FC', club: 'Manchester United FC', playerCount: 28 },
  { id: '002', name: 'Manchester United FC', club: 'Manchester United FC', playerCount: 28 },
];

const fixturesData: Fixture[] = [
  { 
    id: '001', 
    roundNo: '001', 
    match: 'Manchester United vs XYZ', 
    dateTime: 'May 12, 2025 at 15:00', 
    status: 'Not Started', 
    analyst: 'Autopy Analyst' 
  },
  { 
    id: '002', 
    roundNo: '001', 
    match: 'Manchester United vs XYZ', 
    dateTime: 'May 12, 2025 at 15:00', 
    status: 'Not Started', 
    analyst: 'Autopy Analyst' 
  },
];

function Modal({ open, title, onClose, children }: { open: boolean; title?: string; onClose: () => void; children: React.ReactNode; }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg p-6 z-10">
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        {children}
      </div>
    </div>
  );
}

const CompetitionSchema = Yup.object().shape({
  id: Yup.string().required('ID is required'),
  name: Yup.string().required('Competition Name is required'),
  grade: Yup.string().required('Grade is required'),
});

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>(initialCompetitions);
  const [query, setQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [editingCompetition, setEditingCompetition] = useState<Competition | null>(null);
  const [detailCompetition, setDetailCompetition] = useState<Competition | null>(null);
  const [showFixtures, setShowFixtures] = useState(false);

  const grades = useMemo(() => ['', ...Array.from(new Set(competitions.map((c) => c.grade)))], [competitions]);
  const statuses = useMemo(() => ['', ...Array.from(new Set(competitions.map((c) => c.status)))], [competitions]);

  const filtered = useMemo(() => {
    let results = competitions.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter((c) => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
    }
    if (gradeFilter) results = results.filter((c) => c.grade === gradeFilter);
    if (statusFilter) results = results.filter((c) => c.status === statusFilter);
    results.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'teams': return b.teamCount - a.teamCount;
        case 'status': return a.status.localeCompare(b.status);
        default: return a.id.localeCompare(b.id);
      }
    });
    return results;
  }, [competitions, query, gradeFilter, statusFilter, sortBy]);

  const handleCreate = (values: Competition, { resetForm }: { resetForm: () => void }) => {
    if (competitions.some((c) => c.id === values.id)) {
      toast.error('Competition ID already exists');
      return;
    }
    setCompetitions((prev) => [values, ...prev]);
    toast.success('Competition created');
    resetForm();
    setCreateOpen(false);
  };

  const handleUpdate = (values: Competition) => {
    setCompetitions((prev) => prev.map((c) => (c.id === values.id ? values : c)));
    toast.success('Competition updated');
    setEditOpen(false);
    setEditingCompetition(null);
    setDetailCompetition((d) => (d && d.id === values.id ? values : d));
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this competition?')) return;
    setCompetitions((prev) => prev.filter((c) => c.id !== id));
    toast.success('Competition deleted');
    setDetailCompetition((d) => (d && d.id === id ? null : d));
  };

  const handleCompetitionClick = (row: Competition) => {
    const original = competitions.find(c => c.id === row.id);
    if (original) setDetailCompetition(original);
  };

  if (detailCompetition && !showFixtures) {
    return (
      <div>
        <div className="w-full flex flex-row justify-between bg-gradient-to-b from-[#E9F1FF] to-[#F28B84] p-5 rounded-lg shadow-md">
            <div className="flex flex-row justify-between items-center gap-2">
                <img 
                    src={topHeadingIconImg} 
                    alt="Competition Logo"
                    className="w-[100.39px] h-[100px] object-cover"
                />
                <h1 className="text-gray-800 text-2xl font-bold mb-3">
                    Alberta Australian Football Competition
                </h1>
            </div>
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => setDetailCompetition(null)}
                    className="px-4 py-2 cursor-pointer bg-gray-200 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                    <FaArrowLeft /> Back
                </button>
            </div>  
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Teams</h3>
            <div className="flex gap-3">
              <button className="h-[43px] w-[124px] p-[10.18px] border-[1.02px] border-[#4D4D4D] rounded-[8.14px] text-sm font-medium">
                Export
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium">
                Create Fixtures
              </button>
              <button className="px-4 py-2  bg-red-500 text-white rounded-lg text-sm font-medium flex items-center gap-2">
                 Add Team
              </button>
            </div>
          </div>

          <div className="flex flex-row flex-wrap gap-2 mb-3">
            <input 
              type="text" 
              placeholder="Search..." 
              className="h-[48px] p-2 border border-gray-300 rounded-lg text-sm w-64"
            />
            <select 
              className="h-[48px] w-[120px] p-2 border border-gray-300 rounded-lg text-sm"
              aria-label="Select Grade"
            >
              <option>Select Grade</option>
              {grades.filter(g => g).map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <select
              className="h-[48px] w-[128px] p-2 border border-gray-300 rounded-lg text-sm"
              aria-label="Select Season"
            >
              <option>Select Season</option>
              <option>2025</option>
              <option>2024</option>
            </select>
            <select className="h-[48px] w-[90px] p-2 border border-gray-300 rounded-lg text-sm" aria-label="Select Grade">
              <option>Sort By</option>
              <option>Name</option>
              <option>Players</option>
            </select>
          </div>
          
          <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#E9F1FF] text-gray-600 font-semibold">
              <tr>
                <th className="py-3 px-4">CLUB ID</th>
                <th className="py-3 px-4">TEAM</th>
                <th className="py-3 px-4">CLUB</th>
                <th className="py-3 px-4">PLAYER</th>
                <th className="py-3 px-4 text-center">VIEW FIXTURE</th>
                <th className="py-3 px-4 text-center">MANAGE</th>
              </tr>
            </thead>
            <tbody>
              {teamsData.map((team) => (
                <tr key={team.id} className="h-[83.16px] border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">{team.id}</td>
                  <td className="py-3 px-4">{team.name}</td>
                  <td className="py-3 px-4">{team.club}</td>
                  <td className="py-3 px-4">{team.playerCount}</td>
                  <td className="py-3 px-4 text-center">
                    <FaEye 
                      className="text-gray-600 cursor-pointer hover:text-blue-600 inline-block" 
                      onClick={() => setShowFixtures(true)}
                    />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-3">
                      <FaEdit 
                        className="text-gray-600 cursor-pointer hover:text-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Edit team:', team.id);
                        }}
                      />
                      <FaTrash 
                        className="text-red-600 cursor-pointer hover:text-red-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Delete team:', team.id);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        <Modal open={isEditOpen} title="Edit Competition" onClose={() => { setEditOpen(false); setEditingCompetition(null); }}>
          {editingCompetition && (
            <Formik
              initialValues={editingCompetition}
              validationSchema={CompetitionSchema}
              onSubmit={(values) => handleUpdate(values)}
            >
              <Form className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">ID</label>
                  <Field 
                    name="id" 
                    readOnly 
                    className="w-full p-2 rounded-lg bg-gray-100 border border-gray-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Competition Name</label>
                  <Field 
                    name="name" 
                    className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                  />
                  <div className="text-red-500 text-xs mt-1"><ErrorMessage name="name" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Grade</label>
                    <Field 
                      as="select" 
                      name="grade" 
                      className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                    >
                      <option value="">Select Grade</option>
                      {grades.filter(g => g).map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </Field>
                    <div className="text-red-500 text-xs mt-1"><ErrorMessage name="grade" /></div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Team Count</label>
                    <Field 
                      name="teamCount" 
                      type="number" 
                      className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => { setEditOpen(false); setEditingCompetition(null); }} 
                    className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-[#0b2447] text-white rounded-lg text-sm font-medium">
                    Update Competition
                  </button>
                </div>
              </Form>
            </Formik>
          )}
        </Modal>
      </div>
    );
  }

  if (showFixtures) {
    return (
      <div>
        <div className="w-full flex flex-row justify-between bg-gradient-to-b from-[#E9F1FF] to-[#F28B84] p-5  shadow-md">
            <div className="flex flex-row justify-between items-center gap-2">
                <img 
                    src={topHeadingIconImg} 
                    alt="Competition Logo"
                    className="w-[100.39px] h-[100px] object-cover"
                />
                <div className=''>
                   <h1 className="text-gray-800 text-2xl font-bold mb-3">
                      Alberta Australian Football Competition
                   </h1>
                   <button className="w-[151px] h-[42px] rounded-[70px] bg-[#13274B] text-[#FFFFFF] tet-center font-[600] mb-3">
                       SPORTS NAME  
                   </button>
                </div>
            </div>
            <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setShowFixtures(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg text-sm font-medium cursor-pointer flex items-center gap-2"
                >
                    <FaArrowLeft /> Back to Teams
                </button>
            </div>  
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[28.18px] font-[600]">Team Name</h3>
            <div className="flex gap-3">
              <button className="h-[43px] w-[124px] p-[10.18px] border-[1.02px] border-[#4D4D4D] rounded-[8.14px] text-sm font-medium">
                Export
              </button>
              <button className="h-[43px] w-[124px] p-[10.18px] border-[1.02px] border-[#4D4D4D] rounded-[8.14px] text-sm font-medium">
                Import
              </button>
              <button className="px-4 py-2 bg-[#EF4B41] text-white rounded-lg text-sm font-medium flex items-center gap-2">
                Add New Player
              </button> 
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            <input 
              type="text" 
              placeholder="Search..." 
              className="p-2 border border-gray-300 rounded-lg text-sm w-64"
            />
            <select className="p-2 border border-gray-300 rounded-lg text-sm w-40" aria-label="Select Club">
              <option>Select Club</option>
              <option>Manchester United FC</option>
            </select>
            <select className="p-2 border border-gray-300 rounded-lg text-sm w-40" aria-label="Sort By">
              <option>Select Team</option>
              <option>Manchester United FC</option>
            </select>
            <select className="p-2 border border-gray-300 rounded-lg text-sm w-40" aria-label="Select Grade">
              <option>Select Grade</option>
              <option>Under 18</option>
            </select>
            <select className="p-2 border border-gray-300 rounded-lg text-sm w-40" aria-label="Sort By">
              <option>Sort By</option>
              <option>Date</option>
              <option>Round</option>
            </select>
          </div>
          
          <div className='overflow-x-auto'>
          <table className="w-full text-sm text-left">
            <thead className="bg-[#E9F1FF] text-gray-600 font-semibold">
              <tr>
                <th className="py-3 px-4">ROUND NO.</th>
                <th className="py-3 px-4">FIXTURES</th>
                <th className="py-3 px-4">DATE & TIME</th>
                <th className="py-3 px-4">MATCH VIDEO</th>
                <th className="py-3 px-4">ASSIGN ANALYST</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {fixturesData.map((fixture) => (
                <tr key={fixture.id} className="h-[83.16px] border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">{fixture.roundNo}</td>
                  <td className="py-3 px-4 font-medium">{fixture.match}</td>
                  <td className="py-3 px-4">{fixture.dateTime}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-[53.47px] text-xs bg-[#F3F3F3]">
                      {fixture.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-md text-xs bg-[#EF4B41] text-white font-medium">
                      {fixture.analyst}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-[53.47px] text-xs bg-[#FFC300]">
                      {fixture.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-3">
                      <FaEdit 
                        className="text-gray-600 cursor-pointer hover:text-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Edit fixture:', fixture.id);
                        }}
                      />
                      <FaTrash 
                        className="text-red-600 cursor-pointer hover:text-red-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Delete fixture:', fixture.id);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Competitions</h2>
        <div className="flex gap-3">
          <button className="h-[43px] w-[124px] p-[10.18px] border-[1.02px] border-[#4D4D4D] rounded-[8.14px] text-sm font-medium">
            Export
          </button>
          <button 
            onClick={() => setCreateOpen(true)} 
            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium"
          >
            Create New Competition
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6 border border-gray-200">
        <div className="flex flex-row flex-wrap gap-4">
          <div className="">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search competitions..."
              className="w-[396px] h-[48px] p-2 rounded-lg border border-gray-300 text-[16px]"
            />
          </div>
          <div>
            <select
              id="gradeFilter"
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="w-full h-[48px] p-2 rounded-lg border border-gray-300 text-sm"
              title="filter by grade"
            >
              <option value="">Select Grade</option>
              {grades.filter(g => g).map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-1/2 p-2 rounded-lg border border-gray-300 text-sm"
              title="filter by status"
            >
              <option value="">Select Status</option>
              {statuses.filter(s => s).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              aria-label="Sort Competitions"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-[104px] p-2 rounded-lg border border-gray-300 text-[16px]"
            >
              <option value="">Sort By</option>
              <option value="id">Sort By ID</option>
              <option value="name">Sort By Name</option>
              <option value="teams">Sort By Teams</option>
              <option value="status">Sort By Status</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#E9F1FF] text-gray-600 font-semibold">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">COMPETITION NAME</th>
              <th className="py-3 px-4">TEAM</th>
              <th className="py-3 px-4">GRADE</th>
              <th className="py-3 px-4">STATUS</th>
              <th className="py-3 px-4">MANAGE</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((competition) => (
              <tr 
                key={competition.id} 
                className="h-[83.16px] border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleCompetitionClick(competition)}
              >
                <td className="py-3 px-4">{competition.id}</td>
                <td className="py-3 px-4 font-medium">{competition.name}</td>
                <td className="py-3 px-4">{competition.teamCount}</td>
                <td className="py-3 px-4">{competition.grade}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    competition.status === 'Active' ? 'bg-green-100 text-green-700' :
                    competition.status === 'Complete' ? 'w-[97px] h-[30px] bg-[#21FF041A] rounded-[36.6px] text-[#21FF04]' :
                    competition.status === 'Ongoing' ? 'w-[97px] h-[30px] bg-[#EBEBEB] rounded-[36.6px] text-[gray' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {competition.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-3">
                    <FaEdit 
                      className="text-gray-600 cursor-pointer hover:text-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCompetition(competition);
                        setEditOpen(true);
                      }}
                    />
                    <FaTrash 
                      className="text-black-600 cursor-pointer hover:text-red-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(competition.id);
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={isCreateOpen} title="Create New Competition" onClose={() => setCreateOpen(false)}>
        <Formik
          initialValues={{
            id: '',
            name: '',
            teamCount: 0,
            grade: '',
            status: 'Active' as Competition['status'],
            description: '',
          }}
          validationSchema={CompetitionSchema}
          onSubmit={(values, actions) => handleCreate(values as Competition, actions)}
        >
          <Form className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">ID</label>
              <Field 
                name="id" 
                className="w-full p-2 rounded-lg border border-gray-300 text-sm"
              />
              <div className="text-red-500 text-xs mt-1"><ErrorMessage name="id" /></div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Competition Name</label>
              <Field 
                name="name" 
                className="w-full p-2 rounded-lg border border-gray-300 text-sm"
              />
              <div className="text-red-500 text-xs mt-1"><ErrorMessage name="name" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Grade</label>
                <Field 
                  as="select" 
                  name="grade" 
                  className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                >
                  <option value="">Select Grade</option>
                  {grades.filter(g => g).map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </Field>
                <div className="text-red-500 text-xs mt-1"><ErrorMessage name="grade" /></div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Team Count</label>
                <Field 
                  name="teamCount" 
                  type="number" 
                  className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Status</label>
              <Field 
                as="select" 
                name="status" 
                className="w-full p-2 rounded-lg border border-gray-300 text-sm"
              >
                <option value="Active">Active</option>
                <option value="Complete">Complete</option>
                <option value="Draft">Draft</option>
                <option value="Copying">Copying</option>
              </Field>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Description</label>
              <Field 
                as="textarea" 
                name="description" 
                className="w-full p-2 rounded-lg border border-gray-300 text-sm" 
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button 
                type="button" 
                onClick={() => setCreateOpen(false)} 
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium">
                Add Competition
              </button>
            </div>
          </Form>
        </Formik>
      </Modal>
    </div>
  );
}