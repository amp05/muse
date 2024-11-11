import axios from 'axios';

export class SpotifyService {
  private static readonly BASE_URL = 'https://api.spotify.com/v1';
  private static readonly CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  private static readonly CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
  private static accessToken: string | null = null;
  private static tokenExpiration: number = 0;

  private static async getAccessToken() {
    if (this.accessToken && Date.now() < this.tokenExpiration) {
      return this.accessToken;
    }

    const response = await axios.post('https://accounts.spotify.com/api/token', 
      new URLSearchParams({
        'grant_type': 'client_credentials'
      }), {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.CLIENT_ID}:${this.CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    this.accessToken = response.data.access_token;
    this.tokenExpiration = Date.now() + (response.data.expires_in * 1000);
    return this.accessToken;
  }

  static async searchTracks(query: string) {
    const token = await this.getAccessToken();
    const response = await axios.get(`${this.BASE_URL}/search`, {
      params: {
        q: query,
        type: 'track',
        limit: 5
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data.tracks.items.map((track: any) => ({
      id: track.id,
      title: track.name,
      artist: track.artists[0].name,
      albumArt: track.album.images[0]?.url,
      spotifyId: track.id
    }));
  }
}