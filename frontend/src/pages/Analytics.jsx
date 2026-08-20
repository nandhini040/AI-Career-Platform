import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '../api';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('analytics/');
        setData(response.data);
      } catch (err) {
        setError('Failed to load performance analytics.');
      }
    };
    fetchAnalytics();
  }, []);

  if (error) return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;
  if (!data) return <Container className="mt-5">Loading analytics...</Container>;

  return (
    <Container fluid className="mt-4 px-4">
      <h2 className="mb-4">Performance Dashboard</h2>
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title className="text-muted">Avg Interview Score</Card.Title>
              <h3 className={data.summary.avg_interview_score >= 70 ? 'text-success' : 'text-warning'}>
                {data.summary.avg_interview_score}%
              </h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title className="text-muted">Total Interviews</Card.Title>
              <h3>{data.summary.total_interviews}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title className="text-muted">Avg Coding Score</Card.Title>
              <h3 className={data.summary.avg_coding_score >= 70 ? 'text-success' : 'text-warning'}>
                {data.summary.avg_coding_score}%
              </h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title className="text-muted">Coding Submissions</Card.Title>
              <h3>{data.summary.total_coding_problems}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">Recent Interview Performance</Card.Header>
            <Card.Body>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={data.interview_chart_data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">Recent Coding Performance</Card.Header>
            <Card.Body>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={data.coding_chart_data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Analytics;
