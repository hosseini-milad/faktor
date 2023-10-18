import { useState } from "react"
import { normalDate, normalPrice, normalPriceCount } from "../../env"

function CartAccordion(props){
    const [tab,setTab] = useState(0)
    const i = props.index
    const createArray=(addRemove,item)=>{
        if(addRemove){
            props.setCartID(existingItems => {
            return [
              ...existingItems.slice(0, props.cartID.length),
              item,
              ...existingItems.slice(props.cartID.length + 1),
            ]
          })
        }
        else
        props.setCartID(
            props.cartID.filter(function (geeks) {
                return geeks != item;
            })
        )
    }
    return(
        <div className="accordions">
            {props.faktorList&&props.faktorList.map((faktor,i)=>(
                <div className="accordion-item" key={i}>
                    <input type="checkbox" className="checkBoxCart" 
                        onChange={(e)=>createArray(e.target.checked,faktor._id)}/>
                    <div className={tab===i+1?"accordion-title active-title":"accordion-title"}
                         data-tab="item1" onClick={()=>tab===i+1?setTab(0):setTab(i+1)}>
                        <div className="row row-cols-lg-6 row-cols-md-3 row-cols-sm-2 row-cols-1 align-items-center">
                        <small style={{position:"absolute",top:"7px",right:"0px"}}>{i+1}</small>
                            <div className="col">
                                <div className="list-item">
                                    <span>مشتری: </span>
                                    {faktor.userData&&
                                    faktor.userData[0]?
                                    faktor.userData[0].username:
                                    faktor.adminData[0]&&faktor.adminData[0].username}
                                </div>
                            </div>
                            <div className="col">
                                <div className="list-item">
                                    <span>تاریخ ثبت:</span>
                                    {new Date(faktor.initDate).toLocaleDateString('fa-IR')}
                                </div>
                            </div>
                            <div className="col">
                                <div className="list-item">
                                    <span>مبلغ: </span>
                                    {normalPriceCount(faktor.countData.totalPrice,"1.09")}
                                </div>
                            </div>
                            <div className="col">
                                <div className="list-item">
                                    <span>تعداد: </span>
                                    {faktor.countData.totalCount}
                                </div>
                            </div>
                            <div className="col">
                                <div className="list-item">
                                    <span style={{fontSize:"12px",marginLeft:"10px"}}> کاربر: </span>
                                    {faktor.managerData&&
                                    faktor.managerData[0]&&
                                    faktor.managerData[0].username}
                                </div>
                            </div>
                            {/*<div className="col">
                                <div className="list-item">
                                    <a href={`/faktor/print/${faktor.faktorNo}`} className="btn-cancel">
                                        <span className="icon-upload"></span> چاپ فاکتور </a>
                                </div>
                                    </div>*/}
                        </div>
                        {/*<span className="show-more">مشاهده جزئیات</span>*/}
                    </div>
                    <div className="accordion-content" id="item1" 
                        style={{display:tab===i+1?"block":"none"}}>
                        {faktor.cartItems&&faktor.cartItems.map((faktorItem,i)=>(
                            <div className="row row-cols-xl-5 row-cols-lg-5 row-cols-md-3 row-cols-sm-2  row-cols-1" key={i}>
                                
                                <div className="col">
                                    <div className="list-item">
                                        <h6>{faktorItem.title}</h6>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="list-item">
                                        <span>شناسه: </span>{faktorItem.sku}
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="list-item">
                                        <span>تعداد:</span> {faktorItem.count}
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="list-item">
                                        <span>فی:</span> {normalPrice(faktorItem.price)}
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="list-item">
                                        <span>قیمت:</span> {normalPriceCount(faktorItem.price,faktorItem.count)}
                                    </div>
                                </div>
                                <hr/>
                            </div>
                        ))}
                        
                    </div>
                </div>
            ))}
        </div>
    )
}
export default CartAccordion