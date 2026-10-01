import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import FakeNews from './pages/FakeNews';
import ModelComparison from './pages/ModelComparison';
import AnalysisGraphs from './pages/AnalysisGraphs';
import Datasets from './pages/Datasets';
import Training from './pages/Training';
import History from './pages/History';
import About from './pages/About';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/fake-news" element={<FakeNews />} />
            <Route path="/models" element={<ModelComparison />} />
            <Route path="/analysis" element={<AnalysisGraphs />} />
            <Route path="/datasets" element={<Datasets />} />
            <Route path="/training" element={<Training />} />
            <Route path="/history" element={<History />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              border: '1px solid #334155',
            },
          }}
        />
      </Router>
    </QueryClientProvider>
  );
}
