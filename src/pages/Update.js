import { useEffect, useState } from "react"
import Breadcrumb from "../components/BreadCrumb"
import Cookies from 'universal-cookie';
import env from "../env";
import Switch from "react-switch";
const cookies = new Cookies();

function Update(){
    const userId = document.location.pathname.split('/')[2]
    const [updateLog,setUpdateLog] = useState()
    const [waiting,setWaiting] = useState()
    const [updateDone,setUpdateDone] = useState()
    const [error,setError] = useState({message:'',color:"brown"})
    console.log(waiting)
    const token=cookies.get('faktor-login')
    
    useEffect(()=>{
        if(updateDone===0)return
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
            setWaiting(1)
            setUpdateDone(0)
            setUpdateLog(result.log)
        },
        (error) => {
            console.log(error)
        })
    },[updateDone])
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
            if(result.message){
                setError({message:result.message+" ("+
                result.sepidar+")",color:"green"})
                setTimeout(()=>setError({message:'',color:"brown"}),3000)
            }
            setWaiting(1)
            setUpdateDone(1)
        },
        (error) => {
            console.log(error)
        })
    }
    const findDate=(logs,queryName)=>{
        var foundLog=logs.find(item=>item.updateQuery===queryName)
        var foundDate = foundLog&&new Date(foundLog.date)
        .toLocaleDateString('fa-IR')
        return(foundDate)
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
                            <div className="col-md-12">
                                <div className="form-field-fiin">
                                    {waiting?<input type="button" value="بروزرسانی همه" 
                                        onClick={()=>updateFunc("sepidar-all")}/>:
                                        <input type="button" value="در حال بروزرسانی..."/>}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-field-fiin">
                                <label htmlFor="Nome-Comercial">آخرین بروزرسانی: 
                                    {waiting&&findDate(updateLog,"sepidar-price")}</label>
                                    {waiting?<input type="button" value="بروزرسانی قیمت" 
                                        onClick={()=>updateFunc("sepidar-price")}/>:
                                        <input type="button" value="در حال بروزرسانی..."/>}
                                </div>
                            </div>
                            <div className="col-md-6">
                            <div className="form-field-fiin">
                                <label htmlFor="Nome-Comercial">آخرین بروزرسانی: 
                                    {waiting&&findDate(updateLog,"sepidar-quantity")}</label>
                                {waiting?<input type="button" value="بروزرسانی تعداد"
                                        onClick={()=>updateFunc("sepidar-quantity")}/>:
                                        <input type="button" value="در حال بروزرسانی..."/>}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-field-fiin">
                                <label htmlFor="Nome-Comercial">آخرین بروزرسانی: 
                                    {waiting&&findDate(updateLog,"sepidar-product")}</label>
                                {waiting?<input type="button" value="بروزرسانی محصولات"
                                        onClick={()=>updateFunc("sepidar-product")}/>:
                                        <input type="button" value="در حال بروزرسانی..."/>}
                                </div>
                            </div>
                            <div className="col-md-6">
                            <div className="form-field-fiin">
                                <label htmlFor="Nome-Comercial">آخرین بروزرسانی: 
                                    {waiting&&findDate(updateLog,"sepidar-bank")}</label>
                                {waiting?<input type="button" value="بروزرسانی بانک ها"
                                        onClick={()=>updateFunc("sepidar-bank")}/>:
                                        <input type="button" value="در حال بروزرسانی..."/>}
                                </div>
                            </div>
                            <div className="col-md-6">
                            <div className="form-field-fiin">
                                <label htmlFor="Nome-Comercial">آخرین بروزرسانی: 
                                    {waiting&&findDate(updateLog,"sepidar-customer")}</label>
                                {waiting?<input type="button" value="بروزرسانی کاربران"
                                        onClick={()=>updateFunc("sepidar-customer")}/>:
                                        <input type="button" value="در حال بروزرسانی..."/>}
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