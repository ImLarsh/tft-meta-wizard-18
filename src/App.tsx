
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import CompEditor from './pages/CompEditor';
import CompEditExisting from './pages/CompEditExisting';
import SetManager from './pages/SetManager';
import AuthCallback from './pages/AuthCallback';
import NotFound from './pages/NotFound';
import { CompsProvider } from './contexts/CompsContext';
import { Toaster } from './components/ui/toaster';
import { ThemeProvider } from './providers/ThemeProvider';
import { AuthProvider } from './providers/AuthProvider';
import { ImageToggleProvider } from './contexts/ImageToggleContext';
import ParticlesBackground from './components/ParticlesBackground';
import './App.css';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CompsProvider>
          <ImageToggleProvider>
            <ParticlesBackground />
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/create" element={<CompEditor />} />
                <Route path="/edit/:compId" element={<CompEditExisting />} />
                <Route path="/sets" element={<SetManager />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
            <Toaster />
          </ImageToggleProvider>
        </CompsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
