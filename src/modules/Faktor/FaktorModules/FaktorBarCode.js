  import { useState } from "react";
  import BarcodeScannerComponent from "react-webcam-barcode-scanner";
  import env from "../../../env";
  function BarCodeFaktor(props){
      const [barCode,setBarCode] = useState('Searching')
      const findProduct=(sku)=>{
        const postOptions={
          method:'post',
          headers: { 'Content-Type': 'application/json'},
          body:JSON.stringify({search:sku})
        }
        fetch(env.siteApi + "/product/find-products",postOptions)
      .then(res => res.json())
      .then(
          (result) => {
            console.log(result)
              if(result.error){
                  setBarCode(result.error)
                  setTimeout(()=>setBarCode(''),3000)
              }
              else{
                if(result.products.length){
                  setBarCode("کالا پیدا شد")
                  setTimeout(()=>setBarCode(''),1000)
                  result.products[0].newTitle=result.products[0].title+" | "+
                  result.products[0].sku+" ("+result.products[0].count.quantity+")"
                  props.setItem(result.products[0])
                  props.setBarCodeMode(0);
                }
                else{
                  setBarCode(`کد ${sku} در سیستم موجود نیست`)
                  setTimeout(()=>setBarCode(''),2000)
                }
              }
          },
          (error) => {
              console.log(error)
          })
      }
      return(<div className="barCodeHolder">
          <p>{barCode}</p>
          <b className="closeBarCode" onClick={()=>props.setBarCodeMode(0)}>×</b>
          <BarcodeScannerComponent
          width="100%"
          height="100%"
          onUpdate={(err, result) => {
            if (result){
              findProduct(result.text)
            }
            
          }}
        />
        </div>
      )
  }
  export default BarCodeFaktor