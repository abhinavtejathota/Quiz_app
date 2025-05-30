import React, { useState, useEffect } from "react";
import questionsData from "./questions.json";
import "./App.css";

const QUIZ_DURATION = 1000000; // total time in seconds

const App = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(
    Array(questionsData.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION);
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (submitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // it's safe here
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted]);

  const handleOptionSelect = (index) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = index;
    setAnswers(updatedAnswers);
  };

  const handleNavigation = (direction) => {
    if (direction === "next") {
      if (answers[currentQuestion] === null) {
        alert("Please answer the question before proceeding!");
        return;
      }
      if (currentQuestion < questionsData.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }
    } else if (direction === "prev" && currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    if (submitted) return;

    let newScore = 0;
    answers.forEach((ans, i) => {
      if (ans === questionsData[i].correctOption) newScore++;
    });
    setScore(newScore);
    setSubmitted(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className={`quiz-container ${darkMode ? "dark" : ""}`}>
      <button onClick={toggleTheme} className="theme-toggle">
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <h1 className="title">Quizzy 🎯</h1>
      {!submitted && (
        <>
          <div className="timer">
            Time Left: <strong>{formatTime(timeLeft)}</strong>
          </div>

          {/* Progress Bar */}
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{
                width: `${
                  ((currentQuestion + 1) / questionsData.length) * 100
                }%`,
              }}
            ></div>
          </div>
        </>
      )}

      {!submitted ? (
        <div className="question-box">
          <h2 className="question-count">
            Question {currentQuestion + 1} of {questionsData.length}
          </h2>
          <p className="question-text">
            {questionsData[currentQuestion].question}
          </p>

          <div className="options">
            {questionsData[currentQuestion].options.map((option, index) => (
              <label
                key={index}
                className={`option ${
                  answers[currentQuestion] === index ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={index}
                  checked={answers[currentQuestion] === index}
                  onChange={() => handleOptionSelect(index)}
                />
                {option}
              </label>
            ))}
          </div>

          <div className="nav-buttons">
            <button
              onClick={() => handleNavigation("prev")}
              disabled={currentQuestion === 0}
            >
              ⬅️ Previous
            </button>
            {currentQuestion < questionsData.length - 1 ? (
              <button onClick={() => handleNavigation("next")}>Next ➡️</button>
            ) : (
              <button onClick={handleSubmit}>Submit ✅</button>
            )}
          </div>
        </div>
      ) : (
        <div className="results">
          <h2>
            🎉 You scored {score} / {questionsData.length}
          </h2>
          {questionsData.map((q, index) => (
            <div key={index} className="result-item">
              <p className="result-question">
                {index + 1}. {q.question}
              </p>
              <p
                className={
                  answers[index] === q.correctOption ? "correct" : "incorrect"
                }
              >
                Your answer: {q.options[answers[index]] || "None"}
              </p>
              {answers[index] !== q.correctOption && (
                <p className="correct-answer">
                  Correct answer: {q.options[q.correctOption]}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
