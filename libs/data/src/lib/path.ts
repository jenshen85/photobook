const API_PATH = 'api';
export const PATHS = {
  signin: `${API_PATH}/auth/signin`,
  signup: `${API_PATH}/auth/signup`,
  profile: `${API_PATH}/profile`,
  photo: `${API_PATH}/photo`,
  album: `${API_PATH}/album`,
  comment: `${API_PATH}/comment`,
  like: `${API_PATH}/like`,
};

export const WS = {
  ON: {
    test: `ws/${API_PATH}/test`,
  },
  SEND: {
    SEND_TEXT: 'set-text',
    REMOVE_TEXT: 'remove-text',
  },
};
