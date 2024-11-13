import { useState, useEffect } from 'react';
import { TextInput, Group, Stack, Text, Badge } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import api from '../../services/api';

interface VibeSelectProps {
  onSelect: (vibe: string) => void;
  selectedVibes: string[];
}

export default function VibeSelect({ onSelect, selectedVibes }: VibeSelectProps) {
  const [input, setInput] = useState('');
  const [debouncedInput] = useDebouncedValue(input, 300);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [topVibes, setTopVibes] = useState<string[]>([]);

  useEffect(() => {
    const fetchTopVibes = async () => {
      try {
        const { data } = await api.get<string[]>('/vibes/top');
        const filteredVibes = data.filter(vibe => !selectedVibes.includes(vibe));
        setTopVibes(filteredVibes);
      } catch (error) {
        console.error('Failed to fetch top vibes:', error);
      }
    };
    fetchTopVibes();
  }, [selectedVibes]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedInput) {
        setSuggestions([]);
        return;
      }

      try {
        const { data } = await api.get<string[]>(`/vibes/suggest?query=${debouncedInput}`);
        const filteredSuggestions = data.filter(vibe => !selectedVibes.includes(vibe));
        setSuggestions(filteredSuggestions);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
      }
    };

    fetchSuggestions();
  }, [debouncedInput, selectedVibes]);

  const handleSubmit = (word: string) => {
    const normalizedWord = word.trim().toLowerCase();
    
    if (!normalizedWord) {
      return;
    }

    if (normalizedWord.includes(' ')) {
      return;
    }

    if (selectedVibes.includes(normalizedWord)) {
      return;
    }

    onSelect(normalizedWord);
    setInput('');
    setSuggestions([]);
  };

  return (
    <Stack gap="sm">
      <TextInput
        label="Add vibes"
        placeholder="Type to add or select from suggestions..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault(); // Prevent comma from being typed
            const wordWithoutComma = input.replace(',', '').trim();
            if (wordWithoutComma) {
              handleSubmit(wordWithoutComma);
            }
          }
        }}
      />

      {!input && topVibes.length > 0 && (
        <>
          <Text size="sm" c="dimmed">Suggested vibes:</Text>
          <Group gap="xs">
            {topVibes.map((vibe) => (
              <Badge
                key={vibe}
                variant="light"
                color="grape"
                radius="xl"
                style={{ cursor: 'pointer' }}
                onClick={() => handleSubmit(vibe)}
              >
                {vibe}
              </Badge>
            ))}
          </Group>
        </>
      )}

      {suggestions.length > 0 && (
        <Group gap="xs">
          {suggestions.map((suggestion) => (
            <Badge
              key={suggestion}
              variant="light"
              color="grape"
              radius="xl"
              style={{ cursor: 'pointer' }}
              onClick={() => handleSubmit(suggestion)}
            >
              {suggestion}
            </Badge>
          ))}
        </Group>
      )}
    </Stack>
  );
}
