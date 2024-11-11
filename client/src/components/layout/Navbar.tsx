import { AppShell, Container, Group, Button, Text } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppShell header={{ height: 60 }}>
      <Container size="xl" h="100%">
        <Group justify="space-between" h="100%">
          <Text component={Link} to="/" size="xl" fw={700}>
            Muse
          </Text>
          <Group>
            {user ? (
              <>
                <Button component={Link} to="/create" variant="light">
                  Create Post
                </Button>
                <Button onClick={handleLogout} variant="subtle" color="red">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button component={Link} to="/login" variant="subtle">
                  Login
                </Button>
                <Button component={Link} to="/register">
                  Register
                </Button>
              </>
            )}
          </Group>
        </Group>
      </Container>
    </AppShell>
  );
}