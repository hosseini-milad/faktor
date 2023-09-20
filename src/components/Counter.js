function Counter(props){
    const originCount = parseInt(props.count)
    const itemId=props.itemId
    const setCount=(count)=>{
        if(itemId)
            props.setCount(originCount+count,itemId)
        else
            props.setCount(originCount+count)
    }
    return(
    <div className="counterHolder">
        <div className="counter" onClick={()=>setCount(1)}>+</div>
        <input type="text" name="count" id="count" 
            value={originCount}
            className="counterInput"
            readOnly/>
        <div className={originCount===1?"counter disableBtn":"counter"} 
            onClick={()=>(originCount===1?'':setCount(-1))}>-</div>
    </div>
    )
}
export default Counter