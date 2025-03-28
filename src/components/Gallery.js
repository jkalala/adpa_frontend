import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import styled from 'styled-components';
import { FiFilter, FiX, FiZoomIn, FiRefreshCw, FiUpload, FiImage } from 'react-icons/fi';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

// Styled Components
const GalleryContainer = styled(Container)`
  padding: 4rem 0;
  min-height: 70vh;
`;

const EmptyStateContainer = styled.div`
  text-align: center;
  padding: 3rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const AdminGuide = styled.div`
  background: #f0f8ff;
  border-left: 4px solid #1a1a2e;
  padding: 1.5rem;
  margin-top: 2rem;
  text-align: left;
  border-radius: 4px;
`;

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);

  const API_BASE_URL = 'http://localhost:1337';
  const API_URL = `${API_BASE_URL}/api`;

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);

      // Verify server connection
      try {
        await axios.get(API_BASE_URL, { timeout: 3000 });
      } catch (healthError) {
        throw new Error(`Cannot connect to Strapi at ${API_BASE_URL}`);
      }

      // Fetch gallery data
      const response = await axios.get(`${API_URL}/galleries?populate=*`);

      if (!response.data?.data) {
        throw new Error('Invalid API response structure');
      }

      // Process only items with valid image data
      const formattedImages = response.data.data
        .filter(item => {
          const hasImage = item.attributes?.image?.data?.attributes?.url;
          const hasThumbnail = item.attributes?.thumbnail?.data?.attributes?.url;
          return hasImage || hasThumbnail;
        })
        .map(item => {
          const imageData = item.attributes.image?.data?.attributes || 
                          item.attributes.thumbnail?.data?.attributes;

          return {
            id: item.id,
            title: item.attributes.titlephoto || 'Untitled',
            imageUrl: `${API_BASE_URL}${imageData.url}`,
            thumbnailUrl: imageData.formats?.thumbnail?.url 
              ? `${API_BASE_URL}${imageData.formats.thumbnail.url}`
              : `${API_BASE_URL}${imageData.url}`,
            category: item.attributes.category || 'uncategorized',
            description: item.attributes.description?.[0]?.children?.[0]?.text || '',
            date: item.attributes.date || ''
          };
        });

      setImages(formattedImages);
      
      if (formattedImages.length === 0) {
        setError('No gallery items with images found. Please upload images in Strapi admin.');
      }
    } catch (err) {
      setError(err.message || 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Get unique categories
  const categories = ['all', ...new Set(images.map(img => img.category))];

  // Filter images
  const filteredImages = activeFilter === 'all' 
    ? images 
    : images.filter(img => img.category === activeFilter);

  // Lightbox navigation
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
  };

  if (loading) {
    return (
      <GalleryContainer className="text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading gallery...</p>
      </GalleryContainer>
    );
  }

  if (error || images.length === 0) {
    return (
      <GalleryContainer className="text-center">
        <EmptyStateContainer>
          <FiImage size={48} className="mb-3" color="#6c757d" />
          <h3>No Images Found in Gallery</h3>
          <p className="text-muted mb-4">
            The gallery is currently empty or no images have been uploaded.
          </p>
          
          <AdminGuide>
            <h5><FiUpload className="me-2" />Admin Instructions</h5>
            <ol className="text-start">
              <li>Log in to your Strapi admin panel</li>
              <li>Navigate to the Gallery collection type</li>
              <li>Create new gallery items or edit existing ones</li>
              <li>Upload images to each gallery item</li>
              <li>Ensure images are properly saved and published</li>
            </ol>
            
            <Button 
              variant="primary" 
              onClick={fetchImages}
              className="mt-3"
            >
              <FiRefreshCw className="me-2" />
              Check Again
            </Button>
          </AdminGuide>
        </EmptyStateContainer>
      </GalleryContainer>
    );
  }

  return (
    <GalleryContainer>
      <h2 className="text-center mb-5">Gallery</h2>
      
      {/* Filter Controls */}
      <div className="text-center mb-4">
        {categories.map(category => (
          <Button
            key={category}
            variant={activeFilter === category ? 'primary' : 'light'}
            onClick={() => setActiveFilter(category)}
            className="m-1"
          >
            {category === 'all' ? <FiFilter className="me-2" /> : null}
            {category}
            {activeFilter === category && category !== 'all' ? (
              <FiX 
                className="ms-2" 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveFilter('all');
                }} 
              />
            ) : null}
          </Button>
        ))}
      </div>

      {/* Gallery Grid */}
      <Row>
        {filteredImages.map((image, index) => (
          <Col key={image.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <div 
              className="position-relative rounded overflow-hidden shadow-sm hover-shadow-lg transition-all"
              style={{ cursor: 'pointer', height: '100%' }}
              onClick={() => openLightbox(index)}
            >
              <div className="ratio ratio-1x1 bg-light">
                <img
                  src={image.thumbnailUrl}
                  alt={image.title}
                  className="img-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 opacity-0 hover-opacity-100 transition-opacity">
                  <FiZoomIn size={24} color="white" />
                </div>
              </div>
              {image.category && (
                <span className="position-absolute top-0 end-0 m-2 badge bg-dark">
                  {image.category}
                </span>
              )}
            </div>
          </Col>
        ))}
      </Row>

      {/* Lightbox */}
      {isOpen && (
        <Lightbox
          mainSrc={filteredImages[lightboxIndex].imageUrl}
          nextSrc={filteredImages[(lightboxIndex + 1) % filteredImages.length]?.imageUrl}
          prevSrc={filteredImages[(lightboxIndex + filteredImages.length - 1) % filteredImages.length]?.imageUrl}
          onCloseRequest={closeLightbox}
          onMovePrevRequest={() => setLightboxIndex((lightboxIndex + filteredImages.length - 1) % filteredImages.length)}
          onMoveNextRequest={() => setLightboxIndex((lightboxIndex + 1) % filteredImages.length)}
          imageTitle={filteredImages[lightboxIndex].title}
          imageCaption={filteredImages[lightboxIndex].description}
        />
      )}
    </GalleryContainer>
  );
};

export default Gallery;