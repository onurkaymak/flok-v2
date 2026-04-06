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

interface WeatherData {
  city: string;
  temp: number;
  description: string;
  icon: string;
}

const StatCard = ({ title, value, sub }: { title: string; value: number | string; sub?: string }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-2">
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <p className="text-4xl font-bold text-gray-900">{value}</p>
    {sub && <p className="text-xs text-gray-400">{sub}</p>}
  </div>
);

const Dashboard = () => {
  const dispatch = useAppDispatch();

  const token = useSelector((state: RootState) => state.user.token);
  const name = useSelector((state: RootState) => state.user.userName);
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

    // Fetch weather using browser geolocation
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

            // Reverse geocode city name
            const geoRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            );
            const geoData = await geoRes.json();
            const city = geoData.address.city || geoData.address.town || geoData.address.village || "Your location";

            setWeather({
              city,
              temp,
              description: getWeatherDescription(code),
              icon: getWeatherIcon(code),
            });
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

  const getWeatherDescription = (code: number): string => {
    if (code === 0) return "Clear sky";
    if (code <= 3) return "Partly cloudy";
    if (code <= 9) return "Foggy";
    if (code <= 19) return "Drizzle";
    if (code <= 29) return "Rain";
    if (code <= 39) return "Snow";
    if (code <= 49) return "Freezing rain";
    if (code <= 59) return "Drizzle";
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

  return (
    <div className="flex flex-col gap-8 w-full xl:max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-5xl font-semibold text-center text-gray-900 w-full">Welcome, {name}</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Vehicles" value={totalVehicles} sub="In inventory" />
        <StatCard title="Currently Rented" value={rentedVehicles} sub={`of ${totalVehicles} vehicles`} />
        <StatCard title="Active Reservations" value={activeReservations} />
        <StatCard title="Cleaned Today" value={cleanedToday} sub="By all detailers" />
      </div>

      {/* Leaderboard + Weather */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Leaderboard */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Detailer Leaderboard — Today</h2>
          {leaderboard.length === 0 ? (
            <p className="text-sm text-gray-400">No detailing records for today yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Rank</th>
                  <th className="pb-3 font-medium">Detailer</th>
                  <th className="pb-3 font-medium text-right">Cars Cleaned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leaderboard.map((entry, index) => (
                  <tr key={entry.name} className="py-2">
                    <td className="py-3 text-gray-400">#{index + 1}</td>
                    <td className="py-3 font-medium text-gray-900">{entry.name}</td>
                    <td className="py-3 text-right font-semibold text-indigo-600">{entry.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Weather */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Weather</h2>
          {weatherError ? (
            <p className="text-sm text-gray-400">Could not fetch weather data.</p>
          ) : weather ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-gray-500">{weather.city}</p>
              <div className="flex items-center gap-3">
                <span className="text-5xl">{weather.icon}</span>
                <span className="text-5xl font-bold text-gray-900">{weather.temp}°F</span>
              </div>
              <p className="text-sm text-gray-500 capitalize">{weather.description}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-400">Fetching weather...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
