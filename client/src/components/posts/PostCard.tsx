import { Paper, Text, Stack, Group, Avatar, ActionIcon, Divider, Badge } from '@mantine/core';
import { IconHeart, IconMessageCircle, IconShare } from '@tabler/icons-react';
import { Post } from '../../types/post';
import { formatDate } from '../../utils/date';

export default function PostCard({ post }: { post: Post }) {
  return (
    <Paper withBorder shadow="xs" radius="md" p={0}>
      <Stack gap={0}>
        {/* Header */}
        <Group p="md" justify="space-between">
          <Group>
            <Avatar color="violet" radius="xl" size="md">
              {post.user.username[0].toUpperCase()}
            </Avatar>
            <div>
              <Text fw={500} size="sm">{post.user.username}</Text>
              <Text size="xs" c="dimmed">{formatDate(post.createdAt)}</Text>
            </div>
          </Group>
        </Group>

        {/* Caption */}
        {post.caption && (
          <Text size="sm" p="md" pb="xs">
            {post.caption}
          </Text>
        )}

        {/* Songs */}
        <Stack gap="xs" px="md" pb="md">
          {post.songs.map((song) => (
            <Paper 
              key={song.id} 
              withBorder 
              p="md" 
              bg="gray.0"
              radius="md"
            >
              <Group wrap="nowrap">
                {song.albumArt ? (
                  <img 
                    src={song.albumArt} 
                    alt={`${song.title} album art`}
                    style={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: 8,
                      objectFit: 'cover' 
                    }}
                  />
                ) : (
                  <div 
                    style={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: 8,
                      background: 'linear-gradient(45deg, #e6dbff, #c4adff)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    🎵
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <Text fw={500} size="sm" lineClamp={1}>
                    {song.title}
                  </Text>
                  <Text size="xs" c="dimmed" lineClamp={1}>
                    {song.artist}
                  </Text>
                </div>
                <Badge variant="light" color="violet">
                  Song
                </Badge>
              </Group>
            </Paper>
          ))}
        </Stack>

        {/* Vibes */}
        {post.vibes && post.vibes.length > 0 && (
          <Group gap="xs" px="md" pb="md">
            {post.vibes
              .filter(vibe => vibe.useCount >= 3)
              .map((vibe) => (
                <Badge 
                  key={vibe.word} 
                  variant="light" 
                  color="grape"
                  radius="xl"
                >
                  {vibe.word}
                </Badge>
              ))}
          </Group>
        )}

        {/* Actions */}
        <Divider />
        <Group p="xs" justify="space-around">
          <ActionIcon variant="subtle" color="gray" size="lg">
            <IconHeart size={20} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="gray" size="lg">
            <IconMessageCircle size={20} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="gray" size="lg">
            <IconShare size={20} />
          </ActionIcon>
        </Group>
      </Stack>
    </Paper>
  );
}