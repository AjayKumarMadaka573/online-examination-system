
let username = 'ajay';

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

    let body = document.querySelector('body');
    if(body.classList.contains('bg-gray-900')){
        body.classList.remove('bg-gray-900');
        body.classList.add('bg-gray-200');
    }else{
        body.classList.add('bg-gray-900');
        body.classList.remove('bg-gray-200');
    }

    // Messages Border
    const b = document.querySelectorAll('.b-dark');

    b.forEach((border)=>{
        border.classList.toggle('border-gray-200');
        border.classList.toggle('border-gray-700');
    });
      
}


// page event listeners

function pageEventListeners(){
    const home = document.getElementById('menu-home');
    const view = document.getElementById('menu-view');
    const result = document.getElementById('menu-result');

    home.addEventListener('click',()=>{
        hideAllPageElementsExcept('home-page');
        selectedPageNavStyle('menu-home');
    });

    result.addEventListener('click',async ()=>{
        hideAllPageElementsExcept('results-page');
        selectedPageNavStyle('menu-result');
        await viewResults();
    });

    view.addEventListener('click',async ()=>{
        hideAllPageElementsExcept('view-page');
        selectedPageNavStyle('menu-view');
        await viewExams();
       
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


// Page 2 Logics

async function viewExams(){
    const container = document.getElementById('examList');
    try {
    const response = await fetch('/api/exams/fetchExamDetails');
            if (!response.ok) throw new Error('Network response was not ok');
            console.log(response);
            let data = await response.json();
            let i=0;
            
            let batch = username.substring(0,3);
            let html=`<div class="font-semibold p-4 bg-blue-600 text-gray-200 mt-10">
                            <h2 class="text-2xl font-bold text-center">Exams</h2>
                        </div>`;
            data.forEach(exam => {
                if(isToday(new Date(exam.examDate))){
                    html += `<div class="view-list-item">
            <div class="ml-5">
                <img src="sem.jpg" class="view-img" alt="">
            </div>

            <div class="view-d-1">
                <div>
                <h1 class="view-head uppercase">${exam.year}-${exam.examType}-01</h1>
                <p>DM</p>
                </div>

                <div class="view-d-2">
                    <div>
                        <h3 class="font-semibold">ExamDate:</h3><span>${new Date(exam.examDate).toLocaleDateString()}</span>
                    </div>
                    <div class="ml-5">
                        <h3 class="font-semibold">ExamTime:</h3><span>${exam.examTime}</span>
                    </div>
                </div>
            </div>
            <div class="view-badge">
                <button onclick="attemptExam('${exam.examId}')">
                    Attempt
                </button>
            </div>
        </div>`;
                  
                i++;
                
                }
                
            });

            const view = document.getElementById('view');
            view.innerHTML='';
            if(i==0){
                html += `<div class="flex items-center justify-center mt-[35%]"><div class="flex justify-center"><h3 class="text-2xl font-semibold">There are no Exams as of now</h3></div></div>`;
            }
            view.innerHTML=html;
    }
    catch (error) {
            console.error('Error fetching exams:', error);
    }

}

let resultAccess=0

// Page 3 Logics
async function viewResults(){
    try {
        resultAccess++;
        const response = await fetch('/api/results/getResults/'+username);
                if (!response.ok) throw new Error('Network response was not ok');
                console.log(response);
                let data = await response.json();

                let html = ` <div class="font-semibold p-4 bg-blue-600 text-gray-200 mt-10">
                            <h2 class="text-2xl font-bold text-center"> Results</h2>
                        </div>`;
               
                for(const result of data){
                    const grades = JSON.stringify(result);
                    console.log(grades);
                    html += `<div class="mail-icon w-[12rem] mt-10" style="width:14rem;height:5rem">

                    <div class="text-gray-200 flex justify-center mail-body triangle-c1 rounded shadow-md">

                        <div class="ml-5 flex items-center justify-center">
                           <h2 class="font-bold text-xl">${result.semester}</h2> 
                        </div>
                        <div class="ml-5 flex items-center justify-center">
                            <button class="schedule-btn" data-grades='${grades}' onclick="viewEachResult(this)"> 
                                View
                            </button>
                        </div>
                        
                    </div>`;
                }
                const resultlistContainer = document.getElementById("results-list");
                resultlistContainer.innerHTML = html;
                if(resultAccess==1){
                toggleResultsPages();
                }

    }catch(err){

    }
}

function toggleResultsPages(){
    const resultlistContainer = document.getElementById("results-list");
    const resulteachContainer = document.getElementById("results-each-list");
    resultlistContainer.classList.toggle('hidden');
    resulteachContainer.classList.toggle('hidden');
}

function viewEachResult(ele){
    const data = ele.dataset.grades;
    const result = JSON.parse(data);
    console.log(result);
    let html = `<div class="container mx-auto">
                        <div class="font-semibold p-4 bg-blue-600 text-gray-200 mt-10">
                            <h2 class="text-2xl font-bold text-center">${result.semester} Results</h2>
                        </div>
                        
                        <table class="bg-pink-400 shadow-md mt-10 w-full border-collapse">
                          <thead>
                            <tr class=" border-b-2 border-gray-200">
                              <th class="bg-blue-500 text-gray-200 shadow-md px-4 py-2 flex justify-center">
                                <div>
                                    Subject
                                </div>
                            </th>
                              <th class="px-4 py-2 text-gray-200">Grade</th>
                            </tr>
                          </thead>
                          <tbody>`;
    for(const grade of result.results.grades){
        html += `<tr class=" border-b-2 border-gray-200">
                                <td class="bg-blue-300 text-gray-100 shadow-md px-4 py-2 flex justify-center">
                                  <div class="font-semibold">
                                      ${grade.subject}
                                  </div>
                              </td>
                                <td class="px-4 py-2 bg-pink-300 text-gray-200">
                                    <div class="flex justify-center font-semibold">
                                        ${grade.grade}
                                    </div></td>
                              </tr>`;
    }

    html += `</tbody>
                        </table>
                      </div><div class="flex justify-center mt-10"><button class="bit-btn" onclick="toggleResultsPages()">Back</button></div>`

    const resulteachContainer = document.getElementById("results-each-list");
    resulteachContainer.innerHTML = html;
    toggleResultsPages();
}

// check if a given date is today
function isToday(date) {
    if (!(date instanceof Date)) {
        throw new TypeError("The input must be a Date object");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

   
    const inputDate = new Date(date);
    inputDate.setHours(0, 0, 0, 0); 

    return today.getTime() === inputDate.getTime();
}



function attemptExam(examId){
    if(confirm("You sure you want to attempt the exam?"))
{
    
    const data = JSON.stringify({examId:examId});
    console.log(data);
    fetch('/writingExam', {
method: 'POST',
headers: {
    'Content-Type': 'application/json'
},
body: data
})
.then(response => response.json())
.then(data => {
console.log(data);
if(data.data==="Error Occured"){
    alert("Error Occured");
}else if(data.data==="Success"){
    window.location.href="exam.html";
}
})
.catch(error => {
console.error('Error:', error);
});
}
}

async function LoadMessages(){
    console.log("Executed");
    const response = await fetch('/api/messages/getStudentMessages', {
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
       html +=  `<div class="border-b-2 border-gray-700 py-2 b-dark">
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
  

document.addEventListener('DOMContentLoaded', async () => {
    // Your code here, which can safely interact with the DOM
    const response = await fetch('/getStudentDetails', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    
    const student_data = await response.json();

    if(!response.ok){
        alert('error');
    }

    console.log(student_data);
    username = JSON.parse(student_data.student).username;

    const username_field = document.getElementById('username-field');


    // Fetch Student Details
    const response1 = await fetch('/api/users/getStudentDetails/'+username, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    const studentdata = await response1.json();

    username_field.textContent = studentdata.studentName;
    console.log(username);

    updateStudentDetails(studentdata.studentName,studentdata.studentId,studentdata.year);

    // Load Messages

    await LoadMessages();

    if(student_data.dark==='yes'){
        const btn = document.getElementById('dark-mode-btn');
        ToggleDarkMode(btn);
    }
  });


function updateStudentDetails(name,id,year){
    const sname = document.getElementById('s-name');
    const sid = document.getElementById('s-id');
    const syear = document.getElementById('s-year');
    sname.textContent = name;
    sid.textContent = id;
    syear.textContent = year;
}