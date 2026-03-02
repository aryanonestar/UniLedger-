import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { VerifierPortal } from './pages/VerifierPortal';
import { NotFound } from './pages/NotFound';
import { ChatWidget } from './components/ai_chatbot/ChatWidget';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="student" element={<StudentDashboard />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="verify" element={<VerifierPortal />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <ChatWidget />
    </>
  );
}

export default App;

