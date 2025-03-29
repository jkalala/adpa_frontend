import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import { FiClock, FiAlertCircle, FiRefreshCw, FiChevronDown, FiChevronUp } from 'react-icons/fi';

// Styled Components
const NewsContainer = styled.div`
  background-color: #ffffff;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  max-width: 900px;
  margin: 2rem auto;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
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

const NewsArticle = styled.article`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #f0f0f0;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const ArticleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ArticleTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  flex: 1;
`;

const ArticleDate = styled.small`
  display: flex;
  align-items: center;
  color: #6b7280;
  font-size: 0.875rem;
  margin-left: 1.5rem;

  svg {
    margin-right: 0.5rem;
  }
`;

const ArticleContent = styled.div`
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 1.25rem;

  p {
    margin-bottom: 1rem;
  }
`;

const ArticleImage = styled.img`
  width: 100%;
  border-radius: 8px;
  margin-bottom: 1.25rem;
  object-fit: cover;
  height: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
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

  button {
    margin-top: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
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

const ReadMoreButton = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0;
  margin-top: 0.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: #2563eb;
  }

  svg {
    transition: transform 0.2s ease;
  }
`;

// Loading animation
const shimmer = keyframes`
  0% { background-position: -468px 0 }
  100% { background-position: 468px 0 }
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

const LoadingImagePlaceholder = styled(LoadingPlaceholder)`
  height: 300px;
  margin-bottom: 1.25rem;
`;

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedArticles, setExpandedArticles] = useState({});

  const toggleExpand = (articleId) => {
    setExpandedArticles(prev => ({
      ...prev,
      [articleId]: !prev[articleId]
    }));
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
        // Initialize all articles as not expanded
        setExpandedArticles(
          formattedNews.reduce((acc, article) => {
            acc[article.id] = false;
            return acc;
          }, {})
        );
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

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading) {
    return (
      <NewsContainer>
        <NewsHeader>
          <h2>News</h2>
        </NewsHeader>
        {[...Array(2)].map((_, i) => (
          <NewsArticle key={i}>
            <ArticleHeader>
              <ArticleTitle>
                <LoadingPlaceholder width="70%" />
              </ArticleTitle>
              <ArticleDate>
                <LoadingPlaceholder width="100px" />
              </ArticleDate>
            </ArticleHeader>
            <ArticleContent>
              <LoadingPlaceholder />
              <LoadingPlaceholder width="90%" />
              <LoadingPlaceholder width="80%" />
            </ArticleContent>
            <LoadingImagePlaceholder />
          </NewsArticle>
        ))}
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

      {news.length === 0 ? (
        <p>No news articles found.</p>
      ) : (
        news.map((article) => {
          // Calculate half of the content
          const halfContentLength = Math.ceil(article.textContent.length / 2);
          const showHalfContent = !expandedArticles[article.id] && article.textContent.length > 1;
          const displayContent = showHalfContent 
            ? article.textContent.slice(0, halfContentLength)
            : article.textContent;

          return (
            <NewsArticle key={article.id}>
              <ArticleHeader>
                <ArticleTitle>{article.title}</ArticleTitle>
                <ArticleDate>
                  <FiClock /> {new Date(article.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </ArticleDate>
              </ArticleHeader>
              
              {article.image && (
                <ArticleImage
                  src={article.image.includes('http') ? article.image : `http://localhost:1337${article.image}`}
                  alt={article.title}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              
              <ArticleContent>
                {displayContent?.length > 0 ? (
                  displayContent.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))
                ) : (
                  <p>No content available</p>
                )}

                {article.textContent.length > 1 && (
                  <ReadMoreButton onClick={() => toggleExpand(article.id)}>
                    {expandedArticles[article.id] ? (
                      <>
                        <FiChevronUp /> Show Less
                      </>
                    ) : (
                      <>
                        <FiChevronDown /> Read More
                      </>
                    )}
                  </ReadMoreButton>
                )}
              </ArticleContent>
            </NewsArticle>
          );
        })
      )}
    </NewsContainer>
  );
};

export default News;