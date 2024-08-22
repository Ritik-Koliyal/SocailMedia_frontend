import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useTwitterContext } from '../Context/tweetcontext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import '../Styles/comment.css'
import { toast } from 'react-toastify';
const Comment = ({ comment, tweetId, isReply }) => {


  const { toggleLikeComment, retweet, replyToComment } = useTwitterContext();
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [localComment, setLocalComment] = useState(() => {
    const storedComment = localStorage.getItem(`comment-${tweetId}-${comment._id}`);
    return storedComment ? JSON.parse(storedComment) : { ...comment };
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem(`comment-${tweetId}-${comment._id}`, JSON.stringify(localComment));
  }, [localComment, tweetId, comment._id]);

  const handleLike = async () => {
    try {
      const isLiked = localComment.likes.includes(localComment.commentedBy._id);
      await toggleLikeComment(tweetId, localComment._id);
      setLocalComment((prevComment) => ({
        ...prevComment,
        likes: isLiked ? prevComment.likes.filter((id) => id !== localComment.commentedBy._id) : [...prevComment.likes, localComment.commentedBy._id],
      }));

    } catch (error) {
      console.error('Error  like/unlike:', error);
    }
  };


  const handleRetweet = (e) => {
    e.stopPropagation();
    try {
      retweet(comment._id);
    } catch (error) {
      console.error('Error retweeting the comment', error);
    }
  };

  const handleReplyIconClick = (e) => {
    e.stopPropagation();
    setShowReplyModal(true);
  };

  const handleReply = async (e) => {
    e.stopPropagation();
    try {
      await replyToComment(tweetId, comment._id, replyText);
      setReplyText('');
      setShowReplyModal(false);
    } catch (error) {
      console.error('Error replying to  comment', error);
    }
  };

  const getImageUrl = (url) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${API_BASE_URL}/${url}`;
  };

  const handleCardClick = () => {
    navigate(`/replies/${tweetId}/${comment._id}`);
  };

  const navigateToUserProfile = (e) => {
    e.stopPropagation(); // Prevent navigation
    navigate(`/profile/${comment.commentedBy._id}`);
  };

  const handleCommentClick = (e) => {
    e.stopPropagation(); // Prevent navigation
  };

  const profileImgUrl = comment.commentedBy.profileImg || 'https://media.istockphoto.com/id/587805156/vector/profile-picture-vector-illustration.jpg?s=612x612&w=0&k=20&c=gkvLDCgsHH-8HeQe7JsjhlOY6vRBJk_sKW9lyaLgmLo=';

  console.log("comment", comment)

  return (
    <div className="comment-container my-3 p-3 border rounded" onClick={handleCardClick}>
      <div className="comment-header d-flex align-items-center">
        <img
          className="comment-avatar rounded-circle"
          src={getImageUrl(profileImgUrl)}
          alt={`${comment.commentedBy.username || 'User'}'s profile`}
          style={{ width: '40px', height: '40px', cursor: 'pointer' }}
          onClick={navigateToUserProfile}
        />
        <div className="comment-user-info ms-3">
          <span
            className="comment-username fw-bold"
            style={{ cursor: 'pointer' }}
            onClick={navigateToUserProfile}
          >
            @{comment.commentedBy.username || 'Unknown User'}
          </span>
          <span className="comment-date ms-2 text-muted">
            {comment.createdAt}
          </span>
        </div>
      </div>
      <div className="comment-body mt-2" onClick={handleCommentClick}>
        <p>{comment.commentText}</p>
      </div>

      {isReply ? null : (<div className="comment-footer d-flex mt-2" onClick={handleCommentClick} style={{ color: 'red' }} >




        <div className='tweet-action' onClick={handleLike}>
          <i className={`fs-5 fa fa-heart ${localComment.likes.includes(localComment.commentedBy._id) ? 'fas' : 'far'}`} style={{ color: 'red' }} />
        </div>



        <span className="ms-2">{localComment.likes?.length || 0}</span>

        <span className="me-3" onClick={handleReplyIconClick}>
          <i className="fa-regular fa-comment me-1"></i> {comment.replies?.length || 0}
        </span>
        <span className="me-3" onClick={handleRetweet}>
          <i className="fa-solid fa-retweet"></i> {comment.retweets?.length || 0}
        </span>
      </div>)}

      {/* Reply Modal */}
      <Modal show={showReplyModal} onHide={() => setShowReplyModal(false)} onClick={(e) => e.stopPropagation()}>
        <Modal.Header closeButton onClick={(e) => e.stopPropagation()}>
          <Modal.Title>Reply to Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body onClick={(e) => e.stopPropagation()}>
          <Form onClick={(e) => e.stopPropagation()}>
            <Form.Group className="mb-3" controlId="replyTextarea" onClick={(e) => e.stopPropagation()}>
              <Form.Control
                as="textarea"
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer onClick={(e) => e.stopPropagation()}>
          <Button variant="secondary" onClick={() => setShowReplyModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleReply}>
            Reply
          </Button>
        </Modal.Footer>
      </Modal>
    </div >
  );
};

export default Comment;


