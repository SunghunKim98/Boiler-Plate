const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, //띄어쓰기를 알아서 정리해주는(삭제해주는 역할 )
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }

})

userSchema.pre('save',function(next){

    var user = this; // 이 과정이 정말 필수인거구나.... 객체에 넣어주지 않으면 오류가 발생한다.

    if(this.isModified('password')){ //비밀번호가 바뀔 때만 hash로 변경해준다
        //비밀번호를 암호화
        bcrypt.genSalt(saltRounds, function(err,salt){
        if(err) return next(err)
        bcrypt.hash(user.password, salt, function(err, hash) {
            // Store hash in your password DB.
            if(err) return next(err)
            user.password = hash
            next()
            
        });
    })
    } else{
        next()
    } 
})

userSchema.methods.comparePassword = function(plainPassword, callback){
    bcrypt.compare(plainPassword, this.password, function(err,isMatch){
        if(err) return callback(err);
        callback(null, isMatch) //여기서 비교해서 비밀번호가 일치한다면, isMatch가 true로 반환, 아니라면 false를 반환
    })
}

userSchema.methods.generateToken = function(callback){

    var user = this;
     
    //jsonwebtoken을 이용하여 token을 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken')  // user._id + 'secretToken' -> token

    user.token = token;
    user.save(function(err,user){
        if(err) return callback(err)
        callback(null, user)
    })
}

userSchema.statics.findByToken = function(token, callback){
    var user = this;

    //Token을 decode
    jwt.verify(token, 'secretToken', function(err,decoded){
        
        //유저 아이디를 이용해서 유저를 찾은 다음
        //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
        //이떄 decoded에는 user._id가 들어간다.

        user.findOne({"_id": decoded, "token": token},function(err,user){
            if(err) return callback(err)
            callback(null,user)
        })
    })
}


const User = mongoose.model('User',userSchema);
module.exports = {User}