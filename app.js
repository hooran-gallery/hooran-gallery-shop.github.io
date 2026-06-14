// اتصال به سرور
const socket = io("http://localhost:3000");

// رمز مدیریت
const ADMIN_PASSWORD = "132465";

// محصولات
async function loadProducts(){

    const res = await fetch(
        "http://localhost:3000/api/products"
    );

    const products = await res.json();

    let html = "";

    products.forEach(product => {

        html += `
        <div class="card">

            <img src="${product.image}">

            <h3>${product.name}</h3>

            <p class="price">
                ${product.price} تومان
            </p>

            <div class="card-buttons">

                <a
                  class="btn"
                  href="tel:09193753356">
                  تماس
                </a>

                <a
                  class="btn btn-gold"
                  href="sms:09193753356?body=سلام، محصول ${product.name} را میخواهم">
                  پیامک سفارش
                </a>

            </div>

        </div>
        `;
    });

    document.getElementById("products")
        .innerHTML = html;
}

// افزودن محصول
async function addProduct(){

    const name =
      document.getElementById("productName").value;

    const price =
      document.getElementById("productPrice").value;

    const image =
      document.getElementById("productImage").value;

    await fetch(
      "http://localhost:3000/api/products",
      {
        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify({
          name,
          price,
          image
        })
      }
    );

    loadProducts();

    alert("محصول ثبت شد");
}

// پنل مدیریت مخفی
document.getElementById("secretBtn")
.addEventListener("click",()=>{

    const pass =
      prompt("رمز مدیریت");

    if(pass === ADMIN_PASSWORD){

        document
        .getElementById("adminPanel")
        .style.display="block";

    }else{

        alert("رمز اشتباه است");

    }

});

function closeAdmin(){

    document
    .getElementById("adminPanel")
    .style.display="none";

}

// ارسال پیام
function sendMessage(){

    const input =
      document.getElementById("msg");

    if(!input.value) return;

    socket.emit(
      "chat-message",
      {
        sender:"خریدار",
        text:input.value
      }
    );

    input.value="";
}

// دریافت پیام
socket.on(
  "chat-message",
  data => {

    document
      .getElementById("messages")
      .innerHTML +=
      `
      <div class="message">
        <b>${data.sender}</b><br>
        ${data.text}
      </div>
      `;

  }
);

// بارگذاری اولیه
loadProducts();