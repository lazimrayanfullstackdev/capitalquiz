import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//database configuration
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "Lazimrayan99*",
  port: 5433,
});

//connecting database
db.connect();

//defining quiz question-answer array
let quiz = [
  { county: "France", capitals: "Paris" },
  { county: "United Kingdom", capitals: "London" },
  { county: "United States of America", capitals: "New York" },
];

//quering database and storing data to quiz array
db.query("SELECT * FROM capitals", (err, res) => {
  if (err) {
    console.error("Error executing query", err.stack);
  } else {
    quiz = res.rows;
  }
  //closing the DB Connection
  db.end();
});

//defining users score
let totalCorrect = 0;

//defining question
let currentQuestion = {};

// GET home page
app.get("/", async (req, res) => {
  totalCorrect = 0;
  await nextQuestion();
  console.log(currentQuestion);
  res.render("index.ejs", { question: currentQuestion, totalScore: totalCorrect, wasCorrect:true});
});

async function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
  currentQuestion = randomCountry;
  console.log(currentQuestion);
}

// POST a new post
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (currentQuestion.capitals.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
