import "./style.css";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const streaming = async () => {
  socket.emit("msg:send", "", (data: { jobId?: string }) => {
    console.log(data);
    document.getElementById("text")!.innerHTML = "";
  });
};

socket.on("msg:stream", (chunk: string) => {
  document.getElementById("text")!.append(chunk);
});

socket.on("msg:end", () => {
  console.log("END");
});

document.getElementById("click-box")?.addEventListener("click", streaming);
