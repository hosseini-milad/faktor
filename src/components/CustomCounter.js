import { useState } from "react"

function CustomCounter(props){
    const countCalc=(value)=>{
        var oldValue = parseInt(props.count);
        if(oldValue + value<1) props.setCount(1)
        else props.setCount(oldValue + value)
    }
    const [single,setSingle] = useState(1)
    return(
        <div className="myCounter">
            <div className="counterIconHolder reverse">
                {props.double||single===10?<div className="counterIcon" 
                    onClick={()=>countCalc(10)}>
                    <i className="fa fa-plus"></i>
                    <small>10</small>
                </div>:<></>}
                {props.double||single===1?<div className="counterIcon" 
                    onClick={()=>countCalc(1)}>
                    <i className="fa fa-plus"></i>
                    <small></small>
                </div>:<></>}
            </div>
            <h4 className="counterInput"
                onClick={()=>single===1?setSingle(10):setSingle(1)}>{props.count}</h4>

            <div className="counterIconHolder">
                {props.double||single===1?<div className="counterIcon"
                    onClick={()=>countCalc(-1)}>
                    <i className="fa fa-minus"></i>
                    <small></small>
                </div>:<></>}
                {props.double||single===10?<div className="counterIcon"
                    onClick={()=>countCalc(-10)}>
                    <i className="fa fa-minus"></i>
                    <small>10</small>
                </div>:<></>}
            </div>
        </div>
    )
}
export default CustomCounter