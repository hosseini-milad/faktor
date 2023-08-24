import { useState ,useEffect } from "react";
import env, { normalPrice, normalPriceCount } from "../../../env";
var token = JSON.parse(localStorage.getItem('token-lenz'));

function PrintHesabfa(props){
    
  const orderInfo = props.orderData.faktor
  const userInfo = props.userInfo
    return(
        <div className="printArea">
          <div className="userInfo">
              <div className="hesabfaSection">
              </div>
              <div className="hesabfaSection">
                <h1>Order Title</h1>
                <h4>فاکتور فروش</h4>
              </div>
              <div className="hesabfaSection" style={{minWidth: "240px"}}>
                <small>شماره فاکتور: <b>{orderInfo.faktorNo}</b></small>
                <small>شماره ارجاع: <b>{orderInfo.InvoiceNumber}</b></small>
                <small> تاریخ سفارش: <b>{new Date(orderInfo.initDate).toLocaleDateString('fa-IR')}</b></small>
              </div>
            </div>
            <table className="hesabfaTable">
              <tbody>
                <tr>
                  <td className="verticalRow hesabfaColor">
                    <h3>خریدار</h3>
                  </td>
                  <td>
                    <table className="hesabfaRow">
                      <tbody>
                        <tr>
                          <td colSpan={3} className="hesabfaItem">
                            <span>خریدار: </span>
                            <strong> نام خریدار {userInfo.Name}</strong>
                          </td>
                          <td colSpan={2} className="hesabfaItem">
                            <span>شماره تماس: </span>
                            <strong>{userInfo.Mobile}</strong>
                          </td>
                        </tr>
                        <tr>
                          <td className="hesabfaItem">
                            <span>استان: </span>
                            <strong>{userInfo&&userInfo.State}</strong>
                          </td>
                          <td className="hesabfaItem">
                            <span>شهر: </span>
                            <strong>{userInfo&&userInfo.City}</strong>
                          </td>
                          <td className="hesabfaItem">
                            <span>کدپستی: </span>
                            <strong>{userInfo&&userInfo.PostalCode}</strong>
                          </td>
                          <td colSpan={2} className="hesabfaItem">
                            <span>آدرس: </span>
                            <strong>{userInfo&&userInfo.Address}</strong>
                          </td>
                          
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table className="hesabfaMainTable">
              <tbody>
                <tr>
                  <th>#</th>
                  <th>شرح</th>
                  <th>شناسه</th>
                  <th>تعداد</th>
                  <th>مبلغ واحد<br/>(ریال)</th>
                  <th>مبلغ<br/>(ریال)</th>
                  <th>تخفیف<br/>(ریال)</th>
                  <th>مبلغ کل<br/>(ریال)</th>
                </tr>
                {orderInfo&&orderInfo.faktorItems.map((items,i)=>(
                <tr key={i}>
                  <td className="centerCell">{i+1}</td>
                  <td>{items.title}</td>
                  <td>{items.sku}</td>
                  <td className="centerCell">{items.count}</td>
                  <td>{normalPrice(items.price)}</td>
                  <td>{normalPriceCount(items.price,items.count)}</td>
                  <td>{normalPrice(items.Discount)}</td>
                  <td>{normalPrice(items.TotalAmount)}</td>
                </tr>))}
              </tbody>
            </table>
            <div className="hesabfaFooter">
              <div className="footerRows">
                  <div className="hesabfaRight">
                    <strong>شرایط و نحوه فروش:   نقدی    غیرنقدی</strong>
                    <span>مانده حساب فاکتور: {normalPrice(userInfo.Liability-userInfo.Credits)} ریال 
                      {(userInfo.Liability-userInfo.Credits>0)?" بدهکار ":" بستانکار "} </span>
                  </div>
                  <div className="hesabfaPrice">
                    <div className="priceSeprate">
                      <span>مجموع:</span>
                      <span>{normalPrice("totalPrice.sum") } ریال</span>
                    </div>
                    <div className="priceSeprate">
                    <span>تخفیف: </span>
                    <span>{1?
                      normalPrice("totalPrice.discount")+" ریال ":"-"}</span>
                    </div>
                    <h3>مبلغ کل: {normalPrice(orderInfo.totalPrice)} ریال</h3>
                    <strong> </strong>
                  </div>
                </div>
            </div>
            {/*<button className="printBtn" onClick={()=>printNow()}>چاپ</button>*/}
            <div className="footerHesabfa">
              <span style={{textAlign:"center",display:"block"}}>امضا</span>
              <span style={{textAlign:"center",display:"block"}}>
                  نام کاربر: {token&&token.userId.slice(-3)}<br/> ساعت: 
                  {new Date(Date.now()).getHours()+":"+new Date(Date.now()).getMinutes()}
              </span>
              <button className="printBtn" onClick={()=>window.location.href="/hesabfishprint/"+"rxOrderNo"}>فیش پرینت</button>
            </div>
        </div>
    )

  }

export default PrintHesabfa