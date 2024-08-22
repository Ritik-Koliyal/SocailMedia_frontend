import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Container, Row, Col, Image } from 'react-bootstrap';
import axios from 'axios';
import { useProfileContext } from '../Context/ProfileContext';
import TweetCard from './TweetCard';
import { API_BASE_URL } from '../config';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';


function ProfileCard() {
  const { userId } = useParams();
  const [myTweets, setMyTweets] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [bio, setBio] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  const { fetchProfileData, updateBio, updateProfilePicture } = useProfileContext();
  const userData = JSON.parse(localStorage.getItem('user'));
  const loguserId = userData.id;
  const token = localStorage.getItem('token');
  const [image, setImage] = useState({ preview: '', data: null });
  const CONFIG_OBJ = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
  };

  const fetchTweetsByUserId = async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/tweets/user/${userId}`);
      setMyTweets(response.data.tweets);
    } catch (error) {
      console.error('Error fetching tweets:', error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const profileResponse = await axios.get(`${API_BASE_URL}/api/users/${userId}`);
      setProfileData(profileResponse.data.user);
      if (profileResponse.data.user) {
        fetchTweetsByUserId(profileResponse.data.user._id);
        setName(profileResponse.data.user.name);
        setLocation(profileResponse.data.user.location);
        setDateOfBirth(profileResponse.data.user.dateOfBirth);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const handleImageChange = (event) => {
    const img = {
      preview: URL.createObjectURL(event.target.files[0]),
      data: event.target.files[0]
    };
    setImage(img);
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append("file", image.data);
    try {
      const response = await axios.put(`${API_BASE_URL}/uploadDp`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": "JWT " + localStorage.getItem("token")
        }
      });
      if (response.status === 200) {
        setProfileData((prevProfile) => ({
          ...prevProfile,
          profileImg: response.data.profileImg,
        }));
        setShowUploadModal(false);
        toast.success('profile picture added successfully..')
      }
    } catch (error) {
      console.error('Failed to upload image', error);
    }
  };

  const handleBioUpdate = async () => {
    try {
      const response = await updateBio(bio);
      if (response.status === 200) {
        setProfileData((prevProfile) => ({
          ...prevProfile,
          bio: bio,
        }));
        setShowEditModal(false);

      }
    } catch (error) {
      console.error('Failed to update bio', error);
    }
  };
  const handleDelete = () => {
    deleteTweet(tweet._id);
    toast.success('tweet deleted')
  };


  const handleProfileUpdate = async () => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/profile/${userId}`,
        { name, location, dateOfBirth },
        CONFIG_OBJ
      );
      if (response.status === 200) {
        setProfileData((prevProfile) => ({
          ...prevProfile,
          name: name,
          location: location,
          dateOfBirth: dateOfBirth,
        }));
        setShowEditModal(false);
        toast.success('profile updated successfullyy...')
      }
    } catch (error) {
      console.error('Failed to update profile', error);
    }
  };

  const handleFollowUser = async () => {
    setProfileData((prevProfile) => ({
      ...prevProfile,

      followers: [...prevProfile.followers, loguserId],


    }));

    try {
      const response = await axios.put(`${API_BASE_URL}/api/user/follow/${userId}`, {}, CONFIG_OBJ);
      if (response.status !== 200) {
        setProfileData((prevProfile) => ({
          ...prevProfile,
          followers: prevProfile.followers.filter((id) => id !== loguserId),

        }));

      }
    } catch (error) {
      console.error('Error following user:', error);
      setProfileData((prevProfile) => ({
        ...prevProfile,
        followers: prevProfile.followers.filter((id) => id !== loguserId),
      }));

    }
  };

  const handleUnfollowUser = async () => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/user/unfollow/${userId}`, {}, CONFIG_OBJ);

      if (response.status === 200) {
        setProfileData((prevProfile) => ({
          ...prevProfile,
          followers: prevProfile.followers.filter((id) => id !== loguserId),
        }));
      } else {
        console.error('Unfollow failed, server returned non-200 status');
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  if (!profileData) {
    return <div>Loading...</div>;
  }

  const profileImageUrl = profileData.profileImg.startsWith('http') ? profileData.profileImg : `${API_BASE_URL}/${profileData.profileImg}`;

  return (
    <div className="profile-container">
      <div className=" pf-container">
        <div className="cover-img">
          <div className="profile-img-container">
            <img
              className="avatar-img"
              src={profileImageUrl}
              alt="Profile"
            />

          </div>
        </div>
        <div className="user-details  d-flex justify-content-between">

          <div className="detail ">
            <h2>{profileData.name}</h2>
            <p>@{profileData.username}</p>
            {profileData.location && <p>{profileData.location}</p>}
            {profileData.dateOfBirth && <p>Birth Day - {new Date(profileData.dateOfBirth).toLocaleDateString()}</p>}

          </div>

          <div className="buttons-container text-center mt-3 float-end">
            {loguserId === userId ? (
              <>
                <Button variant="primary" onClick={() => setShowEditModal(true)}>
                  Edit Profile
                </Button>
                <Button variant="secondary" className="ml-2" onClick={() => setShowUploadModal(true)}>
                  Upload Profile Picture
                </Button>
              </>
            ) : (
              <>
                {profileData.followers.includes(loguserId) ? (
                  <Button variant="danger" onClick={handleUnfollowUser}>
                    Unfollow
                  </Button>
                ) : (
                  <Button variant="success" onClick={handleFollowUser}>
                    Follow
                  </Button>
                )}
              </>
            )}
          </div>

        </div>
        <div className="d-flex justify-content-start mt-5">
          <div className="follower mx-2">
            <h4>{profileData.followers.length}</h4>
            <h4>Followers</h4>
          </div>
          <div className="following mx-2">
            <h4>{profileData.following.length}</h4>
            <h4>Following</h4>
          </div>
        </div>


      </div>

      <div className="tweets-container">
        <h2 className="text-center m-2" >Tweets </h2>
        {myTweets.map((tweet) => (
          <TweetCard key={tweet._id} tweet={tweet} />
        ))}
      </div>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter your date of birth"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleProfileUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Profile Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Choose Picture</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}

              />
              <p> please upload img jpg or png file only</p>
              {image.preview && <Image src={image.preview} rounded style={{ width: '400px' }} />}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleImageUpload}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProfileCard;
