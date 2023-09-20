function Popup(props){
    const alertData = props
    //console.log(alertData)
    return(
        <div className="alertHolder">
            <div className='alertPlace'>
                <div className="alertTitle">
                    <h3>{props.error?props.error:
                    alertData.title}</h3>
                </div>
                <div className="alertText">
                    {alertData.text}
                </div>
                <div className="alertText">
                    {alertData.text2}
                </div>
                <div className='alertBtn'>
                    {props.error?<></>:
                    <input type="button" className='acceptBtn' value="تایید" onClick={
                        ()=>props.setAlertShow(pState => {
                                return { ...pState, show: false, action:1}
                              })}/>}
                    {alertData.nocancel?'':<input type="button" className='cancelBtn' value="انصراف" onClick={
                        ()=>props.setAlertShow(pState => {
                                return { ...pState, show: false, action:0}
                              })}/>}
                </div>
            </div>
        </div>
    )
}
export default Popup