import { Container, Group, Button, Text, Avatar, Menu, ActionIcon, rem } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { IconPlus, IconUser, IconLogout, IconSettings } from '@tabler/icons-react';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Container size="xl" h="100%">
      <Group justify="space-between" h="100%">
        <Text 
          component={Link} 
          to="/" 
          size="xl" 
          fw={700}
          gradient={{ from: 'violet', to: 'grape' }}
          variant="gradient"
        >
          Muse
        </Text>
        
        {user ? (
          <Group>
            <Button
              component={Link}
              to="/create"
              variant="light"
              leftSection={<IconPlus size={16} />}
              radius="xl"
            >
              Share Music
            </Button>
            
            <Menu shadow="md" width={200} position="bottom-end">
              <Menu.Target>
                <ActionIcon size="lg" variant="subtle" radius="xl">
                  <Avatar 
                    radius="xl" 
                    color="violet" 
                  >
                    {user.username[0].toUpperCase()}
                  </Avatar>
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item leftSection={<IconUser size={rem(14)} />}>
                  Profile
                </Menu.Item>
                <Menu.Item leftSection={<IconSettings size={rem(14)} />}>
                  Settings
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item 
                  color="red" 
                  leftSection={<IconLogout size={rem(14)} />}
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        ) : (
          <Group>
            <Button component={Link} to="/login" variant="subtle">
              Login
            </Button>
            <Button component={Link} to="/register" gradient={{ from: 'violet', to: 'grape' }} variant="gradient">
              Register
            </Button>
          </Group>
        )}
      </Group>
    </Container>
  );
}