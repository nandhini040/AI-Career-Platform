import { useState, useContext } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col, InputGroup } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error
    try {
      await register(username, email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err.response && err.response.data) {
        // Extract field-specific errors from Django Rest Framework
        const errorData = err.response.data;
        const errorMessages = Object.keys(errorData).map(key => {
          const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
          const messages = Array.isArray(errorData[key]) ? errorData[key].join(' ') : errorData[key];
          return `${formattedKey}: ${messages}`;
        });
        setError(errorMessages.join(' | '));
      } else {
        setError('Registration failed. Please check your connection to the server.');
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
            <h1 style={{ fontSize: '3.5rem', fontWeight: 700, color: '#fff', marginBottom: '1.5rem', letterSpacing: '-1px' }}>Master the interview.</h1>
            <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '500px' }}>Create an account and start getting personalized, AI-driven feedback on your technical and behavioral interview performance.</p>
          </div>
        </Col>

        {/* Right Side: Form */}
        <Col lg={6} className="d-flex align-items-center justify-content-center p-4 p-md-5" style={{ backgroundColor: 'var(--bg-primary)', position: 'relative', zIndex: 10 }}>
          <div className="w-100 animate-fade-in-up" style={{ maxWidth: '420px' }}>
            <div className="mb-5 text-center text-lg-start">
              <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--text-h)' }}>Join IntervAI</h1>
              <p className="text-muted" style={{ fontSize: '1.1rem' }}>Create an account to start practicing.</p>
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
                  placeholder="Choose a username" 
                />
              </Form.Group>
              <Form.Group id="email" className="mb-4">
                <Form.Label style={{ color: 'var(--text-muted)' }}>Email</Form.Label>
                <Form.Control 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Enter your email" 
                />
              </Form.Group>
              <Form.Group id="password" className="mb-4">
                <Form.Label style={{ color: 'var(--text-muted)' }}>Password</Form.Label>
                <InputGroup>
                  <Form.Control 
                    type={showPassword ? "text" : "password"} 
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Create a strong password" 
                  />
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ borderColor: 'var(--bs-border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)' }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Button>
                </InputGroup>
              </Form.Group>
              <Button className="w-100 mt-2 btn-primary py-3 fw-bold" type="submit" style={{ fontSize: '1.1rem' }}>
                Sign Up
              </Button>
            </Form>
            
            <div className="w-100 text-center mt-5" style={{ color: '#64748b' }}>
              Already have an account? <Link to="/login" style={{ fontWeight: '600', color: 'var(--accent)' }}>Log In</Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
