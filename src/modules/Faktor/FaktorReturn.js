import { useEffect, useState } from "react"
import Breadcrumb from "../../components/BreadCrumb"
import ListFilters from "../ListFilters"
import env, { defferCount, normalPrice } from "../../env"
import Popup from "../../components/popup"

const FaktorReturn = (props)=>{
    const item = props.itemId
    const [filterItems,setFilterItems] = useState()
    const [error,setError] = useState({message:'',color:"brown"})
    const [showPop,setShowPop] = useState(0)
    const [count,setCount] = useState("1")
    
    const [alertShow,setAlertShow] = useState({show: false, action:0})
    //console.log(props.itemCount)
    const token=props.token
    
    const returnItem=()=>{
        setAlertShow(pState => {
            return { ...pState, show: true}
          })
    }
    useEffect(()=>{
        if(alertShow.action){
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({userId:props.user?props.user._id:(token&&token.userId),
                date:Date.now,cartID:props.itemId.id,count:count?count:1})
            }
        fetch(env.siteApi + "/product/return-cart",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result)
                if(result.error){
                    setError({message:result.error,color:"brown"})
                    setTimeout(()=>setError({message:'',
                        color:"brown"}),3000)
                }
                else{
                    setAlertShow({show: false, action:0})
                    props.setFaktorList(result)
                    setCount("1")
                    setError({message:result.message,color:"green"})
                    setTimeout(()=>setError({message:'',
                        color:"brown"}),3000)
                }
            },
            (error) => {
                console.log(error)
            })
        }
        
    },[alertShow])
    return(<>
        <div className="form-fiin form-field-fiin" 
            style={{marginBottom: "0",display:"flex"}}>
            <input type="text" name="count" id="count" 
                onChange={(e)=>setCount(e.target.value)}
                value={count} style={{textAlign:"center"}}
                placeholder="تعداد"/>
        <input type="button" value="برگشت از فروش" 
        onClick={returnItem}/>
        {alertShow.show?<Popup title={"برگشت از فروش"} 
            text={item.title+"("+item.sku+")"}
            text2={"تعداد: "+count}
            error={defferCount(props.itemCount,count)===-1?"تعداد مطابقت ندارد":''}
            setAlertShow={setAlertShow}/>:<></>}
        </div>
    </>
    )
}
export default FaktorReturn