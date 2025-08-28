import React, { useMemo, useState } from 'react';
import { FaSearch} from 'react-icons/fa';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// 1. Define a type for form values
interface ScheduleFormValues {
  roundNo: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  date: string;
  time: string;
}

type Fixture = {
  id: string;
  roundNo: string;
  match: string;
  competition: string;
  dateTime: string;
  matchVideo: string;
  analyst: string;
  status: string;
};

const initialFixtures: Fixture[] = [
  { 
    id: '001', 
    roundNo: '001', 
    match: 'Manchester United vs XYZ', 
    competition: 'Premier League', 
    dateTime: 'May 12, 2025 at 15:00', 
    matchVideo: 'Not Started', 
    analyst: 'Assign Analyst', 
    status: 'Under QA' 
  },
  { 
    id: '002', 
    roundNo: '001', 
    match: 'Manchester United vs XYZ', 
    competition: 'Premier League', 
    dateTime: 'May 12, 2025 at 15:00', 
    matchVideo: 'Not Started', 
    analyst: 'Assign Analyst', 
    status: 'Under QA' 
  }
];

const FixtureSchema = Yup.object().shape({
  competition: Yup.string().required('Competition is required'),
  homeTeam: Yup.string().required('Home Team is required'),
  awayTeam: Yup.string().required('Away Team is required'),
  date: Yup.string().required('Date is required'),
  time: Yup.string().required('Time is required'),
  roundNo: Yup.string().required('Round No is required')
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

export default function FixturesPage() {
  const [query, setQuery] = useState('');
  const [matchFilter, setMatchFilter] = useState('');
  const [competitionFilter, setCompetitionFilter] = useState('');
  // const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [isScheduleOpen, setScheduleOpen] = useState(false);
  const [isAssignOpen, setAssignOpen] = useState(false);
  const [fixtures, setFixtures] = useState<Fixture[]>(initialFixtures);

  // Sample data for dropdowns
  const matches = ['Manchester United vs XYZ', 'Liverpool vs ABC', 'Chelsea vs DEF'];
  const competitions = ['Premier League', 'Championship', 'FA Cup'];
  // const statuses = ['Not Started', 'In Progress', 'Completed'];
  const teams = ['Manchester United', 'Liverpool', 'Chelsea', 'XYZ', 'ABC', 'DEF'];
  const categories = ['Category 1', 'Category 2', 'Category 3'];
  const analysts = ['Analyst 1', 'Analyst 2', 'Analyst 3'];

  const filteredFixtures = useMemo(() => {
    let results = fixtures.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(f => 
        f.match.toLowerCase().includes(q) || 
        f.competition.toLowerCase().includes(q) ||
        f.roundNo.toLowerCase().includes(q)
      );
    }
    if (matchFilter) results = results.filter(f => f.match === matchFilter);
    if (competitionFilter) results = results.filter(f => f.competition === competitionFilter);
    // if (statusFilter) results = results.filter(f => f.status === statusFilter);
    
    // Sorting logic
    results.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc': return a.dateTime.localeCompare(b.dateTime);
        case 'date-desc': return b.dateTime.localeCompare(a.dateTime);
        case 'round-asc': return a.roundNo.localeCompare(b.roundNo);
        case 'round-desc': return b.roundNo.localeCompare(a.roundNo);
        default: return a.id.localeCompare(b.id);
      }
    });
    return results;
  }, [fixtures, query, matchFilter, competitionFilter, sortBy]);  // removed statusFilter dep

  const handleSchedule = (values: ScheduleFormValues) => {
    const newFixture = {
      id: `00${fixtures.length + 1}`,
      roundNo: values.roundNo,
      match: `${values.homeTeam} vs ${values.awayTeam}`,
      competition: values.competition,
      dateTime: `${values.date} at ${values.time}`,
      matchVideo: 'Not Started',
      analyst: 'Assign Analyst',
      status: 'Under QA'
    };
    setFixtures(prev => [newFixture, ...prev]);
    setScheduleOpen(false);
  };

  const handleAssign = () => {
    // Handle analyst assignment logic
    // simplified: removed unused "values" param
    setAssignOpen(false);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Fixture Management</h2>
        <button 
          className="h-[43px] w-[124px] p-[10.18px] cursor-pointer bg-[#EF4B41] text-white rounded-[8.14px] text-sm font-medium flex items-center justify-center gap-2"
          onClick={() => setScheduleOpen(true)}
        >
          Schedule Game
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6 border border-gray-200">
        <div className="flex flex-row flex-wrap gap-2">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search fixtures..."
              className="w-[396.35px] h-[48.46px] pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-sm"
            />
          </div>
          <select
            className="w-[120.14px] h-[48.46px] p-2 rounded-lg border border-gray-300 text-sm"
            value={matchFilter}
            onChange={(e) => setMatchFilter(e.target.value)}
            title="Filter by Match"
          >
            <option value="">Select Match</option>
            {matches.map(match => (
              <option key={match} value={match}>{match}</option>
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
            className="w-[90px] h-[48.46px] p-2 rounded-lg border border-gray-300 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            title="Sort By"
          >
            <option value="">Sort By</option>
            <option value="date-asc">Date (Oldest)</option>
            <option value="date-desc">Date (Newest)</option>
            <option value="round-asc">Round (A-Z)</option>
            <option value="round-desc">Round (Z-A)</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#E9F1FF] text-gray-600 font-semibold">
            <tr>
              <th className="py-3 px-4">ROUND NO.</th>
              <th className="py-3 px-4">MATCH</th>
              <th className="py-3 px-4">COMPETITIONS</th>
              <th className="py-3 px-4">DATE & TIME</th>
              <th className="py-3 px-4">MATCH VIDEO</th>
              <th className="py-3 px-4">ASSIGN ANALYST</th>
              <th className="py-3 px-4">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filteredFixtures.map((fixture) => (
              <tr key={fixture.id} className="h-[83.16px] border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4">{fixture.roundNo}</td>
                <td className="py-3 px-4 font-medium">{fixture.match}</td>
                <td className="py-3 px-4">{fixture.competition}</td>
                <td className="py-3 px-4">{fixture.dateTime}</td>
                <td className="py-3 px-4">
                  <span className="inline-block px-3 py-1 rounded-[53.47px] bg-[#F3F3F3] text-[#646464]">
                    {fixture.matchVideo}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    className="px-3 py-1 cursor-pointer rounded-[3.56px] bg-[#EF4B41] text-white"
                    onClick={() => setAssignOpen(true)}
                  >
                    {fixture.analyst}
                  </button>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-block px-3 py-1 rounded-[53.47px] bg-[#FFC300] text-black">
                    {fixture.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Schedule Game Modal */}
      <Modal open={isScheduleOpen} title="Schedule New Game" onClose={() => setScheduleOpen(false)}>
        <Formik
          initialValues={{
            competition: '',
            homeTeam: '',
            awayTeam: '',
            date: '',
            time: '',
            roundNo: '',
            analyst: ''
          }}
          validationSchema={FixtureSchema}
          onSubmit={(values) => handleSchedule(values)}
        >
          <Form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Competition</label>
                <Field 
                  as="select" 
                  name="competition" 
                  className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                >
                  <option value="">Select</option>
                  {competitions.map(comp => (
                    <option key={comp} value={comp}>{comp}</option>
                  ))}
                </Field>
                <div className="text-red-500 text-xs mt-1"><ErrorMessage name="competition" /></div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Select Analyst</label>
                <Field 
                  name="analyst" 
                  className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                  placeholder="Enter Name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Home Team</label>
                <Field 
                  as="select" 
                  name="homeTeam" 
                  className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                >
                  <option value="">Select</option>
                  {teams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </Field>
                <div className="text-red-500 text-xs mt-1"><ErrorMessage name="homeTeam" /></div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Away Team</label>
                <Field 
                  as="select" 
                  name="awayTeam" 
                  className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                >
                  <option value="">Select</option>
                  {teams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </Field>
                <div className="text-red-500 text-xs mt-1"><ErrorMessage name="awayTeam" /></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Time</label>
                <Field 
                  name="time" 
                  type="time"
                  className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                  placeholder="Enter Time"
                />
                <div className="text-red-500 text-xs mt-1"><ErrorMessage name="time" /></div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Date</label>
                <Field 
                  name="date" 
                  type="date"
                  className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                />
                <div className="text-red-500 text-xs mt-1"><ErrorMessage name="date" /></div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Round No</label>
              <Field 
                name="roundNo" 
                className="w-full p-2 rounded-lg border border-gray-300 text-sm"
                placeholder="Enter Round No"
              />
              <div className="text-red-500 text-xs mt-1"><ErrorMessage name="roundNo" /></div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <button 
                type="button" 
                onClick={() => setScheduleOpen(false)} 
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-[#EF4B41] text-white rounded-lg text-sm font-medium"
              >
                Schedule Game
              </button>
            </div>
          </Form>
        </Formik>
      </Modal>

      {/* Assign Analyst Modal */}
      <Modal open={isAssignOpen} title="Assign Analyst" onClose={() => setAssignOpen(false)}>
        <Formik
          initialValues={{
            category: '',
            homeAnalyst: '',
            awayAnalyst: ''
          }}
          // onSubmit={(values) => handleAssign(values)}
          onSubmit={() => handleAssign()} // removed 'values' argument to deploy
        >
          <Form className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Select Category</label>
              <Field 
                as="select" 
                name="category" 
                className="w-full p-2 rounded-lg border border-gray-300 text-sm"
              >
                <option value="">Select</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Field>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Select Home Analyst</label>
              <Field 
                as="select" 
                name="homeAnalyst" 
                className="w-full p-2 rounded-lg border border-gray-300 text-sm"
              >
                <option value="">Select</option>
                {analysts.map(analyst => (
                  <option key={analyst} value={analyst}>{analyst}</option>
                ))}
              </Field>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Select Away Analyst</label>
              <Field 
                as="select" 
                name="awayAnalyst" 
                className="w-full p-2 rounded-lg border border-gray-300 text-sm"
              >
                <option value="">Select</option>
                {analysts.map(analyst => (
                  <option key={analyst} value={analyst}>{analyst}</option>
                ))}
              </Field>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <button 
                type="button" 
                onClick={() => setAssignOpen(false)} 
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-[#EF4B41] text-white rounded-lg text-sm font-medium"
              >
                Add Analyst
              </button>
            </div>
          </Form>
        </Formik>
      </Modal>
    </div>
  );
}