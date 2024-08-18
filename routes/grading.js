const express = require('express');

const router = express.Router();
router.use(express.json());

let E1SEM1 = [
    {
        subject:"C&LA",
        credits:"4"
    },
    {
        subject:"BEEE",
        credits:"4"
    },
    {
        subject:"PSTC",
        credits:"4"
    },
    {
        subject:"EGCD",
        credits:"2.5"
    }
]

let E1SEM2 = [
    {
        subject:"DM",
        credits:"4"
    },
    {
        subject:"EP",
        credits:"4"
    },
    {
        subject:"MEFA",
        credits:"3"
    },
    {
        subject:"OOPS",
        credits:"4"
    },
    {
        subject:"DS",
        credits:"3"
    }
]

let E2SEM1 = [
    {
        subject:"P&S",
        credits:"4"
    },
    {
        subject:"DLD",
        credits:"3"
    },
    {
        subject:"DAA",
        credits:"4"
    },
    {
        subject:"DBMS",
        credits:"3"
    },
    {
        subject:"FLAT",
        credits:"3"
    }
]

let E2SEM2 = [
    {
        subject:"IOR",
        credits:"3"
    },
    {
        subject:"COA",
        credits:"3"
    },
    {
        subject:"DSP",
        credits:"3"
    },
    {
        subject:"WT",
        credits:"3"
    },
    {
        subject:"CD",
        credits:"3"
    }
]

let E3SEM1 = [
    {
        subject:"OS",
        credits:"3"
    },
    {
        subject:"CN",
        credits:"3"
    },
    {
        subject:"SE",
        credits:"3"
    },
    {
        subject:"MFDS",
        credits:"3"
    },
    {
        subject:"DM",
        credits:"3"
    }
]

let E3SEM2 = [
    {
        subject:"CNS",
        credits:"4"
    },
    {
        subject:"AI",
        credits:"4"
    },
    {
        subject:"E-2",
        credits:"3"
    },
    {
        subject:"E-3",
        credits:"3"
    },
    {
        subject:"OE-1",
        credits:"3"
    },
    {
        subject:"MiniProject",
        credits:"3"
    },
    {
        subject:"SummerInternship",
        credits:"3"
    }
]

let E4SEM1 = [
    {
        subject:"ML",
        credits:"4"
    },
    {
        subject:"E-4",
        credits:"3"
    },
    {
        subject:"OE-2",
        credits:"3"
    },
    {
        subject:"Project-1",
        credits:"6"
    }
]

let E4SEM2 = [
    {
        subject:"E-4",
        credits:"3"
    },
    {
        subject:"OE-3",
        credits:"3"
    },
    {
        subject:"OE-4",
        credits:"3"
    },
    {
        subject:"Project-2",
        credits:"6"
    },
    {
        subject:"Community Service",
        credits:"2"
    }
]

function getGrade(marks) {
    if (marks >= 90) {
      return 'Ex';
    } else if (marks >= 80) {
      return 'A';
    } else if (marks >= 70) {
      return 'B';
    } else if (marks >= 60) {
      return 'C';
    } else if (marks >= 50) {
      return 'D';
    }else if (marks >= 40) {
      return 'E';
      } else {
      return 'R';
    }
  }

  function getPoints(marks) {
    if (marks >= 90) {
      return 10;
    } else if (marks >= 80) {
      return 9;
    } else if (marks >= 70) {
      return 8;
    } else if (marks >= 60) {
      return 7;
    } else if (marks >= 50) {
      return 6;
    }else if (marks >= 40) {
        return 5;
      } else {
      return 0;
    }
  }

  function calculateTotalMarks(arr, marksData) {
    
    let attainedCredits = 0;
    let totalCredits = 0;
    const result = arr.map(subjectData => {
      const marksObj = marksData.find(mark => mark.subject === subjectData.subject);
      attainedCredits += Number(subjectData.credits) * getPoints(marksObj.marks);
      totalCredits +=  Number(subjectData.credits) * 10;
      return {
        subject: subjectData.subject,
        grade: getGrade(marksObj.marks)
      };
    });
    const points = (attainedCredits/totalCredits)*10;
    return {result,points};
  }

router.post('/E1S1',async (req,res)=>{
   const data = req.body;

   const {result,points} = calculateTotalMarks(E1SEM1,data);

   const result_data = {
    grades : result,
    points : points
   }
    res.json(result_data);
  });


  router.post('/E1S2',async (req,res)=>{
    const data = req.body;
 
    const {result,points} = calculateTotalMarks(E1SEM2,data);
    const result_data = {
        grades : result,
        points : points
       }
        res.json(result_data);
   });
 

   router.post('/E2S1',async (req,res)=>{
    const data = req.body;
 
    const {result,points} = calculateTotalMarks(E2SEM1,data);
    const result_data = {
        grades : result,
        points : points
       }
        res.json(result_data);
   });

   
router.post('/E2S2',async (req,res)=>{
    const data = req.body;
 
    const {result,points}= calculateTotalMarks(E2SEM2,data);
    const result_data = {
        grades : result,
        points : points
       }
        res.json(result_data);
   });

router.post('/E3S1',async (req,res)=>{
    const data = req.body;
 
    const {result,points}= calculateTotalMarks(E3SEM1,data);
    const result_data = {
        grades : result,
        points : points
       }
        res.json(result_data);
   });

   router.post('/E3S2',async (req,res)=>{
    const data = req.body;
 
    const {result,points} = calculateTotalMarks(E3SEM2,data);
    const result_data = {
        grades : result,
        points : points
       }
        res.json(result_data);
   });
   
router.post('/E4S1',async (req,res)=>{
    const data = req.body;
 
    const {result,points}= calculateTotalMarks(E4SEM1,data);
    const result_data = {
        grades : result,
        points : points
       }
        res.json(result_data);
   });
 
 
router.post('/E4S2',async (req,res)=>{
    const data = req.body;
 
    const {result,points} = calculateTotalMarks(E4SEM2,data);
    const result_data = {
        grades : result,
        points : points
       }
        res.json(result_data);
   });
 
module.exports = router;

