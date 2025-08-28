import React, { useMemo, useState } from 'react';
import { FaEdit, FaTrash, FaArrowLeft, FaPlus, FaSearch } from 'react-icons/fa';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import topHeadingIconImg from '../assets/common-top-image-for-all-sub-pages.png';

type Club = {
  id: string;
  name: string;
  country: string;
  competitions: string;
  teams: number;
};

type Team = {
  id: string;
  name: string;
  club: string;
  grade: string;
  jerseyNumber: number;
};

const initialClubs: Club[] = [
  { 
    id: '001', 
    name: 'Manchester United FC', 
    country: 'North West England', 
    competitions: 'Premier League', 
    teams: 20 
  },
  { 
    id: '002', 
    name: 'Manchester United FC', 
    country: 'North West England', 
    competitions: 'Premier League', 
    teams: 20 
  }
];

const initialTeams: Team[] = [
  { id: '001', name: 'John Smith', club: 'Manchester United FC', grade: 'Under 18', jerseyNumber: 18 },
  { id: '002', name: 'John Smith', club: 'Manchester United FC', grade: 'Under 18', jerseyNumber: 18 }
];

const ClubSchema = Yup.object().shape({
  name: Yup.string().required('Club Name is required'),
  country: Yup.string().required('Country is required'),
  competitions: Yup.string().required('Competitions is required')
});

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

export default function ClubsPage() {
  const [query, setQuery] = useState('');
  const [clubFilter, setClubFilter] = useState('');
  const [competitionFilter, setCompetitionFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [seasonFilter, setSeasonFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [detailClub, setDetailClub] = useState<Club | null>(null);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [clubs, setClubs] = useState<Club[]>(initialClubs);
  // const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [teams] = useState<Team[]>(initialTeams);

  // Sample data for dropdowns
  const countries = ['North West England', 'London', 'Liverpool'];
  const competitions = ['Premier League', 'Championship', 'FA Cup'];
  const seasons = ['2023-2024', '2022-2023', '2021-2022'];
  const grades = ['Under 18', 'Under 21', 'Senior'];

  const filteredClubs = useMemo(() => {
    let results = clubs.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.country.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
      );
    }
    if (clubFilter) results = results.filter(c => c.name === clubFilter);
    if (competitionFilter) results = results.filter(c => c.competitions === competitionFilter);
    if (countryFilter) results = results.filter(c => c.country === countryFilter);
    if (seasonFilter) results = results.filter(c => c.competitions.includes(seasonFilter));
    
    // Sorting logic
    results.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'teams-asc': return a.teams - b.teams;
        case 'teams-desc': return b.teams - a.teams;
        case 'id-asc': return a.id.localeCompare(b.id);
        case 'id-desc': return b.id.localeCompare(a.id);
        default: return a.id.localeCompare(b.id);
      }
    });
    return results;
  }, [clubs, query, clubFilter, competitionFilter, countryFilter, seasonFilter, sortBy]);

  const filteredTeams = useMemo(() => {
    let results = teams.slice();
    if (detailClub) {
      results = results.filter(t => t.club === detailClub.name);
    }
    if (gradeFilter) results = results.filter(t => t.grade === gradeFilter);
    
    // Sorting logic for subpage
    results.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'jersey-asc': return a.jerseyNumber - b.jerseyNumber;
        case 'jersey-desc': return b.jerseyNumber - a.jerseyNumber;
        default: return a.id.localeCompare(b.id);
      }
    });
    return results;
  }, [teams, detailClub, gradeFilter, sortBy]);

  const handleClubClick = (club: Club) => {
    setDetailClub(club);
  };

  const handleUpdate = (values: Club) => {
    setClubs(prev => prev.map(c => (c.id === values.id ? values : c)));
    setEditOpen(false);
    setEditingClub(null);
  };

  const handleCreate = (values: Club, { resetForm }: { resetForm: () => void }) => {
    const newClub = {
      ...values,
      id: `00${clubs.length + 1}`,
      teams: 0
    };
    setClubs(prev => [newClub, ...prev]);
    resetForm();
    setCreateOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this club?')) return;
    setClubs(prev => prev.filter(c => c.id !== id));
  };

  if (detailClub) {
    return (
      <div>
        <div className="w-full flex flex-row justify-between bg-gradient-to-b from-[#E9F1FF] to-[#F28B84] p-5 rounded-lg shadow-md">
          <div className="flex flex-row justify-between items-center gap-2">
            <img 
              src={topHeadingIconImg} 
              alt="Club Logo"
              className="w-[100.39px] h-[100px] object-cover"
            />
            <div>
              <h1 className="text-gray-800 text-2xl font-bold mb-1">
                Alberta Australian Football Competition
              </h1>
              <button className="w-[151px] h-[42px] rounded-[70px] bg-[#13274B] text-white text-center font-[600]">
                SPORTS NAME  
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setDetailClub(null)}
              className="px-4 py-2 cursor-pointer bg-gray-200 rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <FaArrowLeft /> Back
            </button>
          </div>  
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[22px] md:text-[28.18px] font-[600]">Team Management</h3>
            <div className="flex flex-wrap gap-2 sm:justify-center items center">
              <div>
                <button className="h-[43px] w-[124px] p-[10.18px] border-[1.02px] border-[#4D4D4D] rounded-[8.14px] text-sm font-medium">
                  Export
                </button>
              </div>
              <div>
                <button className="h-[43px] w-[124px] p-[10.18px] border-[1.02px] border-[#4D4D4D] rounded-[8.14px] text-sm font-medium">
                  Import
                </button>
              </div>
              <div>
                <button 
                  className="h-[43px] px-4 py-2 bg-[#EF4B41] text-white rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  Add Team
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-row flex-wrap gap-2 mb-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-[396.35px] h-[48.46px] pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select
              className="w-[120px.14px] h-[48.46px] p-2 border border-gray-300 rounded-lg text-sm"
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              title="Filter by Grade"
            >
              <option value="">Select Grade</option>
              {grades.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
            <select
              className="w-[104.14px] h-[48.46px] p-2 border border-gray-300 rounded-lg text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              title="Sort Teams By"
            >
              <option value="">Sort By</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="jersey-asc">Jersey No (Low-High)</option>
              <option value="jersey-desc">Jersey No (High-Low)</option>
            </select>
          </div>
          
          <div className='overflow-x-auto'>
          <table className="w-full text-sm text-left">
            <thead className="bg-[#E9F1FF] text-gray-600 font-semibold">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">TEAM NAME</th>
                <th className="py-3 px-4">CLUB</th>
                <th className="py-3 px-4">GRADE</th>
                <th className="py-3 px-4">JERSEY NO</th>
                <th className="py-3 px-4 text-center">MANAGE</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams.map((team) => (
                <tr key={team.id} className="h-[83.16px] border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">{team.id}</td>
                  <td className="py-3 px-4 font-medium">{team.name}</td>
                  <td className="py-3 px-4">{team.club}</td>
                  <td className="py-3 px-4">{team.grade}</td>
                  <td className="py-3 px-4">{team.jerseyNumber}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-3">
                      <FaEdit 
                        className="text-gray-600 cursor-pointer hover:text-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      />
                      <FaTrash 
                        className="text-red-600 cursor-pointer hover:text-red-800"
                        onClick={(e) => {
                          e.stopPropagation();
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

  // Main Clubs Page View
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Club Management</h2>
        <div className="flex gap-3">
          <button className="h-[43px] w-[124px] p-[10.18px] border-[1.02px] border-[#4D4D4D] rounded-[8.14px] text-sm font-medium">
            Export
          </button>
          <button 
            className="px-4 py-2 bg-[#EF4B41] text-white rounded-lg text-sm font-medium flex items-center gap-2"
            onClick={() => {
              setEditingClub({
                id: '',
                name: '',
                country: '',
                competitions: '',
                teams: 0
              });
              setCreateOpen(true);
            }}
          >
            <FaPlus /> Create Club
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6 border border-gray-200">
        <div className="flex flex-row flex-wrap gap-2">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search clubs..."
              className="w-[396.35px] h-[48.46px] pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-sm"
            />
          </div>
          <select
            className="w-[108px] h-[48.46px] p-2 rounded-lg border border-gray-300 text-sm"
            value={clubFilter}
            onChange={(e) => setClubFilter(e.target.value)}
            title="Filter by Club"
          >
            <option value="">Select Club</option>
            {clubs.map(club => (
              <option key={club.id} value={club.name}>{club.name}</option>
            ))}
          </select>
          <select
            className="w-[153.14px] h-[48.46px] p-2 rounded-lg border border-gray-300 text-sm"
            value={competitionFilter}
            onChange={(e) => setCompetitionFilter(e.target.value)}
            title="Filter by Competition"
          >
            <option value="">Select Competition</option>
            {competitions.map(comp => (
              <option key={comp} value={comp}>{comp}</option>
            ))}
          </select>
          <select
            className="w-[125.14px] h-[48.46px] p-2 rounded-lg border border-gray-300 text-sm"
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            title="Filter by Country"
          >
            <option value="">Select Country</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
          <select
            className="w-[125.14px] h-[48.46px] p-2 rounded-lg border border-gray-300 text-sm"
            value={seasonFilter}
            onChange={(e) => setSeasonFilter(e.target.value)}
            title="Filter by Season"
          >
            <option value="">Select Season</option>
            {seasons.map(season => (
              <option key={season} value={season}>{season}</option>
            ))}
          </select>
          <select
            className="w-[104px] h-[48.46px] p-2 rounded-lg border border-gray-300 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            title="Sort Clubs By" 
          >
            <option value="">Sort By</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="teams-asc">Teams (Low-High)</option>
            <option value="teams-desc">Teams (High-Low)</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#E9F1FF] text-gray-600 font-semibold">
            <tr>
              <th className="py-3 px-4">CLUB NAME</th>
              <th className="py-3 px-4">COUNTRY</th>
              <th className="py-3 px-4">COMPETITIONS</th>
              <th className="py-3 px-4">TEAM</th>
              <th className="py-3 px-4 text-center">MANAGE</th>
            </tr>
          </thead>
          <tbody>
            {filteredClubs.map((club) => (
              <tr 
                key={club.id} 
                className="h-[83.16px] border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleClubClick(club)}
              >
                <td className="py-3 px-4 font-medium">{club.name}</td>
                <td className="py-3 px-4">{club.country}</td>
                <td className="py-3 px-4">{club.competitions}</td>
                <td className="py-3 px-4">{club.teams}</td>
                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center gap-3">
                    <FaEdit 
                      className="text-gray-600 cursor-pointer hover:text-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingClub(club);
                        setEditOpen(true);
                      }}
                    />
                    <FaTrash 
                      className="text-red-600 cursor-pointer hover:text-red-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(club.id);
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Club Modal */}
      <Modal open={isCreateOpen} title="Create New Club" onClose={() => { setCreateOpen(false); setEditingClub(null); }}>
        <Formik
          initialValues={{
            id: `00${clubs.length + 1}`,
            name: '',
            country: '',
            competitions: '',
            teams: 0
          }}
          validationSchema={ClubSchema}
          onSubmit={(values, actions) => handleCreate(values, actions)}
        >
          <Form className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Club ID</label>
              <Field 
                name="id" 
                className="w-full p-2 rounded-lg bg-gray-100 border border-gray-300 text-sm"
                readOnly
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Club Name</label>
              <Field 
                name="name" 
                className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                placeholder="Enter club name"
              />
              <div className="text-red-500 text-xs mt-1"><ErrorMessage name="name" /></div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Country Name</label>
              <Field 
                as="select" 
                name="country" 
                className="w-full p-2 rounded-lg border border-gray-300 text-sm"
              >
                <option value="">Select Country</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </Field>
              <div className="text-red-500 text-xs mt-1"><ErrorMessage name="country" /></div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Logo</label>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium">
                  Upload Logo
                </button>
                <button className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium">
                  Upload Logo
                </button>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <button 
                type="button" 
                onClick={() => { setCreateOpen(false); setEditingClub(null); }} 
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-[#EF4B41] text-white rounded-lg text-sm font-medium"
              >
                Add Club
              </button>
            </div>
          </Form>
        </Formik>
      </Modal>

      {/* Edit Club Modal */}
      <Modal open={isEditOpen} title="Edit Club" onClose={() => { setEditOpen(false); setEditingClub(null); }}>
        {editingClub && (
          <Formik
            initialValues={editingClub}
            validationSchema={ClubSchema}
            onSubmit={(values) => handleUpdate(values)}
          >
            <Form className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Club Name</label>
                <Field 
                  name="name" 
                  className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                />
                <div className="text-red-500 text-xs mt-1"><ErrorMessage name="name" /></div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Country Name</label>
                <Field 
                  as="select" 
                  name="country" 
                  className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                >
                  <option value="">Select Country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </Field>
                <div className="text-red-500 text-xs mt-1"><ErrorMessage name="country" /></div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Logo</label>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium">
                    Upload Logo
                  </button>
                  <button className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium">
                    Upload Logo
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => { setEditOpen(false); setEditingClub(null); }} 
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-[#EF4B41] text-white rounded-lg text-sm font-medium"
                >
                  Update Club
                </button>
              </div>
            </Form>
          </Formik>
        )}
      </Modal>
    </div>
  );
}