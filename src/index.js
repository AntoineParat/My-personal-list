// require('./db/mongoose')
// const express = require('express')
// const hbs = require('hbs')
// const path = require('path');
// const userRouter = require('./routers/user')
// const taskRouter = require('./routers/tasks')
// const cookieParser = require('cookie-parser');

// const app = express()
// const port = process.env.PORT || 3000; // process.env.PORT is for heroku deployment

// //Define path for express config
// const publicDirectoryPath = path.join(__dirname, '../public');

// app.use(cookieParser());

// app.use(userRouter);
// app.use(taskRouter);

// //setup static directory to serve
// app.use(express.static(publicDirectoryPath));


// //setup handlebars engine and views location
// app.set('view engine', "hbs");

// app.use(express.json()) //automatically parse upcoming JSON file




// // app.get('/', function (req, res) {
// //   res.render('index')
// // })

// // app.get('/sign-up', function (req, res) {
// //   res.render('sign-up')
// // })

// app.listen(port, () => {
//     console.log('router is up on port' + port)
// })


require('./db/mongoose')
const express = require('express')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/tasks')
const path = require('path');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');

const app = express()
const port = process.env.PORT; // process.env.PORT is for heroku deployment

const publicDirectoryPath = path.join(__dirname, '../public');
const partialsPath = path.join(__dirname, '../views/partials');
hbs.registerPartials(partialsPath);

app.use(cookieParser());

app.use(express.static(publicDirectoryPath));

app.use(express.json()) //automatically parse upcoming JSON file

app.set('view engine', "hbs");

app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log('router is up on port' + port)
})



