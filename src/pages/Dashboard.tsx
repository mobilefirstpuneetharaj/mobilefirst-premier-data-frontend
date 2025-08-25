import { useState } from "react";
import totalLeagueIcon from "../assets/dashboard-total-analytics-icons/dashboard-total-leagues.png";
import totalCompetitionIcon from "../assets/dashboard-total-analytics-icons/dashboard-total-competitions.png";
import registeredClubsIcon from "../assets/dashboard-total-analytics-icons/dashboard-registered-clubs.png";
import totalPlayersIcon from "../assets/dashboard-total-analytics-icons/dashboard-total-players.png";
import gamesAnalyzedIcon from "../assets/dashboard-total-analytics-icons/dashboard-games-analyzed.png";

import anaLyzedGamesIcon from "../assets/dashboard-weekly-summary-icons/dashboard-summary-games-analyzed.png";
import averageErrosIcon from "../assets/dashboard-weekly-summary-icons/dashboard-summary-average-errors.png";
import averageTurnaroundIcon from "../assets/dashboard-weekly-summary-icons/dashboard-summary-averarge-turnaround.png";
import { FaEdit, FaTrash } from "react-icons/fa";

const statCards = [
  { title: "Total Leagues", value: 2221, icon: totalLeagueIcon },
  { title: "Total Competitions", value: 2221, icon: totalCompetitionIcon },
  { title: "Registered Clubs", value: 2221, icon: registeredClubsIcon },
  { title: "Total Players", value: 2221, icon: totalPlayersIcon },
  { title: "Games Analyzed", value: 2221, icon: gamesAnalyzedIcon },
];

const weeklyStats = [
  { title: "Games Analyzed", value: 42, change: "+5.8", icon: anaLyzedGamesIcon },
  { title: "Average errors per game", value: 42, change: "+5.8", icon: averageErrosIcon },
  { title: "Average Turnaround Time", value: "3.5 hrs", change: "+5.8", icon: averageTurnaroundIcon },
];

const competitions = [
  { name: "Alberta Australian Football League", team: 20, grade: "Under 18", status: "Active" },
  { name: "Alberta Australian Football League", team: 20, grade: "Under 18", status: "Active" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"summary" | "competitions">("summary");

  return (
    <>
      {/* Stat Cards */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white px-1 py-2 rounded shadow text-center">
            <div className="flex flex-row justify-between items-center mb-2">
              <div className="text-left">
                <p className="text-xs md:text-sm text-gray-500 font-bold">{stat.title}</p>
                <p className="text-xs md:text-sm text-left font-bold">{stat.value}</p>
              </div>
              <div className="w-12 h-12 flex items-center justify-center rounded-full">
                <img src={stat.icon} alt={stat.title} className="w-12 h-12" />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Tabs */}
      <div className="mt-6 flex bg-white rounded-lg">
        <button
          onClick={() => setActiveTab("summary")}
          className={`py-3 px-4 ${
            activeTab === "summary"
              ? "bg-[#0b2447] rounded-t-lg text-white font-semibold"
              : "text-gray-500"
          }`}
        >
          Weekly Summary & Games Completed
        </button>
        <button
          onClick={() => setActiveTab("competitions")}
          className={`py-3 px-4 ${
            activeTab === "competitions"
              ? "bg-[#0b2447] rounded-t-lg text-white font-semibold"
              : "text-gray-500"
          }`}
        >
          List of Active Competition
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "summary" ? (
          <div className="w-1/2 bg-white rounded-lg shadow p-6 space-y-4">
            <div className="bg-[#E9F1FF] p-2">
              <h3 className="text-lg font-semibold text-[#0b2447] mb-2">Weekly Summary</h3>
              <p className="text-sm text-gray-500 mb-4">Performance metrics from the past week</p>
            </div>
            {weeklyStats.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 mb-3 bg-gray-50 rounded">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full">
                    <img src={item.icon} alt={item.title} className="h-12 w-12" />
                  </div>
                  <div>
                    <p className="text-xs md:text-lg font-semibold">{item.title}</p>
                    <p className="text-[10px] md:text-xs text-green-600">{item.change} from previous week</p>
                  </div>
                </div>
                <p className="text-sm md:text-lg font-bold">{item.value}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#E9F1FF] text-gray-600 font-semibold">
                <tr>
                  <th className="py-3 px-4">COMPETITION NAME</th>
                  <th className="py-3 px-4">TEAM</th>
                  <th className="py-3 px-4">GRADE</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4">MANAGE</th>
                </tr>
              </thead>
              <tbody>
                {competitions.map((c, i) => (
                  <tr key={i} className="h-[83.16px] border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold">{c.name}</td>
                    <td className="py-3 px-4">{c.team}</td>
                    <td className="py-3 px-4">{c.grade}</td>
                    <td className="py-3 px-4">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className='flex gap-3 text-center justify-center items-center'>
                        <FaEdit className="text-gray-600 cursor-pointer" />
                        <FaTrash className="text-red-600 cursor-pointer" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
