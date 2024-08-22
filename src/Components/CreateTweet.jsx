import React, { useState } from 'react';
import { Modal, Form, Container, Row, Col, Image, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { API_BASE_URL } from '../config';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';

function CreateTweet({ updateTweets }) {
  const [image, setImage] = useState({ preview: '', data: null });
  const [content, setContent] = useState("");
  const [userName, setUserName] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const CONFIG_OBJ = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "JWT " + localStorage.getItem("token")
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
      const response = await axios.post(`${API_BASE_URL}/uploadFile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": "JWT " + localStorage.getItem("token")
        }
      });
      return response;
    } catch (error) {
      toast.error('Failed to upload image');
      throw error;
    }
  };

  const addTweet = async () => {
    setLoading(true);

    let imageUrl = '';

    if (image.data) {
      try {
        const imgRes = await handleImageUpload();
        imageUrl = `${API_BASE_URL}/files/${imgRes.data.fileName}`;
      } catch (error) {
        setLoading(false);
        return;
      }
    }

    if (content || imageUrl) {
      const request = { content: content, image: imageUrl, username: userName };

      try {
        const postResponse = await axios.post(`${API_BASE_URL}/api/createtweet`, request, CONFIG_OBJ);

        if (postResponse.status === 200) {
          setContent('');
          setImage({ preview: '', data: null });
          setShow(false);
          updateTweets(); // Update tweets on successful tweet creation
          toast.success('Tweet posted successfully');
        } else {
          toast.error('Failed to post tweet');
        }
      } catch (error) {
        toast.error('Failed to post tweet');
      }
    } else {
      toast.error('Please provide content  upload an image');
    }

    setLoading(false);
  };

  return (
    <>
      <div className="col-md-12 p-4 d-flex align-items-center justify-content-between">
        <h2>Hello</h2>
        <button onClick={handleShow} className="btn btn-danger float-end t-btn">Tweet</button>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Tweet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Control
                onChange={(ev) => setContent(ev.target.value)}
                as="textarea"
                rows={3}
                value={content}
                placeholder="What's happening?"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control name='file' type="file" onChange={handleImageChange} />
            </Form.Group>
            {image.preview && (
              <Container>
                <Row>
                  <Col xs={6} md={4}>
                    <Image className='img-fluid' src={image.preview} rounded />
                  </Col>
                </Row>
              </Container>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button type='button' onClick={addTweet} className='btn btn-dark mb-3' disabled={loading}>
            {loading ? (
              <span>Loading...</span>
            ) : (
              <span>Tweet</span>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
}

export default CreateTweet;



