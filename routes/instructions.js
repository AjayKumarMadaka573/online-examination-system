const express = require('express');
const StudentInstruction = require('../models/StudentInstruction');
const TeacherInstruction = require('../models/TeacherInsruction');

const router = express.Router();

router.use(express.json());


router.post('/createStudentInstruction', async (req, res) => {
    try {
      const { Date,message } = req.body;
  
      const newMessage = new StudentInstruction({ Date,message } );
  
      const savedMessage = await newMessage.save();
  
      res.status(201).json(savedMessage);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating msg' });
    }
  });

router.get('/getStudentMessages',async (req,res)=>{
  const messages = await StudentInstruction.find();
  return res.json(messages);
})

router.get('/getTeacherMessages/:id',async (req,res)=>{
  const messages = await TeacherInstruction.find({teacherId:req.params.id});
  return res.json(messages);
})


  router.post('/createTeacherInstruction', async (req, res) => {
    try {
      const { Date,teacherId,message } = req.body;
  
      const newMessage = new TeacherInstruction({ Date,teacherId,message } );
  
      const savedMessage = await newMessage.save();
  
      res.status(201).json(savedMessage);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating result' });
    }
  });


  
module.exports = router;
