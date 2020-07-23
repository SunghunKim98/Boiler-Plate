const express = require('express') //express module을 가져온다
const app = express() //새로운 express app을 만들고
const port = 5000 //port는 5000번으로
const bodyParser = require('body-parser')
const { User } = require('./models/User')

const config = require('./config/key')

app.use(bodyParser.urlencoded({extended: true})) //application/url: www-form-.com -> 이렇게 url를 encode 할 수 있도록 설정
app.use(bodyParser.json()) //application/ json을 bodyParser해서 가져올 수 있도록

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false //에러를 안나게 하기 위해
}).then(() => console.log('MongoDB Connceted...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => res.send('hi there :)')) // '/'-> root directory에 오면 Hello World를 출력한다.


//먼저 Register Route를 생성해야한다.
app.post('/register', (req,res) => {

    // 회원가입 할때 필요한 정보들을 Client 에서 가져오면 그것들을 데이터베이스에 넣어준다. 
    const user = new User(req.body) // -> body-parser를 통해 req.body를 '파싱(parse)'해서 받아온다.

    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err})
        return res.status(200).json({ //-> status(200)은 성공했다는 표시
            success: true
        })
    })
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
//"port"에 listen이 된다면 console에 'Example ~~'를 찍는다.

