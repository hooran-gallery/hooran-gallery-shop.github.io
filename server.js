const express = require("express");
const cors = require("cors");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
  cors:{origin:"*"}
});

app.use(cors());
app.use(express.json());

function readProducts(){
  return JSON.parse(
    fs.readFileSync("products.json")
  );
}

function saveProducts(data){
  fs.writeFileSync(
    "products.json",
    JSON.stringify(data,null,2)
  );
}

app.get("/api/products",(req,res)=>{
  res.json(readProducts());
});

app.post("/api/products",(req,res)=>{

  const products = readProducts();

  products.push(req.body);

  saveProducts(products);

  res.json({ok:true});

});

io.on("connection",(socket)=>{

  socket.on("chat-message",(msg)=>{

    let messages = JSON.parse(
      fs.readFileSync("messages.json")
    );

    messages.push(msg);

    fs.writeFileSync(
      "messages.json",
      JSON.stringify(messages,null,2)
    );

    io.emit(
      "chat-message",
      msg
    );

  });

});

server.listen(3000,()=>{
 console.log("Server Running");
});