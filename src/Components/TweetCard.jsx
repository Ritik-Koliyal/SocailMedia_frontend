import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useTwitterContext } from '../Context/tweetcontext';
import { API_BASE_URL } from '../config';
import { toast } from 'react-toastify'
import '../Styles/TweetCard.css';
import axios from 'axios';

function TweetCard({ tweet, deleteTweet, setTweets }) {
  const { user, likeTweet, unlikeTweet, addComment, retweetTweet, updateTweetLikes } = useTwitterContext();
  const [show, setShow] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState('');
  const [commentCount, setCommentCount] = useState(0);
  const [originalTweet, setOriginalTweet] = useState(null);
  const [tweetedBy, setTweetedBy] = useState(null);
  const [retweetCount, setRetweetCount] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const CONFIG_OBJ = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
  };
  let userId = null;

  if (localStorage.getItem('user')) {
    var loguser = JSON.parse(localStorage.getItem('user'));
    userId = loguser ? loguser.id : null;
  }

  useEffect(() => {
    setIsLiked(tweet.likes.includes(user._id));
    setLikeCount(tweet.likes.length);
    setCommentCount(tweet.comments.length);
    setRetweetCount(tweet.retweets ? tweet.retweets.length : 0);

  }, [tweet.likes, tweet.comments, tweet.retweets, user._id]);

  useEffect(() => {
    if (tweet.retweetOf) {
      axios.post(`${API_BASE_URL}/api/tweet/${tweet.retweetOf}`, {}, CONFIG_OBJ)
        .then(response => {
          setOriginalTweet(response.data);
          axios.get(`${API_BASE_URL}/api/users/${response.data.tweetedBy}`, CONFIG_OBJ)
            .then(res => {
              setTweetedBy(res.data);
            })
            .catch(err => {
              console.error('Error fetching user details:', err);
            });
        })
        .catch(error => {
          console.error('Error fetching original tweet:', error);
        });
    }
  }, [tweet]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDelete = () => {
    deleteTweet(tweet._id);
    toast.success('tweet deleted')
  };

  const handleLike = () => {
    if (!isLiked) {
      likeTweet(tweet._id);
      updateTweetLikes(tweet._id, [...tweet.likes, user._id]);
      setLikeCount(likeCount + 1);
      setIsLiked(true);
      toast.success('Tweet liked')
    } else {
      unlikeTweet(tweet._id);
      updateTweetLikes(tweet._id, tweet.likes.filter((like) => like !== user._id));
      setLikeCount(likeCount - 1);
      setIsLiked(false);
      toast.success('Tweet unliked')
    }
  };

  const handleComment = async () => {
    try {
      await addComment(tweet._id, comment);
      setComment('');
      handleClose();
      setCommentCount(commentCount + 1);
      toast.success('Commented successfully')
    } catch (error) {
      console.error('Error submitting the comment', error);
    }
  };

  const handleRetweet = async () => {
    try {
      const response = await retweetTweet(tweet._id);
      if (setTweets) {
        setTweets((prevTweets) => [...prevTweets, response.data]);
      }
      setRetweetCount(retweetCount + 1);
      toast.success('Tweet retweeted successfully..')
    } catch (error) {
      console.error(error);
    }
  };

  const getImageUrl = (url) => {
    if (!url) {
      return '';
    }
    if (url.startsWith && (url.startsWith('http://') || url.startsWith('https://'))) {
      return url;
    }
    return `${API_BASE_URL}/${url}`;
  };

  const handleCardClick = (e) => {
    e.stopPropagation();
    navigate(`/tweets/${tweet._id}`);
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const formatDate = (createdAt) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(createdAt).toLocaleDateString('en-US', options);
  };

  const isRetweet = !!tweet.retweetOf;

  return (
    <div className="tweet-card col-12 mx-auto " onClick={handleCardClick}>
      {tweet.tweetedBy._id === userId && (
        <div className="icon float-end" onClick={stopPropagation}>
          <i className="fa-solid fa-trash" onClick={handleDelete}></i>
        </div>
      )}
      {isRetweet && originalTweet && tweetedBy && (
        <>
          <div className="retweeter-info text-muted mb-2">
            <i className="fa-solid fa-retweet me-2"></i>
            Retweeted by <Link to={`/profile/${tweet.tweetedBy._id}`} onClick={stopPropagation} style={{ textDecoration: 'none' }}>
              {tweet.tweetedBy.username}
            </Link>
          </div>
          <div className="tweett-card">
            <div className="tweet-card-header" onClick={handleCardClick}>
              <Link to={`/profile/${tweetedBy.user._id}`} onClick={stopPropagation} style={{ textDecoration: 'none' }}>
                <img
                  className="profile-img"
                  src={getImageUrl(tweetedBy.user.profileImg)}
                  alt={`${tweetedBy.name}'s profile`}
                />
                <span className="text-muted">{formatDate(originalTweet.createdAt)}</span>
              </Link>
              <div className="user-info">
                <Link to={`/profile/${tweetedBy.user._id}`} className="username" onClick={stopPropagation} style={{ textDecoration: 'none' }}>
                  {tweetedBy.user.username}
                </Link>
              </div>
              <div className="tweet-card-content">
                <p>{originalTweet.content}</p>
                {originalTweet.image && (
                  <img
                    className="card-img"
                    src={getImageUrl(originalTweet.image)}
                    alt="Tweet content"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </>
      )}
      {!isRetweet && (
        <div className="tweet-card">
          <div className="tweet-card-header" onClick={handleCardClick}>
            <Link to={`/profile/${tweet.tweetedBy._id}`} onClick={stopPropagation} style={{ textDecoration: 'none' }}>
              <img
                className="profile-img"
                src={getImageUrl(tweet.tweetedBy.profileImg)}
                alt={`${tweet.tweetedBy.name}'s profile`}
              />
              <span className="text-muted">{formatDate(tweet.createdAt)}</span>
            </Link>
            <div className="user-info">
              <Link to={`/profile/${tweet.tweetedBy._id}`} className="username" onClick={stopPropagation} style={{ textDecoration: 'none' }}>
                {tweet.tweetedBy.username}
              </Link>
            </div>
            <div className="tweet-card-content">
              <p>{tweet.content}</p>
              {tweet.image && (
                <img
                  className="card-img"
                  src={getImageUrl(tweet.image)}
                  alt="Tweet content"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
      <div className="tweet-card-footer" onClick={stopPropagation}>
        <div className="tweet-actions">
          {isLiked ? (
            <i className="fa-solid fa-heart" onClick={handleLike}></i>
          ) : (
            <i className="fa-regular fa-heart" onClick={handleLike}></i>
          )}
          <span>{likeCount} Likes</span>
        </div>
        <div className="icon" onClick={(e) => { stopPropagation(e); handleShow(e); }}>
          <i className="fa-regular fa-comment"></i>
          <span>{commentCount} Comments</span>
        </div>
        <div className="icon" onClick={(e) => { stopPropagation(e); handleRetweet(e); }}>
          <i className="fa-solid fa-retweet"></i>
          <span>{retweetCount} Retweets</span>
        </div>
      </div>
      <Modal show={show} onHide={handleClose} onClick={stopPropagation}>
        <Modal.Header closeButton>
          <Modal.Title>Post a Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="comment">
              <Form.Label>Comment:</Form.Label>
              <Form.Control
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleComment}>
            Post Comment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TweetCard;
