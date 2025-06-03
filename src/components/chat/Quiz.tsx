
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizProps {
  questions: QuizQuestion[];
  title?: string;
}

const Quiz = ({ questions, title = "Quiz" }: QuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
  };

  const score = selectedAnswers.filter((answer, index) => 
    answer === questions[index]?.correctAnswer
  ).length;

  if (showResults) {
    return (
      <div className="p-4 bg-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Quiz Results</h3>
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-white mb-2">
            {score} / {questions.length}
          </div>
          <div className="text-gray-300">
            {score === questions.length ? 'Perfect!' : 
             score >= questions.length * 0.7 ? 'Great job!' : 
             'Keep practicing!'}
          </div>
        </div>
        <Button onClick={resetQuiz} className="w-full">
          Restart Quiz
        </Button>
      </div>
    );
  }

  const question = questions[currentQuestion];
  
  return (
    <div className="p-4 bg-gray-700 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <span className="text-gray-300 text-sm">
          {currentQuestion + 1} / {questions.length}
        </span>
      </div>
      
      <div className="mb-4">
        <h4 className="text-white font-medium mb-3">{question.question}</h4>
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-3 rounded border ${
                selectedAnswers[currentQuestion] === index
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-gray-600 border-gray-500 text-gray-300 hover:bg-gray-500'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      
      <Button 
        onClick={nextQuestion}
        disabled={selectedAnswers[currentQuestion] === undefined}
        className="w-full"
      >
        {currentQuestion < questions.length - 1 ? 'Next Question' : 'Show Results'}
      </Button>
    </div>
  );
};

export default Quiz;
