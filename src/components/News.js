import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import { FiClock, FiAlertCircle, FiRefreshCw, FiX } from 'react-icons/fi';

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -468px 0 }
  100% { background-position: 468px 0 }
`;

// Styled Components
const NewsContainer = styled.div`
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  max-width: 100%;
  margin: 2rem auto;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  position: relative;
`;

const NewsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f0f0f0;

  h2 {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 700;
    color: #1a1a1a;
  }
`;

const NewsScroller = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  gap: 1.5rem;
  padding: 1rem 0;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const NewsArticle = styled.article`
  min-width: 320px;
  max-width: 380px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  transition: all 0.3s ease;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
`;

const ArticleImage = styled.img`
  width: 100%;
  height: 180px;
  border-radius: 8px;
  margin-bottom: 1.25rem;
  object-fit: cover;
`;

const ArticleHeader = styled.div`
  margin-bottom: 1rem;
`;

const ArticleTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.4;
`;

const ArticleDate = styled.small`
  display: flex;
  align-items: center;
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;

  svg {
    margin-right: 0.5rem;
  }
`;

const ArticleContent = styled.div`
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 1rem;
  flex-grow: 1;

  p {
    margin-bottom: 1rem;
    display: -webkit-box;
    -webkit-line-clamp: ${props => props.collapsed ? '3' : 'unset'};
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const ReadMoreButton = styled.button`
  background: none;
  border: 1px solid #e5e7eb;
  color: #3b82f6;
  cursor: pointer;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  align-self: flex-start;
  margin-top: auto;

  &:hover {
    background-color: #f0f7ff;
    border-color: #3b82f6;
  }

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
`;

const NavigationControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const NavButton = styled.button`
  background: ${props => props.active ? '#3b82f6' : '#f3f4f6'};
  color: ${props => props.active ? 'white' : '#4b5563'};
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? '#2563eb' : '#e5e7eb'};
  }
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #fef2f2;
  border-radius: 8px;
  color: #dc2626;
  text-align: center;

  svg {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
`;

const RefreshButton = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f0f7ff;
  }
`;

const LoadingPlaceholder = styled.div`
  background: linear-gradient(to right, #f6f7f8 8%, #edeef1 18%, #f6f7f8 33%);
  background-size: 800px 104px;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: 4px;
  height: ${props => props.height || '20px'};
  width: ${props => props.width || '100%'};
  margin-bottom: ${props => props.marginBottom || '0.5rem'};
`;

const LoadingImagePlaceholder = styled.div`
  width: 100%;
  height: 180px;
  border-radius: 8px;
  margin-bottom: 1.25rem;
  background: linear-gradient(to right, #f6f7f8 8%, #edeef1 18%, #f6f7f8 33%);
  background-size: 800px 104px;
  animation: ${shimmer} 1.5s infinite linear;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 2rem;
  overflow-y: auto;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: ${fadeIn} 0.3s ease-out;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
`;

const ModalCloseButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f3f4f6;
    color: #1a1a1a;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const ModalImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const ModalDate = styled.div`
  display: flex;
  align-items: center;
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;

  svg {
    margin-right: 0.5rem;
  }
`;

const ModalText = styled.div`
  color: #4b5563;
  line-height: 1.8;
  font-size: 1.05rem;

  p {
    margin-bottom: 1.5rem;
  }
`;

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedArticleId, setExpandedArticleId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalArticle, setModalArticle] = useState(null);
  const scrollerRef = useRef(null);
  const articleRefs = useRef([]);

  const toggleExpand = (articleId, index) => {
    setExpandedArticleId(prev => prev === articleId ? null : articleId);
    setCurrentIndex(index);
    
    setTimeout(() => {
      if (articleRefs.current[index] && scrollerRef.current) {
        const article = articleRefs.current[index];
        const container = scrollerRef.current;
        const containerWidth = container.offsetWidth;
        const articleWidth = article.offsetWidth;
        const articleLeft = article.offsetLeft;
        
        container.scrollTo({
          left: articleLeft - (containerWidth / 2) + (articleWidth / 2),
          behavior: 'smooth'
        });
        
        article.focus();
      }
    }, 50);
  };

  const scrollToArticle = (index) => {
    if (scrollerRef.current && news.length > 0) {
      const articleWidth = 320 + 24;
      scrollerRef.current.scrollTo({
        left: index * articleWidth,
        behavior: 'smooth'
      });
      setCurrentIndex(index);
    }
  };

  const formatContent = (content) => {
    if (!content || !Array.isArray(content)) return [];
    
    return content
      .filter(block => block.type === 'paragraph' && block.children)
      .map(block => ({
        text: block.children.map(child => child.text || '').join(' '),
        hasImage: block.children.some(child => 
          child.type === 'text' && 
          child.text.includes('Image:') &&
          child.text.includes('(Petra Diamonds)')
        )
      }))
      .filter(item => item.text.trim() !== '');
  };

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('http://localhost:1337/api/news?populate=*');
      
      if (response.data?.data) {
        const formattedNews = response.data.data.map(item => {
          const contentBlocks = formatContent(item.content || []);
          const imageBlock = contentBlocks.find(block => block.hasImage);
          const textBlocks = contentBlocks.filter(block => !block.hasImage);

          return {
            id: item.id,
            title: item.title || 'No Title',
            textContent: textBlocks.map(block => block.text),
            publishedAt: item.publishedNewsAt || item.publishedAt || item.createdAt,
            image: item.image?.url || 
                  item.image?.formats?.large?.url || 
                  (imageBlock ? imageBlock.text.replace('Image: ', '') : null)
          };
        }).filter(item => item);
        
        setNews(formattedNews);
      } else {
        throw new Error('No data received from API');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setError(`Failed to load news: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (article) => {
    setModalArticle(article);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalArticle(null);
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading) {
    return (
      <NewsContainer>
        <NewsHeader>
          <h2>News</h2>
        </NewsHeader>
        <NewsScroller>
          {[...Array(4)].map((_, i) => (
            <NewsArticle key={i}>
              <LoadingImagePlaceholder />
              <ArticleHeader>
                <ArticleTitle>
                  <LoadingPlaceholder width="80%" />
                </ArticleTitle>
                <ArticleDate>
                  <LoadingPlaceholder width="120px" />
                </ArticleDate>
              </ArticleHeader>
              <ArticleContent>
                <LoadingPlaceholder />
                <LoadingPlaceholder />
              </ArticleContent>
              <ReadMoreButton>
                <LoadingPlaceholder width="80px" height="20px" />
              </ReadMoreButton>
            </NewsArticle>
          ))}
        </NewsScroller>
        <NavigationControls>
          {[...Array(4)].map((_, i) => (
            <NavButton key={i} active={i === 0}>
              {i + 1}
            </NavButton>
          ))}
        </NavigationControls>
      </NewsContainer>
    );
  }

  if (error) {
    return (
      <NewsContainer>
        <NewsHeader>
          <h2>News</h2>
        </NewsHeader>
        <ErrorState>
          <FiAlertCircle />
          <p>{error}</p>
          <RefreshButton onClick={fetchNews}>
            <FiRefreshCw /> Try Again
          </RefreshButton>
        </ErrorState>
      </NewsContainer>
    );
  }

  return (
    <NewsContainer>
      <NewsHeader>
        <h2>Latest News</h2>
        <RefreshButton onClick={fetchNews}>
          <FiRefreshCw /> Refresh
        </RefreshButton>
      </NewsHeader>

      <NewsScroller ref={scrollerRef}>
        {news.length === 0 ? (
          <p>No news articles found.</p>
        ) : (
          news.map((article, index) => {
            const isExpanded = expandedArticleId === article.id;
            const displayContent = isExpanded ? article.textContent : [article.textContent[0]];

            return (
              <NewsArticle 
                key={article.id}
                ref={el => articleRefs.current[index] = el}
                tabIndex="0"
                id={`article-${article.id}`}
                aria-expanded={isExpanded}
              >
                {article.image && (
                  <ArticleImage
                    src={article.image.includes('http') ? article.image : `http://localhost:1337${article.image}`}
                    alt={article.title}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                
                <ArticleHeader>
                  <ArticleTitle>{article.title}</ArticleTitle>
                  <ArticleDate>
                    <FiClock /> {new Date(article.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </ArticleDate>
                </ArticleHeader>
                
                <ArticleContent collapsed={!isExpanded}>
                  {displayContent?.length > 0 ? (
                    displayContent.map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))
                  ) : (
                    <p>No content available</p>
                  )}
                </ArticleContent>

                <ReadMoreButton 
                  onClick={() => openModal(article)}
                  aria-controls={`article-${article.id}`}
                >
                  Read More
                </ReadMoreButton>
              </NewsArticle>
            );
          })
        )}
      </NewsScroller>

      {news.length > 0 && (
        <NavigationControls>
          {news.map((_, index) => (
            <NavButton 
              key={index} 
              active={index === currentIndex}
              onClick={() => scrollToArticle(index)}
            >
              {index + 1}
            </NavButton>
          ))}
        </NavigationControls>
      )}

      {/* News Modal */}
      {modalArticle && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{modalArticle.title}</ModalTitle>
              <ModalCloseButton onClick={closeModal}>
                <FiX />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              {modalArticle.image && (
                <ModalImage
                  src={modalArticle.image.includes('http') ? modalArticle.image : `http://localhost:1337${modalArticle.image}`}
                  alt={modalArticle.title}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <ModalDate>
                <FiClock /> {new Date(modalArticle.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </ModalDate>
              <ModalText>
                {modalArticle.textContent.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </ModalText>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </NewsContainer>
  );
};

export default News;