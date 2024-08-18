const express = require('express');
const Quota = require('../models/Quota');
const Evaluated = require('../models/Evaluated');

const router = express.Router();

router.use(express.json());


router.post('/createQuota',async (req,res)=>{
    const { teacherId,
      examId,
      quotaStart,
      quotaEnd,
      Completed } = req.body;

      let quota = new Quota({teacherId,
        examId,
        quotaStart,
        quotaEnd,
        Completed });

      await quota.save();
  
      res.status(201).json({ msg: 'Quota Created successfully' });
});

router.get('/checkIfQuotaAllocated/:id',async (req,res)=>{
 let quota;
 try {
  quota = await Quota.find({ examId: req.params.id });
} catch (error) {
  console.error(error);
  return res.status(500).json({ message: 'Error checking quota' }); 
}
 if(quota.length>0){
  res.json("Quota Already Given");
 }else{
  res.json("Quota Not Given");
 }
});

router.get('/getQuotas/:id',async (req,res)=>{
  try {
    const quotas = await Quota.find({teacherId: req.params.id });
    const filtered_quotas = [];
    for (const quota of quotas) {
      if(!(quota.quotaEnd - quota.quotaStart - quota.Completed===0)){
        filtered_quotas.push(quota);
      }
    }
    return res.json(filtered_quotas);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching quotas' }); 
  }

 
});

// check if an exams evaluation is completedExamsDetails

router.get('/checkEvaluationStatus/:id',async (req,res)=>{
  try {
    const quotas = await Quota.find({examId: req.params.id });
    const filtered_quotas = [];
    for (const quota of quotas) {
      if((quota.quotaEnd - quota.quotaStart - quota.Completed===0)){
        filtered_quotas.push(quota);
      }
    }
    if(filtered_quotas.length!==quotas.length){
      return res.json("Evaluation Not Done");
    }else{

    }return res.json("Evaluation Done");
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching quotas' }); 
  }

 
});

router.post('/updateEvaluated',async (req,res)=>{
  const { examId,teacherId,studentId,marks } = req.body;

    let evaluated = new Evaluated({ examId,studentId ,marks});

    await evaluated.save();

    const quotaToUpdate = await Quota.findOne({teacherId:teacherId,examId:examId });
    quotaToUpdate.Completed = quotaToUpdate.Completed + 1;

    res.status(201).json({ msg: 'Updated Evaluation successfully' });
});

router.get('/checkIfEvaluated/:eid/:sid',async (req,res)=>{
  const { eid, sid } = req.params;
  let evaluated = await Evaluated.findOne({ examId:eid,studentId:sid});
  if(evaluated){
    res.json('Evaluated');
  }else{
    res.json('Not Evaluated');
  }
});


module.exports = router;