import React, { useState, useEffect } from 'react';
import '../Styles/Home.css';
import axios from 'axios';
import TweetCard from './TweetCard';
import CreateTweet from './CreateTweet';
import { API_BASE_URL } from '../config';

function Home() {
  const [allTweets, setAllTweets] = useState([]);
  const token = localStorage.getItem('token');
  const CONFIG_OBJ = {
    headers: {
      Authorization: `JWT ${token}`
    }
  };

  const getAlltweets = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/alltweets`, CONFIG_OBJ);

      if (response.status === 200) {

        const sortedTweets = response.data.tweet.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAllTweets(sortedTweets);
      } else {
        console.log('Some error occurred while getting tweets');
      }
    } catch (error) {
      console.error('Error fetching tweets:', error);
    }
  };

  const deleteTweet = async (tweetId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/deletetweet/${tweetId}`, CONFIG_OBJ);
      if (response.status === 200) {
        getAlltweets();
      } else {
        console.log('Error deleting the tweet');
      }
    } catch (error) {
      console.error('Error deleting the tweet:', error);
    }
  };

  const updateTweets = () => {
    getAlltweets();
  };

  useEffect(() => {
    getAlltweets();
  }, []);

  return (
    <>
      <div className="container col-md-6 col-sm-12">
        <CreateTweet updateTweets={updateTweets} />
        {allTweets.map((tweet) => (
          <TweetCard
            key={`${tweet._id}-${tweet.createdAt}`}
            tweet={tweet}
            deleteTweet={deleteTweet}
            updateTweets={updateTweets}
          />
        ))}
      </div>
    </>
  );
}

export default Home;
