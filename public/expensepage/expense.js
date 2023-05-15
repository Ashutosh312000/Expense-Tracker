var form = document.getElementById('form')
const premiumbtn=document.getElementById('premiumbtn')
const showleaderboardbtn=document.getElementById('showleaderboardbtn')
var section = document.getElementById('section');
const leaderboard=document.getElementById('leaderboard');
const daytodayexpensesbtn=document.getElementById('daytodayexpenses')

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

window.addEventListener("DOMContentLoaded", async () => {
    const token=localStorage.getItem('token');
    let PER_PAGE=5;
   if( localStorage.getItem('per_page')!=undefined){
     PER_PAGE=localStorage.getItem('per_page');
   }
     const decodeToken=parseJwt(token)
     if(decodeToken.ispremiumuser==true){
        premiumbtn.innerText='You Are A Premium User'
        premiumbtn.disabled=true;
        showleaderboardbtn.style.display='flex';
        daytodayexpensesbtn.style.display='flex';
     }

      const response1= await  axios.get(`http://localhost:3000/expense/getIndex?per_page=${PER_PAGE}`,{headers:{"Authorization" : token}})
            goto(response1);
            console.log(response1)

       
})

goto = (response) => {
    let data = response.data;
    
    const storeSection = document.createElement('div');
    storeSection.id = "storeSection";
    section.appendChild(storeSection);

    const pagination = document.createElement('div');
    pagination.id = "pagination";
    section.appendChild(pagination);

    const label=document.createElement('label')
    label.id = "label";
    label.innerText='Choose Rows';
    label.setAttribute('for','rows')
    storeSection.appendChild(label);

    const select=document.createElement('select')
    select.id = "select";
    select.setAttribute('name','per_page1')
    storeSection.appendChild(select);
 
    
        
        const option=document.createElement('option')
    option.className = "option";
    option.innerText='10';
    option.setAttribute('value','10')
    option.setAttribute('selected','false')
    select.appendChild(option)

        const option1=document.createElement('option')
    option1.className = "option";
    option1.innerText='25';
    option1.setAttribute('value','25')
    option1.setAttribute('selected','false')
    select.appendChild(option1)

        const option2=document.createElement('option')
        option2.className = "option";
        option2.innerText='50';
        option2.setAttribute('selected','false')
        option2.setAttribute('value','50')
        select.appendChild(option2)

        const option3=document.createElement('option')
        option3.className = "option";
        option3.innerText='100';
        option3.setAttribute('selected','false')
        option3.setAttribute('value','100')
        select.appendChild(option3)
    
        select.addEventListener('change',()=>{
            const value=document.getElementById('select').value;
            localStorage.setItem('per_page',`${value}`);
            gotopage(data.currentPage)
        });
        
    



    let myarr = response.data.expenses;
    for (let i = 0; i < myarr.length; i++) {
      makeuser(myarr[i]);
    }





    if (data.hasPreviosPage) {
        const previosBtn = document.createElement('button');
        previosBtn.className = "pageBtn";
        previosBtn.textContent = `${data.previosPage}`;
        pagination.appendChild(previosBtn);
        previosBtn.addEventListener('click', () => {
            gotopage(data.previosPage);
        });
    }


    const presentBtn = document.createElement('button');
    presentBtn.className = "pageBtn";
    presentBtn.id = "presentBtn"
    presentBtn.textContent = `${data.currentPage}`;
    presentBtn.setAttribute('type', 'active');
    pagination.appendChild(presentBtn);





    if (data.hasNextPage) {
        const nextBtn = document.createElement('button');
        nextBtn.className = "pageBtn";
        nextBtn.textContent = `${data.nextPage}`;
        pagination.appendChild(nextBtn);
        nextBtn.addEventListener('click', () => {
            gotopage(data.nextPage);
        });
    }

    if (data.hasNextPage && data.currentPage < data.lastPage - 1) {
        const lastBtn = document.createElement('button');
        lastBtn.className = "pageBtn";
        lastBtn.textContent = `...${data.lastPage}`;
        pagination.appendChild(lastBtn);
        lastBtn.addEventListener('click', () => {
            gotopage(data.lastPage);
        });

    }


    gotopage = (pagenumber) => {
        const token=localStorage.getItem('token');
        const PER_PAGE=localStorage.getItem('per_page');
        axios.get(`http://localhost:3000/expense/getIndex?page=${pagenumber}&per_page=${PER_PAGE}`,{headers:{"Authorization" : token}})
            .then((response) => {
                storeSection.remove();
                pagination.remove();
                goto(response)
            })

    }

}


async function expensesubmit(e) {
    try{
        e.preventDefault();
        const token=localStorage.getItem('token'); 
        let expensedetails = {
            Amount: e.target.amount.value,
            Description: e.target.description.value,
            Catogary: e.target.catogary.value,
        }
        await axios.post("http://localhost:3000/expense/postexpense", {expensedetails},{headers:{"Authorization" : token}})
            .then((response) => {
                let myobj1 = response.data.expense;
                makeuser(myobj1);
            })
            .catch((err) => {
                console.log(err);
                document.section.innerHTML = document.section.innerHTML + "<h4>SOMETHING WENT WRONG</h4>"
            })
    }
    catch(err){
        var message=err.response.data.message;
        console.log(message)
    }
   
}

function makeuser(myobj) {
    var details = document.createElement('ul');
    details.setAttribute('type', 'none');
    details.setAttribute('class', 'newli')
    storeSection.appendChild(details);
    const parentnode = details;
    const childHTML = `<li>${myobj.Amount}    ${myobj.Description}    ${myobj.Catogary}    <button  class="stylenewli" onclick=deleteuser(event,'${myobj.id}')>Delete expense</button></li>`;
    parentnode.innerHTML = parentnode.innerHTML + childHTML;
}

deleteuser = function (e,key) {
    e.target.parentElement.parentElement.remove();
    const token=localStorage.getItem('token'); 
    axios.delete(`http://localhost:3000/expense/deleteAddExpense/${key}`,{headers:{"Authorization" : token}})
        .then((response) => {
            
        })
        .catch((err) => { console.log(err) })
}


premiumbtn.onclick= async function(e){   

    const token=localStorage.getItem('token');                     

    const response=await axios.get('http://localhost:3000/purchase/premiummembership', {headers:{"Authorization" : token}});
    var options= 
    {
        "key":response.data.key_id, 
        "order_id":response.data.order.id,

        "handler": async function(response){
          const response1=  await axios.post('http://localhost:3000/purchase/updatetransactionstatus',{ 
                order_id:options.order_id,
                payment_id:response.razorpay_payment_id, 
            },{headers : {"Authorization" :token}})  

            localStorage.setItem('token',`${response1.data.token}`) 
            alert('You are a Premium User Now')
            premiumbtn.innerText='You Are A Premium User';
            premiumbtn.disabled=true;
            showleaderboardbtn.style.display='flex';
            daytodayexpensesbtn.style.display='flex';

        }

    };
    const rzp1=new Razorpay(options);
    rzp1.open();

    rzp1.on('payment.failed',async function(response){ 
        await axios.post('http://localhost:3000/purchase/updatetransactionstatusfailed',{ 
            order_id:options.order_id,
            payment_id:response.razorpay_payment_id, 
        },{headers : {"Authorization" :token}})  

        alert('Something Went Wrong')
    });

}

showleaderboardbtn.onclick= async function(e){  
    if(showleaderboardbtn.value=='off'){
        leaderboard.innerHTML="";
        const token=localStorage.getItem('token');                     

        const response=await axios.get('http://localhost:3000/premium/showleaderboard', {headers:{"Authorization" : token}});
    
        response.data.forEach(element => {
            const leaderboard_ul=document.createElement('ul');
            leaderboard_ul.id='leaderboard_ul';
            leaderboard.appendChild(leaderboard_ul)
            const leaderboard_li=document.createElement('li');
            leaderboard_li.className='leaderboard_li';
            leaderboard_li.textContent=`Name: ${element.name} And Total Expense: ${element.total_expense}`;
            leaderboard_ul.appendChild(leaderboard_li);
    
        });
            leaderboard.style.display='flex';
            showleaderboardbtn.value='on';
    }
    else{
        leaderboard.style.display='none';
        showleaderboardbtn.value='off';
        document.getElementById('leaderboard_ul').remove();
    }
   
}


