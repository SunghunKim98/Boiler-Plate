const express = require('express') //express module을 가져온다
const app = express() //새로운 express app을 만들고
const port = 5000 //port는 5000번으로

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://june:apt1033202@@nodejspractice.xjqzt.mongodb.net/Nodejspractice?retryWrites=true&w=majority',{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false //에러를 안나게 하기 위해
}).then(() => console.log('MongoDB Connceted...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello World!')) // '/'-> root directory에 오면 Hello World를 출력한다.

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
//"port"에 listen이 된다면 console에 'Example ~~'를 찍는다.

