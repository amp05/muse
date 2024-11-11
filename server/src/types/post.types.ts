export interface CreatePostDTO {
    caption?: string;
    songs: {
      title: string;
      artist: string;
      albumArt?: string;
      spotifyId?: string;
    }[];
  }
  
  export interface PostResponse {
    id: string;
    caption?: string;
    songs: {
      id: string;
      title: string;
      artist: string;
      albumArt?: string;
      spotifyId?: string;
    }[];
    user: {
      id: string;
      username: string;
    };
    createdAt: Date;
  updatedAt: Date;
}
