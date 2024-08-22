import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import Comment from './Comment';
import { useTwitterContext } from '../Context/tweetcontext';

const RepliesPage = () => {
  const { tweetId, commentId } = useParams();
  const [comment, setComment] = useState(null);

  useEffect(() => {
    const fetchComment = async () => {
      const CONFIG_OBJ = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'JWT ' + localStorage.getItem('token'),
        },
      };
      try {
        const response = await axios.get(`${API_BASE_URL}/api/tweets/${tweetId}/comments/${commentId}`, CONFIG_OBJ);
        setComment(response.data.comment);
      } catch (error) {
        console.error('Error fetching comment:', error);
      }
    };
    fetchComment();
  }, [tweetId, commentId]);

  const getImageUrl = (url) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${API_BASE_URL}/${url}`;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!comment) return <div>Loading...</div>;

  return (
    <div className="d-flex justify-content-center">
      <div className="col-md-6">
        <h2>Comment</h2>
        <div className="col-md-6 comment-container my-3 p-3 border rounded">
          <div className="comment-header d-flex align-items-center">
            <img
              className="comment-avatar"
              src={getImageUrl(comment.commentedBy.profileImg) || ''}
              alt={`${comment.commentedBy.username || 'User'}'s profile`}
            />
            <div className="comment-user-info ms-3">
              <span className="comment-username">
                @{comment.commentedBy.username || 'Unknown User'}
              </span>

            </div>
          </div>
          <div className="comment-body mt-2">
            <p>{comment.commentText}</p>
          </div>
        </div>
        <div className="replies mt-3">
          <h3>Comment Replies</h3>
          {comment.replies.length > 0 ? (
            comment.replies.map((reply) => (
              <Comment
                key={reply._id}
                comment={reply}
                tweetId={tweetId}
                isReply={true}
              />
            ))
          ) : (
            <p>No replies yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RepliesPage;
