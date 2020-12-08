import axios from 'axios';
import {
  BUG_LIST_REQUEST,
  BUG_LIST_SUCCESS,
  BUG_LIST_FAIL,
  BUG_DETAILS_REQUEST,
  BUG_DETAILS_SUCCESS,
  BUG_DETAILS_FAIL,
  BUG_DELETE_REQUEST,
  BUG_DELETE_SUCCESS,
  BUG_DELETE_FAIL,
  BUG_CREATE_REQUEST,
  BUG_CREATE_SUCCESS,
  BUG_CREATE_FAIL,
  BUG_UPDATE_REQUEST,
  BUG_UPDATE_SUCCESS,
  BUG_UPDATE_FAIL,
  BUG_UPDATE_RESET,
} from '../constants/bugConstants';

export const listBugs = () => async (dispatch) => {
  try {
    dispatch({ type: BUG_LIST_REQUEST });

    const { data } = await axios.get('/api/bugs');

    dispatch({ type: BUG_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: BUG_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listBugDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: BUG_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/bugs/${id}`);

    dispatch({ type: BUG_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: BUG_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteBug = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: BUG_DELETE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`/api/bugs/${id}`, config);

    dispatch({
      type: BUG_DELETE_SUCCESS,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === 'Not authorized, token failed') {
      dispatch(logout());
    }
    dispatch({
      type: BUG_DELETE_FAIL,
      payload: message,
    });
  }
};

export const createBug = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: BUG_CREATE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(`/api/bugs`, {}, config);

    dispatch({
      type: BUG_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === 'Not authorized, token failed') {
      dispatch(logout());
    }
    dispatch({
      type: BUG_CREATE_FAIL,
      payload: message,
    });
  }
};

export const updateBug = (bug) => async (dispatch, getState) => {
  try {
    dispatch({
      type: BUG_UPDATE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(`/api/bugs/${bug._id}`, bug, config);

    dispatch({
      type: BUG_UPDATE_SUCCESS,
      payload: data,
    });
    dispatch({ type: BUG_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === 'Not authorized, token failed') {
      dispatch(logout());
    }
    dispatch({
      type: BUG_UPDATE_FAIL,
      payload: message,
    });
  }
};
