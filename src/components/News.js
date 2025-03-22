import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
//import { LanguageContext } from '../contexts/LanguageContext';

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
    //const { language } = useContext(LanguageContext);

    useEffect(() => {
        fetch('http://localhost:8000/api/news/?language=en')  // Ensure this URL is correct
            .then((response) => response.json())
            .then((data) => setNews(data))
            .catch((error) => console.error('Error fetching news:', error));
    }, []);

    return (
        <NewsContainer>
            <h2>News</h2>
            {news.map((article, index) => (
                <div key={index}>
                    <h3>{article.title}</h3>
                    <p>{article.content}</p>
                    <small>{new Date(article.published_at).toLocaleDateString()}</small>
                </div>
            ))}
        </NewsContainer>
    );
};

export default News;