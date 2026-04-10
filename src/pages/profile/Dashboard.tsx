import { useEffect, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { fetchVehicles } from "../../store/actions/fleet-actions";
import { fetchRentalServiceList } from "../../store/actions/rental-actions";
import { fetchLeaderboard } from "../../store/actions/production-actions";
import { fleetActions } from "../../store/slices/fleet-slice";
import { rentalActions } from "../../store/slices/rental-slice";
import { productionActions } from "../../store/slices/production-slice";
import type { RootState } from "../../store";
import { TruckIcon, KeyIcon, CalendarDaysIcon, SparklesIcon } from "@heroicons/react/24/outline";

interface WeatherData {
  city: string;
  temp: number;
  description: string;
  icon: string;
}

const getWeatherDescription = (code: number): string => {
  if (code === 0) return "Clear sky";
  if (code <= 3) return "Partly cloudy";
  if (code <= 9) return "Foggy";
  if (code <= 29) return "Rain";
  if (code <= 49) return "Freezing rain";
  if (code <= 69) return "Rain";
  if (code <= 79) return "Snow";
  if (code <= 84) return "Rain showers";
  if (code <= 94) return "Thunderstorm";
  return "Stormy";
};

const getWeatherIcon = (code: number): string => {
  if (code === 0) return "☀️";
  if (code <= 3) return "⛅";
  if (code <= 9) return "🌫️";
  if (code <= 39) return "🌧️";
  if (code <= 79) return "❄️";
  if (code <= 84) return "🌦️";
  return "⛈️";
};

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

const Dashboard = () => {
  const dispatch = useAppDispatch();

  const token = useSelector((state: RootState) => state.user.token);
  const userName = useSelector((state: RootState) => state.user.userName);
  const vehicles = useSelector((state: RootState) => state.fleet.vehicles);
  const rentalServices = useSelector((state: RootState) => state.rental.rentalServices);
  const leaderboard = useSelector((state: RootState) => state.production.leaderboard);

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherError, setWeatherError] = useState(false);

  const totalVehicles = vehicles.length;
  const rentedVehicles = vehicles.filter((v) => v.isRented).length;
  const activeReservations = rentalServices.length;
  const cleanedToday = leaderboard.reduce((sum, entry) => sum + entry.count, 0);

  const fetcher = useCallback(() => {
    dispatch(fleetActions.resetVehicles());
    dispatch(rentalActions.resetRentalServices());
    dispatch(productionActions.resetDetailingServices());
    dispatch(fetchVehicles(token!));
    dispatch(fetchRentalServiceList(token!));
    dispatch(fetchLeaderboard(token!));
  }, [dispatch, token]);

  useEffect(() => {
    fetcher();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode&temperature_unit=fahrenheit`,
            );
            const data = await res.json();
            const temp = Math.round(data.current.temperature_2m);
            const code = data.current.weathercode;

            const geoRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            );
            const geoData = await geoRes.json();
            const city = geoData.address.city || geoData.address.town || geoData.address.village || "Your location";

            setWeather({ city, temp, description: getWeatherDescription(code), icon: getWeatherIcon(code) });
          } catch {
            setWeatherError(true);
          }
        },
        () => setWeatherError(true),
      );
    } else {
      setWeatherError(true);
    }
  }, []);

  const maxCount = leaderboard.length > 0 ? Math.max(...leaderboard.map((e) => e.count)) : 1;

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back, <span className="font-medium text-gray-700">{userName}</span>
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Vehicles"
          value={totalVehicles}
          sub="In inventory"
          icon={TruckIcon}
          accent="bg-indigo-600"
        />
        <StatCard
          title="Currently Rented"
          value={rentedVehicles}
          sub={`of ${totalVehicles} vehicles`}
          icon={KeyIcon}
          accent="bg-emerald-600"
        />
        <StatCard
          title="Active Reservations"
          value={activeReservations}
          sub="Ongoing bookings"
          icon={CalendarDaysIcon}
          accent="bg-amber-600"
        />
        <StatCard
          title="Cleaned Today"
          value={cleanedToday}
          sub="By all detailers"
          icon={SparklesIcon}
          accent="bg-sky-600"
        />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 flex-1">
        {/* Leaderboard chart */}
        <div className="xl:col-span-2 bg-gray-800 rounded-xl border border-gray-700 p-6 flex flex-col gap-4">
          <h2 className="text-base font-semibold text-white">Detailer Leaderboard — Today</h2>
          {leaderboard.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-gray-500">No detailing records for today yet.</p>
            </div>
          ) : (
            <>
              {/* Custom Bar Chart */}
              <div className="flex items-end gap-3 border-b border-gray-700" style={{ height: 180 }}>
                {leaderboard.map((entry) => (
                  <div
                    key={entry.name}
                    className="flex flex-col justify-end items-center gap-1 h-full"
                    style={{ minWidth: 48 }}
                  >
                    <span className="text-xs font-semibold text-gray-200">{entry.count}</span>
                    <div
                      className="w-10 rounded-t-lg bg-indigo-500 transition-all duration-300"
                      style={{ height: `${(entry.count / maxCount) * 140}px`, minHeight: 4 }}
                    />
                  </div>
                ))}
              </div>

              {/* X Axis labels */}
              <div className="flex gap-3">
                {leaderboard.map((entry) => (
                  <div key={entry.name} style={{ minWidth: 48 }} className="text-center">
                    <span className="text-xs text-gray-400 truncate block">{entry.name}</span>
                  </div>
                ))}
              </div>

              {/* Table */}
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-700">
                    <th className="pb-2 font-medium">Rank</th>
                    <th className="pb-2 font-medium">Detailer</th>
                    <th className="pb-2 font-medium text-right">Cars Cleaned</th>
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
            </>
          )}
        </div>

        {/* Weather */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 flex flex-col gap-4">
          <h2 className="text-base font-semibold text-white">Weather</h2>
          {weatherError ? (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-gray-500">Could not fetch weather data.</p>
            </div>
          ) : weather ? (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-400">{weather.city}</p>
              <div className="flex items-center gap-4">
                <span className="text-6xl">{weather.icon}</span>
                <div className="flex flex-col">
                  <span className="text-5xl font-bold text-white">{weather.temp}°F</span>
                  <span className="text-sm text-gray-400 capitalize mt-1">{weather.description}</span>
                </div>
              </div>
              <div className="mt-auto pt-4 border-t border-gray-700">
                <p className="text-xs text-gray-500">Based on your current location</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-gray-500">Fetching weather...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
