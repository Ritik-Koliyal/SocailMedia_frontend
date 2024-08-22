import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const ProfileContext = createContext();

const ProfileProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const token = localStorage.getItem('token');

  const CONFIG_OBJ = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
  };

  const followUser = async (userId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/user/follow/${userId}`, {}, CONFIG_OBJ);
      setUser((prevUser) => ({
        ...prevUser,
        following: [...prevUser.following, response.data.following],
      }));
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const unfollowUser = async (userId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/user/unfollow/${userId}`, {}, CONFIG_OBJ);
      setUser((prevUser) => ({
        ...prevUser,
        following: prevUser.following.filter((id) => id !== response.data.unfollowed),
      }));
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const fetchTweetsByUserId = async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/tweets/user/${userId}`, CONFIG_OBJ);
      if (response.status === 200) {
        setTweets(response.data.tweets);
      } else {
        console.log('Error fetching tweets:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching tweets:', error);
    }
  };

  return (
    <ProfileContext.Provider value={{ followUser, unfollowUser }}>
      {children}
    </ProfileContext.Provider>
  );
};




export const useProfileContext = () => useContext(ProfileContext);

export { ProfileProvider, ProfileContext };
