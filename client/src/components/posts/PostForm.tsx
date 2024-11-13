import { Container, Button, Paper, Title, Stack, Textarea, Group, Image, ActionIcon, Text, Badge } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import SongSearch from './SongSearch';
import { Song } from '../../types/post';
import { IconTrash, IconX } from '@tabler/icons-react';
import VibeSelect from './VibeSelect';

interface PostFormValues {
  caption: string;
  songs: Song[];
  vibes: string[];
}

export default function PostForm() {
  const navigate = useNavigate();
  
  const form = useForm<PostFormValues>({
    initialValues: {
      caption: '',
      songs: [],
      vibes: [],
    },
    validate: {
      songs: (value) => (value.length === 0 ? 'At least one song is required' : null),
      vibes: (value) => (value.length === 0 ? 'At least one vibe is required' : null),
    },
  });

  const handleSubmit = async (values: PostFormValues) => {
    try {
      if (values.songs.length === 0) {
        form.setFieldError('songs', 'At least one song is required');
        return;
      }
      if (values.vibes.length === 0) {
        form.setFieldError('vibes', 'At least one vibe is required');
        return;
      }

      await api.post('/posts', {
        caption: values.caption,
        songs: values.songs,
        vibes: values.vibes,
      });
      navigate('/');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleSongSelect = (song: Song) => {
    form.setFieldValue('songs', [...form.values.songs, song]);
  };

  const handleVibeSelect = (vibe: string) => {
    form.setFieldValue('vibes', [...form.values.vibes, vibe]);
  };

  const handleVibeRemove = (index: number) => {
    const newVibes = [...form.values.vibes];
    newVibes.splice(index, 1);
    form.setFieldValue('vibes', newVibes);
  };

  return (
    <Container size={720} my={40}>
      <Title ta="center">Create a Post</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Textarea
              label="Caption"
              placeholder="Share your thoughts..."
              {...form.getInputProps('caption')}
            />
            
            <SongSearch onSelect={handleSongSelect} />
            
            {form.values.songs.map((song, index) => (
              <Paper key={song.id} withBorder p="md">
                <Group justify="apart">
                  <Group>
                    <Image
                      src={song.albumArt}
                      width={48}
                      height={48}
                      radius="sm"
                      alt={song.title}
                    />
                    <div>
                      <Text size="sm" fw={500}>
                        {song.title}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {song.artist}
                      </Text>
                    </div>
                  </Group>
                  <ActionIcon
                    color="red"
                    variant="subtle"
                    onClick={() => {
                      const newSongs = [...form.values.songs];
                      newSongs.splice(index, 1);
                      form.setFieldValue('songs', newSongs);
                    }}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Paper>
            ))}
            
            <VibeSelect 
              onSelect={handleVibeSelect} 
              selectedVibes={form.values.vibes} 
            />

            <Group gap="xs">
              {form.values.vibes.map((vibe, index) => (
                <Badge
                  key={index}
                  variant="light"
                  color="grape"
                  radius="xl"
                  rightSection={
                    <ActionIcon
                      size="xs"
                      radius="xl"
                      variant="transparent"
                      onClick={() => handleVibeRemove(index)}
                    >
                      <IconX size={10} />
                    </ActionIcon>
                  }
                >
                  {vibe}
                </Badge>
              ))}
            </Group>

            {form.errors.vibes && (
              <Text size="sm" c="red">
                {form.errors.vibes}
              </Text>
            )}
            
            <Button type="submit" mt="xl">
              Create Post
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}