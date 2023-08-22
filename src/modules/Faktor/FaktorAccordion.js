import { useState } from "react"
import { normalDate, normalPrice } from "../../env"

function FaktorAccordion(props){
    const [tab,setTab] = useState(0)
    return(
        <div className="accordions">
            {props.faktorList&&props.faktorList.map((faktor,i)=>(
                <div className="accordion-item" key={i}>
                    <div className={tab===i+1?"accordion-title active-title":"accordion-title"}
                         data-tab="item1" onClick={()=>tab===i+1?setTab(0):setTab(i+1)}>
                        <div className="row row-cols-lg-6 row-cols-md-3 row-cols-sm-2 row-cols-1 align-items-center">
                            <div className="col">
                                <div className="list-item">
                                    <span>شماره فاکتور: </span>
                                    {faktor.faktorNo}
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
                                    {normalPrice(faktor.totalPrice)}
                                </div>
                            </div>
                            <div className="col">
                                <div className="list-item">
                                    <span style={{fontSize:"12px"}}>کاربر: </span>
                                    {"میلاد حسینی"}
                                </div>
                            </div>
                            <div className="col">
                                <div className="list-item">
                                    <span>تعداد: </span>
                                    {faktor.totalCount}
                                </div>
                            </div>
                            <div className="col">
                                <div className="list-item">
                                    <a href={`/faktor/print/${faktor.faktorNo}`} className="btn-cancel">
                                        <span className="icon-upload"></span> چاپ فاکتور </a>
                                </div>
                            </div>
                        </div>
                        <span className="show-more">مشاهده جزئیات</span>
                    </div>
                    <div className="accordion-content" id="item1" 
                        style={{display:tab===i+1?"block":"none"}}>
                        {faktor.faktorItems&&faktor.faktorItems.map((faktorItem,i)=>(
                            <div className="row row-cols-xl-5 row-cols-lg-4 row-cols-md-3 row-cols-sm-2  row-cols-1" key={i}>
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
                            </div>
                        ))}
                        
                    </div>
                </div>
            ))}
        </div>
    )
}
export default FaktorAccordion