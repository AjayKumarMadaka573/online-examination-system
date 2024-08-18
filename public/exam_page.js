        let exam;
        let student;
        let questions=[];
        let answers=[];
        let choicequestions=[];
        let choiceanswers=[];
        let bitsquestions = [];
        let bitschoices= [];
        let bitsanswers = [];
        let selectedQuestion=1;
        let pastQuestion=0;
        let selectedBitQuestion=1;
        let attempting_choice = false;
        let startTime;
        let endTime;
        let objective_selected=false;
        let username='ajaykuma';

//   Dark Mode Logics

function ToggleDarkMode(btn){
    const ele = document.querySelectorAll('.page');

    console.log("Executed ");
    ele.forEach(p => {

        const ele1 = p.querySelectorAll('main');

        ele1.forEach(e=>{
            if (e.classList.contains('bg-gray-100')) {
                e.classList.remove('bg-gray-100');
                e.classList.add('bg-gray-900');
                btn.textContent = "Light Mode";
              } else if(e.classList.contains('bg-gray-200')){
                e.classList.remove('bg-gray-200');
                e.classList.add('bg-gray-900');
                btn.textContent = "Light Mode";
              }else {
                e.classList.add('bg-gray-100');
                e.classList.remove('bg-gray-900');
                btn.textContent = "Dark Mode";
              }
        });

        const q = document.querySelectorAll('.q-dark');
        q.forEach(e=>{
            if(e.classList.contains('text-gray-200')){
                e.classList.remove('text-gray-200')
            }else{
                e.classList.add('text-gray-200')
            }
        });
    
       
      });

    let nav = document.querySelectorAll('.nav-section');
    nav.forEach(nav_section=>{
        if(nav_section.classList.contains('bg-white')){
            nav_section.classList.add('bg-gray-700');
            nav_section.classList.remove('bg-white');
            if(nav_section.classList.contains('text-gray-700')){
                nav_section.classList.add('text-gray-200');
                nav_section.classList.remove('text-gray-700');
            }
          }else{
            nav_section.classList.remove('bg-gray-700');
            nav_section.classList.add('bg-white');
            if(nav_section.classList.contains('text-gray-200')){
                nav_section.classList.add('text-gray-700');
                nav_section.classList.remove('text-gray-200');
            }
          }
    })
      
}


// page event listeners

function pageEventListeners(){
    const descriptive = document.getElementById('menu-descriptive');
    const objective = document.getElementById('menu-objective');

    descriptive.addEventListener('click',()=>{
        hideAllPageElementsExcept('descriptive-page');
        selectedPageNavStyle('menu-descriptive');
    });


    objective.addEventListener('click',async ()=>{
        hideAllPageElementsExcept('objective-page');
        selectedPageNavStyle('menu-objective');
        
       
    });

}

pageEventListeners();


function hideAllPageElementsExcept(idToExclude) {
    const allMainElements = document.querySelectorAll('.page');
  
    allMainElements.forEach(element => {
      if (element.id !== idToExclude) {
        if(!element.classList.contains('hidden'))
            element.classList.add('hidden');
      }else{
        if(element.classList.contains('hidden')){
            if(!element.classList.remove('hidden'));
        }
      }
    });
  }


  function selectedPageNavStyle(idToExclude) {
    const allNavElements = document.querySelectorAll('.menu-item');
  
    allNavElements.forEach(element => {
        const head = element.querySelector('span');
      if (element.id !== idToExclude) {
        if(element.classList.contains('border-r-primary')){
            element.classList.remove('border-r-primary')
        }
        if(head.classList.contains('font-bold')){
            head.classList.remove('font-bold');
        }
            element.classList.add('border-r-white');
      }else{
        if(element.classList.contains('border-r-white')){
            element.classList.remove('border-r-white');
            
        }
        if(!head.classList.contains('font-bold')){
            head.classList.add('font-bold');
        }
        element.classList.add('border-r-primary');
      }
    });
  }


// Main Logics

window.addEventListener('DOMContentLoaded', () => {
    
    fetch('/getAttemptingExam')
  .then(response => response.json())
  .then(async data => {
    console.log('Atleast got a response');
    const data_ = JSON.parse(data);
    const exam_json = JSON.parse(data_.exam);

    console.log(exam_json);
    exam = exam_json;
    const examId = exam_json.examId;
    // username =JSON.parse(data_.user).username;
    console.log(username);
    const new_data = JSON.stringify({
        examId:examId,
        studentId:username
    });
    console.log(new_data);
   
    await Check(new_data,examId);

  })
  .catch(error => {
    console.error('Error fetching session data:', error);
  });
});

async function Check(new_data,examId){
    console.log("Check started executing");
const response = await fetch('api/exams/checkAttempted', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:new_data
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

const result = await response.text();


if(result==='"Attempted"'){
   console.log("okay");
}else{
    console.log("Executing prefectly");
    await fetchExamDetails(examId);
}
}

function attemptChoice(ele){
    const que = document.getElementById('dquestion');
    const ans = document.getElementById('ans');
    if(ele.value==='d'){
        ele.textContent='Revert';
        ele.value='o';
        answers[selectedQuestion-1] = ans.value;
        que.value = choicequestions[selectedQuestion-1];
        ans.value = choiceanswers[selectedQuestion-1];
    }else{
        ele.textContent='Attempt Choice';
        ele.value='d';
        que.value = questions[selectedQuestion-1];
        choiceanswers[selectedQuestion-1] = ans.value;
        ans.value = answers[selectedQuestion-1];
    }
}


function hideDescriptive(){
    const d = document.querySelector('.d-menu');
    d.classList.add('hidden');
}

function hideObjective(){
    const o = document.querySelector('.o-menu');
    o.classList.add('hidden');
}

async function fetchExamDetails(examId){
    try {
                const response = await fetch(`api/exams/fetchExamDetails/${examId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
               exam = await response.json();

               startTime = getExamDateTime(exam.examDate,exam.examTime);
               if(exam.examType==='Mid'){
                endTime = addMinutes(startTime,45);
                hideObjective();
                hideAllPageElementsExcept('descriptive-page');
               }else if(exam.examType==='Sem'){
                endTime = addMinutes(startTime,180);
               }else if(exam.examType==='Assignment'){
                endTime = addMinutes(startTime,20);
                hideDescriptive();
                hideAllPageElementsExcept('objective-page');
               }
               LoadExamPage();
               console.log("Executed alright");
    }catch(err){
        console.log("Error :"+err);
    }
 }

 function LoadExamPage(){
    const now = new Date().getTime();
    console.log(now);
    if(now >= startTime && now<endTime){
        console.log("Starting Exam");
        setExamHeader(exam.examType);
        loadQuestionNumberDropDown(exam.examType);
        Countdown();
        if(exam.examType==='Mid' || exam.examType==='Sem'){

            
        
        for(let i=0;i<exam.examQuestions.length;i++){
            questions.push(exam.examQuestions[i]);
            answers.push("");
            choicequestions.push(exam.examChoiceQuestions[i]);
            choiceanswers.push("");
            
        }
        const question = document.getElementById('dquestion');
        question.textContent=selectedQuestion + '.'+ questions[selectedQuestion-1];
        
        
    }
    if(exam.examType==='Assignment' || exam.examType==='Sem'){
        for(let i=0;i<exam.examBits.length;i++){
            bitsquestions.push(exam.examBits[i]);
            let l = [];
            for(let j=0;j<4;j++){
                l.push(exam.examBitsChoices[i][j]);
            }
            bitschoices.push(l);
            bitsanswers.push("");
        }

        const ans = document.getElementsByName('radio-group');
        let value=0;
        for (const radio of ans) {
            radio.value=bitschoices[0][value];

            console.log(radio.value);
            radio.nextElementSibling.textContent=bitschoices[0][value];
            value++;
        }
        // setobjectivequestionNumberDropdown();
    }
    }else if(now>endTime){
        // exam already ended
        console.log("exam already ended");
        
    }else if(now<startTime){
        // exam hasn't started
        console.log("exam hasn't started");
    }
    
}
function loadQuestionNumberDropDown(type){
    const d = document.getElementById('questionNumberDropdown');
    const o = document.getElementById('oquestionNumberDropdown');
    if(type==='Sem'){
        let html = ``;
        for(let i=0;i<6;i++){
            html += `<option value="${i}">Q${i+1}</option>`;
        }
        d.innerHTML='';
        d.innerHTML=html;
        html='';
        for(let i=0;i<18;i++){
            html += `<option value="${i}">Q${i+1}</option>`;
        }
        o.innerHTML='';
        o.innerHTML=html;
        questionNumberChange();
        objectiveQuestionNumberChange();
    }
    if(type==='Mid'){
        let html = ``;
        for(let i=0;i<4;i++){
            html += `<option value="${i}">Q${i+1}</option>`;
        }
        d.innerHTML='';
        d.innerHTML=html;
        o.innerHTML='';
        questionNumberChange();
    }
    if(type==='Assignment'){
        let html = ``;
        for(let i=0;i<10;i++){
            html += `<option value="${i}">Q${i+1}</option>`;
        }
        o.innerHTML='';
        o.innerHTML=html;
        d.innerHTML='';
        objectiveQuestionNumberChange();
    }
}       

    

function questionNumberChange(){
    const d = document.getElementById('questionNumberDropdown');
   

    d.addEventListener('change',(event)=>{
        let pastQuestion = selectedQuestion;
        let qNo = Number(event.target.value);
        selectedQuestion = qNo+1;
        const ans = document.getElementById('ans');
        if(ans.value!==''){
            answers[pastQuestion-1]=ans.value;
            ans.value='';
        }
        const que = document.getElementById('dquestion');
        que.textContent = selectedQuestion + "." + questions[selectedQuestion-1];
        ans.value=answers[selectedQuestion-1];
    });
    

}

function objectiveQuestionNumberChange(){
    const o = document.getElementById('oquestionNumberDropdown');
   

    o.addEventListener('change',(event)=>{
        let pastQuestion = selectedBitQuestion;
        let qNo = Number(event.target.value);
        selectedBitQuestion = qNo+1;
        const ans = document.getElementsByName('radio-group');
        let value='';
        for (const radio of ans) {
            if (radio.checked) {
                value = radio.value;
                break;
            }
        }
        if(value!==''){
            console.log(value);
            bitsanswers[pastQuestion-1]=value;
        }
        const que = document.getElementById('oquestion');
        que.textContent = selectedBitQuestion + "." + bitsquestions[selectedBitQuestion-1];
        let i=0;
        for (const radio of ans) {
            radio.value = bitschoices[selectedBitQuestion-1][i];
            radio.nextElementSibling.textContent=bitschoices[selectedBitQuestion-1][i];
            if (radio.value===bitsanswers[selectedBitQuestion-1]) {
                radio.checked = true;
            }else{
                radio.checked=false;
            }

            i++
        }
    });

}

function setExamHeader(examType){
    const headers = document.querySelectorAll('.exam-head');
    headers.forEach((header)=>{
        header.textContent = examType;
    });
}

 function getExamDateTime(dateString,timeString) {
    dateString = dateString.replace("T00:00:00.000Z","");
    const [year, month, day] = dateString.split('-').map(Number); 

const [hours, minutes] = timeString.split(':').map(Number);

const examDate = new Date(year, month-1, day, hours, minutes, 0);
return examDate;
}

 function addMinutes(date, minutesToAdd) {
    const newDate = new Date(date.getTime());

    newDate.setMinutes(newDate.getMinutes() + minutesToAdd);

    return newDate;
}


// Exam Countdown

function Countdown(){
    const x = setInterval(function() {

const now = new Date().getTime();

const distance = endTime - now;


const days = Math.floor(distance / (1000 * 60 * 60 * 24));
const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
const seconds = Math.floor((distance % (1000 * 60)) / 1000);


document.querySelectorAll(".time-remaining").forEach(ele=>{
    ele.innerHTML =
 hours + "h " + minutes + "m " + seconds + "s ";
});
if (distance < 0) {
clearInterval(x);
submitAnswers();

}
}, 1000);
}


// Submit Exam

async function submitAnswers(){


            
        const data = JSON.stringify({
            studentId:username,
            examId:exam.examId,
            answers:answers,
            answersChoice:choiceanswers,
            bitsAnswers:bitsanswers
        });

        const response = await fetch('api/exams/examAttempted', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:data
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            const result = await response.text();
            hideAllPageElementsExcept('feedback-page');
            




    }

async function submitFeedback(){
    const feedback = document.getElementById('feedback-text').value;
    const rating_radio = document.getElementsByName('rating');
    let rating = 0;
    for (const radio of rating_radio) {
        if(radio.checked){
            rating = Number(radio.value);
        }
    }
    const data = JSON.stringify({examId:exam.examId,studentId:username,feedback:feedback,rating:rating});
    if(feedback && rating){
        const response = await fetch('api/exams/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:data
        });

        if (!response.ok) {
            throw new Error('Failed to give feedback');
        }

        const result = await response.text();
        const f = document.getElementById('feedback');
        f.classList.add('hidden');
        const f_success = document.getElementById('feedback-success');
        f_success.classList.remove('hidden');
    }
}

function goBack()
{
    window.location.href='student.html';
}