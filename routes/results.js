const express = require('express');
const Result = require('../models/Result');

const router = express.Router();

router.use(express.json());


router.post('/createResult', async (req, res) => {
    try {
      const { studentId, semester,results } = req.body;
  
      const newResult = new Result({ studentId, semester,results });
  
      const savedResult = await newResult.save();
  
      res.status(201).json(savedResult);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating result' });
    }
  });

router.get('/getResults/:id',async (req, res) =>{
  const results = await Result.find({studentId:req.params.id});

  res.json(results);
});

  
module.exports = router;
