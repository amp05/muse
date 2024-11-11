import { Paper, Text, Stack, Group, Avatar } from '@mantine/core';
import { Post } from '../../types/post';
import { formatDate } from '../../utils/date';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Paper withBorder p="md" radius="md">
      <Stack>
        <Group>
          <Avatar color="blue" radius="xl">
            {post.user.username[0].toUpperCase()}
          </Avatar>
          <div>
            <Text fw={500}>{post.user.username}</Text>
            <Text size="sm" c="dimmed">
              {formatDate(post.createdAt)}
            </Text>
          </div>
        </Group>

        {post.caption && (
          <Text size="sm">{post.caption}</Text>
        )}

        <Stack gap="xs">
          {post.songs.map((song) => (
            <Paper key={song.id} withBorder p="sm" bg="gray.0">
              <Group justify="space-between">
                <div>
                  <Text fw={500}>{song.title}</Text>
                  <Text size="sm" c="dimmed">{song.artist}</Text>
                </div>
                {song.albumArt && (
                  <img 
                    src={song.albumArt} 
                    alt={`${song.title} album art`}
                    style={{ width: 48, height: 48, objectFit: 'cover' }}
                  />
                )}
              </Group>
            </Paper>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}