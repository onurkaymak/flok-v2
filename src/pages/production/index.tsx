import { useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { fetchLeaderboard } from "../../store/actions/production-actions";
import { productionActions } from "../../store/slices/production-slice";
import type { RootState } from "../../store";
import { TruckIcon, KeyIcon } from "@heroicons/react/24/outline";

// ─── Seeded Data ───────────────────────────────────────────────────────────────

const SEEDED_RENTALS_TODAY = 732;
const SEEDED_RETURNS_TODAY = 940;

const SEEDED_WEEKLY: {
  name: string;
  mon: number;
  tue: number;
  wed: number;
  thu: number;
  fri: number;
  sat: number;
  sun: number;
}[] = [
  { name: "James Caldwell", mon: 52, tue: 48, wed: 54, thu: 50, fri: 53, sat: 47, sun: 49 },
  { name: "Sara Mitchell", mon: 45, tue: 50, wed: 47, thu: 52, fri: 48, sat: 44, sun: 46 },
  { name: "Mike Torres", mon: 38, tue: 42, wed: 40, thu: 44, fri: 39, sat: 36, sun: 41 },
  { name: "Ashley Brooks", mon: 35, tue: 38, wed: 36, thu: 40, fri: 37, sat: 33, sun: 34 },
  { name: "Daniel Nguyen", mon: 51, tue: 47, wed: 53, thu: 49, fri: 55, sat: 46, sun: 50 },
  { name: "Rachel Kim", mon: 30, tue: 33, wed: 28, thu: 35, fri: 31, sat: 27, sun: 29 },
  { name: "Chris Patel", mon: 43, tue: 46, wed: 44, thu: 48, fri: 42, sat: 40, sun: 45 },
  { name: "Megan Foster", mon: 22, tue: 25, wed: 24, thu: 27, fri: 23, sat: 20, sun: 21 },
  { name: "Jordan Ellis", mon: 49, tue: 53, wed: 51, thu: 54, fri: 50, sat: 48, sun: 52 },
  { name: "Taylor Grant", mon: 32, tue: 29, wed: 34, thu: 31, fri: 33, sat: 28, sun: 30 },
  { name: "Brandon Lee", mon: 26, tue: 30, wed: 28, thu: 32, fri: 27, sat: 24, sun: 25 },
  { name: "Natalie Cruz", mon: 47, tue: 44, wed: 49, thu: 46, fri: 48, sat: 43, sun: 45 },
  { name: "Kevin Sanders", mon: 36, tue: 39, wed: 37, thu: 41, fri: 38, sat: 34, sun: 35 },
  { name: "Olivia Hayes", mon: 21, tue: 24, wed: 22, thu: 26, fri: 23, sat: 20, sun: 22 },
  { name: "Marcus Webb", mon: 54, tue: 51, wed: 55, thu: 53, fri: 52, sat: 49, sun: 50 },
  { name: "Stephanie Moore", mon: 40, tue: 43, wed: 41, thu: 45, fri: 42, sat: 38, sun: 39 },
  { name: "Aaron Price", mon: 28, tue: 31, wed: 29, thu: 33, fri: 30, sat: 26, sun: 27 },
  { name: "Brianna Scott", mon: 44, tue: 47, wed: 45, thu: 49, fri: 46, sat: 42, sun: 43 },
];

// ─── Shared Components ────────────────────────────────────────────────────────

const StatCard = ({
  title,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  title: string;
  value: number | string;
  sub?: string;
  icon: React.ElementType;
  accent: string;
}) => (
  <div className="bg-gray-800 rounded-xl p-5 flex flex-col gap-3 border border-gray-700">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-400">{title}</p>
      <div className={`p-2 rounded-lg ${accent}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
    <p className="text-4xl font-bold text-white">{value}</p>
    {sub && <p className="text-xs text-gray-500">{sub}</p>}
  </div>
);

const LeaderboardCard = ({ leaderboard }: { leaderboard: { name: string; count: number }[] }) => (
  <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 flex flex-col gap-4">
    <h2 className="text-base font-semibold text-white">Today's leaderboard</h2>
    {leaderboard.length === 0 ? (
      <p className="text-sm text-gray-500">No detailing records for today yet.</p>
    ) : (
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-700">
            <th className="pb-2 font-medium">Rank</th>
            <th className="pb-2 font-medium">Detailer</th>
            <th className="pb-2 font-medium text-right">Cars cleaned</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {leaderboard.map((entry, index) => (
            <tr key={entry.name}>
              <td className="py-2 text-gray-500">#{index + 1}</td>
              <td className="py-2 font-medium text-gray-200">{entry.name}</td>
              <td className="py-2 text-right font-semibold text-indigo-400">{entry.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

// ─── Role Views ───────────────────────────────────────────────────────────────

const ManagerView = ({ leaderboard }: { leaderboard: { name: string; count: number }[] }) => {
  const weeklyWithTotals = SEEDED_WEEKLY.map((row) => ({
    ...row,
    total: row.mon + row.tue + row.wed + row.thu + row.fri + row.sat + row.sun,
  })).sort((a, b) => b.total - a.total);

  return (
    <div className="flex flex-col gap-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Rentals today"
          value={SEEDED_RENTALS_TODAY}
          sub="New bookings"
          icon={KeyIcon}
          accent="bg-emerald-600"
        />
        <StatCard
          title="Returns today"
          value={SEEDED_RETURNS_TODAY}
          sub="Vehicles returned"
          icon={TruckIcon}
          accent="bg-indigo-600"
        />
      </div>

      {/* Leaderboard */}
      <LeaderboardCard leaderboard={leaderboard} />

      {/* Weekly Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 flex flex-col gap-4">
        <h2 className="text-base font-semibold text-white">This week</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-700">
                <th className="pb-2 font-medium pr-4">Detailer</th>
                <th className="pb-2 font-medium text-center">Mon</th>
                <th className="pb-2 font-medium text-center">Tue</th>
                <th className="pb-2 font-medium text-center">Wed</th>
                <th className="pb-2 font-medium text-center">Thu</th>
                <th className="pb-2 font-medium text-center">Fri</th>
                <th className="pb-2 font-medium text-center">Sat</th>
                <th className="pb-2 font-medium text-center">Sun</th>
                <th className="pb-2 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {weeklyWithTotals.map((row) => (
                <tr key={row.name}>
                  <td className="py-2 font-medium text-gray-200 pr-4">{row.name}</td>
                  <td className="py-2 text-center text-gray-400">{row.mon}</td>
                  <td className="py-2 text-center text-gray-400">{row.tue}</td>
                  <td className="py-2 text-center text-gray-400">{row.wed}</td>
                  <td className="py-2 text-center text-gray-400">{row.thu}</td>
                  <td className="py-2 text-center text-gray-400">{row.fri}</td>
                  <td className="py-2 text-center text-gray-400">{row.sat}</td>
                  <td className="py-2 text-center text-gray-400">{row.sun}</td>
                  <td className="py-2 text-right font-semibold text-indigo-400">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const DetailerView = ({ leaderboard }: { leaderboard: { name: string; count: number }[] }) => (
  <LeaderboardCard leaderboard={leaderboard} />
);

// ─── Main Component ───────────────────────────────────────────────────────────

const Production = () => {
  const dispatch = useAppDispatch();
  const token = useSelector((state: RootState) => state.user.token);
  const userRole = useSelector((state: RootState) => state.user.userRole);
  const leaderboard = useSelector((state: RootState) => state.production.leaderboard);

  const fetcher = useCallback(() => {
    dispatch(productionActions.resetDetailingServices());
    dispatch(fetchLeaderboard(token!));
  }, [dispatch, token]);

  useEffect(() => {
    fetcher();
  }, []);

  return (
    <div className="flex flex-col h-full gap-6 w-full xl:max-w-screen-xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Production</h1>
        <p className="text-gray-500 mt-1">Detailing activity overview</p>
      </div>

      {userRole === "MANAGER" ? <ManagerView leaderboard={leaderboard} /> : <DetailerView leaderboard={leaderboard} />}
    </div>
  );
};

export default Production;
