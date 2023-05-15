
async function  signup(e){
    try{
     e.preventDefault();
    const name=e.target.name.value;
    const email=e.target.email.value;
    const password=e.target.password.value;
    
    let userdetails={
        name:name,
        email:email,
        password:password
    }

    axios.post('http://localhost:3000/user/signup',{userdetails})
    .then((response)=>{
        alert(`${response.data.message}`);
    })
    .catch(err=>console.log(err));

    }
    catch(err){
        console.log(err);
    }
    
}