
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CompDetail from './pages/CompDetail';
import Index from './pages/Index';
import CompBuilder from './pages/CompBuilder';
import NotFound from './pages/NotFound';
import CompEditor from './pages/CompEditor';
import CompEditExisting from './pages/CompEditExisting';
import AuthCallback from './pages/AuthCallback';
import SetManager from './pages/SetManager';
import SetDetail from './pages/SetDetail';

import './App.css';
import { Toaster } from './components/ui/toaster';
import { CompsProvider } from './contexts/CompsContext';
import { AuthProvider } from './providers/AuthProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { ImageToggleProvider } from './contexts/ImageToggleContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CompsProvider>
          <ImageToggleProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/comp/:compId" element={<CompDetail />} />
                <Route path="/builder" element={<CompBuilder />} />
                <Route path="/create" element={<CompEditor />} />
                <Route path="/edit/:compId" element={<CompEditExisting />} />
                <Route path="/sets" element={<SetManager />} />
                <Route path="/sets/:setId" element={<SetDetail />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <Toaster />
          </ImageToggleProvider>
        </CompsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
