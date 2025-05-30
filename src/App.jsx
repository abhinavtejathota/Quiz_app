import React, { useState, useEffect } from "react";
import questionsData from "./questions.json";
import { Button } from "@/components/ui/button";

const App = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(
    Array(questionsData.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleOptionSelect = (index) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = index;
    setAnswers(updatedAnswers);
  };

  const handleNavigation = (direction) => {
    if (direction === "next" && currentQuestion < questionsData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (direction === "prev" && currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    if (answers.includes(null)) {
      alert("Please answer all questions before submitting.");
      return;
    }
    let newScore = 0;
    answers.forEach((answer, index) => {
      if (questionsData[index].correctOption === answer) {
        newScore++;
      }
    });
    setScore(newScore);
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Quiz Platform</h1>
      {!submitted ? (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">
              Question {currentQuestion + 1} of {questionsData.length}
            </h2>
            <p className="mb-2">{questionsData[currentQuestion].question}</p>
            {questionsData[currentQuestion].options.map((option, index) => (
              <div key={index} className="mb-1">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={index}
                    checked={answers[currentQuestion] === index}
                    onChange={() => handleOptionSelect(index)}
                    className="mr-2"
                  />
                  {option}
                </label>
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            <Button
              onClick={() => handleNavigation("prev")}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            {currentQuestion < questionsData.length - 1 ? (
              <Button onClick={() => handleNavigation("next")}>Next</Button>
            ) : (
              <Button onClick={handleSubmit}>Submit</Button>
            )}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">
            Your Score: {score}/{questionsData.length}
          </h2>
          {questionsData.map((q, index) => (
            <div key={index} className="mb-4">
              <p className="font-semibold">
                {index + 1}. {q.question}
              </p>
              <p
                className={
                  answers[index] === q.correctOption
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                Your answer: {q.options[answers[index]] || "None"}
              </p>
              {answers[index] !== q.correctOption && (
                <p className="text-green-600">
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
