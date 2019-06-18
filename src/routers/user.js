// const express = require('express');
// const User = require('../models/user');
// const router = new express.Router();
// const auth = require('../express middleware/auth');


// router.get('/', function (req, res) {
//     res.render('index')
//   })


// router.post('/user/login', async (req,res) => {
//     try { 
//     const user = await User.findByCredentials(req.body.email, req.body.password)
//     await user.generateToken()
//     res.send({err: 0, redirectUrl: "/me", user : user})
//     } catch (err) {
//         res.status(400).send(err) 
//     }
// })
  
// router.get('/sign-up', function (req, res) {
//     res.render('sign-up')
//   })

// router.post('/sign-up/user', async (req, res) => { 
//     const user = new User(req.body);
//     try {
//         await user.save()
//         await user.generateToken()
//         await res.cookie("userProfil", user); 
//         res.send({ err: 0, redirectUrl: "/me", user : user})
//     } catch (err) {
//         console.log(err)
//     }
// })




// //Route for destroying cookie 
// router.get('/logout', (req, res)=>{ 
//     //it will clear the userData cookie 
//     res.clearCookie('userProfil'); 
//     res.send('user logout successfully'); 
//     }); 

// //Iterate users data from cookie 
// router.get('/getuser', (req, res)=>{ 
//     //shows all the cookies 
//     const x = req.cookies
//     res.send(x)
//     }); 
      
 
// router.get('/users/:id', async (req, res) => {
//     const id = req.params.id;
//     if(req.params.id === "all") {
//         const allUsers = await User.find({})
//         res.send(allUsers)
//     }
//     try { 
//         const user = await User.findById(id)
//         res.send(user)  
//     } 
//     catch(err) { 
//         console.log(user)
//     }
// })

// router.patch('/users/:id', async (req,res) => {
//     //define and check for allowed changes
//     const updates = Object.keys(req.body);
//     const allowedChanges = ["name", "age", "email", "password"];
//     const isValidUpdates = updates.every(element => allowedChanges.includes(element));

//     if(!isValidUpdates) {
//         res.status(400).send('error : invalid updates')
//     }

//     try { 
//     //const userToUpdate = await User.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators : true});
//     // it was by-passing the middleware pre save because of updating without explicit "save" command
//     const user = await User.findById(req.params.id)
//     updates.forEach(element => {
//         user[element] = req.body[element]
//     });
//     await user.save()

//     if(!user) {
//         res.status(404).send("user not found")
//     }
//     res.send(user)
    
//     } catch (err) {
//         console.log(err)
//     }
// })

// router.delete('/users/:id', async (req,res) => {
//     try { 
//     //const user = await User.findByIdAndDelete(req.params.id)
//     //for same reasons, it was by-passing middleware pre remove
//     const user = await User.findById(req.params.id)
//     await user.remove()

//     if (!user) {
//         res.status(404).send('error : user not found')
//     }
//     res.send(user)
//     }catch(err) {
//         res.status(400).send(err)
//     }
// })

// module.exports = router;

const express = require('express');
const User = require('../models/user');
const auth = require('../express middleware/auth')
const router = new express.Router();
const multer = require('multer');
const sharp = require('sharp');
const bcrypt =require('bcryptjs');
const jwt = require('jsonwebtoken')

// const nodemailer = require('nodemailer');
// const sendGridTransport = require('nodemailer-sendgrid-transport');

// const transporter = nodemailer.createTransport(sendGridTransport({
//     auth : {
//        api_key : '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'
//     }
// }));

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


router.get('/test', function (req, res) {
    res.send({message : "test"})
    
  })

router.get('/', function (req, res) {
    res.render('index')
  })


router.get('/sign-up', function (req, res) {
    res.render('sign-up')
  })

router.post('/sign-up/user', async (req, res) => { 
    const user = new User (req.body)
    try {
        await user.save()
        const token = await user.generateToken()
        await res.cookie("token", token);  
        sgMail.send({
            to : user.email,
            from : 'paratantoine@gmail.com',
            subject : "Welcome to your to-do-list application !",
            html : `<h1> Welcome ${user.name} ! You successfully registered ! </h1> 
                    <p>Have fun using your very new to-do App !</p>`
        })
        res.send({ err: 0, redirectUrl: "/me"})
    } catch (err) {
        console.log(err)
    }
})

//Route for destroying cookie 
router.get('/logout', auth, (req, res)=>{ 
    //it will clear the userData cookie 
    res.clearCookie('token'); 
    res.redirect('/')
    }); 


router.get('/me', auth, async (req, res)=>{ 
    res.render('me', {
        name : req.user.name
    })
}); 

router.get('/me/completed', auth, async (req, res)=>{ 
    res.render('completed', {
        name : req.user.name
    })
}); 

router.get('/me/todo', auth, async (req, res)=>{ 
    res.render('todo', {
        name : req.user.name
    })
}); 

router.post('/user/login', async (req,res) => {
    try { 
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateToken()
    await res.cookie("token", token); 
    //  transporter.sendMail({
    //     to : user.email,
    //     from : 'paratantoine@gmail.com',
    //     subject : "Welcome to your to-do-list application !",
    //     html : `<h1> Welcome ${user.name} ! You successfully registered ! </h1> 
    //             <p>Have fun using your very new to-do App !</p>`
    // })
    
     res.send({redirectUrl: "/me"})
    } catch (err) {
        res.send({error : "impossible"}) // res.status(400).send(err) 
    }
})

router.get('/forgotpassword', async (req,res) => {
    res.render('forgotpassword')
})


const upload = multer({
    limits : {
        fileSize : 3000000
    }
})

router.post('/me/upload/avatar', auth, upload.single('avatar'), async (req, res)=>{ 
    const buffer = await sharp(req.file.buffer).resize({width : 56, height : 56}).png().toBuffer()
     req.user.avatar = buffer
     await req.user.save()
    res.send({redirect: "/me"})
}, (error, req, res, next) => {
    res.status(400).send({message : error.message})
   
}); 


router.get('/me/avatar', auth, function (req, res) {
     try { 
        if(!req.user.avatar) {
            res.redirect('https://raw.githubusercontent.com/azouaoui-med/pro-sidebar-template/gh-pages/src/img/user.jpg')
        } 
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-disposition', `filename="${req.user.name}-avatar.png"`)
        /*DOWNLOAD AVATAR*/
        //res.setHeader('Content-disposition', `attachment; filename="${req.user.name}-avatar.png" `); 
        res.send(req.user.avatar)
     }
     catch(err) {
         res.status(404).send(err)
     }
    
  })

 router.get('/me/credentials', auth, async (req,res) => {
     res.render('credentials', {
         name : req.user.name,
         email : req.user.email
     })
 }) 

 router.patch('/me/credentials/name', auth, async (req,res) => {
     try {
        req.user.name = req.body.name;
        await req.user.save();
        res.send({msg : "name successufly updtated"})
     }
     catch(err) {
         res.send({err : "unable to modify name"})
     }
     
 })

 router.patch('/me/credentials/mail', auth, async (req,res) =>{
     try{
        if(req.user._id== "5d08de87a65a8d060ca0af81") {
            return res.send({msg : "As a guest you are not allowed to change email"})
         }
        const checkPass = await bcrypt.compare(req.body.password, req.user.password)
        if(!checkPass) {
            res.send({msg : "not able to make update"})
        }
        else { 
            req.user.email = req.body.mail;
            await req.user.save();
            res.send({msg : "email successfully updated"})
            sgMail.send({
                to : req.user.email,
                from : 'paratantoine@gmail.com',
                subject : "Mail update",
                html : `<h1> Welcome ${req.user.name} ! </h1> 
                        <p>Your email has been successfully updated !</p>`
            })
        }    
     }
     catch(err){
        res.send({err : "not able to make update"})
     }
 })


 router.patch('/me/resetpassword', auth, async (req,res) => {
    try {
        if(req.user._id== "5d08de87a65a8d060ca0af81") {
            return res.send({msg : "As a guest you are not allowed to change password"})
         }
        const checkPass = await bcrypt.compare(req.body.currentPassword, req.user.password)
        if(!checkPass) {
            res.send({msg : "error, we are not able to reset your password"})
        }
        else { 
            req.user.password = req.body.verifyPassword;
            await req.user.save()
            res.send({msg : "Your password has been successfully updated"})
            sgMail.send({
                to : req.user.email,
                from : 'paratantoine@gmail.com',
                subject : "Password update",
                html : `<h1> Welcome ${req.user.name} ! </h1> 
                        <p>Your password has been successfully updated ! If you didn't changed your password contact us at paratantoine@gmail.com </p>`
            })
        }    
    }
    catch(err) {
        res.send({err : "error, we are not able to reset your password"})
    }
})

 router.delete('/me/delete/user', auth, async (req,res) => {
     try {
        if(req.user._id== "5d08de87a65a8d060ca0af81") {
            return res.send({msg : "As a guest you are not allowed to delete account"})
         }
        const user = await User.findById(req.user._id)
        await sgMail.send({
            to : user.email,
            from : 'paratantoine@gmail.com',
            subject : `Good bye ${user.name} !`,
            html : `<p> We are sad to see you going away but we wish you the best !</p>`
        })
         user.remove()
     }
     catch(err){
         res.send(err)
     }
    
 }) 

router.post('/forgotpassword/mail', async (req,res) => {
    const user = await User.findOne({email : req.body.email});
    if(user._id== "5d08de87a65a8d060ca0af81") {
        return res.send({msg : "As a guest you are not allowed to reset password"})
     }
    const token = await jwt.sign({ _id : user._id}, process.env.JWT_SECRET, { expiresIn : '0.25h'});
    sgMail.send({
        to : user.email,
            from : 'paratantoine@gmail.com',
            subject : `Reset Password`,
            html : `<p>Welcome ${user.name}, Click on this link to reset your password : /newpassword/${token} </p>
                    <p>Notice that this link is only avalable during 15 min</p
                    <p> If your are not the one who tried to reset this password, please contact us as soon as possible </p>`
    })
    res.send({msg : `A mail has been sent to ${user.email}`})
})

router.get('/newpassword/:id', async (req,res) => { 
    const token = req.params.id;
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
     const user = await User.findOne({_id : decoded._id});
    if (!User ) {
        return res.send({msg : "error"});
    }
    res.render('resetForgottenPassword', {
        name : user.name,
        resetNumber : user._id
    })
    // user.password = req.body.password;
    // user.save()
})

router.post('/setnewpassword', async (req, res) => {
    try {
        const user = await User.findOne({_id : req.body.resetNumber})
        const password = req.body.password;
        user.password = password;
        user.save();
        res.send({msg : 'Your password has been successfully updated'});
        sgMail.send({
            to : user.email,
                from : 'paratantoine@gmail.com',
                subject : `New Password`,
                html : `<p>Hi ${user.name}, your password has been successfully updated !</p>
                        <p> If your are not the one who resets this password, please contact us as soon as possible. </p>`
        })
    }
    catch(err) {
        res.send({error :'Sorry, We are unable to update your password.'})
    }
    
})

module.exports = router;