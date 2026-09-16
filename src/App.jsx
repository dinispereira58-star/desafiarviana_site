import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ActivityPage from "./pages/ActivityPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/atividades/:id" element={<ActivityPage />} />
    </Routes>
  );
}

export default App;
