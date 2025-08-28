import  { useMemo, useState } from 'react';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

type Grade = {
  id: string;
  name: string;
  description: string;
  clubs: string[];
};

const initialGrades: Grade[] = [
  { 
    id: '001', 
    name: 'Under 18 Premier League North', 
    description: 'Manchester United FC', 
    clubs: ['Manchester United FC'] 
  },
  { 
    id: '002', 
    name: 'Under 18 Premier League North', 
    description: 'Manchester United FC', 
    clubs: ['Manchester United FC'] 
  },
  { 
    id: '003', 
    name: 'Under 18 Premier League North', 
    description: 'write some description', 
    clubs: [] 
  }
];

export default function GradesPage() {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [grades, setGrades] = useState<Grade[]>(initialGrades);

  const filteredGrades = useMemo(() => {
    let results = grades.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(g => 
        g.name.toLowerCase().includes(q) || 
        g.description.toLowerCase().includes(q) ||
        g.id.toLowerCase().includes(q)
      );
    }
    
    // Sorting logic
    results.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        default: return a.id.localeCompare(b.id);
      }
    });
    return results;
  }, [grades, query, sortBy]);

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this grade?')) return;
    setGrades(prev => prev.filter(g => g.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Grades</h2>
        <div className="flex gap-3">
          <button className="h-[43px] w-[124px] p-[10.18px] border-[1.02px] border-[#4D4D4D] rounded-[8.14px] text-sm font-medium">
            Export
          </button>
          <button className="h-[43px] w-[124px] p-[10.18px] bg-[#EF4B41] text-white rounded-[8.14px] text-sm font-medium">
            Add Grade
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6 border border-gray-200">
        <div className="flex flex-row  gap-2">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search grades..."
              className="w-[250.35px] h-[48.46px] pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-sm"
            />
          </div>
          <select
            className="w-[90.14px] h-[48.46px] p-2 rounded-lg border border-gray-300 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            title="Sort Grades By"
          >
            <option value="">Sort By</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#E9F1FF] text-gray-600 font-semibold">
            <tr>
              <th className="py-3 px-4">NAME</th>
              <th className="py-3 px-4">DESCRIPTION</th>
              <th className="py-3 px-4 text-center">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredGrades.map((grade) => (
              <tr key={grade.id} className="h-[83.16px] border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="font-medium text-[22.55px] ">{grade.name}</div>
                </td>
                <td className="py-3 px-4">{grade.description}</td>
                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center gap-3">
                    <FaEdit 
                      className="text-gray-600 cursor-pointer hover:text-blue-600"
                    />
                    <FaTrash 
                      className="text-red-600 cursor-pointer hover:text-red-800"
                      onClick={() => handleDelete(grade.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}