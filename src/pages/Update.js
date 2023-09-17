import { useEffect, useState } from "react"
import Breadcrumb from "../components/BreadCrumb"
import Cookies from 'universal-cookie';
import env from "../env";
import Switch from "react-switch";
const cookies = new Cookies();

function Update(){
    const userId = document.location.pathname.split('/')[2]

    const [waiting,setWaiting] = useState()
    const [error,setError] = useState({message:'',color:"brown"})
    
    const token=cookies.get('faktor-login')
    
    useEffect(()=>{
        const postOptions={
            method:'get',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId}
          }
        //console.log(postOptions)
        fetch(env.siteApi + "/sepidar-update-log",postOptions)
      .then(res => res.json())
      .then(
        (result) => {
            setWaiting(result.log)
        },
        (error) => {
            console.log(error)
        })
    },[])
    const updateFunc=(url)=>{
        setWaiting(0)
        const postOptions={
            method:'get',
            headers: { 'Content-Type': 'application/json'}
          }
        //console.log(postOptions)
        fetch(env.siteApi + "/"+url,postOptions)
      .then(res => res.json())
      .then(
        (result) => {
            setWaiting(result)
        },
        (error) => {
            console.log(error)
        })
    }
    return(
        <div className="container">
        <Breadcrumb title={"بروزرسانی سپیدار"}/>
        
        <div className="section-fiin dados-do-consultor">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="form-fiin form-box-style">
                        <div className="section-head">
                            <h1 className="section-title">دریافت اطلاعات از سپیدار </h1>
                            
                        </div>
                        
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-field-fiin">
                                <label htmlFor="Nome-Comercial">Last Update: Today</label>
                                    {waiting?<input type="button" value="update Prices" 
                                        onClick={()=>updateFunc("sepidar-price")}/>:
                                        <input type="button" value="updateing..."/>}
                                </div>
                            </div>
                            <div className="col-md-6">
                            <div className="form-field-fiin">
                                {waiting?<input type="button" value="update Quantity"
                                        onClick={()=>updateFunc("sepidar-quantity")}/>:
                                        <input type="button" value="updateing..."/>}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-field-fiin">
                                {waiting?<input type="button" value="update Products"
                                        onClick={()=>updateFunc("sepidar-product")}/>:
                                        <input type="button" value="updateing..."/>}
                                </div>
                            </div>
                            <div className="col-md-6">
                            <div className="form-field-fiin">
                                {waiting?<input type="button" value="update Banks"
                                        onClick={()=>updateFunc("sepidar-bank")}/>:
                                        <input type="button" value="updateing..."/>}
                                </div>
                            </div>
                        </div>
                        <small className="errorSmall" style={{color:error.color}}>
                            {error.message}</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}
export default Update