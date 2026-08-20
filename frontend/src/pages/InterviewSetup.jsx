import { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Settings, PlayCircle } from 'lucide-react';

const InterviewSetup = () => {
  const [jobRole, setJobRole] = useState('Full Stack Developer');
  const [technology, setTechnology] = useState('React, Django');
  const [interviewType, setInterviewType] = useState('technical');
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setJobRole(role);
    
    const roleTechMap = {
      'Frontend Developer': 'React, Node.js',
      'Backend Developer': 'Python, Django',
      'Full Stack Developer': 'React, Node.js',
      'Data Scientist': 'SQL, NoSQL, Pandas',
      'DevOps Engineer': 'AWS, Docker, Kubernetes',
      'Product Manager': 'Agile, Scrum, Jira'
    };
    
    if (roleTechMap[role]) {
      setTechnology(roleTechMap[role]);
    }
  };

  const handleStart = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('interviews/sessions/', {
        job_role: jobRole,
        technology,
        interview_type: interviewType,
        difficulty
      });
      navigate(`/interview/${response.data.id}`);
    } catch (err) {
      setError('Failed to start interview session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5 animate-fade-in-up">
      <Row className="justify-content-center">
        <Col lg={8}>
          <div className="text-center mb-4">
            <h1 className="mb-3 d-flex align-items-center justify-content-center gap-3">
              <Settings color="var(--accent)" size={36} /> Interview Setup
            </h1>
            <p className="text-muted" style={{ fontSize: '1.1rem' }}>Customize your AI mock interview experience.</p>
          </div>

          <Card className="glass-card mb-4">
            <Card.Body className="p-4 p-md-5">
              {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
              <Form onSubmit={handleStart}>
                <Row className="g-4 mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Target Job Role</Form.Label>
                      <Form.Select value={jobRole} onChange={handleRoleChange}>
                        <option value="Frontend Developer">Frontend Developer</option>
                        <option value="Backend Developer">Backend Developer</option>
                        <option value="Full Stack Developer">Full Stack Developer</option>
                        <option value="Data Scientist">Data Scientist</option>
                        <option value="DevOps Engineer">DevOps Engineer</option>
                        <option value="Product Manager">Product Manager</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Core Technology</Form.Label>
                      <Form.Select value={technology} onChange={(e) => setTechnology(e.target.value)}>
                        <option value="React, Node.js">React, Node.js</option>
                        <option value="Python, Django">Python, Django</option>
                        <option value="Java, Spring Boot">Java, Spring Boot</option>
                        <option value="Angular, TypeScript">Angular, TypeScript</option>
                        <option value="AWS, Docker, Kubernetes">AWS, Docker, Kubernetes</option>
                        <option value="SQL, NoSQL, Pandas">SQL, NoSQL, Pandas</option>
                        <option value="Agile, Scrum, Jira">Agile, Scrum, Jira</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Interview Type</Form.Label>
                      <Form.Select value={interviewType} onChange={(e) => setInterviewType(e.target.value)}>
                        <option value="technical">Technical Interview</option>
                        <option value="hr">HR Interview</option>
                        <option value="behavioral">Behavioral Interview</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Difficulty</Form.Label>
                      <Form.Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Button type="submit" disabled={loading} className="w-100 btn-primary py-3 fs-5 d-flex align-items-center justify-content-center gap-2">
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      <PlayCircle size={24} /> Start Mock Interview
                    </>
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default InterviewSetup;
