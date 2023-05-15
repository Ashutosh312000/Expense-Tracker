const downloadbtn=document.getElementById('downloadbtn')
const tbody=document.getElementById('tbody');
const linkdiv=document.getElementById('link');
var count=1;

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

window.addEventListener("DOMContentLoaded", () => { 
    const token=localStorage.getItem('token');
     const decodeToken=parseJwt(token)
     if(decodeToken.ispremiumuser==true){
        downloadbtn.style.display='flex';
     }
    axios.get('http://localhost:3000/expense/getexpense',{headers:{"Authorization" : token}})
        .then((response) => {
            for (var i = 0; i < response.data.length; i++) {
                let myobj = response.data[i];
                makerow(myobj)
            }
        })
        .catch((err) => {
            console.log(err)
        })
    axios.get('http://localhost:3000/files/downloadfiles',{headers:{"Authorization" : token}})
        .then((response) => {
            for (var i = 0; i < response.data.files.length; i++) {
                
                let myobj = response.data.files[i];
                makelink(myobj);
            }
        })
        .catch((err) => {
            console.log(err)
        })
})

function makelink(myobj) {
    const a=document.createElement('a')
    const br=document.createElement('br')
    a.setAttribute('href', `${myobj.Link}`);
    a.style.color='black'
    a.innerText=` Report :Downloaded On ${myobj.createdAt}`;
    linkdiv.appendChild(a);
    linkdiv.appendChild(br);
    
}
function makerow(myobj) {
    var tr = document.createElement('tr');
    var th = document.createElement('th');
    th.setAttribute('scope', 'row');
    th.innerText=`${count}`;
    count++;
    tr.appendChild(th);

    var Description = document.createElement('td');
    Description.innerText=`${myobj.Description}`
    tr.appendChild(Description);
    var Catogary = document.createElement('td');
    Catogary.innerText=`${myobj.Catogary}`
    tr.appendChild(Catogary);
    var Amount = document.createElement('td');
    Amount.innerText=`${myobj.Amount}`
    tr.appendChild(Amount);
    
    tbody.appendChild(tr);
}

downloadbtn.onclick= async function(e){  
    try{
        const token=localStorage.getItem('token');                     

    const response=await axios.get('http://localhost:3000/expense/download', {headers:{"Authorization" : token}});
        
    var a=document.createElement('a');
    a.href=response.data.fileURL;
    a.download='myexpense.csv';
    a.click();
    }
    catch{
        throw new Error(response.data.message)
    }
    
   
}
