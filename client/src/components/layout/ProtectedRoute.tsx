import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Center, Loader } from '@mantine/core';

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <Center h="calc(100vh - 60px)" style={{ marginTop: 60 }}>
        <Loader color="violet" size="lg" />
      </Center>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}