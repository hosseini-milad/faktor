import { useState ,useEffect } from "react";
import env, {  normalPrice, normalPriceCount } from "../../../env";
var token = JSON.parse(localStorage.getItem('token-lenz'));

function FishPrintHesabfa(props){
  const orderInfo = props.orderData
  const userInfo = props.orderData.userData?props.orderData.userData[0]:''
    
    if(!orderInfo)
      return(<main>{"orderError"}</main>)
    else return(
        <div className="printArea fishPrintArea">
          <div className="userInfo hesabSection">
              <div className="hesabfaSection hesabBorder">
                <h4>فاکتور فروش</h4>
                <h4>روانکاران شریف</h4>
              </div>
              <div className="hesabfaSection hesabBorder">
                <small>ش.فاکتور: {orderInfo.faktorNo}</small>
                <small>ش.ارجاع: {orderInfo.InvoiceNumber}</small>
              </div>
              <div className="hesabfaSection hesabBorder">
                <small> تاریخ: {new Date(orderInfo.initDate).toLocaleDateString('fa')}</small>
                <small>ساعت: {new Date(Date.now()).getHours()+":"+new Date(Date.now()).getMinutes()}</small>
              </div>
            </div>
            <table className="hesabPrintTable hesabBorder">
              <tbody>
                <tr>
                  <td className="verticalRow hesabfaColor">
                    <small>مشتری</small>
                  </td>
                  <td colSpan={3} className="hesabfaItem">
                    <span>نام: </span>
                    <strong>{userInfo&&userInfo.username}</strong>{/*+" ("+userInfo.Code+")"*/}
                    <br/>
                    <span>شماره تماس: </span>
                    <strong>{userInfo&&userInfo.phone}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
            <table className="hesabfaMainTable">
              <tbody>
                <tr>
                  <th>#</th>
                  <th width={120}>عنوان</th>
                  <th>تعداد</th>
                  <th className="priceCell">مبلغ</th>
                </tr>
                {orderInfo&&orderInfo.faktorItems.map((items,i)=>(
                <tr key={i}>
                  <td className="centerCell">{i+1}</td>
                  <td style={{fontSize:"11px"}}>{items.title}</td>
                  <td className="centerCell">{items.count}</td>
                  <td className="priceCell">{normalPriceCount(items.price,items.count)}</td>
                </tr>))}
              </tbody>
            </table>
            <table className="hesabfaMainTable sumTable"> 
              <tbody>
                <tr>
                  <td rowSpan={3}>جمع اقلام: {orderInfo.totalCount}</td>
                  <td>جمع فاکتور </td>
                  <td className="priceCell">{normalPrice(orderInfo.totalPrice)}</td>
                </tr>
                <tr>
                  <td>جمع تخفیف </td>
                  <td className="priceCell">{"0"}</td>
                </tr>
                <tr>
                  <td>قابل پرداخت </td>
                  <td className="priceCell"><b>{normalPrice(orderInfo.totalPrice)}</b></td>
                </tr>
              </tbody>
            </table>
            <div className="hesabfaFooter">
              <div className="footerRows">
                  <div className="hesabfaRight">
                    {/*<span>مانده حساب: {normalPrice(userInfo.Liability-userInfo.Credits)} ریال بدهکار</span>*/}
                  </div>
                  
                </div>
            </div>
            {/*<button className="printBtn" onClick={()=>printNow()}>چاپ</button>*/}
            <div className="footerHesabfa">
              <span style={{textAlign:"center",display:"block"}}>امضا</span>
              <span style={{textAlign:"center",display:"block"}}>
                  تنظیم سند: {token&&token.userId.slice(-3)}
              </span>
            </div>
        </div>
    )

  }

export default FishPrintHesabfa