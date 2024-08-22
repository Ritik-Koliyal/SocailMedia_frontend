import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const TwitterContext = createContext();

export const TwitterProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [myTweets, setMyTweets] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const [comments, setComments] = useState([]);
  const CONFIG_OBJ = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
  };

  // Fetch user details using userId from API
  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/${userId}`, CONFIG_OBJ);
      if (response.status === 200) {
        setUser(response.data.user);
        setLoading(false);
      } else {
        console.log('Error fetching user details:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // Fetch tweets for the logged-in user
  const fetchMyTweets = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/myalltweets`, CONFIG_OBJ);
      if (response.status === 200) {
        setMyTweets(response.data.tweet);
        setLoading(false);
      } else {
        console.log('Error fetching tweets:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching tweets:', error);
    }
  };

  // Fetch all tweets
  const fetchAllTweets = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/alltweets`, CONFIG_OBJ);
      setTweets(response.data.tweets);
    } catch (error) {
      console.error('Error fetching tweets:', error);
    }
  };

  const addComment = async (tweetId, commentText) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/comment`, { tweetId, commentText }, CONFIG_OBJ);
      setTweets((prevTweets) =>
        prevTweets.map((tweet) =>
          tweet._id === tweetId ? { ...tweet, comments: response.data.comments } : tweet
        )
      );
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };



  const likeTweet = async (tweetId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/like`, { postId: tweetId }, CONFIG_OBJ);
      if (response.status === 200) {
        setTweets((prevTweets) =>
          prevTweets.map((tweet) => (tweet._id === tweetId ? { ...tweet, likes: response.data.likes } : tweet))
        );
      }
    } catch (error) {
      console.error('Error liking tweet:', error);
    }
  };



  const unlikeTweet = async (tweetId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/unlike`, { postId: tweetId }, CONFIG_OBJ);
      if (response.status === 200) {
        setTweets((prevTweets) =>
          prevTweets.map((tweet) => (tweet._id === tweetId ? { ...tweet, likes: response.data.likes } : tweet))
        );
      }
    } catch (error) {
      console.error('Error unliking tweet:', error);
    }
  };
  const updateTweetLikes = (tweetId, newLikes) => {
    setTweets((prevTweets) =>
      prevTweets.map((tweet) => (tweet._id === tweetId ? { ...tweet, likes: newLikes } : tweet))
    );
  };


  const retweetTweet = async (tweetId) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/api/tweets/retweet/${tweetId}`, { tweetId }, CONFIG_OBJ);
      // Update tweets state or handle as per your application's state management
      setTweets((prevTweets) => {
        return prevTweets.map((prevTweet) => {
          if (prevTweet._id === tweetId) {
            return { ...prevTweet, retweetBy: [...prevTweet.retweetBy, user._id] };
          }
          return prevTweet;
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  const replyToComment = async (tweetId, commentId, replyText) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/tweets/${tweetId}/comments/${commentId}/reply`, { replyText }, CONFIG_OBJ);
      // Update the comment with the new reply
      setTweets((prevTweets) =>
        prevTweets.map((tweet) =>
          tweet._id === tweetId
            ? {
              ...tweet,
              comments: tweet.comments.map((comment) =>
                comment._id === commentId
                  ? { ...comment, replies: [...comment.replies, { text: replyText }] }
                  : comment
              ),
            }
            : tweet
        )
      );
    } catch (error) {
      console.error('Error replying to the comment', error);
    }
  };


  const toggleLikeComment = async (tweetId, commentId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/tweets/${tweetId}/comments/${commentId}/like`, {}, CONFIG_OBJ);
      return response.data.likes;
    } catch (error) {
      console.error('Error toggling like/unlike:', error);
    }
  };

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      fetchUserDetails(loggedInUser.id);
    }
  }, []);

  return (
    <TwitterContext.Provider
      value={{
        user,
        setUser,
        myTweets,
        setMyTweets,
        tweets,
        setTweets,
        fetchMyTweets,
        fetchAllTweets,
        addComment,
        retweetTweet,
        likeTweet,
        unlikeTweet,
        updateTweetLikes,

        toggleLikeComment,
        replyToComment,
      }}
    >
      {children}
    </TwitterContext.Provider>
  );
};

export const useTwitterContext = () => useContext(TwitterContext);





