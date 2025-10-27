import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Portfolio from './pages/Portfolio';
import Chat from './pages/Chat';

function AppContent() {
  const { isDark } = useTheme();

  useEffect(() => {
    document.documentElement.className = isDark ? 'dark' : 'light';
  }, [isDark]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
