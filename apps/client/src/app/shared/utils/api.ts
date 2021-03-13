const API_PATH = 'api';
export const PATHS = {
  signin: `${API_PATH}/auth/signin`,
  signup: `${API_PATH}/auth/signup`,
  profile: `${API_PATH}/profile`,
  photo: `${API_PATH}/photo`,
  album: `${API_PATH}/album`,
  comment: `${API_PATH}/comment`,
  like: `${API_PATH}/like`,
  // updateAlbums: (album_id: number | string) => `${API_PATH}/album/${album_id}`,
  // deleteAlbums: (album_id: number | string) => `${API_PATH}/album/${album_id}`,
  // getUserAllbums: (user_id: number | string) => `${API_PATH}/album/${user_id}`,
};
