const express = require('express') //express module을 가져온다
const app = express() //새로운 express app을 만들고
const port = 5000 //port는 5000번으로
const bodyParser = require('body-parser')
const { User } = require('./models/User');
const { auth } =  require('./middleware/auth');
const cookieParser = require('cookie-parser');
const config = require('./config/key')

app.use(bodyParser.urlencoded({extended: true})) //application/url: www-form-.com -> 이렇게 url를 encode 할 수 있도록 설정
app.use(bodyParser.json()) //application/ json을 bodyParser해서 가져올 수 있도록
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI,{
    
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false //에러를 안나게 하기 위해
}).then(() => console.log('MongoDB Connceted...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => res.send('hi there :)')) // '/'-> root directory에 오면 Hello World를 출력한다.


app.get('/api/hello',(req,res) => {
    res.send('안녕하세용')
})



//먼저 Register Route를 생성해야한다.
app.post('/api/users/register', (req,res) => {

    // 회원가입 할때 필요한 정보들을 Client 에서 가져오면 그것들을 데이터베이스에 넣어준다. 
    const user = new User(req.body) // -> body-parser를 통해 req.body를 '파싱(parse)'해서 받아온다.

    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err})
        return res.status(200).json({ //-> status(200)은 성공했다는 표시
            success: true
        })
    })
    
})


app.post('/api/users/login',(req,res) => {
    //요청된 이메일이 데이터베이스에 존재하는지 확인

    User.findOne({email: req.body.email}, (err,user) => {
        
        //console.log(user);
        //=> MongoDB에서 제공하는 findOne이라는 메소드를 이용 && Callback function
        
        if(!user) { // MongoDB의 findOne()에서 콜백함수를 통해 에러발생시 err에서/ 그리고 에러가 없다면 user에 값이 담긴다.
                    // 이때 값이 존재하지 않는다면, user에는 false가 담긴다.
                    // 값이 존재한다면, user에는 데이터베이스에서 가져온 정보들이 Json형식으로 담긴다. 
            return res.json({
                loginSuccess: false,
                message: "해당되는 유저가 없습니다. 다른 이메일을 입력해주세요."
            })
        } 
        //요청된 이메일이 데이터베이스에 존재한다면 비밀번호가 일치하는지 확인
        user.comparePassword(req.body.password, (err,isMatch) => {

            console.log(user);
            
            if(!isMatch)
            return res.json({loginSuccess: false, message:"비밀번호가 틀렸습니다."})
            
            //비밀번호도 일치한다면, 토큰을 생성하기.
            user.generateToken((err,user) => {

                if(err) return res.status(400).send(err)
                // 토큰을 저장한다 -> 어디에? -> 쿠키, 로컬스토리지, 세션 등등 but 여기선 쿠키에 저장한다.
                res.cookie("x_auth",user.token)
                .status(200)
                .json({loginSuccess: true, userID: user._id, message: "로그인에 성공하였습니다."})
            })
        })
    }) 
})

app.get('/api/users/auth', auth ,(req,res) => { //auth라는 미드웨어 -> 콜벡function이 실행되기전에 실행되는 함수

    //여기까지 미들웨어(auth)를 통괴해서 왔다는 얘기는 Authentication이 True 라는 말이다.
    //Authentication이 false였으면, 미들웨어인 auth에서 res.json()을 return하면서 끝났을 것.

    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true, //role이 0이면 일반user; role 0이 아니면 관리자
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image 
    })
})

app.get('/api/users/logout', auth , (req,res) => { //**로그인이 되어있으므로 auth를 가져온다...라...

    User.findOneAndUpdate({_id: req.user._id}, {token: ""}, (err,user) => {
        //console.log(err)
        if(err) return res.json({success: false, err});
        res.status(200).send({success: true})
    })
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
//"port"에 listen이 된다면 console에 'Example ~~'를 찍는다.

