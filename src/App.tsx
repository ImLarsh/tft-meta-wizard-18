
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import CompEditor from './pages/CompEditor';
import CompEditExisting from './pages/CompEditExisting';
import SetManager from './pages/SetManager';
import NotFound from './pages/NotFound';
import { CompsProvider } from './contexts/CompsContext';
import { TFTDataProvider } from './contexts/TFTDataContext';
import { Toaster } from './components/ui/toaster';
import './App.css';

function App() {
  return (
    <CompsProvider>
      <TFTDataProvider>
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
      </TFTDataProvider>
    </CompsProvider>
  );
}

export default App;
