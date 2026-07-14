import client from "../../utils/radis.connection.js";
import gateWayConfiString from "./gateway.config.js";
import serverConfigString from "./server.config.js";

await client.set('gateway-config' , gateWayConfiString) ; 
await client.set('server-config' , serverConfigString) ; 

let data = await client.get("gateway-config") ; 
const parseGatewayData = JSON.parse(data) ; 

data = await client.get('server-config') ; 

const pasre = JSON.parse(data) ; 

console.log(parseGatewayData) ; 
console.log(pasre) ;  