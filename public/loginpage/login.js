

const submitbtn=document.getElementById('submitbtn');
const form=document.getElementById('form');

document.addEventListener('submitbtn', (e) => {
    e.preventDefault();
});

const loginmessage=(message)=>{
    var loginMessage=document.createElement('div');
        loginMessage.className='loginmessage';
        loginMessage.textContent=`${message}`;
        form.insertBefore(loginMessage,submitbtn)

        setTimeout(() => {
            loginMessage.remove();
        }, 2000);
}

async function  login(e){
    try{
     e.preventDefault();
    const email=e.target.email.value;
    const password=e.target.password.value;
    
    let logindetails={
        email:email,
        password:password
    }

     axios.post('http://localhost:3000/user/login',{logindetails})
    .then((response)=>{
        localStorage.setItem('token',`${response.data.token}`) 
        alert(`${response.data.message}`);
        localStorage.setItem('per_page','5')   
        window.location.href="../expensepage/expense.html" 
    })
    .catch(err=>{
        loginmessage(err.response.data.message);
    });

    }
    catch(err){
        console.log(err);
    }
    
}