import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Sessions from "./pages/Sessions";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
