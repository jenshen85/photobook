const API_PATH = 'api';
export const PATHS = {
  signin: API_PATH + '/auth/signin',
  signup: API_PATH + '/auth/signup',
  me: API_PATH + '/user/me',
  getUserById: (user_id: number) => API_PATH + '/user/' + user_id,
  updateProfile: API_PATH + '/profile',
  getAllPhoto: API_PATH + '/photo',
  album: API_PATH + '/album',
  updateAlbums: (album_id: number) => API_PATH + '/album/' + album_id,
  deleteAlbums: (album_id: number) => API_PATH + '/album/' + album_id,
  getUserAllbums: (user_id: number) => API_PATH + '/album/' + user_id,
};
