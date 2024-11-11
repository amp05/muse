export interface Song {
    id?: string;
    title: string;
    artist: string;
    albumArt?: string;
    spotifyId?: string;
  }
  
  export interface Post {
    id: string;
    caption?: string;
    songs: Song[];
    user: {
      id: string;
      username: string;
    };
    createdAt: string;
    updatedAt: string;
  }