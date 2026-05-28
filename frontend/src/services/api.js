const BASE_URl = "http://localhost:5000/api"

const request = async (endpoint,method="GET",body = null)=>{
    const token = localStorage.getItem("token")
    const options = {
        method,
        headers :{
            "Content-Type" : "application/json"
        }
    }
    if(token)
        options.headers.Authorization = `Bearer ${token}`
    if(body)
        options.body = JSON.stringify(body)
    try{
        const response = await fetch(`${BASE_URl}${endpoint}`,options)
        const data = await response.json()
        if(!response.ok)
            throw new Error(data.message || "Something went wrong")
        return data;
    }catch(err){
        throw err;
    }
}
export default request;