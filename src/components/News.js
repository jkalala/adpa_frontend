import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const NewsContainer = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 2rem auto;

  h2 {
    margin-bottom: 1.5rem;
  }

  div {
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
    }

    h3 {
      margin-bottom: 0.5rem;
    }

    p {
      color: #555;
    }

    small {
      color: #888;
    }
  }
`;

const News = () => {
  const [news, setNews] = useState([]);

  const formatContent = (content) => {
    if (Array.isArray(content)) {
      return content
        .map((block) => block.children?.map((child) => child.text || '').join(' ') || '')
        .join(' ');
    }
    return content || 'No Content';
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/news');
        console.log('API Response:', response.data); // Log the response

        if (response.data && response.data.data) {
          const formattedNews = response.data.data.map((item) => ({
            id: item.id,
            title: item.title || 'No Title',
            content: formatContent(item.content), // Format the content
            published_at: item.publishedNewsAt || new Date().toISOString(), // Use publishedNewsAt
            image: item.image?.url || null, // Adjust if image field exists
          }));
          setNews(formattedNews);
        } else {
          console.error('Unexpected API response structure:', response.data);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, []);

  return (
    <NewsContainer>
      <h2>News</h2>
      {news.map((article) => (
        <div key={article.id}>
          <h3>{article.title}</h3>
          <p>{article.content}</p>
          {article.image && (
            <img
              src={`http://localhost:1337${article.image}`}
              alt={article.title}
              style={{ maxWidth: '100%', marginBottom: '1rem' }}
            />
          )}
          <small>
            {new Date(article.published_at).toLocaleDateString()} {/* Render the date */}
          </small>
        </div>
      ))}
    </NewsContainer>
  );
};

export default News;