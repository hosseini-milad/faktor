import { normalPrice, normalPriceCount } from "../env"

function SumTable(props){
    return(
        <table className="resultTable">
            <tbody>
                <tr>
                    <td>جمع سفارش: </td>
                    <td><small>{normalPrice(props.totalPrice)} ریال</small></td>
                </tr>
                <tr>
                    <td>مالیات: </td>
                    <td><small>{normalPriceCount (props.totalPrice,"0.09")} ریال</small></td>
                </tr>
                <tr>
                    <td>سفارش با مالیات: </td>
                    <td><b>{normalPriceCount(props.totalPrice,"1.09")} ریال</b></td>
                </tr>
            </tbody>
        </table>
    )
}
export default SumTable