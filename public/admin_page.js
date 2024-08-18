

// Variables 
let examType,examTime,examDate,year,batch,examNumber;
let E3SEM1 = ['Operating Systems','Software Engineering','Data Mining','Computer Networks','Mathematical Foundation For Data Science'];
let E3SEM1SUBJECTCODES = ['os','se','dm','cn','mfds'];
let E2SEM2 = ['Computer Organisation And Architecture','Compiler Design','Web Technologies','Data Science with Python','Introduction to Operations Research'];
let E2SEM2SUBJECTCODES = ['coa','cd','wt','dsp','ior'];
let NoOfSubsInSchedule=0;
let selectedSubCodes=[];


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

    let labels = document.querySelectorAll('label');

    labels.forEach(l=>{
        if(l.classList.contains('text-gray-200')){
            l.classList.remove('text-gray-200');
        }else{
            l.classList.add('text-gray-200');
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
      
}


// page event listeners

function pageEventListeners(){
    const descriptive = document.getElementById('menu-schedule');
    const objective = document.getElementById('menu-result');

    descriptive.addEventListener('click',()=>{
        hideAllPageElementsExcept('schedule-page');
        selectedPageNavStyle('menu-schedule');
    });


    objective.addEventListener('click',async ()=>{
        hideAllPageElementsExcept('results-page');
        selectedPageNavStyle('menu-result');
        await completedExamsDetails();
       
    });

}

pageEventListeners();

// Nav bar Logics
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

//Message Section Logics
let selected = 0; // 0 for student , 1 for teacher
const teacherColumn = document.getElementById('teacherColumn');
function recipientSelect(btn){
    if(btn.id==='teacherButton'){
        selected=1;
    }else{
        selected=0;
    }
    const student = document.getElementById('studentButton');
    const teacher = document.getElementById('teacherButton');
    student.classList.toggle('bg-primary');
    student.classList.toggle('text-gray-200');
    teacher.classList.toggle('bg-primary');
    teacher.classList.toggle('text-gray-200');
    if(selected==1){
        teacherColumn.classList.remove('hidden');
    }else{
        if(!teacherColumn.classList.contains('hidden')){
            teacherColumn.classList.add('hidden');
        }
    }
}


async function sendMessage(){
    const message = document.getElementById('message').value;
    const today = new Date();
    if(message!==''){
        if(selected==1){
            const teacherId = document.getElementById('teacherId').value;
            if(teacherId!==''){
                const data = JSON.stringify({
                    Date:today,
                    teacherId:teacherId,
                    message:message
                });
                const response = await fetch('api/messages/createTeacherInstruction', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body:data
                });
        
                const results = await response.json();

                alert("message sent");
                document.getElementById('teacherId').value='';
            }else{
                alert("Enter teacher Id");
            }

        }else{
            const data = JSON.stringify({
                Date:today,
                message:message
            });
            const response = await fetch('api/messages/createStudentInstruction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:data
            });
    
            const results = await response.json();

            alert("message sent");
        }
    }else{
        alert("Enter message");
    }

    document.getElementById('message').value='';

}

const messageContainer = document.getElementById('msg-container');
const header = document.getElementById('header');
function ToggleMsg(btn){
    if(btn.textContent==='Send Message'){
        btn.innerHTML = '&nbsp;&nbsp;&nbsp;Cancel&nbsp;&nbsp;&nbsp;';
    }else{
        btn.textContent='Send Message'
    }
    messageContainer.classList.toggle('hidden')
    header.classList.toggle('lg:block');
}


// Schedule Creation
function createSchedule(){
    const  examTypeSelect = document.getElementById('examType');
    const  examNumberSelect = document.getElementById('examNumber');
    const yearSelect = document.getElementById('year');
    const batchSelect = document.getElementById('Batch');
        examType = examTypeSelect.value;
        examNumber = examNumberSelect.value;
        year = yearSelect.value;
        batch = batchSelect.value;
        console.log(year);
    let html=`<div class="font-semibold p-4 bg-blue-600 text-gray-200 mt-10">
                <div class="flex justify-center text-3xl uppercase">
                    ${year+" "+examType} schedule
                </div>
               </div>`;
    if(year==='e3'){
            if(examNumber==='1'){
                console.log("Executed");
                NoOfSubsInSchedule = E3SEM1.length;
                E3SEM1.forEach((subject,index)=>{
                    selectedSubCodes.push(subject);
                    html += `<div class="card mt-10 p-4">
                    <div class=" schedule-card flex  justify-around p-4" id=${E3SEM1SUBJECTCODES[index]}>
                        <div  class="flex items-center">
                            <h3 class="font-bold">Subject:&nbsp; </h3><span>${E3SEM1SUBJECTCODES[index]}</span>
                        </div>
                        <div class="flex items-center">
                            <h3 class="font-bold">ExamDate: </h3><span ><input class="rounded ml-[0.5rem] text-gray-600 s-${index}" type="date"></span>
                        </div>
                        <div class="flex items-center">
                            <h3 class="font-bold">ExamTime: </h3><span ><input class="rounded ml-[0.5rem] text-gray-600 s-${index}" type="time"></span>
                        </div>
                        <div class="flex items-center">
                            <h3 class="font-bold">TeacherId: </h3><span ><input class="rounded ml-[0.5rem] text-gray-600 w-[5rem] s-${index}" type="text"></span>
                        </div>
                    </div>
                   </div>`;
                });

            }    
                
        }else if(year==='e2'){
            console.log("Executed");
            if(examNumber==='2'){
                NoOfSubsInSchedule = E2SEM2.length;
                E2SEM2.forEach((subject,index)=>{
                    selectedSubCodes.push(subject);
                    html += `<div class="card mt-10 p-4">
                    <div class=" schedule-card flex  justify-around p-4" id=${E2SEM2SUBJECTCODES[index]}>
                        <div  class="flex items-center">
                            <h3 class="font-bold">Subject:&nbsp; </h3><span>${E2SEM2SUBJECTCODES[index]}</span>
                        </div>
                        <div class="flex items-center">
                            <h3 class="font-bold">ExamDate: </h3><span ><input class="rounded ml-[0.5rem] text-gray-600 s-${index}" type="date"></span>
                        </div>
                        <div class="flex items-center">
                            <h3 class="font-bold">ExamTime: </h3><span ><input class="rounded ml-[0.5rem] text-gray-600 s-${index}" type="time"></span>
                        </div>
                        <div class="flex items-center">
                            <h3 class="font-bold">TeacherId: </h3><span ><input class="rounded ml-[0.5rem] text-gray-600 w-[5rem] s-${index}" type="text"></span>
                        </div>
                    </div>
                   </div>`;
                });

            }
        }

    html += `<div class="flex mt-10 justify-center">
                 <button class="schedule-btn" onclick="submitSchedule()">Create Schedule</button>
                 <button class="schedule-btn ml-15" onclick="revertToStart()">Cancel Schedule</button>
               </div>`;
    
    // hideAllPageElementsExcept('schedule-section');
    const schedule_section = document.getElementById('schedule-section');
    if(schedule_section.classList.contains('hidden'))
        schedule_section.classList.remove('hidden');
    const start_section = document.getElementById('start-section');
    if(!start_section.classList.contains('hidden'))
        start_section.classList.add('hidden');
    schedule_section.innerHTML=html;

    
}

function truncateSubject(subject) {
    if (subject.length > 6) {
      return subject.substring(0, 6) + "...";
    } else {
      return subject;
    }
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


// submit schedule

async function submitSchedule(){
    const ele = document.querySelectorAll('.list-group-item');
        let schedule_data = [];
        let flag=false;
        for(let i=0;i<NoOfSubsInSchedule;i++){
            
            const examDateInput = document.querySelectorAll(`.s-${i}`)[0];
            const examTimeInput = document.querySelectorAll(`.s-${i}`)[1];
            const teacherIdInput = document.querySelectorAll(`.s-${i}`)[2];

            let obj = {
                examId:generateUUID(),
                Subject:selectedSubCodes[i],
                
                ExamDate:examDateInput.value,
                ExamTime:examTimeInput.value,
                AssignedTeacherId:teacherIdInput.value
            };
            schedule_data.push(obj);

            Object.keys(obj).forEach(key => {
            if (obj[key] === "") {
                console.log(`Property ${key} is an empty string`);
                flag=true;
            }
            });

            if(!flag){
                const data = JSON.stringify( {
                    year:year,
                    type:examType,
                    examNumber:Number(examNumber),
                    batch:batch,
                    data:schedule_data
                } );
        
                const response = await fetch('api/exams/create_schedule', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body:data
                });
        
                const result = await response.json();
                if(result.msg==='Exam Schedule Created successfully'){
                    alert('Exam Schedule Created successfully');
                    revertToStart()
                }else{
                    alert("Error");
                }
            }
        }
}

// Id Generation

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

function revertToStart(){
    const start_section = document.getElementById('start-section');
    if(start_section.classList.contains('hidden'))
        start_section.classList.remove('hidden');
    const schedule_section = document.getElementById('schedule-section');
    if(!schedule_section.classList.contains('hidden'))
        schedule_section.classList.add('hidden');
}
  

// Page 2 Logics

async function completedExamsDetails(){
    const response = await fetch('/api/exams/fetchCompletedExamDetails', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    const data = await response.json();

    let html = ``;

    for (const exam of data) {
        const response = await fetch('/api/quotas/checkIfQuotaAllocated/'+exam.examId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const msg = await response.json();

        if(msg==="Quota Not Given"){
            console.log(typeof msg);
       
        html += `<div class="card ml-5 p-2 mt-5 items-center col-span-2 md:col-span-1">
                <div class="flex justify-around">
                    <div>
                        <div>
                            <h3 class="font-semibold">Exam Year: </h3>
                        </div>
                        <div class="res-card p-2 text-center">
                            <h3 class="uppercase"> ${exam.year} </h3>
                        </div>
                    </div>
                    <div>
                        <div>
                            <h3 class="font-semibold">Exam Type: </h3>
                        </div>
                        <div class="res-card p-2 text-center">
                            <h3>${exam.examType}-1</h3>
                        </div>
                    </div>
                    <div>
                        <div>
                            <h3 class="font-semibold">Exam Subject: </h3>
                        </div>
                        <div class="res-card p-2 text-center">
                            <h3>${exam.subject}</h3>
                        </div>
                    </div>
                </div>
                
                
                <div class="flex justify-center mt-5">
                    <button class="btn border-2 border-gray-900 hover:bg-gray-900 hover:text-gray-100 transition ease-out duration-300" data-id="${exam.examId}" data-type="${exam.examType}" data-sub="${exam.subject}" onclick="evaluateExams(this)">Evaluate</button>
                </div>


                
            </div>`;

        }else{
            console.log("Quota has been given");
           
        }
    }

html += await fetchEvaluationCompletedExams();
    const container = document.getElementById('completed-exams');
console.log("Executed");
    container.innerHTML = html;
}


async function fetchEvaluationCompletedExams(){
    const response = await  await fetch('/api/exams/getTasks', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let html = ``;

    const tasks = await response.json();

    for(const schedule in tasks){
        let flag=0;
        if(schedule.type==='sem'){
        for(const exam in schedule.data){

        const response = await fetch('/api/quotas/checkEvaluationStatus/'+exam.examId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const msg = await response.json();
        if(msg!=="Evaluation Done"){
            flag=1;
        }
    }

    if(flag===0){
        html +=  `<div class="card ml-5 p-2 mt-5 items-center col-span-2 md:col-span-1">
        <div class="flex justify-around">
            <div>
                <div>
                    <h3 class="font-semibold">Exam Year: </h3>
                </div>
                <div class="res-card p-2 text-center">
                    <h3 class="uppercase"> ${schedule.year} </h3>
                </div>
            </div>
            <div>
                <div>
                    <h3 class="font-semibold">Exam Type: </h3>
                </div>
                <div class="res-card p-2 text-center">
                    <h3>${schedule.type}-${schedule.examNumber}</h3>
                </div>
            </div>
            <div>
                <div>
                    <h3 class="font-semibold">Batch: </h3>
                </div>
                <div class="res-card p-2 text-center">
                    <h3>${schedule.batch}</h3>
                </div>
            </div>
        </div>
        
        
        <div class="flex justify-center mt-5">
            <button class="btn border-2 border-gray-900 hover:bg-gray-900 hover:text-gray-100 transition ease-out duration-300" onclick="evaluateExams(this)">Release Results</button>
        </div>


        
    </div>`;
    }

}
    }

    return html;
}

async function releaseResults(schedule){
    
        let Students = [];


        for(const exam of schedule.data){
            const response = await fetch('api/exams/studentsAttemptedExam/'+exam.examId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
        });

        const students = await response.json();

        for(const student of students){

            const midresponse = await fetch('api/exams/getMidMarks/'+student+'/'+exam.Subject, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
        });

        const midMarks = await response.json();

        const assignmentresponse = await fetch('api/exams/getAssignmentMarks/'+student+'/'+exam.Subject, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
    });

    const assignmentMarks = await response.json();

    
    const semresponse = await fetch('api/exams/getSemesterMarks/'+student+'/'+exam.Subject, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    const semMarks = await response.json();

    const total_marks = semMarks + midMarks + assignmentMarks;

    Students = addSubjectToStudent(Students,student,exam.Subject,total_marks);

        
        }

    }

    // Grading the Exams
    let examYear = formatOutput(schedule.year,schedule.examNumber);
    for(const Student in Students){

        const data = JSON.stringify(Student.data);
        const response = await fetch('api/grading/'+examYear, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:data
        });

        const results = await response.json();

        const result_data = JSON.stringify({
            studentId : Student.studentId,
            semester : examYear,
            results : results
        });

        const Result_response = await fetch('api/results/createResult', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:result_data
        });

        const result = await response.json();

        console.log("Result Created");

    }

}

function formatOutput(year, number) {
    return `${year}S${number}`.toUpperCase();
  }

function addSubjectToStudent(students, studentId, subject, marks) {
    const studentIndex = students.findIndex(student => student.studentId === studentId);
  
    if (studentIndex !== -1) {
      students[studentIndex].data.push({ subject:subject, marks:marks });
    } else {
      students.push({ studentId:studentId, data: [{ subject, marks }] });
    }
  
    return students;
  }

// Assigning Evaluation of Exams
async function evaluateExams(ele){
    const id = ele.dataset.id ;
    const type = ele.dataset.type;
    const subject = ele.dataset.sub;

    console.log(subject);

        console.log("Executed");
        const response = await fetch('api/users/getFacultyDealingASubject/'+subject, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
    });

    const data = await response.json();
    const new_response = await fetch('api/exams/NumberOfAttempts/'+id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
});

    const new_data = await new_response.json();

    console.log(data);
    
    if(data.length>0){
    const each_quota  = new_data/data.length;

    console.log(each_quota);

    data.forEach(async (teacher,index)=>{
        const data = JSON.stringify({
            teacherId:teacher.username,
            examId:id,
            quotaStart:Number(index*each_quota),
            quotaEnd:Number(index*each_quota + each_quota),
            Completed:0
        });
        const response = await fetch('api/quotas/createQuota', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data:data
    });


    const msg = await response.json();
    if(msg.msg==='Quota Created successfully'){
        alert("Quota creation successful");
    }
     });





    }else{
        alert("There are no faculty to assign");
    }


}