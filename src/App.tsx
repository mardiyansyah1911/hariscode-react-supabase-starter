import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Hero } from "./components/ui/animated-hero";
import { ProblemSolvingPage } from './components/problem-solving/ProblemSolvingPage';
import { Toaster } from 'sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/problems/:problemId" element={<ProblemSolvingPage />} />
          </Routes>
          <Toaster
            position="top-right"
            expand={false}
            richColors
            closeButton
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}
