import React, { useEffect, useState } from 'react';
import styled from 'styled-components';


const DashboardContainer = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 2rem auto;

  h2 {
    margin-bottom: 1.5rem;
    color: #2c3e50;
  }

  .stats {
    display: flex;
    justify-content: space-around;
    gap: 1rem;
    margin-bottom: 1.5rem;

    .stat-item {
      text-align: center;
      padding: 1rem;
      background-color: #f4f4f9;
      border-radius: 8px;
      flex: 1;

      h3 {
        font-size: 1.5rem;
        color: #007bff;
        margin-bottom: 0.5rem;
      }

      p {
        color: #555;
      }
    }
  }

  .chart-placeholder {
    text-align: center;
    padding: 2rem;
    background-color: #f4f4f9;
    border-radius: 8px;
    color: #888;
  }
`;

const AnalyticsDashboard = () => {
    const [stats, setStats] = useState({ total_visits: 0, unique_visitors: 0 });

    useEffect(() => {
        fetch('http://localhost:8000/api/visit-stats/')  // Ensure this URL is correct
            .then((response) => response.json())
            .then((data) => setStats(data))
            .catch((error) => console.error('Error fetching stats:', error));
    }, []);
    return (
        <DashboardContainer>
            <h2>Analytics Dashboard</h2>
            <div className="stats">
                <div className="stat-item">
                    <h3>{stats.total_visits}</h3>
                    <p>Total Visits</p>
                </div>
                <div className="stat-item">
                    <h3>{stats.unique_visitors}</h3>
                    <p>Unique Visitors</p>
                </div>
            </div>
            <div className="chart-placeholder">
                <p>Charts and graphs will be displayed here.</p>
            </div>
        </DashboardContainer>
    );
};

export default AnalyticsDashboard;