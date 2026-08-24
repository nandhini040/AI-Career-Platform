import { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col, Badge, ProgressBar } from 'react-bootstrap';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);
    
    setLoading(true);
    setError('');
    try {
      const response = await api.post('resume/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAnalysis(response.data);
    } catch (err) {
      setError('Failed to process resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5 animate-fade-in-up">
      <Row className="justify-content-center">
        <Col lg={8}>
          <div className="text-center mb-4">
            <h1 className="mb-3 fw-bold" style={{ color: 'var(--text-h)' }}>Resume Analyzer</h1>
            <p className="text-muted" style={{ fontSize: '1.1rem' }}>Upload your resume and let our AI tailor your interview experience based on your unique profile.</p>
          </div>

          <Card className="glass-card mb-4">
            <Card.Body className="p-4 p-md-5">
              {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
              
              <Form onSubmit={handleUpload}>
                <Form.Group className="mb-4">
                  <Form.Label className="d-block w-100">
                    <div className="upload-zone">
                      <UploadCloud size={48} className="mb-3" color="var(--accent)" />
                      <h4 className="mb-2" style={{ color: 'var(--text-h)' }}>Click or drag to upload</h4>
                      <p className="text-muted mb-0">Supports PDF format (Max 5MB)</p>
                      {file && (
                        <div className="mt-3 p-2 rounded" style={{ background: 'rgba(139, 92, 246, 0.2)', border: '1px solid var(--accent)' }}>
                          <FileText size={16} className="me-2" />
                          <span style={{ color: 'var(--text-h)' }}>{file.name}</span>
                        </div>
                      )}
                    </div>
                    <Form.Control type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} required />
                  </Form.Label>
                </Form.Group>
                
                <Button type="submit" disabled={loading || !file} className="w-100 btn-primary py-3 fs-5">
                  {loading ? (
                    <span className="d-flex align-items-center justify-content-center gap-2">
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Analyzing Resume with AI...
                    </span>
                  ) : 'Upload & Analyze Resume'}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {analysis && (
            <Card className="glass-card animate-fade-in-up">
              <Card.Body className="p-4 p-md-5">
                <h3 className="mb-4 pb-3 border-bottom" style={{ borderColor: 'var(--glass-border) !important' }}>Analysis Results</h3>
                
                <div className="mb-4 text-center">
                  <div className="d-inline-block p-4 rounded-circle mb-3" style={{ border: `4px solid ${analysis.resume_score > 70 ? 'var(--success)' : 'var(--warning)'}`, background: 'rgba(255,255,255,0.05)' }}>
                    <h2 className="mb-0" style={{ fontSize: '2.5rem' }}>{analysis.resume_score}</h2>
                    <span className="text-muted">/100</span>
                  </div>
                  <h4 style={{ color: 'var(--text-h)' }}>Overall Resume Score</h4>
                </div>

                <Row className="g-4 mb-4">
                  <Col md={6}>
                    <div className="p-3 rounded h-100" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                      <h5 className="d-flex align-items-center gap-2 mb-3 text-success">
                        <CheckCircle size={20} /> Skills Found
                      </h5>
                      <p className="mb-0" style={{ color: 'var(--text)' }}>{analysis.skill_summary}</p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="p-3 rounded h-100" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                      <h5 className="d-flex align-items-center gap-2 mb-3 text-danger">
                        <AlertTriangle size={20} /> Missing Skills
                      </h5>
                      <p className="mb-0" style={{ color: 'var(--text)' }}>{analysis.missing_skills}</p>
                    </div>
                  </Col>
                </Row>

                <div className="mb-4">
                  <h5 className="mb-2 text-info">Suggested Roles</h5>
                  <p style={{ color: 'var(--text)' }}>{analysis.suitable_job_roles}</p>
                </div>

                <div className="mb-4">
                  <h5 className="mb-2 text-warning">Improvements</h5>
                  <p style={{ color: 'var(--text)' }}>{analysis.suggested_improvements}</p>
                </div>

                <Button onClick={() => navigate('/setup')} className="w-100 btn-primary mt-3 py-3">
                  Proceed to Interview Setup
                </Button>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ResumeUpload;
