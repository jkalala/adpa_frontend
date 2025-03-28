import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import styled from 'styled-components';
import { FiFilter, FiX, FiZoomIn, FiRefreshCw } from 'react-icons/fi';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

// Styled Components
const GalleryContainer = styled(Container)`
  padding: 4rem 0;
  min-height: 70vh;
`;

const FilterButton = styled(Button)`
  margin: 0.5rem;
  border-radius: 20px;
  border: 1px solid #ddd;
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

const GalleryItem = styled(Col)`
  position: relative;
  margin-bottom: 1.5rem;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.15);

    .overlay {
      opacity: 1;
    }
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  padding-top: 100%;
  background: #f8f9fa;
`;

const StyledImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;

  svg {
    color: white;
    font-size: 2rem;
  }
`;

const CategoryBadge = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  text-transform: capitalize;
`;

const ErrorContainer = styled.div`
  background: #fff5f5;
  padding: 2rem;
  border-radius: 8px;
  margin-top: 2rem;
`;

const Placeholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  color: #6c757d;
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
      const response = await axios.get(`${API_URL}/galleries?populate=*`, {
        timeout: 10000
      });

      if (!response.data?.data) {
        throw new Error('Invalid API response structure');
      }

      // Process images with comprehensive error handling
      const formattedImages = response.data.data
        .map(item => {
          try {
            // Skip items without required image data
            if (!item.attributes?.image?.data?.attributes?.url) {
              console.warn(`Skipping gallery item ${item.id} - missing image data`);
              return null;
            }

            const imageAttrs = item.attributes.image.data.attributes;
            const thumbnailAttrs = item.attributes.thumbnail?.data?.attributes;

            return {
              id: item.id,
              title: item.attributes?.titlephoto || 'Untitled',
              imageUrl: `${API_BASE_URL}${imageAttrs.url}`,
              thumbnailUrl: thumbnailAttrs?.url 
                ? `${API_BASE_URL}${thumbnailAttrs.url}`
                : imageAttrs.formats?.thumbnail?.url
                  ? `${API_BASE_URL}${imageAttrs.formats.thumbnail.url}`
                  : `${API_BASE_URL}${imageAttrs.url}`,
              category: item.attributes?.category || 'uncategorized',
              description: item.attributes?.description?.[0]?.children?.[0]?.text || '',
              date: item.attributes?.date || ''
            };
          } catch (mapError) {
            console.error(`Error processing gallery item ${item.id}:`, mapError);
            return null;
          }
        })
        .filter(item => item !== null); // Remove null entries

      if (formattedImages.length === 0) {
        throw new Error('No valid images found in gallery');
      }

      setImages(formattedImages);
    } catch (err) {
      let errorMessage = 'Failed to load gallery. ';
      
      if (err.message.includes('Cannot connect')) {
        errorMessage += `Server not running at ${API_BASE_URL}.`;
      } else if (err.message.includes('No valid images')) {
        errorMessage += 'All gallery items are missing image data.';
      } else if (err.response?.status === 404) {
        errorMessage += 'Gallery endpoint not found.';
      } else if (err.message.includes('Invalid API response')) {
        errorMessage += 'Unexpected data structure from API.';
      } else {
        errorMessage += err.message;
      }
      
      setError(errorMessage);
      console.error('Gallery Error:', err);
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

  if (error) {
    return (
      <GalleryContainer className="text-center">
        <ErrorContainer>
          <Alert variant="danger">
            <h4>Gallery Loading Error</h4>
            <p>{error}</p>
            
            <div className="mt-4">
              <h5>Troubleshooting Steps:</h5>
              <ol className="text-start">
                <li>Ensure Strapi server is running at <code>{API_BASE_URL}</code></li>
                <li>Verify the gallery content type exists in Strapi admin</li>
                <li>Check API permissions in Settings → Users & Permissions</li>
                <li>Confirm images are uploaded in Media Library</li>
                <li>Test the endpoint directly: <br/>
                  <code>{API_URL}/galleries?populate=*</code>
                </li>
              </ol>
            </div>
          </Alert>
          
          <Button 
            variant="primary" 
            onClick={fetchImages}
            className="mt-3"
          >
            <FiRefreshCw className="me-2" />
            Retry Loading Gallery
          </Button>
        </ErrorContainer>
      </GalleryContainer>
    );
  }

  return (
    <GalleryContainer>
      <h2 className="text-center mb-5">Gallery</h2>
      
      {/* Filter Controls */}
      <div className="text-center mb-4">
        {categories.map(category => (
          <FilterButton
            key={category}
            active={activeFilter === category}
            onClick={() => setActiveFilter(category)}
            variant={activeFilter === category ? 'primary' : 'light'}
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
          </FilterButton>
        ))}
      </div>

      {/* Gallery Grid */}
      <Row>
        {filteredImages.length > 0 ? (
          filteredImages.map((image, index) => (
            <GalleryItem 
              key={image.id} 
              xs={12} sm={6} md={4} lg={3}
              onClick={() => openLightbox(index)}
            >
              <ImageWrapper>
                {image.imageUrl ? (
                  <>
                    <StyledImage 
                      src={image.thumbnailUrl} 
                      alt={image.title}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = '';
                        console.error(`Failed to load image: ${image.thumbnailUrl}`);
                      }}
                    />
                    <Overlay className="overlay">
                      <FiZoomIn />
                    </Overlay>
                  </>
                ) : (
                  <Placeholder>
                    Image unavailable
                  </Placeholder>
                )}
                {image.category && (
                  <CategoryBadge>{image.category}</CategoryBadge>
                )}
              </ImageWrapper>
            </GalleryItem>
          ))
        ) : (
          <Col className="text-center py-5">
            <Alert variant="info">No images found in this category.</Alert>
          </Col>
        )}
      </Row>

      {/* Lightbox */}
      {isOpen && filteredImages.length > 0 && (
        <Lightbox
          mainSrc={filteredImages[lightboxIndex]?.imageUrl}
          nextSrc={filteredImages[(lightboxIndex + 1) % filteredImages.length]?.imageUrl}
          prevSrc={filteredImages[(lightboxIndex + filteredImages.length - 1) % filteredImages.length]?.imageUrl}
          onCloseRequest={closeLightbox}
          onMovePrevRequest={() => setLightboxIndex((lightboxIndex + filteredImages.length - 1) % filteredImages.length)}
          onMoveNextRequest={() => setLightboxIndex((lightboxIndex + 1) % filteredImages.length)}
          imageTitle={filteredImages[lightboxIndex]?.title}
          imageCaption={filteredImages[lightboxIndex]?.description}
        />
      )}
    </GalleryContainer>
  );
};

export default Gallery;