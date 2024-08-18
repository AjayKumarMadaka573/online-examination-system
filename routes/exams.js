const express = require('express');
const Exam = require('../models/Exam');
const AttemptedExam = require('../models/ExamAttempted');
const Quota = require('../models/Quota');
const Evaluated = require('../models/Evaluated');
const Schedule = require('../models/Schedule');
const Feedback = require('../models/Feedback');
const cors = require('cors');
const moment = require('moment');
// const { AutoModelForCausalLM, AutoTokenizer } = require('transformers');

// const fetch = require('node-fetch');

(async () => {
    const { default: fetch } = await import('node-fetch'); // Dynamic import
  })();

const API_URL = 'https://api-inference.huggingface.co/models/VatsaDev/ChatGpt-nano';
const API_KEY = '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';

// const modelName = 'VatsaDev/ChatGpt-nano';
// const tokenizer = AutoTokenizer.from_pretrained(modelName);
// const model = AutoModelForCausalLM.from_pretrained(modelName);

const router = express.Router();

router.use(express.json());
router.use(cors());



// // Initialize the OpenAI client with your API key
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

async function getAllExams() {
    try {
      const exams = await Exam.find({});
      return exams;
    } catch (err) {
      console.error('Error fetching exams:', err);
    }
}

async function getCompletedExams() {
  try {
    const exams = await Exam.find({});

    const pastExams = exams.filter(exam => {
      const examDateMoment = moment(exam.examDate);
      const now = moment();
      return examDateMoment.isBefore(now);
    });

    return pastExams;
  } catch (err) {
    console.error('Error fetching exams:', err);
    throw err; // Re-throw the error for proper handling
  }
}


router.get('/fetchCompletedExamDetails',async (req,res)=>{
  const data = await getCompletedExams();
  res.json(data);
});

router.get('/fetchExamDetails',async (req,res)=>{
    const data = await getAllExams();
    res.json(data);
});

router.get('/fetchExamDetails/:id', async (req, res) => {
    try {

        const exam = await Exam.findOne({ examId: req.params.id });

        if (!exam) {
            return res.status(404).json({ error: 'Exam not found' });
        }
        
        res.json(exam);
    } catch (error) {

        console.error('Error fetching exam details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/checkIfAlreadyCreated/:id',async (req, res) => {
  try {

      const exam = await Exam.findOne({ examId: req.params.id });

      if (!exam) {
          return res.json("Exam not found");
      }
      
      res.json("Exam found");
  } catch (error) {

      console.error('Error fetching exam details:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/findExam/:id', async (req, res) => {
  try {

      const exam = await Exam.findOne({ examId: req.params.id });

      if (!exam) {
          return res.status(404).json({ error: 'Exam not found' });
      }
      
      res.json(exam);
  } catch (error) {

      console.error('Error fetching exam details:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/create_exam', async (req, res) => {
    const { examId,teacherId,examNumber,year,batch,subject,examType,examDate,examTime,examQuestions,examChoiceQuestions,examBits,examBitsChoices } = req.body;
    console.log("exam creation underway");
    let exam = await Exam.findOne({examId});
    if (exam) return res.status(400).json({ msg: 'Invalid credentials' });

    exam = new Exam({ examId,teacherId,examNumber,year,batch,subject,examType,examDate,examTime,examQuestions,examChoiceQuestions,examBits,examBitsChoices  });

    await exam.save();

    res.status(201).json({ msg: 'Exam Created successfully' });
});

router.put('/updateExam', async (req, res) => {
    // const { examId, updateData } = req.body;
    const examId = req.body.examId;
    const updateData = req.body.updateData;
    console.log("examId:",examId);
    try {
        const updatedExam = await Exam.findOneAndUpdate(
            { examId: examId },
            { $set: updateData }, 
            { new: true, runValidators: true } 
        );

        if (updatedExam) {
            res.status(200).json({ message: 'Exam updated successfully', updatedExam });
        } else {
            res.status(404).json({ message: 'Exam not found' });
        }
    } catch (err) {
        console.error('Error updating exam:', err);
        res.status(500).json({ message: 'Server error', error: err });
    }
});

router.delete('/deleteExam',async (req,res)=>{
    try {
    const examId=req.body.examId;
    const deletedExam = await Exam.deleteOne({examId:examId});
    if (deletedExam) {
        res.status(200).json({ message: 'Exam deleted successfully', deletedExam });
    } else {
        res.status(404).json({ message: 'Exam not found' });
    }
}catch (err) {
    console.error('Error deleting exam:', err);
    res.status(500).json({ message: 'Server error', error: err });
}

});

router.post('/examAttempted',async (req,res)=>{
    const { studentId,examId,answers,answersChoice,bitsAnswers } = req.body;
    console.log("exam creation underway");
   

    let attempted_exam = new AttemptedExam({ studentId,examId,answers,answersChoice,bitsAnswers });

    await attempted_exam.save();

    res.status(201).json({ msg: 'Exam Submitted successfully' });
});

router.get('/completedExamDetails/:id',async (req,res)=>{
let attempted_exams;
try{
  attempted_exams = await AttemptedExam.find({ examId:req.params.id});

  if(attempted_exams.length === 0){
    res.json('Not Found');
  }else{
  res.json(attempted_exams);
  }
}catch(err){

}

});


router.post('/feedback',async (req,res)=>{
    const {examId,studentId,feedback,rating} = req.body;

    let new_feedback = new Feedback({examId,studentId,feedback,rating});
    await new_feedback.save();

    res.status(201).json({ msg: 'Feedback Submitted successfully' });
});

async function getAllFeedbacks() {
  try {
    const feedbacks = await Feedback.find({});
    return feedbacks;
  } catch (err) {
    console.error('Error fetching feedbacks:', err);
  }
}

router.get('/fetchFeedbacks',async (req,res)=>{
  const data = await getAllFeedbacks();
  res.json(data);
});

router.post('/checkAttempted',async (req,res)=>{
    const {examId,studentId} = req.body;
    let attempted = await AttemptedExam.findOne({examId:examId,studentId:studentId});
    if(attempted){

        res.json("Attempted");
    }else{
        res.json("Not Attempted");
    }
});

// Number of Attempts for an exam
router.get('/NumberOfAttempts/:id',async (req,res)=>{
  let attempted=0;
  attempted = await AttemptedExam.find({examId:req.params.id});
  attempted = attempted.length;
  res.json(attempted);
});

//Answers evaluation part

function extractKeywords(text) {
    return new Set(
      text
        // .toLowerCase()
        .replace(/[\p{P}]/gu, '') // Remove punctuation
        .split(/\s+/) // Split by whitespace
        .filter(word => word.length > 2) // Filter out short words
    );
  }

  function evaluateRelevance(prompt, answer) {
    const promptKeywords = extractKeywords(prompt);
    const answerKeywords = extractKeywords(answer);
  
    if (promptKeywords.size === 0 || answerKeywords.size === 0) {
      return 0; // If either text has no keywords, relevance is 0
    }
  
    // Calculate keyword overlap
    const intersection = new Set([...promptKeywords].filter(keyword => answerKeywords.has(keyword)));
    const union = new Set([...promptKeywords, ...answerKeywords]);
  
    // Calculate Jaccard similarity score
    const jaccardIndex = intersection.size / union.size;
    return Math.round(jaccardIndex * 7); // Convert to percentage
  }
  
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  

  async function processQuestions(questions, answers,total_score) {

  
    for (let index = 0; index < questions.length; index++) {
      const question = questions[index];
      console.log(`Processing question ${index + 1}: ${question}`);
        const prompt = await generateText(question);
        console.log(prompt);
        const score = evaluateRelevance(prompt, answers[index]);
        total_score += score;
  
        console.log(`Score for question ${index + 1}: ${score}`);

  
      
    }
  
    console.log(`Total score: ${total_score}`);
    return total_score;
  }
//   async function generateText(prompt) {
//     const input_ids = tokenizer(prompt, return_tensors='pt').input_ids
//     const output = model.generate(input_ids, max_length=50, num_beams=5, early_stopping=True)
//     return tokenizer.decode(output[0], skip_special_tokens=True)
// }

  async function generateText(prompt) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: prompt }),
    });
    
    const data = await response.json();
    console.log(data);
    return data[0].generated_text;
  }


  function getInternalMarks(){
    return 40;
  }

router.post('/evaluate', async (req, res) => {
    const { type,questions,answers,score } = req.body;
    let total_score = score;
  console.log("Evaluation underway");
    if (!answers) {
      return res.status(400).send({ error: 'No answers' });
    }
    if(type!=='Assignment'){
    total_score = await processQuestions(questions,answers,total_score);
    }
    
    if(type==='Sem'){

    }
    res.send("done");
});


//create schedule

router.post('/create_schedule', async (req, res) => {
  const {year,type,examNumber,batch, data } = req.body;
  console.log("exam schedule creation underway");

  const schedule = new Schedule({year,type,examNumber,batch, data });

  await schedule.save();

  res.status(201).json({ msg: 'Exam Schedule Created successfully' });
});

// get assigned task details
router.get('/getTasks/:id',async (req, res)=>{
  try {
    const { id } = req.params;

    const schedules = await Schedule.find();

    const tasks = schedules.flatMap(schedule => {
      const filteredTasks = schedule.data.filter(task => task.AssignedTeacherId === id);
      return {
        year: schedule.year,
        type: schedule.type,
        batch: schedule.batch,
        tasks: filteredTasks 
      };
    });

    const filtered_tasks =  tasks.filter(item => item.tasks.length !== 0);
    console.log(filtered_tasks);
    res.json(filtered_tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

router.get('/getTasks',async (req, res)=>{
  try {
    const schedules = await Schedule.find();

    console.log(schedules);
    res.json(schedules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});


async function getStudentIdsByExamId(examId) {
  try {
    const attemptedExams = await AttemptedExam.find({ examId }, 'studentId');
    const studentIds = attemptedExams.map(exam => exam.studentId);
    return studentIds;
  } catch (error) {
    console.error('Error fetching student IDs:', error);
    throw error;
  }
}


// get students that attmepted an exam
router.get('/studentsAttemptedExam/:id',async ()=>{
  const students = getStudentIdsByExamId(req.params.id);

  res.json(students);
});

router.get('/getMidMarks/:id/:subject',async ()=>{
  try {
    // Find exams with examType "mid" for the given given
    const midExams = await Exam.find({examType: "mid" ,subject:req.params.subject});

    // Fetch evaluated data for each mid exam
    const evaluatedData = await Promise.all(
      midExams.map(async (exam) => {
        const evaluations = await Evaluated.find({ studentId:req.params.id,examId: exam.examId });
        return evaluations;
      })

    );

    const marks = findTotalMidMarks(evaluatedData);

    res.json(marks);
  }catch(err){

  }
});

router.get('/getAssignmentMarks/:id/:subject',async ()=>{
  try {
    // Find exams with examType "mid" for the given given
    const midExams = await Exam.find({examType: "assignment" ,subject:req.params.subject});

    // Fetch evaluated data for each mid exam
    const evaluatedData = await Promise.all(
      midExams.map(async (exam) => {
        const evaluations = await Evaluated.find({ studentId:req.params.id,examId: exam.examId });
        return evaluations;
      })

    );

    const marks = findTotalAssignmentMarks(evaluatedData);

    res.json(marks);
  }catch(err){

  }
});

router.get('/getSemesterMarks/:id/:subject',async ()=>{
  try {
    // Find exams with examType "mid" for the given given
    const midExams = await Exam.find({examType: "sem" ,subject:req.params.subject});

    // Fetch evaluated data for each mid exam
    const evaluatedData = await Promise.all(
      midExams.map(async (exam) => {
        const evaluations = await Evaluated.find({ studentId:req.params.id,examId: exam.examId });
        return evaluations;
      })

    );

    res.json(evaluatedData.marks);

  }catch(err){

  }
});


function findTotalMidMarks(evaluations) {

  const marksArray = evaluations.map(evaluation => evaluation.marks);

  marksArray.sort((a, b) => b - a);
  let arr = marksArray.slice(0, 2);
  let marks = arr[0] + arr[1];
  return marks;
}

function findTotalMidAssignmentMarks(evaluations) {

  const marksArray = evaluations.map(evaluation => evaluation.marks);

  marksArray.sort((a, b) => b - a);
  let arr = marksArray.slice(0, 3);
  let marks = (arr[0] + arr[1] + arr[2])/3;
  return marks;
}


module.exports = router;