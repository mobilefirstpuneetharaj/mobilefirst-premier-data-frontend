import React, { useMemo, useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaArrowLeft, FaSearch } from 'react-icons/fa';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import topHeadingIconImg from '../assets/common-top-image-for-all-sub-pages.png';

type Team = {
  id: string;
  name: string;
  club: string;
  competition: string;
  playerCount: number;
};

type Player = {
  id: string;
  name: string;
  club: string;
  grade: string;
  jerseyNumber: number;
};

const initialTeams: Team[] = [
  { id: '01', name: 'Manchester United FC', club: 'Manchester United FC', competition: 'Premier League', playerCount: 28 },
  { id: '02', name: 'Manchester United FC', club: 'Manchester United FC', competition: 'Premier League', playerCount: 28 },
];

const playersData: Player[] = [
  { id: '001', name: 'John Smith', club: 'Manchester United FC', grade: 'Under 18', jerseyNumber: 18 },
  { id: '002', name: 'John Smith', club: 'Manchester United FC', grade: 'Under 18', jerseyNumber: 18 },
];

const TeamSchema = Yup.object().shape({
  id: Yup.string().required('ID is required'),
  name: Yup.string().required('Team Name is required'),
  club: Yup.string().required('Club is required'),
  competition: Yup.string().required('Competition is required'),
  playerCount: Yup.number().required('Player count is required').min(0, 'Must be positive'),
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

export default function TeamsPage() {
  const [query, setQuery] = useState('');
  const [competitionFilter, setCompetitionFilter] = useState('');
  const [seasonFilter, setSeasonFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [detailTeam, setDetailTeam] = useState<Team | null>(null);
  const [showPlayers, setShowPlayers] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [teams, setTeams] = useState<Team[]>(initialTeams);

  const filteredTeams = useMemo(() => {
    let results = teams.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(t => 
        t.name.toLowerCase().includes(q) || 
        t.club.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q)
      );
    }
    if (competitionFilter) results = results.filter(t => t.competition === competitionFilter);
    if (seasonFilter) results = results.filter(t => true); // Add actual season filtering logic when you have the data
    
    // Sorting logic
    results.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'players-asc': return a.playerCount - b.playerCount;
        case 'players-desc': return b.playerCount - a.playerCount;
        case 'id-asc': return a.id.localeCompare(b.id);
        case 'id-desc': return b.id.localeCompare(a.id);
        default: return a.id.localeCompare(b.id);
      }
    });
    return results;
  }, [teams, query, competitionFilter, seasonFilter, sortBy]);

  const filteredPlayers = useMemo(() => {
    let results = playersData.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.club.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      );
    }
    return results;
  }, [playersData, query]);

  const handleTeamClick = (team: Team) => {
    setDetailTeam(team);
  };

  const handleUpdate = (values: Team) => {
    setTeams(prev => prev.map(t => (t.id === values.id ? values : t)));
    setEditOpen(false);
    setEditingTeam(null);
    setDetailTeam(d => (d && d.id === values.id ? values : d));
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this team?')) return;
    setTeams(prev => prev.filter(t => t.id !== id));
    setDetailTeam(d => (d && d.id === id ? null : d));
  };

  if (detailTeam && !showPlayers) {
    return (
      <div>
        <div className="w-full flex flex-row justify-between bg-gradient-to-b from-[#E9F1FF] to-[#F28B84] p-5 rounded-lg shadow-md">
          <div className="flex flex-row justify-between items-center gap-2">
            <img 
              src={topHeadingIconImg} 
              alt="Team Logo"
              className="w-[100.39px] h-[100px] object-cover"
            />
            <h1 className="text-gray-800 text-2xl font-bold mb-3">
              {detailTeam.name}
            </h1>
          </div>
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setDetailTeam(null)}
              className="px-4 py-2 cursor-pointer bg-gray-200 rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <FaArrowLeft /> Back
            </button>
          </div>  
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Player Management</h3>
            <div className="flex gap-3">
              <button className="h-[43px] w-[124px] p-[10.18px] border-[1.02px] border-[#4D4D4D] rounded-[8.14px] text-sm font-medium">
                Export
              </button>
              <button className="h-[43px] w-[124px] p-[10.18px] border-[1.02px] border-[#4D4D4D] rounded-[8.14px] text-sm font-medium">
                Import
              </button>
              <button 
                className="px-4 py-2 bg-[#EF4B41] text-white rounded-lg text-sm font-medium flex items-center gap-2"
                onClick={() => console.log('Add new player')}
              >
                <FaPlus /> Add New Player
              </button>
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            <div className="relative w-64">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select
              className="p-2 border border-gray-300 rounded-lg text-sm w-40"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              title="sorting"
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
                <th className="py-3 px-4">PLAYER ID</th>
                <th className="py-3 px-4">PLAYER NAME</th>
                <th className="py-3 px-4">CLUB</th>
                <th className="py-3 px-4">GRADE</th>
                <th className="py-3 px-4">JERSEY NO</th>
                <th className="py-3 px-4 text-center">MANAGE</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.map((player) => (
                <tr key={player.id} className="h-[83.16px] border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">{player.id}</td>
                  <td className="py-3 px-4 font-medium">{player.name}</td>
                  <td className="py-3 px-4">{player.club}</td>
                  <td className="py-3 px-4">{player.grade}</td>
                  <td className="py-3 px-4">{player.jerseyNumber}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-3">
                      <FaEdit 
                        className="text-gray-600 cursor-pointer hover:text-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Edit player:', player.id);
                        }}
                      />
                      <FaTrash 
                        className="text-red-600 cursor-pointer hover:text-red-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Delete player:', player.id);
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
        <h2 className="text-2xl font-bold">Teams</h2>
        <div className="flex gap-3">
          <button className="h-[43px] w-[124px] p-[10.18px] border-[1.02px] border-[#4D4D4D] rounded-[8.14px] text-sm font-medium">
            Export
          </button>
          <button className="h-[43px] w-[124px] p-[10.18px] border-[1.02px] border-[#4D4D4D] rounded-[8.14px] text-sm font-medium">
            Import
          </button>
          <button 
            className="px-4 py-2 bg-[#EF4B41] text-white rounded-lg text-sm font-medium flex items-center gap-2"
            onClick={() => {
              setEditingTeam({
                id: '',
                name: '',
                club: '',
                competition: '',
                playerCount: 0
              });
              setEditOpen(true);
            }}
          >
            <FaPlus /> Add New Team
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6 border border-gray-200">
        <div className="flex flex-row gap-3">
          <div className="relative col-span-1 md:col-span-2">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search teams..."
              className="h-[48px] pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-sm w-full"
            />
          </div>
          <div>
            <select
              value={competitionFilter}
              onChange={(e) => setCompetitionFilter(e.target.value)}
              className="h-[48px] w-full p-2 rounded-lg border border-gray-300 text-sm"
              title="filter by competition"
            >
              <option value="">Select Competition</option>
              <option value="Premier League">Premier League</option>
              <option value="Championship">Championship</option>
              <option value="League One">League One</option>
            </select>
          </div>
          <div className="flex gap-3">
            <select
              value={seasonFilter}
              onChange={(e) => setSeasonFilter(e.target.value)}
              className="h-[48px] w-full p-2 rounded-lg border border-gray-300 text-sm"
              title="filter by seasons"
            >
              <option value="">Select Season</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-[48px] w-[104px] p-2 rounded-lg border border-gray-300 text-sm"
              title="sorting"
            >
              <option value="">Sort By</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="players-asc">Players (Low-High)</option>
              <option value="players-desc">Players (High-Low)</option>
              <option value="id-asc">ID (Low-High)</option>
              <option value="id-desc">ID (High-Low)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#E9F1FF] text-gray-600 font-semibold">
            <tr>
              <th className="py-3 px-4">TEAM ID</th>
              <th className="py-3 px-4">TEAM</th>
              <th className="py-3 px-4">CLUB</th>
              <th className="py-3 px-4">COMPETITION</th>
              <th className="py-3 px-4">PLAYERS</th>
              <th className="py-3 px-4 text-center">MANAGE</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeams.map((team) => (
              <tr 
                key={team.id} 
                className="h-[83.16px] border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleTeamClick(team)}
              >
                <td className="py-3 px-4">{team.id}</td>
                <td className="py-3 px-4 font-medium">{team.name}</td>
                <td className="py-3 px-4">{team.club}</td>
                <td className="py-3 px-4">{team.competition}</td>
                <td className="py-3 px-4">{team.playerCount}</td>
                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center gap-3">
                    <FaEdit 
                      className="text-gray-600 cursor-pointer hover:text-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingTeam(team);
                        setEditOpen(true);
                      }}
                    />
                    <FaTrash 
                      className="text-red-600 cursor-pointer hover:text-red-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(team.id);
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={isEditOpen} title={editingTeam?.id ? "Edit Team" : "Add New Team"} onClose={() => { setEditOpen(false); setEditingTeam(null); }}>
        {editingTeam && (
          <Formik
            initialValues={editingTeam}
            validationSchema={TeamSchema}
            onSubmit={(values) => handleUpdate(values)}
          >
            <Form className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Team ID</label>
                <Field 
                  name="id" 
                  className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                  readOnly={!!editingTeam.id}
                />
                <div className="text-red-500 text-xs mt-1"><ErrorMessage name="id" /></div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Team Name</label>
                <Field 
                  name="name" 
                  className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                />
                <div className="text-red-500 text-xs mt-1"><ErrorMessage name="name" /></div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Club</label>
                <Field 
                  name="club" 
                  className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                />
                <div className="text-red-500 text-xs mt-1"><ErrorMessage name="club" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Competition</label>
                  <Field 
                    as="select" 
                    name="competition" 
                    className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                  >
                    <option value="">Select Competition</option>
                    <option value="Premier League">Premier League</option>
                    <option value="Championship">Championship</option>
                    <option value="League One">League One</option>
                  </Field>
                  <div className="text-red-500 text-xs mt-1"><ErrorMessage name="competition" /></div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Player Count</label>
                  <Field 
                    name="playerCount" 
                    type="number" 
                    className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                  />
                  <div className="text-red-500 text-xs mt-1"><ErrorMessage name="playerCount" /></div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => { setEditOpen(false); setEditingTeam(null); }} 
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#EF4B41] text-white rounded-lg text-sm font-medium">
                  {editingTeam.id ? "Update Team" : "Add Team"}
                </button>
              </div>
            </Form>
          </Formik>
        )}
      </Modal>
    </div>
  );
}