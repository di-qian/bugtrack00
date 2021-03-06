import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Form, Button, Image, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, updateUser } from '../actions/userActions';
import { getScreenName } from '../actions/screenActions';
import { USER_UPDATE_RESET } from '../constants/userConstants';
import {
  SCREEN_NAME_RESET,
  USER_EDIT_PAGE,
} from '../constants/screenConstants';

const UserEditScreen = ({ match, history }) => {
  const userId = match.params.id;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [emailEdit, setEmailEdit] = useState(false);
  const [imageEdit, setImageEdit] = useState(false);
  const [passwordEdit, setPasswordEdit] = useState(false);
  const [confirmPasswordEdit, setConfirmPasswordEdit] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [show, setShow] = useState(false);

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdate = useSelector((state) => state.userUpdate);
  const { error: errorUpdate, success: successUpdate } = userUpdate;

  useEffect(() => {
    if (!userInfo || (userInfo && !userInfo.isAdmin)) {
      history.push('/auth/fail');
    } else {
      dispatch(getScreenName(USER_EDIT_PAGE));
      if (!user.name || user._id !== userId || successUpdate) {
        if (successUpdate) {
          setUpdateSuccess(successUpdate);
          setShow(true);
        }
        dispatch(getUserDetails(userId));
      } else {
        if (successUpdate) {
          setUpdateSuccess(false);
        }
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
        setIsManager(user.isManager);
        setImage(user.image);
      }
      dispatch({ type: USER_UPDATE_RESET });
    }
  }, [dispatch, history, userInfo, userId, user, successUpdate, updateSuccess]);

  useEffect(() => {
    return () => {
      dispatch({ type: SCREEN_NAME_RESET });
    };
  }, [dispatch]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await axios.post('/api/upload', formData, config);

      settingImage(data);

      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setShow(false);
    setEmailEdit(false);
    setPasswordEdit(false);
    setConfirmPasswordEdit(false);
    setImageEdit(false);
    // if (password !== confirmPassword) {
    //   setMessage('Passwords do not match');
    // } else {
    dispatch(
      updateUser({
        _id: userId,
        name,
        email,
        password,
        confirmPassword,
        isAdmin,
        isManager,
        image,
      })
    );
    //}
  };

  const settingEmail = (e) => {
    setEmail(e);
    setEmailEdit(true);
  };

  const settingPassword = (e) => {
    setPassword(e);
    setPasswordEdit(true);
  };

  const settingConfirmPassword = (e) => {
    setConfirmPassword(e);
    setConfirmPasswordEdit(true);
  };

  const settingImage = (e) => {
    setImage(e);
    setImageEdit(true);
  };

  return (
    <>
      <Row>
        <Col>
          <h3 className="pagetitlefont">Edit User</h3>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <hr />
          {updateSuccess && (
            <Alert
              variant="success"
              dismissible
              transition
              show={show}
              onClose={() => setShow(false)}
            >
              User Profile Updated
            </Alert>
          )}

          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="name">
                <Form.Label>Edit Name</Form.Label>{' '}
                <i className="fas fa-asterisk fa-xs fh"></i>
                <Form.Control
                  type="name"
                  placeholder="Enter name"
                  value={name}
                  disabled={email === 'admin@example.com'}
                  onChange={(e) => setName(e.target.value)}
                  isInvalid={errorUpdate && errorUpdate.name && !name}
                ></Form.Control>
                <Form.Control.Feedback
                  className="tooltipposition"
                  type="invalid"
                  tooltip
                >
                  {errorUpdate && errorUpdate.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label>Edit Email Address</Form.Label>{' '}
                <i className="fas fa-asterisk fa-xs fh"></i>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  disabled={email === 'admin@example.com'}
                  onChange={(e) => settingEmail(e.target.value)}
                  isInvalid={errorUpdate && errorUpdate.email && !emailEdit}
                ></Form.Control>
                <Form.Control.Feedback
                  className="tooltipposition"
                  type="invalid"
                  tooltip
                >
                  {errorUpdate && errorUpdate.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Label>Edit Password</Form.Label>{' '}
                <i className="fas fa-asterisk fa-xs fh"></i>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => settingPassword(e.target.value)}
                  isInvalid={
                    errorUpdate && errorUpdate.password && !passwordEdit
                  }
                ></Form.Control>
                <Form.Control.Feedback
                  className="tooltipposition"
                  type="invalid"
                  tooltip
                >
                  {errorUpdate && errorUpdate.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>{' '}
                <i className="fas fa-asterisk fa-xs fh"></i>
                <Form.Control
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => settingConfirmPassword(e.target.value)}
                  isInvalid={
                    errorUpdate &&
                    errorUpdate.confirmPassword &&
                    !confirmPasswordEdit
                  }
                ></Form.Control>
                <Form.Control.Feedback
                  className="tooltipposition"
                  type="invalid"
                  tooltip
                >
                  {errorUpdate && errorUpdate.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="isadmin">
                <Form.Check
                  type="checkbox"
                  label="Is Admin"
                  checked={isAdmin}
                  disabled={email === 'admin@example.com'}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                ></Form.Check>
              </Form.Group>

              <Form.Group controlId="ismanager">
                <Form.Check
                  type="checkbox"
                  label="Is Manager"
                  checked={isManager}
                  onChange={(e) => setIsManager(e.target.checked)}
                ></Form.Check>
              </Form.Group>

              <Form.Group controlId="image">
                <Form.Label>Edit Profile Image</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter image url"
                  value={image}
                  onChange={(e) => settingImage(e.target.value)}
                  isInvalid={errorUpdate && errorUpdate.image && !imageEdit}
                ></Form.Control>
                <Form.File
                  id="image-file"
                  label="Choose File"
                  custom
                  onChange={uploadFileHandler}
                ></Form.File>
                {uploading && <Loader />}
                <Form.Control.Feedback
                  className="tooltipposition"
                  type="invalid"
                  tooltip
                >
                  {errorUpdate && errorUpdate.image}
                </Form.Control.Feedback>
              </Form.Group>

              <Button className="mr-2" type="submit" variant="primary">
                Update
              </Button>
              <Link to="/admin/userlist" className="btn btn-dark my-3">
                Go Back
              </Link>
            </Form>
          )}
        </Col>
        <Col md={6}>
          <Image className="mr-2" width="100%" src={user && user.image} />
        </Col>
      </Row>
    </>
  );
};

export default UserEditScreen;
