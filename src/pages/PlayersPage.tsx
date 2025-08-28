import React, { useMemo, useState } from 'react';
import { FaEdit, FaTrash, FaArrowLeft, FaPlus, FaSearch } from 'react-icons/fa';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import topHeadingIconImg from '../assets/common-top-image-for-all-sub-pages.png';

type Player = {
  id: string;
  firstName: string;
  lastName: string;
  teamName: string;
  jerseyNumber: number;
  gamesPlayed: number;
  position: string;
  club: string;
  league: string;
  email: string;
  grade?: string;
};

type Team = {
  id: string;
  name: string;
  grade: string;
};

const initialPlayers: Player[] = [
  { 
    id: '01', 
    firstName: 'John', 
    lastName: 'Smith', 
    teamName: 'XYZ', 
    jerseyNumber: 18, 
    gamesPlayed: 20,
    position: 'Forward',
    club: 'Manchester United FC',
    league: 'Premier League',
    email: 'john.smith@example.com'
  },
  { 
    id: '02', 
    firstName: 'John', 
    lastName: 'Smith', 
    teamName: 'XYL', 
    jerseyNumber: 18, 
    gamesPlayed: 20,
    position: 'Midfielder',
    club: 'Manchester United FC',
    league: 'Premier League',
    email: 'john.smith2@example.com'
  }
];

// const teamsData: Team[] = [
//   { id: '001', name: 'Manchester United FC', grade: 'Under 18' },
//   { id: '002', name: 'Manchester United FC', grade: 'Under 18' }
// ];

const PlayerSchema = Yup.object().shape({
  id: Yup.string().required('ID is required'),
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  jerseyNumber: Yup.number().required('Jersey Number is required').min(0),
  gamesPlayed: Yup.number().required('Games Played is required').min(0),
  position: Yup.string().required('Position is required'),
  club: Yup.string().required('Club is required'),
  league: Yup.string().required('League is required'),
  email: Yup.string().email('Invalid email').required('Email is required')
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

export default function PlayersPage() {
  const [query, setQuery] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [seasonFilter, setSeasonFilter] = useState('');
  const [clubFilter, setClubFilter] = useState(''); // New club filter for subpage
  const [sortBy, setSortBy] = useState('');
  const [detailTeam, setDetailTeam] = useState<Team | null>(null);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>(initialPlayers);

  // Sample data for dropdowns
  const positions = ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'];
  const clubs = ['Manchester United FC', 'Liverpool FC', 'Chelsea FC'];
  const leagues = ['Premier League', 'Championship', 'League One'];
  const grades = ['Under 18', 'Under 21', 'Senior'];
  const teams = ['XYZ', 'XYL', 'ABC'];
  const seasons = ['2023-2024', '2022-2023', '2021-2022']; // Added seasons data

  const filteredPlayers = useMemo(() => {
    let results = players.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(p => 
        p.firstName.toLowerCase().includes(q) || 
        p.lastName.toLowerCase().includes(q) ||
        p.teamName.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      );
    }
    if (teamFilter) results = results.filter(p => p.teamName === teamFilter);
    if (gradeFilter) results = results.filter(p => p.grade === gradeFilter);
    if (seasonFilter) results = results.filter(p => p.league.includes(seasonFilter)); // Filter by season
    if (clubFilter) results = results.filter(p => p.club === clubFilter); // Filter by club in subpage
    
    // Sorting logic
    results.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc': return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'name-desc': return `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`);
        case 'jersey-asc': return a.jerseyNumber - b.jerseyNumber;
        case 'jersey-desc': return b.jerseyNumber - a.jerseyNumber;
        case 'games-asc': return a.gamesPlayed - b.gamesPlayed;
        case 'games-desc': return b.gamesPlayed - a.gamesPlayed;
        case 'id-asc': return a.id.localeCompare(b.id);
        case 'id-desc': return b.id.localeCompare(a.id);
        default: return a.id.localeCompare(b.id);
      }
    });
    return results;
  }, [players, query, teamFilter, gradeFilter, seasonFilter, clubFilter, sortBy]);

  const handleTeamClick = (team: Team) => {
    setDetailTeam(team);
  };

  const handleUpdate = (values: Player) => {
    setPlayers(prev => prev.map(p => (p.id === values.id ? values : p)));
    setEditOpen(false);
    setEditingPlayer(null);
  };

  const handleCreate = (values: Player, { resetForm }: { resetForm: () => void }) => {
    const newPlayer = {
      ...values,
      id: `00${players.length + 1}`,
      teamName: detailTeam?.name || ''
    };
    setPlayers(prev => [newPlayer, ...prev]);
    resetForm();
    setCreateOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this player?')) return;
    setPlayers(prev => prev.filter(p => p.id !== id));
  };

  if (detailTeam) {
    return (
      <div>
        <div className="w-full flex flex-row justify-between bg-gradient-to-b from-[#E9F1FF] to-[#F28B84] p-5 rounded-lg shadow-md">
          <div className="flex flex-row justify-between items-center gap-2">
            <img 
              src={topHeadingIconImg} 
              alt="Team Logo"
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
              onClick={() => setDetailTeam(null)}
              className="px-4 py-2 cursor-pointer bg-gray-200 rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <FaArrowLeft /> Back
            </button>
          </div>  
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[28.18px] font-[600]">Team Details</h3>
            <div className="flex gap-3">
              <button className="h-[43px] w-[124px] p-[10.18px] border-[1.02px] border-[#4D4D4D] rounded-[8.14px] text-sm font-medium">
                Export
              </button>
              <button 
                className="px-4 py-2 bg-[#EF4B41] text-white rounded-lg text-sm font-medium flex items-center gap-2"
                onClick={() => setCreateOpen(true)}
              >
                <FaPlus /> Add New Player
              </button>
            </div>
          </div>

          <div className="flex gap-3 mb-4 flex-wrap">
            <div className="relative w-64 flex flex-row gap-[5.05px]">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className=" w-[396.35px] h-[48.46px] pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select
              className="w-[125.14px] h-[48.46px] p-2 border border-gray-300 rounded-lg text-sm"
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              title="Filter by Team"
            >
              <option value="">Select Team</option>
              {teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
            <select
              className="w-[120.14px] h-[48.46px] p-2 border border-gray-300 rounded-lg text-sm"
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              title="Filter by Grade"
            >
              <option value="">Select Grade</option>
              {grades.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
            {/* Added Club Filter for subpage */}
            <select
              className="w-[115.14px] h-[48.46px] p-2 border border-gray-300 rounded-lg text-sm "
              value={clubFilter}
              onChange={(e) => setClubFilter(e.target.value)}
              title="Filter by Club"
            >
              <option value="">Select Club</option>
              {clubs.map(club => (
                <option key={club} value={club}>{club}</option>
              ))}
            </select>
            <select
              className="w-[104.14px] h-[48.46px] p-2 border border-gray-300 rounded-lg text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              title="Sort Players By"
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
                <th className="py-3 px-4">PLAYER NAME</th>
                <th className="py-3 px-4">CLUB</th>
                <th className="py-3 px-4">GRADE</th>
                <th className="py-3 px-4">JERSEY NO</th>
                <th className="py-3 px-4 text-center">MANAGE</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers
                .filter(p => p.teamName === detailTeam.name)
                .map((player) => (
                <tr key={player.id} className="h-[83.16px] border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{`${player.firstName} ${player.lastName}`}</td>
                  <td className="py-3 px-4">{player.club}</td>
                  <td className="py-3 px-4">{player.grade || 'N/A'}</td>
                  <td className="py-3 px-4">{player.jerseyNumber}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-3">
                      <FaEdit 
                        className="text-gray-600 cursor-pointer hover:text-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingPlayer(player);
                          setEditOpen(true);
                        }}
                      />
                      <FaTrash 
                        className="text-red-600 cursor-pointer hover:text-red-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(player.id);
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

        {/* Create Player Modal for Team Detail View */}
        <Modal open={isCreateOpen} title="Create New Player" onClose={() => setCreateOpen(false)}>
          <Formik
            initialValues={{
              id: `00${players.length + 1}`,
              firstName: '',
              lastName: '',
              teamName: detailTeam?.name || '',
              jerseyNumber: 0,
              gamesPlayed: 0,
              position: '',
              club: '',
              league: '',
              email: '',
              grade: detailTeam?.grade || ''
            }}
            validationSchema={PlayerSchema}
            onSubmit={(values, actions) => handleCreate(values, actions)}
          >
            <Form className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Player ID</label>
                <Field 
                  name="id" 
                  className="w-full p-2 rounded-lg bg-gray-100 border border-gray-300 text-sm"
                  readOnly
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">First Name</label>
                  <Field 
                    name="firstName" 
                    className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                    placeholder="Enter first name"
                  />
                  <div className="text-red-500 text-xs mt-1"><ErrorMessage name="firstName" /></div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Last Name</label>
                  <Field 
                    name="lastName" 
                    className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                    placeholder="Enter last name"
                  />
                  <div className="text-red-500 text-xs mt-1"><ErrorMessage name="lastName" /></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Playing Number</label>
                  <Field 
                    name="jerseyNumber" 
                    type="number"
                    className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                    placeholder="Enter jersey number"
                  />
                  <div className="text-red-500 text-xs mt-1"><ErrorMessage name="jerseyNumber" /></div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Position</label>
                  <Field 
                    as="select" 
                    name="position" 
                    className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                  >
                    <option value="">Select Position</option>
                    {positions.map(pos => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </Field>
                  <div className="text-red-500 text-xs mt-1"><ErrorMessage name="position" /></div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Select Club</label>
                <Field 
                  as="select" 
                  name="club" 
                  className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                >
                  <option value="">Select Club</option>
                  {clubs.map(club => (
                    <option key={club} value={club}>{club}</option>
                  ))}
                </Field>
                <div className="text-red-500 text-xs mt-1"><ErrorMessage name="club" /></div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Select League</label>
                <Field 
                  as="select" 
                  name="league" 
                  className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                >
                  <option value="">Select League</option>
                  {leagues.map(league => (
                    <option key={league} value={league}>{league}</option>
                  ))}
                </Field>
                <div className="text-red-500 text-xs mt-1"><ErrorMessage name="league" /></div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email ID</label>
                <Field 
                  name="email" 
                  type="email"
                  className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                  placeholder="Enter email address"
                />
                <div className="text-red-500 text-xs mt-1"><ErrorMessage name="email" /></div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setCreateOpen(false)} 
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-[#EF4B41] text-white rounded-lg text-sm font-medium"
                >
                  Add Player
                </button>
              </div>
            </Form>
          </Formik>
        </Modal>

        {/* Edit Player Modal for Team Detail View */}
        <Modal open={isEditOpen} title="Edit Player" onClose={() => { setEditOpen(false); setEditingPlayer(null); }}>
          {editingPlayer && (
            <Formik
              initialValues={editingPlayer}
              validationSchema={PlayerSchema}
              onSubmit={(values) => handleUpdate(values)}
            >
              <Form className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Player ID</label>
                  <Field 
                    name="id" 
                    className="w-full p-2 rounded-lg bg-gray-100 border border-gray-300 text-sm"
                    readOnly
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">First Name</label>
                    <Field 
                      name="firstName" 
                      className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                    />
                    <div className="text-red-500 text-xs mt-1"><ErrorMessage name="firstName" /></div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Last Name</label>
                    <Field 
                      name="lastName" 
                      className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                    />
                    <div className="text-red-500 text-xs mt-1"><ErrorMessage name="lastName" /></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Playing Number</label>
                    <Field 
                      name="jerseyNumber" 
                      type="number"
                      className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                    />
                    <div className="text-red-500 text-xs mt-1"><ErrorMessage name="jerseyNumber" /></div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Position</label>
                    <Field 
                      as="select" 
                      name="position" 
                      className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                    >
                      <option value="">Select Position</option>
                      {positions.map(pos => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </Field>
                    <div className="text-red-500 text-xs mt-1"><ErrorMessage name="position" /></div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Select Club</label>
                  <Field 
                    as="select" 
                    name="club" 
                    className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                  >
                    <option value="">Select Club</option>
                    {clubs.map(club => (
                      <option key={club} value={club}>{club}</option>
                    ))}
                  </Field>
                  <div className="text-red-500 text-xs mt-1"><ErrorMessage name="club" /></div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Select League</label>
                  <Field 
                    as="select" 
                    name="league" 
                    className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                  >
                    <option value="">Select League</option>
                    {leagues.map(league => (
                      <option key={league} value={league}>{league}</option>
                    ))}
                  </Field>
                  <div className="text-red-500 text-xs mt-1"><ErrorMessage name="league" /></div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Email ID</label>
                  <Field 
                    name="email" 
                    type="email"
                    className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                  />
                  <div className="text-red-500 text-xs mt-1"><ErrorMessage name="email" /></div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => { setEditOpen(false); setEditingPlayer(null); }} 
                    className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-[#EF4B41] text-white rounded-lg text-sm font-medium"
                  >
                    Update Player
                  </button>
                </div>
              </Form>
            </Formik>
          )}
        </Modal>
      </div>
    );
  }

  // Main Players Page View
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Player Management</h2>
        <div className="flex gap-3">
          <button className="h-[43px] w-[124px] p-[10.18px] border-[1.02px] border-[#4D4D4D] rounded-[8.14px] text-sm font-medium">
            Export
          </button>
          <button 
            className="cursor-pointer px-4 py-2 bg-[#EF4B41] text-white rounded-lg text-sm font-medium flex items-center gap-2"
            onClick={() => {
              setEditingPlayer({
                id: '',
                firstName: '',
                lastName: '',
                teamName: '',
                jerseyNumber: 0,
                gamesPlayed: 0,
                position: '',
                club: '',
                league: '',
                email: ''
              });
              setEditOpen(true);
            }}
          >
            <FaPlus /> Create Player
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6 border border-gray-200">
        <div className="flex flex-row flex-wrap gap-2">
          <div className="relative col-span-1 md:col-span-2 gap-[5.05px]">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search players..."
              className="w-[396.35px] h-[48.46px] pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-sm"
            />
          </div>
          <div>
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="w-[110.14px] h-[48.46px] p-2 rounded-lg border border-gray-300 text-sm"
              title="Filter by Team"
            >
              <option value="">Select Team</option>
              {teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="w-[115.14px] h-[48.46px] p-2 rounded-lg border border-gray-300 text-sm"
              title="Filter by Grade"
            >
              <option value="">Select Grade</option>
              {grades.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={seasonFilter}
              onChange={(e) => setSeasonFilter(e.target.value)}
              className="w-w-[115.14px] h-[48.46px] p-2 rounded-lg border border-gray-300 text-sm" 
              title="Filter by Season"
            >
              <option value="">Select Season</option>
              {seasons.map(season => (
                <option key={season} value={season}>{season}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-[104px] h-[48.46px] p-2 rounded-lg border border-gray-300 text-sm"
              title="Sort Players By"
            >
              <option value="">Sort By</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="jersey-asc">Jersey No (Low-High)</option>
              <option value="jersey-desc">Jersey No (High-Low)</option>
              <option value="games-asc">Games (Low-High)</option>
              <option value="games-desc">Games (High-Low)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#E9F1FF] text-gray-600 font-semibold">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">PLAYER NAME</th>
              <th className="py-3 px-4">TEAM NAME</th>
              <th className="py-3 px-4">JERSEY NO</th>
              <th className="py-3 px-4">NO. OF GAMES PLAYED</th>
              <th className="py-3 px-4 text-center">MANAGE</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map((player) => (
              <tr 
                key={player.id} 
                className="h-[83.16px] border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleTeamClick({ id: player.id, name: player.teamName, grade: player.grade || '' })}
              >
                <td className="py-3 px-4">{player.id}</td>
                <td className="py-3 px-4 font-medium">{`${player.firstName} ${player.lastName}`}</td>
                <td className="py-3 px-4">{player.teamName}</td>
                <td className="py-3 px-4">{player.jerseyNumber}</td>
                <td className="py-3 px-4">{player.gamesPlayed}</td>
                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center gap-3">
                    <FaEdit 
                      className="text-gray-600 cursor-pointer hover:text-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingPlayer(player);
                        setEditOpen(true);
                      }}
                    />
                    <FaTrash 
                      className="text-red-600 cursor-pointer hover:text-red-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(player.id);
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Player Modal for Main View */}
      <Modal open={isEditOpen && !editingPlayer?.id} title="Create New Player" onClose={() => { setEditOpen(false); setEditingPlayer(null); }}>
        <Formik
          initialValues={{
            id: `00${players.length + 1}`,
            firstName: '',
            lastName: '',
            teamName: '',
            jerseyNumber: 0,
            gamesPlayed: 0,
            position: '',
            club: '',
            league: '',
            email: '',
            grade: ''
          }}
          validationSchema={PlayerSchema}
          onSubmit={(values, actions) => {
            setPlayers(prev => [values, ...prev]);
            actions.resetForm();
            setEditOpen(false);
          }}
        >
          <Form className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Player ID</label>
              <Field 
                name="id" 
                className="w-full p-2 rounded-lg bg-gray-100 border border-gray-300 text-sm"
                readOnly
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">First Name</label>
                <Field 
                  name="firstName" 
                  className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                  placeholder="Enter first name"
                />
                <div className="text-red-500 text-xs mt-1"><ErrorMessage name="firstName" /></div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Last Name</label>
                <Field 
                  name="lastName" 
                  className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                  placeholder="Enter last name"
                />
                <div className="text-red-500 text-xs mt-1"><ErrorMessage name="lastName" /></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Playing Number</label>
                <Field 
                  name="jerseyNumber" 
                  type="number"
                  className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                  placeholder="Enter jersey number"
                />
                <div className="text-red-500 text-xs mt-1"><ErrorMessage name="jerseyNumber" /></div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Position</label>
                <Field 
                  as="select" 
                  name="position" 
                  className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                >
                  <option value="">Select Position</option>
                  {positions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </Field>
                <div className="text-red-500 text-xs mt-1"><ErrorMessage name="position" /></div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Select Team</label>
              <Field 
                as="select" 
                name="teamName" 
                className="w-full p-2 rounded-lg border border-gray-300 text-sm"
              >
                <option value="">Select Team</option>
                {teams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </Field>
              <div className="text-red-500 text-xs mt-1"><ErrorMessage name="teamName" /></div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Select Club</label>
              <Field 
                as="select" 
                name="club" 
                className="w-full p-2 rounded-lg border border-gray-300 text-sm"
              >
                <option value="">Select Club</option>
                {clubs.map(club => (
                  <option key={club} value={club}>{club}</option>
                ))}
              </Field>
              <div className="text-red-500 text-xs mt-1"><ErrorMessage name="club" /></div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Select League</label>
              <Field 
                as="select" 
                name="league" 
                className="w-full p-2 rounded-lg border border-gray-300 text-sm"
              >
                <option value="">Select League</option>
                {leagues.map(league => (
                  <option key={league} value={league}>{league}</option>
                ))}
              </Field>
              <div className="text-red-500 text-xs mt-1"><ErrorMessage name="league" /></div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email ID</label>
              <Field 
                name="email" 
                type="email"
                className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                placeholder="Enter email address"
              />
              <div className="text-red-500 text-xs mt-1"><ErrorMessage name="email" /></div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <button 
                type="button" 
                onClick={() => { setEditOpen(false); setEditingPlayer(null); }} 
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-[#EF4B41] text-white rounded-lg text-sm font-medium"
              >
                Create Player
              </button>
            </div>
          </Form>
        </Formik>
      </Modal>

      {/* Edit Player Modal for Main View */}
      <Modal open={isEditOpen && !!editingPlayer?.id} title="Edit Player" onClose={() => { setEditOpen(false); setEditingPlayer(null); }}>
        {editingPlayer && (
          <Formik
            initialValues={editingPlayer}
            validationSchema={PlayerSchema}
            onSubmit={(values) => {
              handleUpdate(values);
              setEditOpen(false);
            }}
          >
            <Form className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Player ID</label>
                <Field 
                  name="id" 
                  className="w-full p-2 rounded-lg bg-gray-100 border border-gray-300 text-sm"
                  readOnly
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">First Name</label>
                  <Field 
                    name="firstName" 
                    className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                  />
                  <div className="text-red-500 text-xs mt-1"><ErrorMessage name="firstName" /></div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Last Name</label>
                  <Field 
                    name="lastName" 
                    className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                  />
                  <div className="text-red-500 text-xs mt-1"><ErrorMessage name="lastName" /></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Playing Number</label>
                  <Field 
                    name="jerseyNumber" 
                    type="number"
                    className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                  />
                  <div className="text-red-500 text-xs mt-1"><ErrorMessage name="jerseyNumber" /></div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Position</label>
                  <Field 
                    as="select" 
                    name="position" 
                    className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                  >
                    <option value="">Select Position</option>
                    {positions.map(pos => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </Field>
                  <div className="text-red-500 text-xs mt-1"><ErrorMessage name="position" /></div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Select Team</label>
                <Field 
                  as="select" 
                  name="teamName" 
                  className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                >
                  <option value="">Select Team</option>
                  {teams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </Field>
                <div className="text-red-500 text-xs mt-1"><ErrorMessage name="teamName" /></div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Select Club</label>
                <Field 
                  as="select" 
                  name="club" 
                  className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                >
                  <option value="">Select Club</option>
                  {clubs.map(club => (
                    <option key={club} value={club}>{club}</option>
                  ))}
                </Field>
                <div className="text-red-500 text-xs mt-1"><ErrorMessage name="club" /></div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Select League</label>
                <Field 
                  as="select" 
                  name="league" 
                  className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                >
                  <option value="">Select League</option>
                  {leagues.map(league => (
                    <option key={league} value={league}>{league}</option>
                  ))}
                </Field>
                <div className="text-red-500 text-xs mt-1"><ErrorMessage name="league" /></div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email ID</label>
                <Field 
                  name="email" 
                  type="email"
                  className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                />
                <div className="text-red-500 text-xs mt-1"><ErrorMessage name="email" /></div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => { setEditOpen(false); setEditingPlayer(null); }} 
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-[#EF4B41] text-white rounded-lg text-sm font-medium"
                >
                  Update Player
                </button>
              </div>
            </Form>
          </Formik>
        )}
      </Modal>
    </div>
  );
}