const Breadcrumb = (props)=>{
    return(
        <div className="breadcrumb">
            <a href="#">خانه</a>
            /
            <span>{props.title}</span>
        </div>
    )
}
export default Breadcrumb