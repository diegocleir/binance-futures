//console.log("Hello World");

import WebSocket from "ws";
import api from "./api.js";

const ws = new WebSocket(`${process.env.STREAM_URL}/btcusdt@ticker`);

let isOpened = false;

ws.onmessage = async (event) => {
  const obj = JSON.parse(event.data);

  const price = parseFloat(obj.c);

  console.clear();
  console.log(`Symbol: ${obj.s}`);
  console.log(`Price: $${obj.c}`);
  console.log(`Is Opened? ${isOpened}`);
  
  try {
    if (price < 100000 && !isOpened) {
      console.log("Abre posição!");
      const response = await api.newOrder("BTCUSDT", "0.001", "BUY", "MARKET");
      console.log(response.data);
      isOpened = true;
      process.exit(0);
    } else if (price > 110000 && isOpened) {
      console.log("Fecha posição!");
      const response = await api.newOrder("BTCUSDT", "0.001", "SELL", "MARKET");
      console.log(response.data);
      isOpened = false;
      process.exit(0);
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};