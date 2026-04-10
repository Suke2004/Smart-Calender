import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Calendar from './components/Calendar/Calendar';
import AcademyModule from './components/Academy/AcademyModule';
import { GlobalDock } from './components/Global/GlobalDock';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen relative bg-surface">
        <Routes>
          <Route path="/" element={<Navigate to="/calendar" replace />} />
          <Route path="/calendar/*" element={<Calendar />} />
          <Route path="/academy/*" element={<AcademyModule />} />
        </Routes>
        <GlobalDock />
      </div>
    </BrowserRouter>
  );
}

