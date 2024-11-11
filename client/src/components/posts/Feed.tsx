import React, { useEffect, useState } from 'react';
import { Container, Stack, Text, Loader, Center } from '@mantine/core';
import api from '../../services/api';
import { Post } from '../../types/post';
import PostCard from './PostCard';

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get<Post[]>('/posts/feed');
        setPosts(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return (
    <Center h="100vh">
      <Loader color="violet" size="lg" />
    </Center>
  );
  
  if (error) return (
    <Center h="100vh">
      <Text c="red" fw={500}>{error}</Text>
    </Center>
  );

  return (
    <Container size="sm" py="xl">
      <Stack gap="lg">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </Stack>
    </Container>
  );
}