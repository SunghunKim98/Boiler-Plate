import React,{useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { auth } from '../_actions/user_action'

export default function(SpecificComponent, option, adminRoute = null) {

    //null   => 아무나 출입가능한 페이지
    //true   => 로그인한 유저만 출입가능한 페이지
    //false  => 로그인한 유저는 출입이 불가능한 페이지

    function AuthenticationCheck(props){
        const dispatch = useDispatch();

        useEffect(() => {
            dispatch(auth())
            .then(response => {
                //console.log(response)

                // 로그인을 하지 않은 상태
                if(!response.payload.isAuth){
                    if(option){
                        alert('응 안돼!');
                        props.history.push('/login') // 로그인은 하지 않았는데, 로그인한 유저만 출입가능한 페이지를 들어가려고 하는 경우
                    }
                } else{
                    // 로그인을 한 상태
                    if(adminRoute && !response.payload.isAdmin){
                        alert('응 안돼!');
                        props.history.push('/') // 관리자 페이지를 들어가려고 하고 && 근데 관리자는 아닌 경우
                    } else{
                        if(option === false){
                            alert('응 안돼!');
                            props.history.push('/') // 로그인한 사람이 로그인 유저는 출입이 불가능한 페이지를 가려고 할 때.
                        }
                    }
                }
            })// eslint-disable-next-line
        }, [])

        return(<SpecificComponent/>)
    }

    return AuthenticationCheck
}