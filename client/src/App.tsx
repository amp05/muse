import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MantineProvider, createTheme, AppShell } from '@mantine/core';
import '@mantine/core/styles.css';
import Navbar from './components/layout/Navbar';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Feed from './components/posts/Feed';
import PostForm from './components/posts/PostForm';
import ProtectedRoute from './components/layout/ProtectedRoute';

const theme = createTheme({
  primaryColor: 'violet',
  colors: {
    violet: [
      '#f6f1ff',
      '#e6dbff',
      '#c4adff',
      '#a17dff',
      '#844dff',
      '#6d2aff',
      '#5c0fff',
      '#4d00e6',
      '#4000bf',
      '#340099',
    ],
  },
  fontFamily: 'Inter, sans-serif',
  defaultRadius: 'md',
});

function App() {
  return (
    <MantineProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <AppShell
            header={{ height: 60 }}
            padding="md"
          >
            <AppShell.Header>
              <Navbar />
            </AppShell.Header>

            <AppShell.Main>
              <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
                <Route path="/create" element={<ProtectedRoute><PostForm /></ProtectedRoute>} />
              </Routes>
            </AppShell.Main>
          </AppShell>
        </BrowserRouter>
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;