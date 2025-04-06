import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Spinner, Alert, Badge, Modal } from 'react-bootstrap';
import { FiZoomIn, FiRefreshCw, FiExternalLink, FiFilter, FiX } from 'react-icons/fi';
import styled, { keyframes } from 'styled-components';

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scaleIn = keyframes`
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: -468px 0 }
  100% { background-position: 468px 0 }
`;

// Styled Components
const GalleryContainer = styled.div`
  padding: 3rem 0;
  animation: ${fadeIn} 0.8s ease-out;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 15px;
  padding-right: 15px;
`;

const GalleryHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 1rem;
    position: relative;
    display: inline-block;
    
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 4px;
      background: linear-gradient(90deg, #4cc9f0, #4361ee);
      border-radius: 2px;
    }
  }
  
  p {
    color: #6c757d;
    font-size: 1.1rem;
    max-width: 700px;
    margin: 0 auto;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const FilterButton = styled.button`
  background: ${props => props.active ? 'linear-gradient(135deg, #4cc9f0, #4361ee)' : '#f8f9fa'};
  color: ${props => props.active ? 'white' : '#495057'};
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: 50px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: ${props => props.active ? '0 4px 10px rgba(76, 201, 240, 0.3)' : 'none'};
  
  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, #3ab8df, #3250d4)' : '#e9ecef'};
    color: ${props => props.active ? 'white' : '#212529'};
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  &:focus {
    box-shadow: 0 0 0 0.25rem rgba(76, 201, 240, 0.25);
    outline: none;
  }
`;

const GalleryGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -0.75rem;
`;

const GalleryItem = styled.div`
  padding: 0.75rem;
  animation: ${scaleIn} 0.5s ease-out;
  animation-fill-mode: both;
  animation-delay: ${props => props.index * 0.1}s;
  width: ${props => {
    if (props.xs) return '50%';
    if (props.md) return '33.333333%';
    if (props.lg) return '25%';
    return '100%';
  }};
  
  @media (max-width: 767.98px) {
    width: 50%;
  }
  
  @media (min-width: 768px) and (max-width: 991.98px) {
    width: 33.333333%;
  }
  
  @media (min-width: 992px) {
    width: 25%;
  }
`;

const ImageCard = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  background: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    
    .image-overlay {
      opacity: 1;
    }
    
    .image-container img {
      transform: scale(1.05);
    }
  }
`;

const ImageContainer = styled.div`
  position: relative;
  padding-top: 100%;
  overflow: hidden;
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  .zoom-icon {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(4px);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: scale(0.8);
    transition: all 0.3s ease;
    
    svg {
      color: white;
      font-size: 1.5rem;
    }
  }
  
  &:hover .zoom-icon {
    transform: scale(1);
  }
`;

const ImageInfo = styled.div`
  padding: 1.25rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  
  h6 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #1a1a2e;
  }
  
  .badge {
    align-self: flex-start;
    background: linear-gradient(135deg, #4cc9f0, #4361ee);
    border: none;
    padding: 0.4rem 0.8rem;
    font-weight: 500;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  
  .spinner-border {
    width: 3rem;
    height: 3rem;
    color: #4cc9f0;
  }
  
  p {
    margin-top: 1rem;
    color: #6c757d;
    font-size: 1.1rem;
  }
`;

const ErrorContainer = styled.div`
  border-radius: 12px;
  border: none;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  background-color: #f8d7da;
  color: #842029;
  
  h4 {
    color: #dc3545;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  pre {
    white-space: pre-wrap;
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
    font-size: 0.9rem;
    border: 1px solid #e9ecef;
  }
  
  .btn {
    border-radius: 50px;
    padding: 0.5rem 1.25rem;
    font-weight: 500;
    
    &.btn-primary {
      background: linear-gradient(135deg, #4cc9f0, #4361ee);
      border: none;
      
      &:hover {
        background: linear-gradient(135deg, #3ab8df, #3250d4);
      }
    }
  }
`;

const StyledBadge = styled.span`
  display: inline-block;
  padding: 0.4rem 0.8rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.5;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
  background: linear-gradient(135deg, #4cc9f0, #4361ee);
  color: white;
  text-transform: capitalize;
`;

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredImages, setFilteredImages] = useState([]);

  // Strapi API configuration
  const API_BASE_URL = 'http://localhost:1337';
  const API_URL = `${API_BASE_URL}/api/galleries`;

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);

      // First verify Strapi is running
      try {
        await axios.get(API_BASE_URL);
      } catch (err) {
        throw new Error(`Cannot connect to Strapi server at ${API_BASE_URL}. Make sure:
        - Strapi server is running
        - The URL is correct
        - No CORS issues exist (check browser console)`);
      }

      // Fetch gallery data with proper population
      const response = await axios.get(API_URL, {
        params: {
          populate: {
            image: { populate: '*' },
            thumbnail: { populate: '*' }
          }
        }
      });

      if (!response.data?.data) {
        throw new Error('API returned invalid data structure');
      }

      // Process gallery items
      console.log('API Response:', JSON.stringify(response.data, null, 2));
      
      const processedImages = response.data.data.map(item => {
        try {
          console.log('Processing item:', JSON.stringify(item, null, 2));
          
          // Check if we have the expected structure
          if (!item) {
            console.warn('Item is null or undefined');
            return null;
          }
          
          // Get the first available image source
          const imageData = item.image;
          const thumbnailData = item.thumbnail;
          
          console.log('Image data:', JSON.stringify(imageData, null, 2));
          console.log('Thumbnail data:', JSON.stringify(thumbnailData, null, 2));
          
          // Get the first available media source
          const mediaSource = imageData || thumbnailData;
          
          if (!mediaSource?.url) {
            console.warn(`No valid image found for item ${item.id}`);
            return null;
          }
          
          // Construct URLs - handles both local and absolute paths
          const imageUrl = mediaSource.url.startsWith('http')
            ? mediaSource.url
            : `${API_BASE_URL}${mediaSource.url.startsWith('/') ? '' : '/'}${mediaSource.url}`;
          
          console.log('Image URL:', imageUrl);
          
          // Get thumbnail URL
          let thumbnailUrl = imageUrl;
          
          // Try to get thumbnail from formats
          if (mediaSource.formats?.thumbnail?.url) {
            thumbnailUrl = mediaSource.formats.thumbnail.url.startsWith('http')
              ? mediaSource.formats.thumbnail.url
              : `${API_BASE_URL}${mediaSource.formats.thumbnail.url.startsWith('/') ? '' : '/'}${mediaSource.formats.thumbnail.url}`;
            console.log('Thumbnail URL from formats:', thumbnailUrl);
          }
          
          // If we have a separate thumbnail, use that
          if (thumbnailData?.url) {
            thumbnailUrl = thumbnailData.url.startsWith('http')
              ? thumbnailData.url
              : `${API_BASE_URL}${thumbnailData.url.startsWith('/') ? '' : '/'}${thumbnailData.url}`;
            console.log('Thumbnail URL from separate thumbnail:', thumbnailUrl);
          }
          
          const result = {
            id: item.id,
            title: item.titlephoto || `Image ${item.id}`,
            imageUrl,
            thumbnailUrl,
            category: item.category || 'general',
            description: item.description?.[0]?.children?.[0]?.text || '',
            date: item.date || ''
          };
          
          console.log('Processed result:', result);
          return result;
        } catch (err) {
          console.error(`Error processing item ${item?.id || 'unknown'}:`, err);
          return null;
        }
      }).filter(Boolean);
      
      console.log('Final processed images:', processedImages);

      if (processedImages.length === 0) {
        throw new Error(`
          Gallery loaded but no images displayed. Please verify:

          1. MEDIA FIELDS:
             - Go to Content Manager → Gallery
             - Edit each item and ensure either:
               * 'image' field has a media file, or
               * 'thumbnail' field has a media file
             - Click "Save" then "Publish"

          2. PERMISSIONS:
             - Settings → Users & Permissions → Roles → Public
             - Enable permissions for:
               * Gallery - find, findOne
               * Media - find, findOne
               * Upload - read

          3. TEST API ENDPOINT:
             ${API_URL}?populate[image][populate]=*&populate[thumbnail][populate]=*
        `);
      }

      setImages(processedImages);
      setFilteredImages(processedImages);
    } catch (err) {
      console.error('Gallery loading failed:', err);
      setError(err.response?.data?.error?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter(img => img.category === activeFilter));
    }
  }, [activeFilter, images]);

  const getUniqueCategories = () => {
    const categories = ['all', ...new Set(images.map(img => img.category))];
    return categories;
  };

  // Prepare slides for lightbox
  const prepareSlides = () => {
    return filteredImages.map(image => ({
      src: image.imageUrl,
      alt: image.title,
      title: image.title,
      description: image.description || ''
    }));
  };

  if (loading) {
    return (
      <GalleryContainer>
        <LoadingContainer>
          <Spinner animation="border" />
          <p>Loading gallery...</p>
        </LoadingContainer>
      </GalleryContainer>
    );
  }

  if (error) {
    return (
      <GalleryContainer>
        <ErrorContainer>
          <h4>Gallery Loading Error</h4>
          <pre>
            {error}
          </pre>
          <div className="mt-3 d-flex gap-2">
            <Button 
              variant="primary" 
              onClick={fetchImages}
            >
              <FiRefreshCw className="me-1" /> Try Again
            </Button>
            <Button 
              variant="outline-secondary" 
              href={`${API_URL}?populate[image][populate]=*&populate[thumbnail][populate]=*`} 
              target="_blank"
            >
              <FiExternalLink className="me-1" /> Test API Endpoint
            </Button>
          </div>
        </ErrorContainer>
      </GalleryContainer>
    );
  }

  return (
    <GalleryContainer>
      <GalleryHeader>
        <h2>Our Gallery</h2>
        <p>Explore our collection of images showcasing the beauty and diversity of African diamonds</p>
      </GalleryHeader>
      
      <FilterContainer>
        {getUniqueCategories().map(category => (
          <FilterButton
            key={category}
            active={activeFilter === category}
            onClick={() => setActiveFilter(category)}
          >
            {category === 'all' ? 'All Images' : category.charAt(0).toUpperCase() + category.slice(1)}
          </FilterButton>
        ))}
      </FilterContainer>
      
      <GalleryGrid>
        {filteredImages.map((image, index) => (
          <GalleryItem key={image.id} index={index}>
            <ImageCard
              onClick={() => {
                setLightboxIndex(index);
                setIsOpen(true);
              }}
            >
              <ImageContainer>
                <img
                  src={image.thumbnailUrl}
                  alt={image.title}
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgZmlsbD0iI2Y4ZjlmYSIvPjxwYXRoIGQ9Ik0yNTYgOEMxMTkgOCA4IDExOSA4IDI1NnMxMTEgMjQ4IDI0OCAyNDggMjQ4LTExMSAyNDgtMjQ4UzM5MyA4IDI1NiA4em0wIDQ0OGMtMTEwLjUgMC0yMDAtODkuNS0yMDAtMjAwUzE0NS41IDU2IDI1NiA1NnMyMDAgODkuNSAyMDAgMjAwLTg5LjUgMjAwLTIwMCAyMDB6bTMyLjItMTQzLjJoLTE2Ljd2LTE2LjdoMTYuN3YxNi43em0wLTY2LjdoLTE2Ljd2LTgzLjNoMTYuN3Y4My4zeiIgZmlsbD0iI2RkZGRkZCIvPjwvc3ZnPg==`;
                  }}
                />
                <ImageOverlay className="image-overlay">
                  <div className="zoom-icon">
                    <FiZoomIn size={24} />
                  </div>
                </ImageOverlay>
              </ImageContainer>
              <ImageInfo>
                <h6>{image.title}</h6>
                {image.category && (
                  <StyledBadge>
                    {image.category}
                  </StyledBadge>
                )}
              </ImageInfo>
            </ImageCard>
          </GalleryItem>
        ))}
      </GalleryGrid>

      <Modal
        show={isOpen}
        onHide={() => setIsOpen(false)}
        size="lg"
        centered
        className="gallery-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{filteredImages[lightboxIndex]?.title || 'Image'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {filteredImages[lightboxIndex] && (
            <div className="text-center">
              <img 
                src={filteredImages[lightboxIndex].imageUrl} 
                alt={filteredImages[lightboxIndex].title}
                style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
              />
              {filteredImages[lightboxIndex].description && (
                <div className="p-3">
                  <p>{filteredImages[lightboxIndex].description}</p>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </GalleryContainer>
  );
};

export default Gallery;