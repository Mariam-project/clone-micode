import "./style.css";
import { Questions } from "./question";

const app = document.querySelector("#app");

const startButton = document.querySelector("#start");
startButton.addEventListener("click", startQuiz);

function startQuiz(event) {
  console.log(event);
  let currentQuestion = 0;
  let score = 0;

  displayQuestion(currentQuestion);

  function clean() {
    while (app.firstElementChild) {
      app.firstElementChild.remove();
    }
    const progress = getProgressBar(Questions.length, currentQuestion);
    app.appendChild(progress);
  }

  function displayQuestion(index) {
    clean();
    const question = Questions[index];

    if (!question) {
      displayFinishMessages();
      return;
    }

    const title = getTitleElement(question.question);
    app.appendChild(title);

    const answersDiv = createAnswers(question.answers);
    app.appendChild(answersDiv);

    const submitButton = getSubmitButton();
    submitButton.addEventListener("click", submit);

    app.appendChild(submitButton);
  }

  function displayFinishMessages() {
    const h1 = document.createElement("h1");
    h1.innerText = "Bravo! Tu as terminé le quizz";
    const p = document.createElement("p");
    p.innerText = `Tu as eu ${score} sur ${Questions.length} point !`;

    app.appendChild(h1);
    app.appendChild(p);
  }

  function submit() {
    const selectedAnswer = app.querySelector('input[name="answer"]:checked');
    disableAllAnswers();
    const value = selectedAnswer.value;
    const question = Questions[currentQuestion];
    const isCorrect = question.correct === value;

    if (isCorrect) {
      score++;
    }

    showFeedback(isCorrect, question.correct, value);
    const feedback = getFeeedbackMessage(isCorrect, question.correct);
    app.appendChild(feedback);

    displayNextQuestionButton();
  }

  function displayNextQuestionButton() {
    const TIMEOUT = 4000;
    let remainingTimeout = TIMEOUT;

    app.querySelector("button").remove();

    const nextButton = document.createElement("button");
    nextButton.innerText = `Next (${remainingTimeout / 1000}s)`;
    app.appendChild(nextButton);

    const interval = setInterval(() => {
      remainingTimeout -= 1000;
      nextButton.innerText = `Next (${remainingTimeout / 1000}s)`;
    }, 1000);

    const handleNextQuestion = () => {
      currentQuestion++;
      clearInterval(interval);
      clearTimeout(timeout);
      displayQuestion(currentQuestion);
    };

    const timeout = setTimeout(() => {
      handleNextQuestion();
    }, TIMEOUT);

    nextButton.addEventListener("click", () => {
      handleNextQuestion();
    });
  }

  function createAnswers(answers) {
    const answersDiv = document.createElement("div");

    answersDiv.classList.add("answers");

    for (const answer of answers) {
      const label = getAnswerElement(answer);
      answersDiv.appendChild(label);
    }

    return answersDiv;
  }
}

function getTitleElement(text) {
  const title = document.createElement("h3");
  title.innerText = text;
  return title;
}

function formatID(text) {
  return text.replaceAll(" ", "-").replaceAll('"', "'").toLowerCase();
}

function getAnswerElement(text) {
  const label = document.createElement("label");
  label.innerText = text;
  const input = document.createElement("input");
  const id = formatID(text);
  input.id = id;
  label.htmlFor = id;
  input.setAttribute("type", "radio");
  input.setAttribute("name", "answer");
  input.setAttribute("value", text);

  label.appendChild(input);
  return label;
}

function getSubmitButton() {
  const submitButton = document.createElement("button");
  submitButton.innerText = "Submit";
  return submitButton;
}

function showFeedback(isCorrect, correct, answer) {
  const correctAnswerId = formatID(correct);
  const correctElement = document.querySelector(
    `label[for="${correctAnswerId}"`
  );

  const selectedAnswerID = formatID(answer);
  const selectedElement = document.querySelector(
    `label[for="${selectedAnswerID}"`
  );

  correctElement.classList.add("correct");
  selectedElement.classList.add(isCorrect ? "correct" : "incorrect");
}

function getFeeedbackMessage(isCorrect, correct) {
  const paragraph = document.createElement("p");
  paragraph.innerText = isCorrect
    ? "Bravo! Tu as eu la bonne réponse"
    : `Désolé... mais la bonne réponse était ${correct}`;
  return paragraph;
}

function getProgressBar(max, value) {
  const progress = document.createElement("progress");
  progress.setAttribute("max", max);
  progress.setAttribute("value", value);
  return progress;
}

function disableAllAnswers() {
  const radioInputs = document.querySelectorAll('input[type="radio"]');
  for (const radio of radioInputs) {
    radio.disabled = true;
  }
}
