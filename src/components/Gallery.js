import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Gallery = () => {
    const [gallery, setGallery] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/gallery/')
            .then((response) => response.json())
            .then((data) => {
                console.log('Fetched gallery:', data);
                setGallery(data);
            })
            .catch((error) => console.error('Error fetching gallery:', error));
    }, []);

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">Gallery</h2>
            <Row>
                {gallery.map((image, index) => (
                    <Col key={index} md={4} className="mb-4">
                        <Card>
                            <Card.Img variant="top" src={image.image} alt={image.caption} />
                            <Card.Body>
                                <Card.Text>{image.caption}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Gallery;