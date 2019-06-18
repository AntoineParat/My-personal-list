const express = require('express');
const router = new express.Router();
const Task = require('../models/task');
const auth = require('../express middleware/auth');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');



router.get('/me/newtask/',auth, async (req, res) => {   
    res.render('addTask', {
        name : req.user.name
    })
})

router.post('/me/newtask/add',auth, async (req, res) => { 
    try {
        const task = new Task(req.body);
        task.id = req.user._id;
        await task.save()
        res.send(task)
     } catch (err) {
        res.send(err)
    }
})

router.get('/tasks/all', auth, async  (req, res) => {
    try {   
        if (req.query.sort === "all")  {    
           const tasks = await Task.find({id : req.user._id})
           .limit(6)
           .skip(parseInt(req.query.page - 1) * 6 )
           .sort({createdAt : -1})

            //let currentDoc = parseInt(req.query.page * 6) - (6 - tasks.length)
            res.send({tasks /*, currentDoc*/ })   
        }  
        else  {    
            const tasks = await Task.find({id : req.user._id, completed : req.query.sort})
            .limit(6)
            .skip(parseInt(req.query.page - 1) * 6 )
            .sort({createdAt : -1})
 
             //let currentDoc = parseInt(req.query.page * 6) - (6 - tasks.length)
             res.send({tasks /*, currentDoc*/ })   
         }   
        res.send({msg : "unable to find tasks"})                               
        }
    catch (err) {
        console.log(err)
    }
  })

  router.get('/tasks/all/count', auth, async  (req, res) => {
    try {   
        if(req.query.sort ==="all") { 
            const count = await Task.find({id : req.user._id}).countDocuments()
            let totalPage = Math.ceil(count/6);
            res.send({totalPage, count}) 
        } 
        else {
            const count = await Task.find({id : req.user._id, completed : req.query.sort}).countDocuments()
            let totalPage = Math.ceil(count/6);
            res.send({totalPage, count}) 
        }    
        }                        
    catch (err) {
        console.log(err)
    }
  })


router.get('/tasks/test', auth, async (req, res) => {    
    //Task.find({}).then((docs) => {res.send(docs)})
    try { 
        const queryKey = Object.keys(req.query)
        const queryValue = Object.values(req.query);
        
        const tasks =  await Task.find({ [queryKey]: queryValue, id : req.user._id })
        res.send(tasks)
    }
    catch (err) {
        res.send(err)
    }
})

router.get('/tasks', auth, async (req, res) => {    
    //Task.find({}).then((docs) => {res.send(docs)})
    try { 
        const tasks =  await Task.find({ completed : req.query.completed, id : req.user._id })
        .limit(5)
        .skip(parseInt(req.query.skip))
        .sort({createdAt : -1})
        res.send(tasks)
    }
    catch (err) {
        res.send(err)
    }
})


router.patch('/me/task/update',auth,  async (req,res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];
    const isValid = updates.every(e => allowedUpdates.includes(e));

    if(!isValid) {
        res.status(200).send('error : invalid update')
    }

    try{
        const task = await Task.findOne({_id : req.body._id, id : req.user._id});
        updates.forEach(element => { 
            task[element] = req.body[element]
        })
        await task.save()
       
        if(!task) {
            res.status(404).send("error : task not found")
        }
    }catch (err) {
        res.send(err)
    }
})

router.delete('/me/delete/task', auth, async (req,res) => {
    try { 
    const task = await Task.findOneAndDelete({_id : req.body._id, id : req.user._id})
    if (!task) {
        res.status(404).send('task : user not found')
    }
    }catch(err) {
        res.status(400).send(err)
    }
})


router.get('/me/search', auth, async (req,res) => {
    try { 
        const search = await Task.find({$text: {$search: req.query.word}, id : req.user._id})
    
    res.send(search)
    }
    catch (err) {
        res.status("202").send(err)
    }   
})

router.delete('/me/delete/alltasks', auth, async (req,res) => {
    try {
        if(req.user._id== "5d0945e56abb9b0017a482a5") {
            return res.send({msg : "As a guest you are not allowed to cdelete account"})
         }
        const toDelete = await Task.deleteMany({id : req.user._id})
        if(!toDelete) {
            res.send({err : "tasks not found"})
        }
    }
    catch(err) {
        res.send(err)
    }
})

router.get('/me/mytasks/pdf', auth, async (req,res) => {

    const pdfName = `${req.user._id}-tasks.pdf`
    const pdfPath = path.join('data', 'pdf',pdfName )
    const tasks = await Task.find({id : req.user._id})
    .sort({createdAt : -1})
    
    // Create a document
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-disposition', `filename="${pdfName}"`)
    doc.pipe(fs.createWriteStream(pdfPath))
    doc.pipe(res)

    if(req.user.avatar) {
        doc.image(req.user.avatar)
    }

    doc.text(req.user.name +', here are all of your tasks :', {
        align: 'center',
        stroke : true,
    })
    doc.moveDown();
    doc.moveDown(); 

    for (let task of tasks) {
        if(task.completed=== true) {
            doc.text(task.description, {
                strike : true
            }); 
        }
        else {
            doc.text(task.description)
        }
        doc.moveDown()
        doc.moveDown()
    }    

    
    // Finalize PDF file
    doc.end();
})

module.exports = router;