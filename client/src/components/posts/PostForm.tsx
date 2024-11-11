import { TextInput, Container, Button, Paper, Title, Stack, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface PostFormValues {
  caption: string;
  songs: {
    title: string;
    artist: string;
  }[];
}

export default function PostForm() {
  const navigate = useNavigate();
  
  const form = useForm<PostFormValues>({
    initialValues: {
      caption: '',
      songs: [{ title: '', artist: '' }],
    },
    validate: {
      songs: {
        title: (value) => (!value ? 'Title is required' : null),
        artist: (value) => (!value ? 'Artist is required' : null),
      },
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

  const addSong = () => {
    form.insertListItem('songs', { title: '', artist: '' });
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
            
            {form.values.songs.map((_, index) => (
              <Paper key={index} withBorder p="md">
                <Stack>
                  <TextInput
                    label="Song Title"
                    required
                    {...form.getInputProps(`songs.${index}.title`)}
                  />
                  <TextInput
                    label="Artist"
                    required
                    {...form.getInputProps(`songs.${index}.artist`)}
                  />
                </Stack>
              </Paper>
            ))}
            
            <Button type="button" variant="outline" onClick={addSong}>
              Add Another Song
            </Button>
            
            <Button type="submit" mt="xl">
              Create Post
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}