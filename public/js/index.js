var download = document.getElementById("download");

var file = document.getElementById("file");

const fileSelect = document.getElementById("fileSelect")

fileSelect.addEventListener("click", function (e) {
  if (file) {
    file.click();
  }
}, false);

if(localStorage.getItem("number")){
    var number = Number(localStorage.getItem("number"));
    document.getElementById("number").innerHTML = ""+number;
}else{
    var number = 0;
    localStorage.setItem("number","0");
}

file.addEventListener('change', event => {
    handleWordUpload(event)
})
              

const handleWordUpload = event => {

    download.classList.remove("none","green");
    download.classList.add("gray");
    document.getElementById("mail").classList.add("none");
    
    if(!file.value.includes(".docx")){
        download.classList.add("none");
        file.value = ""
        alert("Nije unijet word file")
        return
    }

    const files = event.target.files
    console.log(files[0].name)
    var data = new FormData()
    data.append("myFile",files[0])
    
    fetch('/saveWord', {
    method: 'POST',
    body: data,
    })
    .then((res)=> res.json())
    .then(data => {
        console.log('Success:', data);
        localStorage.setItem("number", ++number);
        document.getElementById("number").innerHTML = ""+ number;

        document.getElementById("mail").classList.remove("none");
        download.classList.remove("gray");
        download.classList.add("green");

        download.addEventListener("click",()=>{
            window.open(data.url,"_blank")
        })
        return data
    })
    .then((data)=>{
        const sendMail = document.getElementById("send")
        sendMail.addEventListener("click",async(e)=>{
            var mail = document.getElementById("email").value

            setTimeout(()=>{
                postData(`/sendMail`, {"myMail": mail,"myFile":data.fileName})

                function postData(url = ``, data = {}) {
                    return fetch(url, {
                        method: "POST",
                        mode: "cors",
                        cache: "no-cache", 
                        credentials: "same-origin",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        redirect: "follow",
                        referrer: "no-referrer",
                        body: JSON.stringify(data)
                    })
                    .then(response => response.text())
                    .then(data => {
                        console.log(data),
                        alert("SUCCESS")
                    })
                    .catch(error => console.error(error))
                }
            },0)
            


        },{once:true})
    })
    .catch((error) => {
        console.error('Error:', error);
    });
        // setTimeout(()=>{
        //     download.classList.remove("gray");
        //     download.classList.add("green");
        //     localStorage.setItem("number", ++number);
        //     document.getElementById("number").innerHTML = ""+number;
        //     download.setAttribute("href",`${file.value.split("\\")[2].split(".")[0]}.pdf`)
        // },3500)
    
}
    

// document.getElementById("submit").addEventListener("click",(e)=>{
   
//     var mail = document.getElementById("email").value
//     var data2 = new FormData()
//     data2.append("myMail",mail)
//     data2.append("myFIle",file.files[0].name.split(".")[0]+".pdf")

//     fetch('/sendMail', {
//         method: 'POST',
//         body: data,
//         })
//     .then(response => response.text())
//     .then(data => {
//         console.log('Success:', data);
//         return data
//     })
// })
       


