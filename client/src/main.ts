import "./style.css";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");
const button = document.getElementById("click-box") as HTMLButtonElement;
const textBox = document.getElementById("text") as HTMLParagraphElement;

const streaming = async () => {
  socket.emit("msg:send", "", (data: { jobId?: string }) => {
    console.log(data);
    button.disabled = true;
    textBox.innerHTML = "";
  });
};

socket.on("connect", () => {
  console.log("Successfully connected to the server!");
  console.log("Socket ID:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log(`Disconnected from the server. Reason: ${reason}`);
});

socket.on("connect_error", (error) => {
  console.error("Connection failed:", error.message);
});

socket.on("msg:stream", (chunk: string) => {
  textBox.innerHTML += chunk.replaceAll("\n", "<br>");
});

socket.on("msg:end", () => {
  console.log("END");
  button.disabled = false;
});

button.addEventListener("click", streaming);
