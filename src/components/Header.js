import { useState } from 'react';
import Cookies from 'universal-cookie';

import errortrans from "../translate/error";

const Header = (props)=>{
    const cookies = new Cookies();
    const [convas,setConvas] = useState(0)
    const token=cookies.get('faktor-login');
    const lang = props.lang?props.lang.lang:errortrans.defaultLang;
    const logOff=()=>{
       cookies.remove('faktor-login',{ path: '/' });
       setTimeout(()=>(document.location.reload(),500))
    }
    return(
        <header className="main-header">
        <div className="container">
            <nav className="header-navbar">
                <a href="/" className="header-logo">
                    <img src="/img/logo-black.png" alt=""/></a>
                <button type="button" className="toggle-menu"
                    onClick={()=>setConvas(1)}><span></span></button>
                <div className={convas?"navbar-menu active-navbar-menu":"navbar-menu"}>
                    <span className="menu-close" onClick={()=>setConvas(0)}>
                        <span className="icon-close"></span></span>
                    <ul className="main-menu">
                        <li><a href="/faktor/register"> ثبت فاکتور </a>
                        </li>
                        <li><a href="/cart/List">سفارشات باز</a>
                        </li>
                        <li><a href="/faktor/List"> لیست فاکتورها</a>
                        </li>
                        <li><a href="/update"> بروزرسانی سپیدار</a>
                        </li>
                        
                    </ul>
                </div>
                <div className="account-head ms-auto">
                    <button type="button" className="toggle-head-account">
                        <span className="icon-user"></span>
                        <span className="head-user-name">
                            {token&&token.name?token.name:token.username}
                        </span>
                    </button>
                    <ul>
                        <li><a href="/profile">پروفایل کاربری</a></li>
                        <li><a href="/password">رمز عبور</a></li>
                        <li><a href="#" onClick={logOff}>خروج</a></li>
                    </ul>
                </div>
            </nav>
        </div>
    </header>
    )
}
export default Header