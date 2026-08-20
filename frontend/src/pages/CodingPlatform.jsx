import { useState, useEffect } from 'react';
import { Container, Card, Button, Alert, Row, Col, Form } from 'react-bootstrap';
import api from '../api';
import Editor from '@monaco-editor/react';

const CodingPlatform = () => {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [activeCategory, setActiveCategory] = useState('beginner');
  const [code, setCode] = useState('// Write your code here');
  const [language, setLanguage] = useState('python');
  const [submitting, setSubmitting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  const fetchProblems = async () => {
    try {
      const response = await api.get('coding/problems/');
      setProblems(response.data);
    } catch (err) {
      setError('Failed to load coding problems. You may need to create some problems first.');
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleGenerateProblems = async () => {
    setGenerating(true);
    setError('');
    try {
      await api.post('coding/problems/generate/', {
        difficulty: activeCategory,
        num_questions: 2
      });
      await fetchProblems();
    } catch (err) {
      setError('Failed to generate problems with AI. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleProblemSelect = async (id) => {
    try {
      const response = await api.get(`coding/problems/${id}/`);
      setSelectedProblem(response.data);
      setResult(null);
      // Set some starter code
      if (language === 'python') {
         setCode('def solve():\n    pass');
      } else {
         setCode('// Write your code here');
      }
    } catch (err) {
      setError('Failed to load problem details.');
    }
  };

  const handleSubmit = async () => {
    if (!selectedProblem) return;
    setSubmitting(true);
    try {
      const response = await api.post(`coding/problems/${selectedProblem.id}/submit/`, {
        language,
        code_content: code
      });
      setResult(response.data);
    } catch (err) {
      setError('Failed to submit code.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container fluid className="mt-5 px-4 animate-fade-in-up">
      <Row>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm glass-card">
            <Card.Header style={{ backgroundColor: 'rgba(37, 99, 235, 0.2)', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-h)' }}>
              <h5 className="mb-0 py-1">Coding Problems</h5>
            </Card.Header>
            <Card.Body style={{ overflowY: 'auto', maxHeight: '80vh' }}>
              {error && <Alert variant="danger">{error}</Alert>}
              
              <div className="mb-4 d-flex gap-2 justify-content-center">
                <Button 
                  variant={activeCategory === 'beginner' ? 'primary' : 'outline-primary'} 
                  size="sm"
                  onClick={() => setActiveCategory('beginner')}
                >
                  Beginner
                </Button>
                <Button 
                  variant={activeCategory === 'medium' ? 'primary' : 'outline-primary'} 
                  size="sm"
                  onClick={() => setActiveCategory('medium')}
                >
                  Medium
                </Button>
                <Button 
                  variant={activeCategory === 'advanced' ? 'primary' : 'outline-primary'} 
                  size="sm"
                  onClick={() => setActiveCategory('advanced')}
                >
                  Advanced
                </Button>
              </div>

              {problems.filter(p => p.difficulty === activeCategory).length === 0 ? (
                <p className="text-muted text-center mt-4">No {activeCategory} problems available right now.</p>
              ) : (
                <div className="list-group list-group-flush" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                  {problems.filter(p => p.difficulty === activeCategory).map(p => (
                    <button 
                      key={p.id} 
                      className={`list-group-item list-group-item-action border-bottom ${selectedProblem?.id === p.id ? 'active' : ''}`}
                      onClick={() => handleProblemSelect(p.id)}
                      style={{ 
                        backgroundColor: selectedProblem?.id === p.id ? 'var(--accent)' : 'rgba(15, 23, 42, 0.4)',
                        color: selectedProblem?.id === p.id ? '#fff' : 'var(--text)',
                        borderColor: 'var(--glass-border)'
                      }}
                    >
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <h6 className="mb-1">{p.title}</h6>
                        <small className={`px-2 py-1 rounded ${
                          p.difficulty === 'advanced' ? 'bg-danger text-white' : 
                          (p.difficulty === 'medium' ? 'bg-warning text-dark' : 'bg-success text-white')
                        }`}>
                          {p.difficulty}
                        </small>
                      </div>
                      <small style={{ color: selectedProblem?.id === p.id ? '#e2e8f0' : 'var(--text-muted)' }}>{p.topic}</small>
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-4 text-center">
                <Button 
                  variant="outline-info" 
                  onClick={handleGenerateProblems} 
                  disabled={generating}
                  className="w-100"
                >
                  {generating ? 'Generating AI Questions...' : `Generate New ${activeCategory} Problems`}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          {selectedProblem ? (
            <div className="d-flex flex-column h-100 animate-fade-in-up">
              <Card className="mb-4 shadow-sm glass-card">
                <Card.Body className="p-4">
                  <h4 className="text-info mb-3">{selectedProblem.title}</h4>
                  <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text)', fontSize: '1.05rem', lineHeight: '1.6' }}>{selectedProblem.problem_statement}</p>
                  
                  {selectedProblem.input_format && (
                    <div className="mt-4 p-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                      <strong className="text-warning d-block mb-2">Input Format:</strong> 
                      <p className="mb-0" style={{ color: 'var(--text-muted)' }}>{selectedProblem.input_format}</p>
                    </div>
                  )}
                  {selectedProblem.output_format && (
                    <div className="mt-3 p-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                      <strong className="text-success d-block mb-2">Output Format:</strong> 
                      <p className="mb-0" style={{ color: 'var(--text-muted)' }}>{selectedProblem.output_format}</p>
                    </div>
                  )}
                </Card.Body>
              </Card>

              <Card className="flex-grow-1 shadow-sm mb-4 glass-card">
                <Card.Header className="d-flex justify-content-between align-items-center" style={{ borderBottom: '1px solid var(--glass-border)', backgroundColor: 'transparent' }}>
                  <span className="fw-bold" style={{ color: 'var(--text-h)' }}>Code Editor</span>
                  <Form.Select 
                    size="sm" 
                    style={{ width: '150px', backgroundColor: 'rgba(15, 23, 42, 0.8)', color: 'var(--text)', border: '1px solid var(--glass-border)' }} 
                    value={language}
                    onChange={(e) => {
                      setLanguage(e.target.value);
                      setCode(e.target.value === 'python' ? 'def solve():\n    pass' : '// Write your code here');
                    }}
                  >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                  </Form.Select>
                </Card.Header>
                <div style={{ height: '450px' }}>
                  <Editor
                    height="100%"
                    language={language}
                    theme="vs-dark"
                    value={code}
                    onChange={(value) => setCode(value)}
                    options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 } }}
                  />
                </div>
                <Card.Footer className="d-flex justify-content-end p-3" style={{ borderTop: '1px solid var(--glass-border)', backgroundColor: 'transparent' }}>
                  <Button variant="primary" onClick={handleSubmit} disabled={submitting} className="px-4">
                    {submitting ? 'Running...' : 'Submit Code'}
                  </Button>
                </Card.Footer>
              </Card>

              {result && (
                <Card className="shadow-sm glass-card mb-4">
                  <Card.Header className={result.status === 'Passed' ? 'bg-success text-white' : 'bg-danger text-white'} style={{ borderBottom: 'none' }}>
                    <strong>Result: {result.status}</strong> (Score: {result.score}/100)
                  </Card.Header>
                  <Card.Body className="p-4">
                    <h6 className="text-info mb-3">AI Feedback:</h6>
                    <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-muted)' }}>{result.ai_feedback}</p>
                  </Card.Body>
                </Card>
              )}
            </div>
          ) : (
            <Card className="h-100 shadow-sm glass-card d-flex flex-column justify-content-center align-items-center text-center p-5">
              <div style={{ width: '80px', height: '80px', backgroundColor: 'rgba(2, 132, 199, 0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--info)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
              </div>
              <h4 style={{ color: 'var(--text-h)' }}>Select a problem to start coding</h4>
              <p style={{ color: 'var(--text-muted)', maxWidth: '400px' }}>Choose a challenge from the list on the left to write and run your code in the browser.</p>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CodingPlatform;
