import Analytics from "@/modules/analytics/pages/Analytics";
import Auth from "@/modules/auth/pages/Auth";
import Dashboard from "@/modules/dashboard/pages/dashboard";
import Navigator from "@/shared/components/Partials/Navigators/Navigators";
import useTheme from "@/shared/hooks/useTheme";
import NotFound from "@/shared/pages/NotFound";
import { FC } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./routes/ProtectedRoutes";

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
