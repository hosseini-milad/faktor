import Footer from "./Footer"
import Header from "./Header"
const lang = JSON.parse(localStorage.getItem('fiin-lang'));
const url = document.location.pathname;
function Layout(props){
    
    return(
        <>
            {!url.includes("print")?<Header lang={lang}/>:<></>}
            {props.children}
            {!url.includes("print")?<Footer />:<></>}
        </>
    )
}
export default Layout