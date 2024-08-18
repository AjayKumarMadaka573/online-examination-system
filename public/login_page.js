let dark_mode = 0;
//   Dark Mode Logics

function ToggleDarkMode(btn){
    const ele = document.querySelectorAll('.page');

    if(dark_mode===0){
      dark_mode=1;
    }else{
      dark_mode=0;
    }
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

      const description_text_color_elements = document.querySelectorAll('.d-text');

        description_text_color_elements.forEach(description_text_color => {
          description_text_color.classList.toggle('text-gray-200');
          console.log("yes");
          console.log(description_text_color.classList);
        });

   document.querySelector('.screen').classList.toggle('bg-gray-700');
      
   const labels = document.querySelectorAll('.d-text-l');
   labels.forEach(l=>{
    if(l.classList.contains('text-gray-700')){
        l.classList.remove('text-gray-700');
        l.classList.add('text-gray-100');
    }else{
        l.classList.add('text-gray-700');
        l.classList.remove('text-gray-100');
    }
   });

   const signin_layout = document.querySelectorAll('.signin-layout');

   signin_layout.forEach(l=>{
    if(l.classList.contains('bg-gray-900')){
        l.classList.remove('bg-gray-900');
        l.classList.add('bg-white');
    }else{
        l.classList.add('bg-gray-900');
        l.classList.remove('bg-white');
    }

   });
}


// popover trigger


const popover = document.getElementById('popover');
    
let timerId;

function popover_func(){
    const popover = document.getElementById('popover');
    const progressFill = document.getElementById('progress-fill');
    if(popover.classList.contains('hidden', 'translate-y-full', 'opacity-0')){
    popover.classList.remove('hidden', 'translate-y-full', 'opacity-0');

    const duration = 5000;
    let timeLeft = duration;

    const timerInterval = setInterval(() => {
      const progressPercentage = ((duration - timeLeft) / duration) * 100;
      progressFill.style.width = `${progressPercentage}%`;
        progressFill.style.backgroundColor="blue";
      console.log("Executed");
      timeLeft-=100;

      if(timeLeft===0){
        clearInterval(timerInterval);
        popover.classList.add('hidden', 'translate-y-full', 'opacity-0');
      }
    }, 100);   } 

}

// Toggle Logins

function hideAllLoginElementsExcept(idToExclude) {
    const allLoginElements = document.querySelectorAll('.login_');
  
    allLoginElements.forEach(element => {
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

function changeLoginPage(ele){
    hideAllLoginElementsExcept(ele.value);
}

document.getElementById('s-btn').addEventListener('click',async ()=>{
  await studentLogin();
});

document.getElementById('t-btn').addEventListener('click',async ()=>{
  await teacherLogin();
});

// LoginLogics
async function studentLogin(){
  const Id = document.getElementById('sid').value;
  const password = document.getElementById('spassword').value;

  if(Id!=='' && password!==''){
    const data = JSON.stringify({
      username : Id,
      password: password,
      dark:dark_mode
    });

    await sendStudentLoginDetails(data);
    
  }else{
    alert('Details Not entered');
  }
}

async function sendStudentLoginDetails(data){
  const response = await fetch('/StudentLogin', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body:data
});

const message = await response.json();
console.log(message);


if(message==='success'){
  window.location.href='/Student';
}
}

async function teacherLogin(){
  const Id = document.getElementById('tid').value;
  const password = document.getElementById('tpassword').value;

  if(Id!=='' && password!==''){
    const data = JSON.stringify({
      username : Id,
      password: password,
      dark:dark_mode
    });

    await sendTeacherLoginDetails(data);
    
  }else{
    alert('Details Not entered');
  }
}

async function sendTeacherLoginDetails(data){
  const response = await fetch('/TeacherLogin', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body:data
});

const message = await response.json();
console.log(message);


if(message==='success'){
  window.location.href='/Teacher';
}
}