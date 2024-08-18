// No of Semester Questions Added
let username = "ajay";
let SemQueCounter = 0;
let SemBitQueCounter = 0;
let MidQueCounter = 0;
let AssignmentQueCounter = 0;
let AssignmentQuestions = [];
let AssignmentQuestionsChoices = [];
let MidQuestions = [];
let SemQuestions = [];
let SemQuestionsChoice = [];
let SemBitQuestions = [];
let SemBitQuestionsChoice = [];
let MidQuestionsChoice = [];
let examDate="";
let examTime="";
let year="";
let subject="";
let batch = "";
let e3_subs = ['Data Mining','Computer Networks','Operating Systems','Software Engineering','Mathematical Foundation for Data Science'];
let selectedExamId="";
let exam_detals;
let tasks_assigned;
let examId;
let examNumber=0;
let questionNumber;
let bitQuestionNumber=1;
let type;

const Field = document.querySelector('#tasks');


window.addEventListener('DOMContentLoaded',async () => {
    initializingAllArrays();
        // Your code here, which can safely interact with the DOM
        const response = await fetch('/getTeacherDetails', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        
        const teacher_data = await response.json();
    
        if(!response.ok){
            alert('error');
        }

        console.log(teacher_data);
        username = JSON.parse(teacher_data.teacher).username;

        const username_field = document.getElementById('username-field');
        username_field.textContent = username
        console.log(username);
        if(teacher_data.dark==='yes'){
            const btn = document.getElementById('dark-mode-btn');
            ToggleDarkMode(btn);
        }

    // Load Messages

    await LoadMessages();


    getTaskAssigned();

});

function createCreateStartForm(){
    const Field = document.querySelector('#tasks');

    const list = createTaskList(tasks_assigned);
    console.log(list);
    
    if(list!=="undefined"){
        Field.textContent="";
    Field.innerHTML = list;
    }


}



async function createTaskList(data) {
    const taskList = document.createElement('ul');
    taskList.classList.add('list-group','TasksList');

    let html=``;    let i=0;
    for(const schedule of data){

    let img_src;
    if(schedule.type==='mid'){
        img_src="M.png";
    }else if(schedule.type==='sem'){
        img_src="S.png";
    }else{
        img_src = "A.png";
    }


    for(const task of schedule.tasks){

        const response = await fetch('/api/exams/checkIfAlreadyCreated/'+task.examId);

        const msg = await response.json();
        if(msg==="Exam not found"){
            let t_data = {tyear: schedule.year,
                ttype: schedule.type,
                tnumber: schedule.examNumber,
                tbatch: schedule.batch,
                tsubject: task.Subject,
                tdate: task.ExamDate,
                ttime: task.ExamTime,
                tid: task.examId};
        
            let string_data = JSON.stringify(t_data);
            string_data = removeNewlines(string_data);
           
             html += `<div class="card hover:shadow-lg">
                            <img src="${img_src}" alt="sem.jpg" class="w-full h-32 sm:h-48 object-cover">
                            <div class="m-4">
                                <span class="font-semibold"><span class="font-bold">ExamDate:</span> ${task.ExamDate}</span>
                                <span class="font-semibold block"><span class="font-bold">ExamTime:</span>${task.ExamTime}</span>
                            </div>
                            <div class="flex m-2 justify-center">
                                <button data-task-data='${string_data}' onclick='tasksEventListener(this)' class="bg-secondary-100 text-secondary-200 btn hover:shadow-inner transform hover:scale-125 hover:bg-opacity-50 transition ease-out duration-300">Create</button>
                            </div>
                            <div class="badge">
                                <svg class="w-5 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                  </svg>
                                  
                                <span>3 hrs</span>
                            </div>
                         </div>`;
        
                         i++;
        
        }
    
      }

    }
    if(i==0){

            html = `<div class="flex items-center justify-center mt-[35%]"><div class="flex justify-center"><h3 class="text-2xl font-semibold">There are no Tasks as of now</h3></div></div>`;
    }
    html = html.replace('undefined','');
    return html;
  }

  function removeNewlines(data) {
    return data.replace(/[\r\n]/g, '');
  }
   

function getTaskAssigned(){
    fetch('api/exams/getTasks/'+username)
  .then(response => response.json())
  .then(async data => {
    console.log(data); 

    tasks_assigned=data;
    const list = await createTaskList(data);
    Field.textContent="";
    Field.innerHTML =  list;
   
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
}


async function tasksEventListener(data_){
    console.log("Invoked");
    const data = JSON.parse(data_.dataset.taskData);
    year = data.tyear;
    examType = data.ttype;
    batch = data.tbatch;
    subject = data.tsubject;
    examDate = data.tdate;
    examTime = data.ttime;
    examId = data.tid;
    examNumber = data.tnumber || 1;
    console.log(year,examType,batch,subject,examDate,examTime,examNumber);
    // Logic to generate questions based on exam type
    if (examType === 'sem' && examDate!=='' && examTime!=='') {
        console.log("yes");
        type="sem";
        generateSemesterForm();
        semesterFormEventListeners();


} else if (examType === 'mid' && examDate!=='' && examTime!=='') {
// Generate 4 descriptive questions
type="mid";
    generateMidForm();
    midFormEventListeners();

} else if (examType === 'assignment' && examDate!=='' && examTime!=='') {
// Generate 20 multiple choice questions
console.log("assign,ent secion called");
type="assignment";
generateAssignmentForm();
assignmentFormEventListeners();

}else{
alert("Some value is missing check again");
}
}


function generateSemesterForm(){
    console.log('yes');
    hideAllMainElementsExcept('sem');
}

function generateMidForm(){
    console.log('yes');
    hideAllMainElementsExcept('mid');
}


function generateAssignmentForm(){
    console.log('yes');
    hideAllMainElementsExcept('assignment');
}

function hideAllMainElementsExcept(idToExclude) {
    const ele = document.getElementById('home-page');
    const allMainElements = ele.querySelectorAll('main');
  
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


  function semesterFormEventListeners(){
    const create = document.getElementById('create-sem');
    const cancel = document.getElementById('cancel');

    create.addEventListener('click',async ()=>{

        if(AllFieldsEntered()){
            const data = {
                    examId:examId,
                    teacherId:username,
                    examType:'Sem',
                    examNumber:examNumber,
                    year:year,
                    batch:batch,
                     subject:subject,
                     examDate:examDate,
                    examTime:examTime,
                    examQuestions:SemQuestions,
                    examChoiceQuestions:SemQuestionsChoice,
                    examBits:SemBitQuestions,
                    examBitsChoices:SemBitQuestionsChoice,
                    
                };
                try {
            const response = await fetch('/api/exams/create_exam', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)  

            });

            if (!response.ok) {
            throw new Error('Network response was not ok');
            }

            const result = await response.json();

            if(result.msg=== 'Exam Created successfully'){
                window.location.href="Success.html";
            }
        } catch (error) {
            console.error('Error:', error); 

        }
                

                }else{
                    alert("Oops!! Some Questions are missing!! Check and try again..");
                }

            });

    cancel.addEventListener('click',()=>{
        initializingAllArrays();
        Field.textContent='';
        hideAllMainElementsExcept('tasks-section');
       createCreateStartForm();


    });

    for(let i=0;i<6;i++){
        const ele = document.getElementById('sq-'+i);

        ele.addEventListener('click',(event)=>{
            const questionNo = Number(event.target.id.replace('sq-').replace('undefined',''));

            generateDescriptiveForm(questionNo);
        });
    }

    for(let i=0;i<18;i++){
        const ele = document.getElementById('sb-'+i);

        ele.addEventListener('click',(event)=>{
            const questionNo = Number(event.target.id.replace('sb-').replace('undefined',''))+1;

            generateObjectiveForm(questionNo);
        });
    }
        
        
}

function midFormEventListeners(){
    const create = document.getElementById('create-mid');
    const cancel = document.getElementById('cancel-mid');

    create.addEventListener('click',async ()=>{

        if(AllFieldsEntered()){
            const data = {
                    examId:examId,
                    teacherId:username,
                    examType:'Mid',
                    examNumber:examNumber,
                    year:year,
                    batch:batch,
                     subject:subject,
                     examDate:examDate,
                    examTime:examTime,
                    examQuestions:MidQuestions,
                    examChoiceQuestions:MidQuestionsChoice,
                    examBits:[],
                    examBitsChoices:[],
                    
                };
                try {
            const response = await fetch('/api/exams/create_exam', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)  

            });

            if (!response.ok) {
            throw new Error('Network response was not ok');
            }

            const result = await response.json();

            if(result.msg=== 'Exam Created successfully'){
                window.location.href="Success.html";
            }
        } catch (error) {
            console.error('Error:', error); 

        }
                

                }else{
                    alert("Oops!! Some Questions are missing!! Check and try again..");
                }

            });

    cancel.addEventListener('click',()=>{
        initializingAllArrays();
        Field.textContent='';
        hideAllMainElementsExcept('tasks-section');
       createCreateStartForm();


    });

    for(let i=0;i<4;i++){
        const ele = document.getElementById('mq-'+i);

        ele.addEventListener('click',(event)=>{
            const questionNo = Number(event.target.id.replace('mq-').replace('undefined',''))+1;

            generateDescriptiveForm(questionNo);
        });
    }
        
}

function assignmentFormEventListeners(){
    const create = document.getElementById('create-assignment');
    const cancel = document.getElementById('cancel-assignment');

    create.addEventListener('click',async ()=>{

        if(AllFieldsEntered()){
            const data = {
                    examId:examId,
                    teacherId:username,
                    examType:'Assignment',
                    examNumber:examNumber,
                    year:year,
                    batch:batch,
                     subject:subject,
                     examDate:examDate,
                    examTime:examTime,
                    examQuestions:[],
                    examChoiceQuestions:[],
                    examBits:AssignmentQuestions,
                    examBitsChoices:AssignmentQuestionsChoices,
                    
                };
                try {
            const response = await fetch('/api/exams/create_exam', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)  

            });

            if (!response.ok) {
            throw new Error('Network response was not ok');
            }

            const result = await response.json();
  
            if(result.msg=== 'Exam Created successfully'){
                window.location.href="Success.html";
            }
        } catch (error) {
            console.error('Error:', error); 

        }
                

                }else{
                    alert("Oops!! Some Questions are missing!! Check and try again..");
                }

            });

    cancel.addEventListener('click',()=>{
        initializingAllArrays();
        // Field.textContent='';
        hideAllMainElementsExcept('tasks-section');
       createCreateStartForm();


    });

    for(let i=0;i<6;i++){
        const ele = document.getElementById('sq-'+i);

        ele.addEventListener('click',(event)=>{
            const questionNo = Number(event.target.id.replace('sq-').replace('undefined',''));

            generateDescriptiveForm(questionNo);
        });
    }
        
}

function generateDescriptiveForm(qNo){
    hideAllMainElementsExcept('descriptive');
    questionNumber = qNo;
    const que = document.getElementById('entry-que');
    que.value='';
   
    const choice = document.getElementById('entry-choice-que');
    choice.value='';

    const qh = document.getElementById('q-header');
    const ch = document.getElementById('c-header');
    qh.textContent = "Question "+(qNo);
    ch.textContent = "Choice Question "+(qNo);
    console.log(qNo);
    if(type==='sem'){
    if(SemQuestions[qNo-1]!=='')
        que.value = SemQuestions[qNo-1];
    if(SemQuestionsChoice[qNo-1]!=='')
        choice.value = SemQuestionsChoice[qNo-1];
    }
    if(type==='mid'){
        if(MidQuestions[qNo-1]!=='')
            que.value = MidQuestions[qNo-1];
        if(MidQuestionsChoice[qNo-1]!=='')
            choice.value = MidQuestionsChoice[qNo-1];
    }

    descriptiveQuestionUpdate();
}

function generateObjectiveForm(qNo){
    hideAllMainElementsExcept('objective');
    bitQuestionNumber = qNo;
    const que = document.getElementById('bit-que');
    que.value='';

    let choices = [];

    for(let i=0;i<4;i++){
        choices.push(document.getElementById('b-'+(i+1)));
        choices[i].value='';
    }

   


    const qh = document.getElementById('bq-header');
    qh.textContent = "Question "+(qNo);
    console.log(typeof qNo);

    if(type==='assignment'){
    if(AssignmentQuestions[qNo-1]!==''){
        que.value = AssignmentQuestions[qNo-1];
        console.log("Executed");
    }

let l = [];

    for(let i=0;i<4;i++){

        
        AssignmentQuestionsChoices.forEach((e,index)=>{
            
            if(index===qNo-1){
                e.forEach(v=>{
                   
                    l.push(v);
                });
            }
        });
        
    }

    if( AssignmentBitQuestionsChoice[qNo-1][4]){
        selectRadioButton(AssignmentBitQuestionsChoice[qNo-1][4]);
    }else{
        selectRadioButton('');
    }

    for(let i=0;i<4;i++){
        if(l[i]!==undefined){

        choices[i].value = l[i];
        }
    }
   

    objectiveQuestionUpdate();
}

    if(type==='sem'){
        if(SemBitQuestions[qNo-1]!==''){
            que.value = SemBitQuestions[qNo-1];
            console.log("Executed");
        }

        let l = [];

    for(let i=0;i<4;i++){

        
        SemBitQuestionsChoice.forEach((e,index)=>{
            console.log(e);
            if(index===qNo-1){
                if(e!==''){
                e.forEach(v=>{
                   
                    l.push(v);
                });
            }else{
                l.push('');
            }
            }
        });
        
    }

    

    for(let i=0;i<4;i++){
        if(l[i]!==undefined){

        choices[i].value = l[i];
        }
    }
    if( SemBitQuestionsChoice[qNo-1][4]){
        selectRadioButton(SemBitQuestionsChoice[qNo-1][4]);
    }else{
        selectRadioButton('');
    }
    objectiveQuestionUpdate();
}
}

function AllFieldsEntered(){
    let flag = true;
    console.log(type);
    if(type==='sem'){
    
        SemBitQuestions.forEach(v=>{
            
            if(v==='' ||  v===undefined){
              
                flag = false;
                return flag;
            }
        });

        SemBitQuestionsChoice.forEach(c=>{
            if(c!==''){
            c.forEach(v=>{
                console.log(v);
                if(v==='' || v===undefined){
                    flag = false;
                    return flag;
                }
            });}else{
                return false;
            }
        })

        SemQuestions.forEach(que=>{
            if(que===''){
                flag = false;
                return flag;
            }
        });
            

        
    
} 


if(type==='assignment'){
    console.log("Executing");
    AssignmentQuestions.forEach(v=>{
        if(v==='' ||  v===undefined){
            
            flag = false;
            return flag;
        }
    })

    AssignmentQuestionsChoices.forEach(c=>{
        c.forEach(v=>{
            console.log(v);
            if(v==='' || v===undefined){
                flag = false;
                return flag;
            }
        });
    })
    return flag;
}

if(type==='mid'){
   MidQuestions.forEach(que=>{
        if(que===''){
            flag = false;
            return flag;
        }
    });

    MidQuestionsChoice.forEach(c=>{
        if(c===''){
            flag=false;
            return flag;
        }
    });
        
}

return flag;
}

function initializingAllArrays(){
    console.log("All initilaizations done");
    SemQuestions=[];
    SemQuestionsChoice=[];
    SemBitQuestions=[];
    SemBitQuestionsChoice=[];
    let i;
    for(i=0;i<18;i++){
        if(i<6){
            SemQuestions.push("");
            SemQuestionsChoice.push(new Array(5));
        }
        SemBitQuestions.push("");
        SemBitQuestionsChoice.push("");
    }

    MidQuestions=[];
    MidQuestionsChoice=[];
    for(i=0;i<4;i++){
        MidQuestions.push("");
        MidQuestionsChoice.push("");
    }

    AssignmentQuestions=[];
    AssignmentQuestionsChoices=[];
    for(i=0;i<10;i++){
        AssignmentQuestions.push("");
        AssignmentQuestionsChoices.push(new Array(5));

        console.log("Execute");
    }
}


function descriptiveQuestionUpdate(){
    document.getElementById('update-descriptive').addEventListener('click',()=>{
        const que = document.getElementById('entry-que');
    const choice = document.getElementById('entry-choice-que');
        if(type==='sem'){

                SemQuestions[questionNumber-1] = que.value;
            
 
                SemQuestionsChoice[questionNumber-1] = choice.value;
                hideAllMainElementsExcept('sem');
        }
        if(type==='mid'){

            MidQuestions[questionNumber-1] = que.value;
        

            MidQuestionsChoice[questionNumber-1] = choice.value;
            hideAllMainElementsExcept('mid');
    }

        
    });
}

function objectiveQuestionUpdate(){

    document.getElementById('update-objective').addEventListener('click',()=>{
        const que = document.getElementById('bit-que');
        let choices = [];

        for(let i=0;i<4;i++){
            choices.push(document.getElementById('b-'+(i+1)));
            console.log(choices[i]);
        }
        const v = getSelectedValue();


    
        if(type==='sem'){

                SemBitQuestions[bitQuestionNumber-1] = que.value;
            
                let l = [];
                for(let i=0;i<4;i++){
                    l.push(choices[i].value);
                    
    
                }
                l.push(v);
                console.log(l+" for checking");
                SemBitQuestionsChoice[bitQuestionNumber-1] = l;
               
                hideAllMainElementsExcept('sem');
        }
        if(type==='assignment'){

            AssignmentQuestions[bitQuestionNumber-1] = que.value;
            let l = [];
            for(let i=0;i<4;i++){
                l.push(choices[i].value);
                

            }
            l.push(v);
            AssignmentQuestionsChoices[bitQuestionNumber-1]=l;
            
            hideAllMainElementsExcept('assignment');
    }

       
    });
}

for(let i=0;i<6;i++){
    const ele = document.getElementById('sq-'+i);

    ele.addEventListener('click',(event)=>{
        const questionNo = Number(event.target.id.replace('sq-').replace('undefined',''));

        generateDescriptiveForm(questionNo);
    });
}

for(let i=0;i<10;i++){
    const ele = document.getElementById('bq-'+i);

    ele.addEventListener('click',(event)=>{
        const bitQuestionNo = Number(event.target.id.replace('bq-').replace('undefined',''))+1;
        console.log(event.target.id.replace('bq-'));
        generateObjectiveForm(bitQuestionNo);
    });
}

function getSelectedValue() {
    const radioButtons = document.getElementsByName('radio-group');
    let selectedValue = null;
  
    for (const radioButton of radioButtons) {
      if (radioButton.checked) {
        selectedValue = radioButton.value;
        break;
      }
    }
  
    return selectedValue;
  }
  function selectRadioButton(value) {
    const radioButtons = document.getElementsByName('radio-group');
  
    for (const radioButton of radioButtons) {
      radioButton.checked = radioButton.value === value;
    }
  }
// page 2 logics (Exams View)


async function fetchExams() {
    try {
        const response = await fetch('/api/exams/fetchExamDetails');
        if (!response.ok) throw new Error('Network response was not ok');
        console.log(response);
        let data = await response.json();

        const examList = document.getElementById('view');
        examList.innerHTML = '';
       
        
        let i=0;

        let html=`<div class="font-semibold p-4 bg-blue-600 text-gray-200 mt-10">
                            <h2 class="text-2xl font-bold text-center">Exams</h2>
                        </div>`;
        data.forEach(exam => {
            let exam_data = JSON.stringify(exam);
            let date = exam.examDate.split('T')[0];
            if(exam.teacherId===username){
                let img_src;
                if(exam.examType==='Sem'){
                    img_src = 'sem.jpg';
                }else if(exam.examType==='Mid'){
                    img_src = 'mid.webp';
                }else{
                    img_src = 'assignment.jpg';
                }
//             html += `<div class="view-list-item">
//             <div class="ml-5">
//                 <img src="${img_src}" class="view-img" alt="">
//             </div>

//             <div class="view-d-1">
//                 <div>
//                 <h1 class="view-head uppercase">${exam.year}-${exam.examType}-01</h1>
//                 <p>DM</p>
//                 </div>

//                 <div class="view-d-2">
//                     <div>
//                         <h3 class="font-semibold">ExamDate:</h3><span>${date}</span>
//                     </div>
//                     <div class="ml-5">
//                         <h3 class="font-semibold">ExamTime:</h3><span>${exam.examTime}</span>
//                     </div>
//                 </div>
//             </div>
//             <button class="view-badge" data-task-data='${exam_data}' onclick='eachExam(this)'>
//                 <div>
//                     View
//                 </div>
//             </button>
//         </div>
// `;

                html += ` <div class="card mt-10 p-4">
                <div class="relative schedule-card flex justify-around p-4">
                    <div  class="flex items-center">
                        <h3 class="font-bold uppercase">${exam.year}-${exam.examType}-01&nbsp; </h3><span>DM</span>
                    </div>
                    <div class="flex items-center">
                        <h3 class="font-bold">ExamDate: </h3><span>${date}</span>
                    </div>
                    <div class="flex items-center">
                        <h3 class="font-bold">ExamTime: </h3><span>${exam.examTime}</span>
                    </div>
                    <div class="flex items-center justify-center">
                        <button class="view-badge  transform -translate-y-1/3 translate-x-1/2" data-task-data='${exam_data}' onclick='eachExam(this)'>
                 <div>
                    View
               </div>
           </button>
                    </div>
                </div>
               </div>`;
           
            i++;

            }
        });
        if(i==0){

            html += `<div class="flex items-center justify-center mt-[35%]"><div class="flex justify-center"><h3 class="text-2xl font-semibold">There are no Exams Created Yet</h3></div></div>`;
    }
        examList.innerHTML = html;

    } catch (error) {
        console.error('Error fetching exams:', error);
    }
}

function eachExam(data_){
    const data = JSON.parse(data_.dataset.taskData);
    let html=``;
    if(data.examType==='Sem' || data.examType==='Mid'){
       html += ` <div>
        <div class="view-each-header">
            Descriptive
        </div> <div class="view-each-card">
            <div class="view-each-inner-header">
                Questions
            </div>`;
    
        for(let i=0;i<data.examQuestions.length;i++){
            html += `<div class="view-each-item que-btn">
                ${i+1}.${data.examQuestions[i]}.
            </div>`;
        }
        html+=` </div><div class="view-each-card">
            <div class="view-each-inner-header">
                Choice Questions
            </div>`; 
            for(let i=0;i<data.examChoiceQuestions.length;i++){
                html += `<div class="view-each-item que-btn">
                    ${i+1}.${data.examChoiceQuestions[i]}.
                </div>`;
            }
        
            html+=`</div>`;
    }

    if(data.examType==='Sem' || data.examType==='Assignment'){
        html += `<div>
        <div class="text-3xl font-bold text-center mt-5">
           Objective
        </div>
        <div class="view-each-card">
            <div class="font-bold text-xl text-center mt-5 mb-5">
                Questions
            </div>`;

        for(let i=0;i<data.examBits.length;i++){
            html += `<div class="view-each-item">
                <div class='que-btn'>${i+1}.${data.examBits[i]}.</div>
                <div class='flex justify-around mt-10'>
                    <div class='bit-btn'>
                        <p>A.${data.examBitsChoices[i][0]}</p>
                    </div>
                    <div class='bit-btn'>
                       <p>B.${data.examBitsChoices[i][1]}</p>
                    </div>
                    <div class='bit-btn'>
                        <p>C.${data.examBitsChoices[i][2]}</p>
                    </div>
                    <div class='bit-btn'>
                       <p>D.${data.examBitsChoices[i][3]}</p>
                    </div>
                </div>
            </div>`;
        }

        html += '</div></div>';

        

    }
    html += `<div class="flex justify-center"><button class="btn bg-blue-400 text-gray-200 transform hover:scale-125 mt-10" onclick="disable_each_view()">Back</button></div>`;
    const view_each = document.getElementById('view-questions');
        view_each.textContent='';

        view_each.innerHTML=html;
        enable_each_view();
}

function enable_each_view(){
    const ele = document.getElementById('view-page');
    const l = ele.querySelectorAll('main');

    l.forEach((e)=>{
        if(e.id==='view-questions'){
            if(e.classList.contains('hidden')){
                e.classList.remove('hidden');
            }
        }else {
            if(!e.classList.contains('hidden')){
                e.classList.add('hidden');
            }
        }
    });
}

function disable_each_view(){
    const ele = document.getElementById('view-page');
    const l = ele.querySelectorAll('main');

    l.forEach((e)=>{
        if(e.id==='view-questions'){
            if(!e.classList.contains('hidden')){
                e.classList.add('hidden');
            }
        }else if(e.id==='view'){
            if(e.classList.contains('hidden')){
                e.classList.remove('hidden');
            }
        }
    });
}



// page 3 logics (Feedbacks)
let feedbacks;
async function LoadFeedbacks(){
    const response_exams = await fetch('/api/exams/fetchExamDetails');
    if (!response_exams.ok) throw new Error('Network response was not ok');
    console.log(response_exams);
    let exam_data = await response_exams.json();


    const response = await fetch('/api/exams/fetchFeedbacks');
    if (!response.ok) throw new Error('Network response was not ok');
    console.log(response);
    let data = await response.json();
    feedbacks=data;
let i=0;
    let html = `<div class="font-semibold p-4 bg-blue-600 text-gray-200 mt-10 col-span-3">
                            <h2 class="text-2xl font-bold text-center">Feedbacks</h2>
                        </div>`;
    data.forEach((feedback,index) => {
        let flag=false;
        let examType;
        let examDate;
        let color;
        if(index%3===0){
            color=1;
        }else if(index%3===1){
            color=2;
        }else{
            color=3;
        }
        exam_data.forEach(exam =>{
            if(exam.examId===feedback.examId && exam.teacherId===username){
                    flag=true;
                    examType=exam.examType;
                    examDate=exam.examDate;
                    examDate=examDate.replace('T00:00:00.000Z','');
            }
        });
        if(flag){
            html += `<div class="msg-card mt-[10] pt-[8rem] w-[80%]">
                

                  <div class="mail-icon w-[12rem] shadow-md " style="width:12rem;height:10rem">

                    <div class="mail-body triangle-c${color} rounded shadow-md"></div>
                    <div class="mail-triangle${color} mail-triangle cropped-element"></div>

                    
                  </div>`;
            for(let i=0;i<feedback.rating;i++){
                html += `
                  <div class="text-yellow-400 absolute bottom-[20%] left-[${10+(i*15)}%]">
                    <div class="star">
                        <svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path class="bg-pink-900" stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                          </svg>
                          
                          
                      </div>
                      
                </div>`;
            }
            html += `
                <div class="msg h-[2rem] overflow-hidden hover:h-[10rem] rounded h-[10rem] translate-x-[3.5%]  hover:opacity-100 hover:translate-y-[-5%] transition-all duration-300" style="width:10rem;">
                    <div>
                        <h1 class="text-center text-gray-900">${feedback.studentId}'s Feedback</h1>
                    </div>
                    <div class="">
                        <p class="text-center text-gray-700">${feedback.feedback}</p>
                    </div>
                </div>                  
            </div>`;
            i++;
        
        }});

        const feedbacks_content = document.getElementById('feedbacks');
        feedbacks_content.textContent="";
        if(i==0){

            html += `<div class="h-screen flex col-span-3 items-center justify-center "><div class="flex justify-center"><h3 class="text-2xl font-semibold">There are no Feedbacks as of now</h3></div></div>`;
    }
        feedbacks_content.innerHTML = html;
}


// Page 4 Logics (Evaluation of scripts)
async function LoadQuotas(){
    const response_quotas = await fetch('/api/quotas/getQuotas/'+username);
    if (!response_quotas.ok) throw new Error('Network response was not ok');
    let quotas = await response_quotas.json();

    console.log(quotas);

    let i=0;
    let html = ``;
    for(const quota of quotas){
        try{
            console.log("examid :"+quota.examId);
        const exam_details = await fetch('/api/exams/fetchExamDetails/'+quota.examId);
        const exam = await exam_details.json();
        console.log("exam : "+exam.examId);
        html += `<div class="mt-5 ml-5 overflow-hidden`;
        if(i>2){
            html += `-translate-y-1/2`;
        }
            
            html+=`">
        <div class="relative card col-span-1 flex flex-col justify-center items-center">
            <div class=" bg-blue-400 w-full flex justify-center py-2">
                <h1 class="text-gray-100 font-bold uppercase">${exam.year} ${exam.examType}-01</h1>
            </div>
            <div class="mt-10 transform translate-y-1/8">
                <button class="bit-btn mt-5" data-id="${exam.examId}" onclick="LoadEvalEachPage(this)">Evaluate</button>
            </div>
            <div class="absolute top-15 right-15 quota-badge">
                <h3>Remaining-${quota.quotaEnd - quota.quotaStart -quota.Completed}</h3>
            </div>
            <div class="absolute top-15 right-5 quota-badge">
                <h3>Completed-${quota.Completed}</h3>
            </div>
            <div class="absolute top-15 left-10 quota-badge">
                <h3>Quota-${quota.quotaEnd - quota.quotaStart}</h3>
            </div>
        </div>
    </div>`;
    i++;
        }catch(err){
            console.log("Error occured");
        }
    }

    const quotas_content = document.getElementById('eval-list');
        quotas_content.textContent="";
        if(i==0){

            html += `<div class="h-screen flex col-span-3 items-center justify-center "><div class="flex justify-center"><h3 class="text-2xl font-semibold">There are no Scripts to Evaluate as of now</h3></div></div>`;
    }
        quotas_content.innerHTML = html;
}

// Variables for loading a particular question and managing marks
let selectedQuestion = 1;
let Attempts = [];
let marks = [];
let questions = [];
let exam_script;
async function LoadEvalEachPage(ele){
    const examId = ele.dataset.id;

    const response = await fetch('/api/exams/completedExamDetails/'+examId);

    const data = await response.json();
    Attempts = [];
    for(const exam_attempt of data){
        const res = await fetch('/api/quotas/checkIfEvaluated/'+examId+'/'+exam_attempt.studentId);
        const msg = await res.json();

        if(msg==='Not Evaluated'){
            Attempts.push(exam_attempt);
        }else{
            console.log('Evaluated');
        }
    }
    await startEvalEachPage();
}



async function startEvalEachPage(){
    const eval_list = document.getElementById('eval-list');
            const eval_each = document.getElementById('eval-each');
            eval_list.classList.add('hidden');
            eval_each.classList.remove('hidden');
     exam_script = Attempts[0];
    marks = [];
   
    let html = `<div class="col-span-2">
    <div class="relative font-semibold p-4 bg-blue-600 text-gray-200 w-full">
        <div class="flex justify-center text-3xl w-full">
            Evaluation 
        </div>

        <div class="absolute top-0">
            <button class="bit-btn" onclick="goBackToEvalList()">Back</button>
        </div>

        <div class="absolute right-5 top-0">
            <button class="bit-btn" onclick="submitMarks()">Submit</button>
        </div>
       </div><div class="mt-5">
        <h1 class="flex justify-center font-bold text-2xl">
            Allotted Marks
        </h1>
       </div>
    <div class="shadow-md w-auto flex justify-center">
        <div class="card w-[14rem] flex justify-start">`;
    for(let i=0;i<exam_script.answers.length;i++){

        html += `<div class="flex  flex-col items-center justify-center">
                <div class="flex justify-center text-gray-100 bg-blue-500 p-2 w-full">
    Q${i+1}
                </div>
                <div class="flex justify-center text-gray-100  bg-blue-300 p-2 w-full" id="m-${i}">
    ${0}
                </div>
            </div>`;
            marks.push(0);
    }

    const response = await fetch('/api/exams/fetchExamDetails/'+exam_script.examId);

    const exam = await response.json();

    questions = exam.examQuestions;
    html += `
        </div>

    </div>   
   

    <div class="mt-10 mb-10 flex flex-col justify-center items-center">
        <h1 class="font-bold mb-5 text-2xl" id="question-number-field">
            Question 1
        </h1>
        <h1 class="font-semibold text-xl" id="question-field">
         ${questions[0]}
        </h1>
    </div>
    <div class="flex flex-col justify-center items-center">
        <div class="font-bold text-2xl mb-5">
            <h3>Answer</h3>
        </div>
        <div id="answer-field">
            ${exam_script.answers[0]}
        </div>
    </div>

    <div  class="relative eval-card mt-10">
        <div onclick="prevQuestion()" class="absolute left-5 flex items-center">
            <svg class="text-gray-100 w-5" xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
              </svg>

              <div class="ml-5 hidden sm:block">
                <h3 class="text-gray-200">prev</h3>
              </div>
              
        </div>
        <div onclick="nextQuestion()" class="absolute right-5 flex items-center">
           
              <div class="mr-5 hidden sm:block">
                <h3 class="text-gray-200">Next</h3>
              </div>

              
              <svg class="text-gray-100 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
              </svg>
              
              
        </div>
        <div class="flex justify-center">
            <div>
                <h3 class="font-semibold text-gray-200">Allot Marks: </h3>
            </div>
            <div class="ml-5">
                <input class="text-center w-10 md:w-20 rounded" id="marks-field" value="0" type="number" min="0" max="7">
            </div>
           
        </div>
    </div>
</div>
   `;

   const eval_each_container = document.getElementById('eval-each');
   eval_each_container.innerHTML = html;
}

function prevQuestion(){
    let pqNo = selectedQuestion;
    if(selectedQuestion===1){
        selectedQuestion = questions.length;
    }else{
        selectedQuestion = selectedQuestion - 1;
    }
    updateQuestion(pqNo);
}

function nextQuestion(){
    let pqNo = selectedQuestion;
    if(selectedQuestion===questions.length){
        selectedQuestion = 1;
    }else{
        selectedQuestion = selectedQuestion + 1;
    }
    updateQuestion(pqNo);
}

function updateQuestion(qno){
    const question_field= document.getElementById('question-field');
    const answer_field = document.getElementById('answer-field');
    const marks_field = document.getElementById('marks-field');
    const question_number_field = document.getElementById("question-number-field");

    question_field.textContent = questions[selectedQuestion-1];
    answer_field.textContent = exam_script.answers[selectedQuestion-1];
    marks[qno-1] = Number(marks_field.value);
    question_number_field.textContent = 'Question '+selectedQuestion;
    marks_field.value = marks[selectedQuestion-1];
    updateMarks();
}

function updateMarks(){
    for(let i=0;i<marks.length;i++){
        const ele = document.getElementById('m-'+i);
        ele.textContent=marks[i];
    }
}

async function submitMarks(){
    try {
        let total_marks = 0;

        for(let i=0;i<marks.length;i++){
            total_marks += marks[i];
        }
        const data = {
            examId: exam_script.examId,
            teacherId: username,
            studentId : exam_script.studentId,
            marks: total_marks
        }
        const response = await fetch('/api/quotas/updateEvaluated', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)  

        });

        if (!response.ok) {
        throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log(result);
        if(result.msg=== 'Updated Evaluation successfully'){
            alert("Evaluation Complete");
            const eval_list = document.getElementById('eval-list');
            const eval_each = document.getElementById('eval-each');
            eval_list.classList.remove('hidden');
            eval_each.classList.add('hidden');
            await LoadQuotas();
        }
    } catch (error) {
        console.error('Error:', error); 

    }
}

function resetValues(){
    marks = [];
    selectedQuestion = 1;

}

function goBackToEvalList(){
    const eval_list = document.getElementById('eval-list');
            const eval_each = document.getElementById('eval-each');
            eval_list.classList.remove('hidden');
            eval_each.classList.add('hidden');

        resetValues();
}

// page event listeners

function pageEventListeners(){
    const home = document.getElementById('menu-home');
    const view = document.getElementById('menu-view');
    const feedback = document.getElementById('menu-feedback');
    const evaluate = document.getElementById('menu-evaluate');

    home.addEventListener('click',()=>{
        hideAllPageElementsExcept('home-page');
        selectedPageNavStyle('menu-home');
    });

    feedback.addEventListener('click',()=>{
        hideAllPageElementsExcept('feedbacks-page');
        selectedPageNavStyle('menu-feedback');
        LoadFeedbacks();
    });

    view.addEventListener('click',async ()=>{
        hideAllPageElementsExcept('view-page');
        selectedPageNavStyle('menu-view');
        await fetchExams();
    });

    evaluate.addEventListener('click',async ()=>{
        hideAllPageElementsExcept('evaluate-page');
        selectedPageNavStyle('menu-evaluate');
        await LoadQuotas();
    });

}


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


  pageEventListeners();
  

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

    const q = document.querySelectorAll('.q-dark');
    q.forEach(e=>{
        if(e.classList.contains('text-gray-200')){
            e.classList.remove('text-gray-200')
        }else{
            e.classList.add('text-gray-200')
        }
    });

    // Messages Border
    const b = document.querySelectorAll('.b-dark');

    b.forEach((border)=>{
        border.classList.toggle('border-gray-200');
        border.classList.toggle('border-gray-700');
    });

    document.querySelector('body').classList.toggle('bg-gray-200');


       document.querySelector('body').classList.toggle('bg-gray-900');
}

// Messages Logics

async function LoadMessages(){
    console.log("Executed");
    const response = await fetch('/api/messages/getTeacherMessages/'+username, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    console.log(response);

    const messages = await response.json();

    console.log(messages);
    let html = ``;
    let i=0;
    for(const msg of messages){
        if(isWithin10Days(msg.Date)){
        html += `<div class="border-b-2 border-gray-700 py-2 b-dark">
                <h4 class="q-dark">${msg.message}</h4>
            </div>`;
            i++;
        }
    }
    if(i==0){
        html += `<div class="border-b-2 border-gray-700 py-2 b-dark">
        <h4 class="q-dark">No messages to show</h4>
    </div>`
    }

    const messageContainer = document.getElementById('messages');

    messageContainer.innerHTML = html;

}

function isWithin10Days(isoDateString) {
   
    const dateToCheck = new Date(isoDateString);
  
    
    const tenDaysInMillis = 10 * 24 * 60 * 60 * 1000;
    const differenceInMillis = Date.now() - dateToCheck.getTime();
  
   
    return differenceInMillis <= tenDaysInMillis;
  }