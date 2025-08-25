import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { FiSettings } from 'react-icons/fi';
import { MdOutlineMessage } from 'react-icons/md';
import { FaBell, FaEnvelope, FaChevronDown } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';
import avatar from '../assets/avatar.png';
import { useState } from 'react';

// Sidebar icons
import dashboardIcon from '../assets/sidebar-icons/dashboard.png';
import leagueIcon from '../assets/sidebar-icons/league.png';
import competitionsIcon from '../assets/sidebar-icons/competitions.png';
import teamsIcon from '../assets/sidebar-icons/teams.png';
import playersIcon from '../assets/sidebar-icons/players.png';
import clubsIcon from '../assets/sidebar-icons/clubs.png';
import gradesIcon from '../assets/sidebar-icons/grades.png';
import fixturesIcon from '../assets/sidebar-icons/fixtures.png';
import costAnalysisIcon from '../assets/sidebar-icons/cost-analysis.png';
import sportsManagementIcon from '../assets/sidebar-icons/sports-management.png';

const SidebarItem = ({
  label,
  to,
  icon,
  Icon,
}: {
  label: string;
  to: string;
  icon?: string;
  Icon?: React.ElementType;
}) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2 rounded cursor-pointer ${
        isActive
          ? "bg-white text-[#0b2447] font-semibold"
          : "hover:bg-white hover:text-[#0b2447]"
      }`
    }
  >
    {icon && <img src={icon} alt={`${label} icon`} className="w-5 h-5" />}
    {Icon && <Icon className="w-5 h-5" />}
    <span>{label}</span>
  </NavLink>
);

export default function MainLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center bg-[#0b2447] text-white px-6 py-4 relative">
        <img src={logo} alt="Logo" className="h-8" />
        <div className="flex items-center gap-6">
          <button className="bg-red-500 px-4 py-1 rounded">Soccer ▼</button>
          <FaBell className="text-xl cursor-pointer" />
          <FaEnvelope className="text-xl cursor-pointer" />
          
          {/* Custom Dropdown */}
          <div className="relative">
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={toggleDropdown}
            >
              <span>{user?.firstName} {user?.lastName}</span>
              <img 
                src={avatar} 
                alt="User" 
                className="w-8 h-8 rounded-full" 
              />
              <FaChevronDown className={`text-xs transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
            </div>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={() => {
                    navigate('/settings');
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile Settings
                </button>
                <div className="border-t border-gray-200"></div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-[#0b2447] text-white flex flex-col p-4">
          <nav className="flex flex-col space-y-3">
            <SidebarItem label="Dashboard" to="/dashboard" icon={dashboardIcon} />
            <SidebarItem label="League" to="/leagues" icon={leagueIcon} />
            <SidebarItem label="Competitions" to="/competitions" icon={competitionsIcon} />
            <SidebarItem label="Teams" to="/teams" icon={teamsIcon} />
            <SidebarItem label="Players" to="/players" icon={playersIcon} />
            <SidebarItem label="Clubs" to="/clubs" icon={clubsIcon} />
            <SidebarItem label="Grades" to="/grades" icon={gradesIcon} />
            <SidebarItem label="Fixtures" to="/fixtures" icon={fixturesIcon} />
            <SidebarItem label="Cost Analysis" to="/cost-analysis" icon={costAnalysisIcon} />
            <SidebarItem label="Sports Management" to="/sports-management" icon={sportsManagementIcon} />
            <SidebarItem label="Message" to="/message" Icon={MdOutlineMessage} />
            <SidebarItem label="Settings" to="/settings" Icon={FiSettings} />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}