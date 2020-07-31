
const { User } = require('../models/User')

let auth = (req,res,next) => {

    //인증처리를 하는 곳

    //클라이언트 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth;

    //토큰을 복호화 한 후, 유저를 찾는다.
    User.findByToken(token, (err,user) => {
        if(err) throw err;
        if(!user) return res.json({isAuth: false, error: true})

        req.token = token;
        req.user = user; // -> Auth Router에 존재하는 다음 콜백function에서 사용하기 위해 request에 담아놓는다.
        next() //-> auth 라는 것은 미들웨어이기 때문에 next()를 해야 다음으로 넘어갈 수 있다.
    })


    //유저가 있으면 인증 O/ 유저가 없으면 인정 X
}

module.exports = { auth }