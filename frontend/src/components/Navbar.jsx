import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Nav, Navbar as BootstrapNavbar, Button } from 'react-bootstrap';
import { BrainCircuit, LogOut, User } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Do not show navbar on login/register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <BootstrapNavbar expand="lg" className="glass-panel sticky-top" variant="dark">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/dashboard" className="d-flex align-items-center gap-2" style={{ fontWeight: '600', letterSpacing: '-0.5px' }}>
          <BrainCircuit color="var(--accent)" size={28} />
          IntervAI
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard" active={location.pathname === '/dashboard'}>Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/resume" active={location.pathname === '/resume'}>Resume Analyzer</Nav.Link>
            <Nav.Link as={Link} to="/setup" active={location.pathname === '/setup'}>Mock Interview</Nav.Link>
            <Nav.Link as={Link} to="/coding" active={location.pathname === '/coding'}>Coding</Nav.Link>
            <Nav.Link as={Link} to="/analytics" active={location.pathname === '/analytics'}>Analytics</Nav.Link>
          </Nav>
          <Nav>
            {user ? (
              <div className="d-flex align-items-center gap-3">
                <span className="text-muted d-flex align-items-center gap-1">
                  <User size={16} /> {user.username}
                </span>
                <Button variant="outline-danger" size="sm" onClick={handleLogout} className="d-flex align-items-center gap-1">
                  <LogOut size={16} /> Logout
                </Button>
              </div>
            ) : (
              <Button as={Link} to="/login" variant="primary">Login</Button>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
