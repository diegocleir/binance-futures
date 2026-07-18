import axios from "axios";
import crypto from "crypto";

const apiKey = process.env.API_KEY;
const apiSecret = process.env.SECRET_KEY;
const apiUrl = process.env.API_URL;

if (!apiKey || !apiSecret || !apiUrl)
  throw new Error("API_KEY, API_SECRET, and API_URL must be set in the environment variables.");

async function newOrder( symbol, quantity, side = "BUY", type = "MARKET", price = null) {
  const data = { symbol, side, type, quantity };

  const timestamp = Date.now();
  const recvWindow = 60000;
  
  const signature = crypto
    .createHmac("sha256", apiSecret)
    .update(new URLSearchParams({ ...data, timestamp, recvWindow }).toString())
    .digest("hex");

  const queryString = new URLSearchParams({ ...data, timestamp, recvWindow, signature }).toString();

  return axios.post(`${apiUrl}/v1/order?${queryString}`, null, {
      headers: {
          "X-MBX-APIKEY": apiKey,
      },
  });
}

export default {
  newOrder
}