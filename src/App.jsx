import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ActivityPage from "./pages/ActivityPage";
import FaqPage from "./pages/FaqPage";
import LegalPage from "./pages/LegalPage";
import PopupManager from "./components/PopupManager";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/atividades/:id" element={<ActivityPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/termos-condicoes" element={<LegalPage title="Termos e Condições" contentKey="terms_content" />} />
        <Route path="/politica-privacidade" element={<LegalPage title="Política de Privacidade" contentKey="privacy_content" />} />
        <Route path="/politica-cookies" element={<LegalPage title="Política de Cookies" contentKey="cookies_content" />} />
      </Routes>
      <PopupManager />
    </>
  );
}

export default App;
