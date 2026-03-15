import { JobsProvider } from "./context/JobsContext";
import { Dashboard } from "./pages/Dashboard";

export default function App() {
  return (
    <JobsProvider>
      <Dashboard />
    </JobsProvider>
  );
}
