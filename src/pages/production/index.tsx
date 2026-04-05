import { useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { fetchLeaderboard } from "../../store/actions/production-actions";
import { productionActions } from "../../store/slices/production-slice";
import type { RootState } from "../../store";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const Production = () => {
  const dispatch = useAppDispatch();
  const token = useSelector((state: RootState) => state.user.token);
  const userId = useSelector((state: RootState) => state.user.userId);
  const userName = useSelector((state: RootState) => state.user.userName);
  const leaderboard = useSelector((state: RootState) => state.production.leaderboard);

  const fetcher = useCallback(() => {
    dispatch(productionActions.resetDetailingServices());
    dispatch(fetchLeaderboard(token!));
  }, [dispatch, token]);

  useEffect(() => {
    fetcher();
  }, []);

  return (
    <div className="flex flex-col h-full gap-8 w-full xl:max-w-screen-xl mx-auto">
      <h1 className="text-5xl font-semibold text-center text-gray-900">Detailings</h1>

      {leaderboard.length === 0 ? (
        <div className="flex items-center justify-center flex-1">
          <p className="text-gray-500 text-sm">No detailing records for today yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-500 text-center">Cars cleaned today</p>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={leaderboard} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {leaderboard.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.name === userName ? "#4f46e5" : "#94a3b8"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="flex items-center gap-4 justify-center text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-indigo-600" />
              <span>You ({userName})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-slate-400" />
              <span>Other detailers</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Production;
