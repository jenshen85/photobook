const API_PATH = 'api';
export const PATHS = {
  signin: `${API_PATH}/auth/signin`,
  signup: `${API_PATH}/auth/signup`,
  // me: `${API_PATH}/user/me`,
  profile: `${API_PATH}/profile`,
  // profileMe: `${API_PATH}/profile/me`,
  // getUserById: (user_id: number | string) => `${API_PATH}/profile/${user_id}`,
  getAllPhoto: `${API_PATH}/photo`,
  album: `${API_PATH}/album`,
  updateAlbums: (album_id: number | string) => `${API_PATH}/album/${album_id}`,
  deleteAlbums: (album_id: number | string) => `${API_PATH}/album/${album_id}`,
  getUserAllbums: (user_id: number | string) => `${API_PATH}/album/${user_id}`,
  getUserAlbumById: (user_id: number | string, album_id: number | string) => `${API_PATH}/album/${user_id}/${album_id}`,
};
