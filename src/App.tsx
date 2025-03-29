
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import CompEditor from './pages/CompEditor';
import CompEditExisting from './pages/CompEditExisting';
import SetManager from './pages/SetManager';
import NotFound from './pages/NotFound';
import { CompsProvider } from './contexts/CompsContext';
import { Toaster } from './components/ui/toaster';
import { ThemeProvider } from './providers/ThemeProvider';
import { ChampionSetProvider } from './providers/ChampionSetProvider';
import ParticlesBackground from './components/ParticlesBackground';
import './App.css';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <ChampionSetProvider>
        <CompsProvider>
          <ParticlesBackground />
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/create" element={<CompEditor />} />
              <Route path="/edit/:compId" element={<CompEditExisting />} />
              <Route path="/sets" element={<SetManager />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </CompsProvider>
      </ChampionSetProvider>
    </ThemeProvider>
  );
}

export default App;
