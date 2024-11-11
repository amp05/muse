import React, { useState, useEffect } from 'react';
import { TextInput, Loader, Paper, Group, Text, Image, Stack } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import api from '../../services/api';
import { Song } from '../../types/post';

interface SongSearchProps {
  onSelect: (song: Song) => void;
}

export default function SongSearch({ onSelect }: SongSearchProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 300);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Song[]>([]);

  const searchSongs = async (searchQuery: string) => {
    if (!searchQuery) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.get<Song[]>(`/spotify/search?query=${encodeURIComponent(searchQuery)}`);
      setResults(data);
    } catch (error) {
      console.error('Failed to search songs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchSongs(debouncedQuery);
  }, [debouncedQuery]);

  return (
    <Stack>
      <TextInput
        placeholder="Search for a song..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        leftSection={<IconSearch size={16} />}
        rightSection={loading && <Loader size="xs" />}
      />
      
      {results.length > 0 && (
        <Paper withBorder shadow="sm">
          <Stack>
            {results.map((song) => (
              <Group
                key={song.id}
                p="xs"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  onSelect(song);
                  setQuery('');
                  setResults([]);
                }}
              >
                <Image
                  src={song.albumArt}
                  alt={song.title}
                  width={40}
                  height={40}
                  radius="sm"
                  fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z'/%3E%3C/svg%3E"
                />
                <div style={{ flex: 1 }}>
                  <Text size="sm" fw={500} lineClamp={1}>
                    {song.title}
                  </Text>
                  <Text size="xs" c="dimmed" lineClamp={1}>
                    {song.artist}
                  </Text>
                </div>
              </Group>
            ))}
          </Stack>
        </Paper>
      )}
    </Stack>
  );
}