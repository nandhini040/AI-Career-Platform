import { useContext } from 'react';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FileText, Users, Code, Activity, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <Container className="mt-5 animate-fade-in-up">
      <div className="mb-5 text-center">
        <h1 className="mb-3 d-flex align-items-center justify-content-center gap-3 text-white fw-bold">
          Dashboard <Sparkles color="var(--accent)" />
        </h1>
        {user && <p className="text-muted" style={{ fontSize: '1.2rem' }}>Welcome back, {user.username}! Here's your prep overview.</p>}
      </div>
      
      <Row className="mt-4 g-4">
        <Col md={6}>
          <Card className="h-100 glass-card" style={{ overflow: 'hidden' }}>
            <div style={{ height: '160px', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--glass-border)', overflow: 'hidden' }}>
              <img src="/resume_icon_1785860032901.png" alt="Resume Analyzer" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
            </div>
            <Card.Body className="d-flex flex-column p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent)' }}>
                  <FileText size={24} />
                </div>
                <Card.Title className="mb-0 fs-4">Resume Analyzer</Card.Title>
              </div>
              <Card.Text className="mb-4">
                Upload your resume to get AI-powered feedback, skill gap analysis, and tailored interview preparation.
              </Card.Text>
              <Button variant="primary" className="mt-auto w-100" onClick={() => navigate('/resume')}>
                Upload Resume
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="h-100 glass-card" style={{ overflow: 'hidden' }}>
            <div style={{ height: '160px', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--glass-border)', overflow: 'hidden' }}>
              <img src="/interview_icon_1785860042735.png" alt="Mock Interview" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
            </div>
            <Card.Body className="d-flex flex-column p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
                  <Users size={24} />
                </div>
                <Card.Title className="mb-0 fs-4">Mock Interview</Card.Title>
              </div>
              <Card.Text className="mb-4">
                Practice your interviewing skills with our AI. Configure job role, tech stack, and difficulty.
              </Card.Text>
              <Button variant="primary" className="mt-auto w-100" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.4)' }} onClick={() => navigate('/setup')}>
                Start Interview
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100 glass-card" style={{ overflow: 'hidden' }}>
            <div style={{ height: '160px', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--glass-border)', overflow: 'hidden' }}>
              <img src="/coding_icon_1785860055869.png" alt="Coding Platform" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
            </div>
            <Card.Body className="d-flex flex-column p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="icon-wrapper" style={{ background: 'rgba(2, 132, 199, 0.15)', color: 'var(--info)' }}>
                  <Code size={24} />
                </div>
                <Card.Title className="mb-0 fs-4">Coding Platform</Card.Title>
              </div>
              <Card.Text className="mb-4">
                Practice coding problems in a real IDE environment. Get instant AI code review and scoring.
              </Card.Text>
              <Button variant="primary" className="mt-auto w-100" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.4)' }} onClick={() => navigate('/coding')}>
                Start Coding
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100 glass-card" style={{ overflow: 'hidden' }}>
            <div style={{ height: '160px', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--glass-border)', overflow: 'hidden' }}>
              <img src="/analytics_icon_1785862046615.png" alt="Performance Dashboard" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
            </div>
            <Card.Body className="d-flex flex-column p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                  <Activity size={24} />
                </div>
                <Card.Title className="mb-0 fs-4">Performance Dashboard</Card.Title>
              </div>
              <Card.Text className="mb-4">
                View your historical performance, track your scores over time, and identify areas for improvement.
              </Card.Text>
              <Button variant="primary" className="mt-auto w-100 text-white" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 4px 14px 0 rgba(245, 158, 11, 0.4)' }} onClick={() => navigate('/analytics')}>
                View Analytics
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
