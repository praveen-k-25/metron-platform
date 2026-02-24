import Analytics from "@/modules/analytics/pages/Analytics";
import Auth from "@/modules/auth/pages/Auth";
import Dashboard from "@/modules/dashboard/pages/dashboard";
import IdleReport from "@/modules/reports/pages/IdleReport";
import InactiveReport from "@/modules/reports/pages/InactiveReport";
import PlaybackReport from "@/modules/reports/pages/PlaybackReport";
import TripReport from "@/modules/reports/pages/TripReport";
import ProtectedRoutes from "@/routes/ProtectedRoutes";
import Navigator from "@/shared/components/Partials/Navigators/Navigators";
import useTheme from "@/shared/hooks/useTheme";
import NotFound from "@/shared/pages/NotFound";
import { FC } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";

const App: FC = () => {
  const [] = useTheme();

  return (
    <section id="App-Section" className="font-geist">
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route element={<ProtectedRoutes />}>
          <Route element={<Navigator />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />

            {/* Reports */}
            <Route path="/tripReport" element={<TripReport />} />
            <Route path="/idleReport" element={<IdleReport />} />
            <Route path="/inactiveReport" element={<InactiveReport />} />
            <Route path="/playbackReport" element={<PlaybackReport />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
      <Toaster
        position="top-right"
        containerStyle={{ fontSize: "12px" }}
        reverseOrder={false}
      />
    </section>
  );
};

export default App;
