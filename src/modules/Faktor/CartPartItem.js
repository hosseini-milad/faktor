import { normalPrice, normalPriceCount } from "../../env"
import FaktorReturn from "./FaktorReturn"

function CartPartItem(props){
    const faktor = props.faktor
    return(
        <tr style={{backgroundColor:"#EEEFFC"}}>
            <td>{props.number}</td>
            <td className="tdHolder">
                <strong>{faktor.title}</strong>
                <small>{faktor.sku}</small></td>
            <td style={{textAlign:"center"}}>{/*<div className="form-fiin form-field-fiin" style={{marginBottom: "0"}}>
                <input type="text" name="count" id="count" 
                    onChange={(e)=>setCount(faktor.id,e.target.value)}
                    className="formInputSimple"
                    value={faktor.count||''}
            placeholder="تعداد"/>
                </div>*/}{faktor.count}</td>
            <td style={{textAlign:"center"}}>{normalPrice(faktor.price)}</td>
            <td>{faktor.description}</td>
            <td>{<FaktorReturn itemId={faktor} setFaktorList={props.setFaktorList}
                user={props.user} token={props.token}/>}</td>
        </tr>
    )
}
export default CartPartItem