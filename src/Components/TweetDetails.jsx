import '../Styles/comment.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import Comment from './Comment.jsx';
import TweetCard from './TweetCard.jsx';

function TweetDetails() {
  const { tweetId } = useParams();
  const [tweet, setTweet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTweet = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/tweets/${tweetId}`);
        setTweet(response.data);
      } catch (error) {
        console.error('Error fetching tweet details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTweet();
  }, [tweetId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!tweet) {
    return <p>Tweet not found or error occurred.</p>;
  }

  return (
    <div className='d-flex justify-content-center'>
      <div className="col-md-6">
        <h3>Tweets</h3>
        <div className="tweet-details">
          <TweetCard tweet={tweet} />
        </div>

        <div className="replies mt-4">
          <h4>Replies</h4>
          {tweet.comments?.length > 0 ? (
            tweet.comments.map(comment => (
              <Comment key={comment._id} comment={comment} tweetId={tweet._id} />
            ))
          ) : (
            <p>No replies yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TweetDetails;
