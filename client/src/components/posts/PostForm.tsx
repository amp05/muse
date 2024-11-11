import { Container, Button, Paper, Title, Stack, Textarea, Group, Image, ActionIcon, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import SongSearch from './SongSearch';
import { Song } from '../../types/post';
import { IconTrash } from '@tabler/icons-react';

interface PostFormValues {
  caption: string;
  songs: Song[];
}

export default function PostForm() {
  const navigate = useNavigate();
  
  const form = useForm<PostFormValues>({
    initialValues: {
      caption: '',
      songs: [],
    },
    validate: {
      songs: (value) => (value.length === 0 ? 'At least one song is required' : null),
    },
  });

  const handleSubmit = async (values: PostFormValues) => {
    try {
      await api.post('/posts', values);
      navigate('/');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleSongSelect = (song: Song) => {
    form.setFieldValue('songs', [...form.values.songs, song]);
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
            
            <Button type="submit" mt="xl">
              Create Post
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}