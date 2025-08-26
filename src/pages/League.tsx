// League.tsx - Fixed version
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Table from '../components/Table';
import { useAuthStore } from '../store';

/* -------------------------
   Types
   ------------------------- */
type League = {
  _id: string;
  id: string;
  name: string;
  country: string;
  season: string;
  competitionsCount: number;
  status: 'Active' | 'Ongoing' | 'Complete' | 'Draft';
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

/* -------------------------
   Dummy data (fallback)
   ------------------------- */
const initialLeagues: League[] = [
  {
    _id: '1',
    id: '01',
    name: 'Alberta Australian Football 2024',
    country: 'England',
    season: '2024',
    competitionsCount: 20,
    status: 'Active',
    description: 'Sample description for Alberta Australian Football 2024.',
    createdBy: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    id: '02',
    name: 'Alberta Australian Football 2023',
    country: 'England',
    season: '2023',
    competitionsCount: 18,
    status: 'Active',
    description: 'Sample description for Alberta Australian Football 2023.',
    createdBy: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
];

/* -------------------------
   Small reusable Modal component
   - simple overlay + center box
   ------------------------- */
function Modal({ open, title, onClose, children }: { open: boolean; title?: string; onClose: () => void; children: React.ReactNode; }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      {/* modal box */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg p-6 z-10">
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        {children}
      </div>
    </div>
  );
}

/* -------------------------
   Validation schema for Create/Edit form
   ------------------------- */
const LeagueSchema = Yup.object().shape({
  name: Yup.string().required('League Name is required'),
  country: Yup.string().required('Country is required'),
  season: Yup.string().required('Season is required'),
  competitionsCount: Yup.number().min(0, 'Must be positive').required('Required'),
});

/* -------------------------
   Main component
   ------------------------- */
export default function LeaguePage() {
  const { 
    leagues, 
    getAllLeagues, 
    createLeague, 
    updateLeague, 
    deleteLeague,
    isLeagueLoading,
    leagueError,
    clearLeagueError
  } = useAuthStore();

  // Use leagues from store or fallback to dummy data
  const displayLeagues = leagues.length > 0 ? leagues : initialLeagues;

  // UI state
  const [query, setQuery] = useState(''); // search keyword
  const [countryFilter, setCountryFilter] = useState(''); // country filter (empty by default)
  const [seasonFilter, setSeasonFilter] = useState(''); // season filter (empty by default)
  const [sortBy, setSortBy] = useState(''); // sort field (empty by default)

  // modal state
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [editingLeague, setEditingLeague] = useState<League | null>(null);

  // detail view: when set to a League, we show its detail instead of list
  const [detailLeague, setDetailLeague] = useState<League | null>(null);

  // Fetch leagues on component mount
  useEffect(() => {
    getAllLeagues();
    clearLeagueError();
  }, [getAllLeagues, clearLeagueError]);

  // Show error toast if there's a league error
  useEffect(() => {
    if (leagueError) {
      toast.error(leagueError);
    }
  }, [leagueError]);

  /* -------------------------
     Derived lists for dropdowns
     - useMemo so arrays are stable unless leagues change
     ------------------------- */
  const countries = useMemo(() => ['', ...Array.from(new Set(displayLeagues.map((l) => l.country)))], [displayLeagues]);
  const seasons = useMemo(() => ['', ...Array.from(new Set(displayLeagues.map((l) => l.season)))], [displayLeagues]);

  /* -------------------------
     Delete handler (simple confirm) - wrapped in useCallback
     ------------------------- */
  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this league?')) return;
    try {
      await deleteLeague(id);
      // if we were viewing its detail, go back to list
      setDetailLeague((d) => (d && d._id === id ? null : d));
    } catch (error) {
      // Error is handled by the store
      console.log(error);
    }
  }, [deleteLeague]);

  /* -------------------------
     Filtered + sorted leagues to render in table
     ------------------------- */
  const filtered = useMemo(() => {
    let results = [...displayLeagues];

    // search by name or id (case-insensitive)
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter((l) => l.name.toLowerCase().includes(q) || (l.id && l.id.toLowerCase().includes(q)));
    }

    // country filter
    if (countryFilter) results = results.filter((l) => l.country === countryFilter);

    // season filter
    if (seasonFilter) results = results.filter((l) => l.season === seasonFilter);

    // sort
    results.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'competitions':
          return b.competitionsCount - a.competitionsCount; // desc
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return (a.id || a._id).localeCompare(b.id || b._id);
      }
    });

    return results;
  }, [displayLeagues, query, countryFilter, seasonFilter, sortBy]);

  /* -------------------------
     Create league handler (called from Formik)
     ------------------------- */
  const handleCreate = async (values: Omit<League, '_id' | 'createdBy' | 'createdAt' | 'updatedAt'>, { resetForm }: { resetForm: () => void }) => {
    try {
      // Generate a temporary ID for the new league
      const leagueData = {
        ...values,
        id: `temp-${Date.now()}`, // Generate a temporary ID
      };
      
      await createLeague(leagueData);
      resetForm();
      setCreateOpen(false);
    } catch (error) {
      // Error is handled by the store
      console.log(error);
    }
  };

  /* -------------------------
     Edit league handler
     ------------------------- */
  const handleUpdate = async (values: League) => {
    try {
      await updateLeague(values._id, values);
      setEditOpen(false);
      setEditingLeague(null);
      // if currently viewing details of this league, update that view too
      setDetailLeague((d) => (d && d._id === values._id ? values : d));
    } catch (error) {
      // Error is handled by the store
      console.log(error);
    }
  };

  /* -------------------------
     Prepare table data for the reusable Table component
     ------------------------- */
  const tableData = useMemo(() => {
    return filtered.map(league => ({
      ...league,
      // Use id field for display (fallback to _id if id doesn't exist)
      id: league.id || league._id,
      // Format status with colored badge
      status: (
        <span className={`px-2 py-1 rounded text-xs ${
          league.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {league.status}
        </span>
      ),
      // Add actions column
      actions: (
        <div className="flex gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingLeague(league);
              setEditOpen(true);
            }}
            className="text-gray-600 hover:text-blue-600"
            title="Edit League"
            aria-label="Edit League"
          >
            <FaEdit aria-hidden="true" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(league._id);
            }}
            className="text-red-600 hover:text-red-800"
            title="Delete League"
            aria-label="Delete League"
          >
            <FaTrash aria-hidden="true" />
          </button>
        </div>
      )
    }));
  }, [filtered, handleDelete]);

  /* -------------------------
     Table columns configuration
     ------------------------- */
  const tableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'LEAGUE NAME' },
    { key: 'country', label: 'COUNTRY' },
    { key: 'competitionsCount', label: 'NO. OF COMPETITIONS' },
    { key: 'status', label: 'STATUS' },
    { key: 'actions', label: 'ACTIONS' }
  ];

  /* -------------------------
     Handle row click to show detail view
     ------------------------- */
  const handleRowClick = (row: League) => {
    // Find the original league object (without the JSX formatting we added for the table)
    const originalLeague = filtered.find(l => (l.id || l._id) === row.id);
    if (originalLeague) setDetailLeague(originalLeague);
  };

  /* -------------------------
     Render: either detail view or list view
     ------------------------- */
  if (detailLeague) {
    // League Detail view (shows header + description and back button)
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{detailLeague.name}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setDetailLeague(null)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              Back
            </button>
            <button
              onClick={() => {
                setEditingLeague(detailLeague);
                setEditOpen(true);
              }}
              className="px-3 py-1 bg-[#0b2447] text-white rounded"
            >
              Edit
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow">
          <p className="mb-2"><strong>ID:</strong> {detailLeague.id || detailLeague._id}</p>
          <p className="mb-2"><strong>Country:</strong> {detailLeague.country}</p>
          <p className="mb-2"><strong>Season:</strong> {detailLeague.season}</p>
          <p className="mb-2"><strong>No. of Competitions:</strong> {detailLeague.competitionsCount}</p>
          <p className="mb-4"><strong>Status:</strong> <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">{detailLeague.status}</span></p>
          <div>
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="text-gray-700">{detailLeague.description || 'No description provided.'}</p>
          </div>
        </div>

        {/* Edit modal */}
        <Modal open={isEditOpen} title="Edit League" onClose={() => { setEditOpen(false); setEditingLeague(null); }}>
          {editingLeague && (
            <Formik
              initialValues={editingLeague}
              validationSchema={LeagueSchema}
              onSubmit={(values) => handleUpdate(values as League)}
            >
              <Form className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600">ID</label>
                  <Field 
                    name="id" 
                    readOnly 
                    value={editingLeague.id || editingLeague._id}
                    className="w-full p-2 rounded bg-gray-100 border border-[#C7C7C7] border-opacity-100"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600">League Name</label>
                  <Field 
                    name="name" 
                    className="w-full p-2 rounded border border-[#C7C7C7] border-opacity-100"
                  />
                  <div className="text-red-500 text-xs"><ErrorMessage name="name" /></div>
                </div>

                <div>
                  <label className="block text-xs text-gray-600">Country</label>
                  <Field 
                    name="country" 
                    className="w-full p-2 rounded border border-[#C7C7C7] border-opacity-100"
                  />
                  <div className="text-red-500 text-xs"><ErrorMessage name="country" /></div>
                </div>

                <div>
                  <label className="block text-xs text-gray-600">Season</label>
                  <Field 
                    name="season" 
                    className="w-full p-2 rounded border border-[#C7C7C7] border-opacity-100"
                  />
                  <div className="text-red-500 text-xs"><ErrorMessage name="season" /></div>
                </div>

                <div>
                  <label className="block text-xs text-gray-600">No. of Competitions</label>
                  <Field 
                    name="competitionsCount" 
                    type="number" 
                    className="w-full p-2 rounded border border-[#C7C7C7] border-opacity-100"
                  />
                  <div className="text-red-500 text-xs"><ErrorMessage name="competitionsCount" /></div>
                </div>

                <div>
                  <label className="block text-xs text-gray-600">Status</label>
                  <Field 
                    as="select" 
                    name="status" 
                    className="w-full p-2 rounded border border-[#C7C7C7] border-opacity-100"
                  >
                    <option value="Active">Active</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Complete">Complete</option>
                    <option value="Draft">Draft</option>
                  </Field>
                </div>

                <div>
                  <label className="block text-xs text-gray-600">Description</label>
                  <Field 
                    as="textarea" 
                    name="description" 
                    className="w-full p-2 rounded border border-[#C7C7C7] border-opacity-100" 
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button 
                    type="button" 
                    onClick={() => { setEditOpen(false); setEditingLeague(null); }} 
                    className="px-4 py-2 rounded border border-[#C7C7C7] border-opacity-100"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isLeagueLoading}
                    className={`px-4 py-2 bg-[#0b2447] text-white rounded ${isLeagueLoading ? 'opacity-50' : ''}`}
                  >
                    {isLeagueLoading ? 'Updating...' : 'Update League'}
                  </button>
                </div>
              </Form>
            </Formik>
          )}
        </Modal>
      </div>
    );
  }

  /* -------------------------
     List view (search, filters, table, create modal)
     ------------------------- */
  return (
    <div>
      {/* Header (title + top-right buttons) */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">League Management</h2>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded border border-[#C7C7C7] border-opacity-100">
            Export
          </button>
          <button 
            onClick={() => setCreateOpen(true)} 
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Create New League
          </button>
        </div>
      </div>

      {/* Filters: Search + Country + Season + Sort */}
      <div className="bg-white p-6 rounded-lg shadow mb-6 border border-gray-200">
        <div className="flex flex-row flex-wrap gap-2">
          {/* Search */}
          <div className="">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-[350.35px] h-[48.46px] p-2 rounded-lg border border-gray-300 text-[16px]"
            />
          </div>

          {/* Country dropdown */}
          <div className="">
            <select
              id="countryFilter"
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-[128px] h-[48px] p-2 rounded-lg border border-gray-300 text-sm"
              title="Filter by country"
            >
              <option value="" className=''>Select Country</option>
              {countries.filter(c => c).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Season & Sort grouped small */}
          <div className="flex gap-3">
            <select
              value={seasonFilter}
              onChange={(e) => setSeasonFilter(e.target.value)}
              className=" w-[140px] h-[48px] p-3 rounded  border-[#C7C7C7] border-opacity-100 border-[0.68px]"
              title="Filter by season"
            >
              <option value="">Select Season</option>
              {seasons.filter(s => s).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-[104px] h-[48px] p-3 rounded border-[#C7C7C7] border-opacity-100 border-[0.68px]"
              title="Sort leagues"
            >
              <option value="">Sort By</option>
              <option value="id">Sort By ID</option>
              <option value="name">Sort By Name</option>
              <option value="competitions">Sort By Competitions</option>
              <option value="status">Sort By Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLeagueLoading && (
        <div className="bg-white rounded-lg shadow p-8 text-center mb-4 border-[#A8A8A8] border-opacity-100 border-[0.92px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading leagues...</p>
        </div>
      )}

      {/* Table using the reusable Table component */}
      <div className="bg-white rounded-lg shadow overflow-hidden  border-[#A8A8A8] border-opacity-100 border-[0.92px]">
        <Table 
          columns={tableColumns}
          data={tableData}
          onRowClick={handleRowClick}
          rowClassName="border border-[#A8A8A8] border-opacity-100 border-[0.92px] w-[1163px] h-[81.437px]"
        />
        
        {/* Empty state */}
        {!isLeagueLoading && filtered.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {leagues.length === 0 ? 'No leagues found. Create your first league!' : 'No leagues match your filters.'}
          </div>
        )}
      </div>

      {/* ---------------- Create Modal ---------------- */}
      <Modal open={isCreateOpen} title="Create New League" onClose={() => setCreateOpen(false)}>
        <Formik
          initialValues={{
            name: '',
            country: '',
            season: '',
            competitionsCount: 0,
            status: 'Active' as League['status'],
            description: '',
          }}
          validationSchema={LeagueSchema}
          onSubmit={(values, actions) => handleCreate(values, actions)}
        >
          {() => (
            <Form className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600">League Name</label>
                <Field 
                  name="name" 
                  className="w-full p-2 rounded border-[#C7C7C7] border-opacity-100 border-[0.68px]"
                />
                <div className="text-red-500 text-xs"><ErrorMessage name="name" /></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600">Country</label>
                  <Field 
                    as="select" 
                    name="country" 
                    className="w-full p-2 rounded border-[#C7C7C7] border-opacity-100 border-[0.68px]"
                  >
                    <option value="">Select Country</option>
                    {countries.filter(c => c).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </Field>
                  <div className="text-red-500 text-xs"><ErrorMessage name="country" /></div>
                </div>

                <div>
                  <label className="block text-xs text-gray-600">Season</label>
                  <Field 
                    as="select" 
                    name="season" 
                    className="w-full p-2 rounded  border-[#C7C7C7] border-opacity-100 border-[0.68px]"
                  >
                    <option value="">Select Season</option>
                    {seasons.filter(s => s).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </Field>
                  <div className="text-red-500 text-xs"><ErrorMessage name="season" /></div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-600">No. of Competitions</label>
                <Field 
                  name="competitionsCount" 
                  type="number" 
                  className="w-full p-2 rounded border-[#C7C7C7] border-opacity-100 border-[0.68px]"
                />
                <div className="text-red-500 text-xs"><ErrorMessage name="competitionsCount" /></div>
              </div>

              <div>
                <label className="block text-xs text-gray-600">Status</label>
                <Field 
                  as="select" 
                  name="status" 
                  className="w-full p-2 rounded border-[#C7C7C7] border-opacity-100 border-[0.68px]"
                >
                  <option value="Active">Active</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Complete">Complete</option>
                  <option value="Draft">Draft</option>
                </Field>
              </div>

              <div>
                <label className="block text-xs text-gray-600">Description</label>
                <Field 
                  as="textarea" 
                  name="description" 
                  className="w-full p-2 rounded border-[#C7C7C7] border-opacity-100 border-[0.68px]" 
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setCreateOpen(false)} 
                  className="px-4 py-2 rounded border-[#C7C7C7] border-opacity-100 border-[0.68px]"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isLeagueLoading}
                  className={`px-4 py-2 bg-red-500 text-white rounded ${isLeagueLoading ? 'opacity-50' : ''}`}
                >
                  {isLeagueLoading ? 'Creating...' : 'Add League'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
}