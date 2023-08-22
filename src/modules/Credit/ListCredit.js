import { useEffect, useState } from "react";
import Breadcrumb from "../../components/BreadCrumb"
import env from "../../env"
import CreditAccordion from "./CreditAccordion"
import CreditFilter from "./CreditFilter"
import Cookies from 'universal-cookie';
import BarcodeScannerComponent from "react-webcam-barcode-scanner";
const cookies = new Cookies();

const CreditList = (props)=>{
    const [users,setUsers] = useState()
    const [filter,setFilter] = useState()
    const [doFilter,setDoFilter] = useState(1)
    const [ data, setData ] = useState('Not Found');
    const [acceptData,setAcceptData] = useState([])

    useEffect(()=>{
        if(!doFilter)return
        const token=cookies.get('fiin-login')
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({access:"customer",...filter})
          }
        fetch(env.siteApi + "/auth/list-users",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                setUsers(result.user)
            },
            (error) => {
                console.log(error)
            })
            setDoFilter(0)
        },[doFilter])
    return(
        <div className="container">
        <Breadcrumb title={"Lista de Créditos"}/>

        <div className="section-fiin">
            <CreditFilter  setDoFilter={setDoFilter} filter={filter} setFilter={setFilter}/>   
        </div>
        <div className="section-fiin">
            <div className="section-head">
                <h1 className="section-title">Lista de Créditos​​</h1>
                <p className="hidden">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt .</p>
            </div>   
            <CreditAccordion userList={users}/>
        </div>
        <BarcodeScannerComponent
        width={500}
        height={500}
        onUpdate={(err, result) => {
          if (result) {
            setData(result.text)
            setAcceptData(
                [...acceptData,result.text]
            )
          }
          else setData('Not Found')
        }}
      />
      <p>{data}</p>
      <p>{acceptData?acceptData.map((item,i)=>(
        <h6 key={i}>{item}</h6>
      )):<></>}</p>
    </div>
    )
}
export default CreditList