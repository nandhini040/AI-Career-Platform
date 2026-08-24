import { useState, useContext } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
  const data = err.response?.data;

  if (typeof data === 'string') {
    setError(data);
  } else if (data?.detail) {
    setError(data.detail);
  } else if (data && typeof data === 'object') {
    const errorMessages = Object.entries(data)
      .map(([key, value]) => {
        const message = Array.isArray(value) ? value.join(', ') : String(value);
        return `${key}: ${message}`;
      });

    setError(errorMessages.join(' | '));
  } else {
    setError('Login failed. Please check your username and password.');
  }
}
  };

  return (
    <Container fluid className="p-0" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <Row className="m-0 h-100" style={{ minHeight: '100vh' }}>
        {/* Left Side: Branding / Image */}
        <Col lg={6} className="d-none d-lg-block p-0 position-relative" style={{ overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(2, 6, 23, 0.6)', zIndex: 1 }}></div>
          <img src="/auth_side_bg_1785862575937.png" alt="AI Platform" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '10%' }}>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 700, color: '#fff', marginBottom: '1.5rem', letterSpacing: '-1px' }}>Elevate your interview skills.</h1>
            <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '500px' }}>Join top candidates who use IntervAI to practice coding, refine their answers, and land their dream jobs with AI-driven feedback.</p>
          </div>
        </Col>

        {/* Right Side: Form */}
        <Col lg={6} className="d-flex align-items-center justify-content-center p-4 p-md-5" style={{ backgroundColor: 'var(--bg-primary)', position: 'relative', zIndex: 10 }}>
          <div className="w-100 animate-fade-in-up" style={{ maxWidth: '420px' }}>
            <div className="mb-5 text-center text-lg-start">
              <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--text-h)' }}>Welcome Back</h1>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Sign in to continue your interview prep.</p>
            </div>
            
            {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group id="username" className="mb-4">
                <Form.Label style={{ color: 'var(--text-muted)' }}>Username</Form.Label>
                <Form.Control 
                  type="text" 
                  required 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  placeholder="Enter your username" 
                />
              </Form.Group>
              <Form.Group id="password" className="mb-4">
                <Form.Label style={{ color: 'var(--text-muted)' }}>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Enter your password" 
                />
              </Form.Group>
              <Button className="w-100 mt-2 btn-primary py-3 fw-bold" type="submit" style={{ fontSize: '1.1rem' }}>
                Log In
              </Button>
            </Form>
            
            <div className="w-100 text-center mt-5" style={{ color: '#64748b' }}>
              Need an account? <Link to="/register" style={{ fontWeight: '600', color: 'var(--accent)' }}>Sign Up</Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
export default Login;
