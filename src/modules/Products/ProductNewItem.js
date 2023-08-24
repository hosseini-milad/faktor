import { useEffect, useState } from "react"
import Breadcrumb from "../../components/BreadCrumb"
import ListFilters from "../ListFilters"
import env from "../../env"
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const ProductNewItem = (props)=>{
    
    const [filter,setFilter] = useState()
    const [error,setError] = useState({message:'',color:"brown"})
    const [doFilter,setDoFilter] = useState(1)
    const [pageNumber,setPageNumber] = useState(0)
    
    const token=cookies.get('faktor-login')
    useEffect(()=>{
        
    },[])
    
    return(
        <tr>
            <td>{"user.cName"}</td>
            <td>
                <div class="form-fiin">
                    <input type="text" name="Code" id="Code" 
                        placeholder="Code"
                        onChange={(e)=>props.setNewItem(data => ({
                            ...data,
                            ...{sku:e.target.value}
                          }))
                        }/>
                </div></td>
            <td><div class="form-fiin">
                    <input type="text" name="Title" id="Title" 
                        placeholder="Title"
                        onChange={(e)=>props.setNewItem(data => ({
                            ...data,
                            ...{title:e.target.value}
                          }))
                        }/>
                </div></td>
            <td>{"user.email"}</td>
            <td><a onClick={props.saveFunction}>Save</a></td>
        </tr>
    )
}
export default ProductNewItem