import { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col, ProgressBar } from 'react-bootstrap';
import api from '../api';
import { useParams, useNavigate } from 'react-router-dom';

const MockInterview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const getTimeForDifficulty = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 3 * 60;
      case 'medium': return 5 * 60;
      case 'hard': return 7 * 60;
      default: return 3 * 60; // Default to 3 mins
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await api.get(`interviews/sessions/${id}/`);
        setSession(response.data);
        setTimeRemaining(getTimeForDifficulty(response.data.difficulty));
      } catch (err) {
        setError('Failed to load interview session.');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [id]);

  useEffect(() => {
    if (feedback || !session) return; 

    if (timeRemaining === 0 && !loading) {
      // Time gets ended move directly to next question
      handleTimeoutNextQuestion();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentQuestionIndex, feedback, timeRemaining, session, loading]);

  const handleTimeoutNextQuestion = () => {
    if (currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setAnswerText('');
      setFeedback(null);
      setTimeRemaining(getTimeForDifficulty(session.difficulty));
    } else {
      navigate('/analytics'); 
    }
  };

  const handleSubmitAnswer = async (e) => {
    if (e) e.preventDefault();
    const finalAnswer = answerText;
    if (!finalAnswer.trim()) return;
    
    setSubmitting(true);
    const question = session.questions[currentQuestionIndex];
    try {
      const response = await api.post(`interviews/question/${question.id}/answer/`, {
        answer_text: finalAnswer
      });
      setFeedback(response.data);
      setAnswerText('');
    } catch (err) {
      setError('Failed to submit answer.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setAnswerText('');
      setFeedback(null);
      setTimeRemaining(getTimeForDifficulty(session.difficulty));
    } else {
      navigate('/analytics'); 
    }
  };

  if (loading) return <Container className="mt-5">Loading Interview...</Container>;
  if (error) return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;
  if (!session || !session.questions || session.questions.length === 0) {
    return <Container className="mt-5">No questions found for this session.</Container>;
  }

  const currentQuestion = session.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / session.questions.length) * 100;

  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col>
          <h2 className="text-white fw-bold mb-3">Mock Interview</h2>
          <ProgressBar now={progress} label={`${currentQuestionIndex} / ${session.questions.length} completed`} />
        </Col>
      </Row>

      <Card className="mb-4 shadow-sm glass-card">
        <Card.Body className="p-4 p-md-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0 text-info">Question {currentQuestionIndex + 1}</h5>
            <span className={`badge ${timeRemaining < 30 ? 'bg-danger' : 'bg-primary'}`}>
              Time: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <h4 className="mb-4">{currentQuestion.question_text}</h4>
          
          {!feedback ? (
            <div className="mt-4">
              <Form.Group className="mb-4">
                <Form.Label className="mb-2">Your Answer:</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={6} 
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Type your answer here..."
                  style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', color: 'var(--text-h)', border: '1px solid var(--glass-border)' }}
                />
              </Form.Group>
              <Button onClick={handleSubmitAnswer} disabled={submitting} className="btn-primary w-100 py-3">
                {submitting ? 'Evaluating...' : 'Submit Answer'}
              </Button>
            </div>
          ) : (
            <div className="mt-4 p-4 border rounded" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', borderColor: 'var(--glass-border) !important' }}>
              <h5 className="text-success mb-4">AI Evaluation</h5>
              <div className="mb-3">
                <strong className="text-info">Score:</strong> 
                <span className="ms-2 px-3 py-1 rounded-pill" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>{feedback.score}/100</span>
              </div>
              <div className="mb-3">
                <strong className="text-success d-block mb-1">Strengths:</strong>
                <p className="mb-0 text-light">{feedback.feedback_strengths}</p>
              </div>
              <div className="mb-3">
                <strong className="text-warning d-block mb-1">Areas for Improvement:</strong>
                <p className="mb-0 text-light">{feedback.feedback_improvements}</p>
              </div>
              <div className="mb-4">
                <strong className="text-primary d-block mb-1">Ideal Answer:</strong>
                <p className="mb-0 text-light">{feedback.ideal_answer}</p>
              </div>
              <Button onClick={handleNextQuestion} className="btn-primary w-100 py-3 mt-2">
                {currentQuestionIndex < session.questions.length - 1 ? 'Next Question' : 'Finish Interview'}
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MockInterview;
