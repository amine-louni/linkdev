import { auth, user as userHttp } from '../http';
import setAuthToken from '../http/setAuthToken';

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  AUTH_ERROR,
  USER_LOADED,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
  UPDATE_USER,
} from './types';

import { setAlert } from './alertHandler';
import { createInitialProfile } from './profileHandler';

//Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await auth.get('/is-loggedin');

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register User

export const register = (body) => async (dispatch) => {
  try {
    const res = await auth.post('/register', body);
    if (res.data.status === 'success') {
      console.log('success', 'registered with success 👌');
      // props.setAlert(', 'success');
      dispatch(setAlert('registered with success 👌', 'success'));
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
      dispatch(loadUser());
      dispatch(createInitialProfile());
    }
  } catch (err) {
    console.log(err);
    if (err) {
      dispatch(setAlert(err.response.data.message, 'error'));
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response.data.message,
      });
    }
  }
};

// Login User

export const login = (body) => async (dispatch) => {
  try {
    const res = await auth.post('/login', body);
    if (res.data.status === 'success') {
      dispatch(setAlert('logged with success 👌', 'success'));

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data.data,
      });
      dispatch(loadUser());
    }
  } catch (err) {
    console.log(err);
    if (err) {
      dispatch(setAlert(err.response.data.message, 'error'));
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response.data.message,
      });
    }
  }
};

// Logout User
export const logout = () => (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
  dispatch(setAlert('You Logged out 😥', 'warning'));
};

// Update current user
//[PATCH] {{URL}}/users/update-me
export const updateMe = (body) => async (dispatch) => {
  try {
    const res = await userHttp.patch('/update-me', body);
    dispatch({
      type: UPDATE_USER,
      payload: res.data.data.user,
    });
    dispatch(setAlert('infos updated successfully 👼', 'success'));
  } catch (err) {
    dispatch(setAlert(`Ops! 😣 , ${err.response.data.message}`, 'error'));
  }
};
