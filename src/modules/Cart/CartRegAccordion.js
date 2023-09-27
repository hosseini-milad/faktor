import { useState } from "react"
import { normalDate, normalPrice, normalPriceCount } from "../../env"
import FaktorReturn from "../Faktor/FaktorReturn"

function CartRegAccordion(props){
    const faktor = props.faktor
    const cartDetail = props.cartDetail
    const [tab,setTab] = useState(0)
    const i = props.index
    return(
        <div className="accordion-item" >
            <div className={tab===i+1?"accordion-title active-title":"accordion-title"}
                    data-tab="item1" onClick={()=>tab===i+1?setTab(0):setTab(i+1)}>
                <div className="row row-cols-lg-5 row-cols-md-3 row-cols-sm-2 row-cols-1 align-items-center">
                <small style={{position:"absolute",top:"7px",right:"0px"}}>{i+1}</small>
                    <div className="col">
                    <div className="list-item">
                            <span>تاریخ ثبت:</span>
                            {new Date(faktor.initDate).toLocaleDateString('fa-IR')}
                        </div>
                    </div>
                    <div className="col">
                        <div className="list-item">
                            <span>ساعت:</span>
                            {new Date(faktor.initDate).toLocaleTimeString()}
                        </div>
                    </div>
                    <div className="col">
                        <div className="list-item">
                            <span>مبلغ با احتساب مالیات: </span>
                            {normalPriceCount(cartDetail.totalPrice,"1.09")}
                        </div>
                    </div>
                    <div className="col">
                        <div className="list-item">
                            <span>تعداد: </span>
                            {cartDetail.totalCount}
                        </div>
                    </div>
                    <div className="col">
                        <div className="list-item">
                            <span style={{fontSize:"12px",marginLeft:"10px"}}> توضیحات: </span>
                            {cartDetail.cartDescription}
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
                    <div className="row row-cols-xl-6 row-cols-lg-6 row-cols-md-3 row-cols-sm-2  row-cols-1" key={i}>
                        
                        <div className="col">
                            <div className="list-item">
                                <span> </span>
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
                        {/*<div className="col">
                            <div className="list-item">
                                <span>قیمت:</span> {normalPriceCount(faktorItem.price,faktorItem.count)}
                            </div>
                </div>*/}
                        <div className="col">
                            <div className="list-item">
                                <span>قیمت با احتساب مالیات:</span> 
                                {normalPriceCount(normalPriceCount(faktorItem.price,faktorItem.count),"1.09")}
                            </div>
                        </div>
                        <div className="col">
                            <div className="list-item">
                                <FaktorReturn itemId={faktorItem} faktor={faktor}
                                    setFaktorList={props.setFaktorList}/>
                            </div>
                        </div>
                        <div className="col">
                            <div className="list-item">
                                <span>توضیحات:</span> {faktorItem.description}
                            </div>
                        </div>
                    </div>
                ))}
                
            </div>
        </div>
    )
}
export default CartRegAccordion