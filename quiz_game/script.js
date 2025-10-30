// DOM Elements
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");

// 题目数组
const quizQuestions = [
    {
        question: "What is the capital of France?",
        answers: [
            { text: "London", correct: false },
            { text: "Berlin", correct: false },
            { text: "Paris", correct: true },
            { text: "Madrid", correct: false },
        ],
    },
    {
        question: "Which planet is known as the Red Planet?",
        answers: [
            { text: "Venus", correct: false },
            { text: "Mars", correct: true },
            { text: "Jupiter", correct: false },
            { text: "Saturn", correct: false },
        ],
    },
    {
        question: "What is the largest ocean on Earth?",
        answers: [
            { text: "Atlantic Ocean", correct: false },
            { text: "Indian Ocean", correct: false },
            { text: "Arctic Ocean", correct: false },
            { text: "Pacific Ocean", correct: true },
        ],
    },
    {
        question: "Which of these is NOT a programming language?",
        answers: [
            { text: "Java", correct: false },
            { text: "Python", correct: false },
            { text: "Banana", correct: true },
            { text: "JavaScript", correct: false },
        ],
    },
    {
        question: "What is the chemical symbol for gold?",
        answers: [
            { text: "Go", correct: false },
            { text: "Gd", correct: false },
            { text: "Au", correct: true },
            { text: "Ag", correct: false },
        ],
    },
];

// QUIZ STATE VARS
let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;

// 初始化
totalQuestionsSpan.textContent = quizQuestions.length;
maxScoreSpan.textContent = quizQuestions.length;

// 事件监听器
startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", restartQuiz);

// 开始测验
function startQuiz() {
    // 重置变量
    currentQuestionIndex = 0;
    score = 0;
    scoreSpan.textContent = 0;
    
    // 切换屏幕
    startScreen.classList.remove("active");
    quizScreen.classList.add("active");
    
    // 显示第一个问题
    showQuestion();
}

// 显示问题
function showQuestion() {
    // 重置状态
    answersDisabled = false;
    const currentQuestion = quizQuestions[currentQuestionIndex];
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
    
    // 更新进度条
    const progressPercent = ((currentQuestionIndex) / quizQuestions.length) * 100;
    progressBar.style.width = progressPercent + "%";
    
    // 设置问题文本
    questionText.textContent = currentQuestion.question;
    
    // 清空答案容器
    answersContainer.innerHTML = "";
    
    // 创建答案按钮
    currentQuestion.answers.forEach((answer) => {
        const button = document.createElement("button");
        button.textContent = answer.text;
        button.classList.add("answer-btn");
        
        // 存储正确答案信息
        button.dataset.correct = answer.correct;
        button.addEventListener("click", selectAnswer);
        answersContainer.appendChild(button);
    });
}

// 选择答案
function selectAnswer(event) {
    // 优化检查
    if (answersDisabled) return;
    answersDisabled = true;
    
    const selectedButton = event.target;
    const isCorrect = selectedButton.dataset.correct === "true";
    
    // 显示正确答案和错误答案
    Array.from(answersContainer.children).forEach((button) => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        } else if (button === selectedButton && !isCorrect) {
            button.classList.add("incorrect");
        }
    });
    
    // 更新分数
    if (isCorrect) {
        score++;
        scoreSpan.textContent = score;
    }
    
    // 延迟后显示下一题或结果
    setTimeout(() => {
        currentQuestionIndex++;
        // 检查是否还有更多问题或测验结束
        if (currentQuestionIndex < quizQuestions.length) {
            showQuestion();
        } else {
            showResults();
        }
    }, 1000);
}

// 显示结果
function showResults() {
    // 切换屏幕
    quizScreen.classList.remove("active");
    resultScreen.classList.add("active");
    
    // 显示最终分数
    finalScoreSpan.textContent = score;
    
    // 计算百分比并显示相应消息
    const percentage = (score / quizQuestions.length) * 100;
    
    if (percentage === 100) {
        resultMessage.textContent = "Perfect! You're a genius!";
    } else if (percentage >= 80) {
        resultMessage.textContent = "Great job! You know your stuff!";
    } else if (percentage >= 60) {
        resultMessage.textContent = "Good effort! Keep learning!";
    } else if (percentage >= 40) {
        resultMessage.textContent = "Not bad! Try again to improve!";
    } else {
        resultMessage.textContent = "Keep studying! You'll get better!";
    }
}

// 重新开始测验
function restartQuiz() {
    resultScreen.classList.remove("active");
    startQuiz();
}