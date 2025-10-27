import { Routes, Route, Link } from "react-router-dom";
import FireBaseTest from "./solarpanelandbatt";
import FirsTest from "./first_test";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function App() {
  return (
    <Routes>
      {/* Home page route (only this one has the nav) */}
      <Route
        path="/"
        element={
          <div>
            <nav>
              <Stack gap={5} textAlign={"left"}>
                <Typography variant="h4" gutterBottom color="aqua">
                  Menu:
                </Typography>
                <Link to="/firebase">| Battery with solar panel</Link>
                <Link to="/solo_battery">| Solo battery test</Link>
                <Link to="/combined">| Combined tests </Link>
                <Link to="/">| Coming Soon: Solar panel with Diode Test </Link>
              </Stack>
            </nav>
          </div>
        }
      />

      {/* Other pages */}
      <Route path="/firebase" element={<FireBaseTest />} />
      <Route path="/solo_battery" element={<FirsTest />} />
      {/* COMBINED */}
      <Route path="/combined" element={<FirsTest />} />
    </Routes>
  );
}
