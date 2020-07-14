/* This demostrates a udp data emitter
  Data emitted looks like:

  {"id":1,"name":"yomo!","test":{"tag":["5G","ioT"]}}
  {"id":2,"name":"yomo!","test":{"tag":["5G","ioT"]}}
  ...
  {"id":n,"name":"yomo!","test":{"tag":["5G","ioT"]}}
*/
import { parse } from "https://deno.land/std/flags/mod.ts";

const args = parse(Deno.args);
const port = args["p"] || 9999;
const hostname = args["h"] || "127.0.0.1";
console.log("[YoMo DevTools] Data Emitter v0.1 will emit data to= ", hostname, ":", port);

const listener = Deno.listenDatagram({ port: 19999, transport: "udp" });
const encoder = new TextEncoder();

let i = 0;

setInterval(
    () => {
        const k = i++;
        let data = `{"id":${k},"name":"yomo!","test":{"tag":["5G","ioT"]}}`;
        const buf = encoder.encode(data);
        listener.send(buf, { hostname, port, transport: "udp" });
    },
    1000,
    i,
);

for await (const _ of Deno.signal(Deno.Signal.SIGUSR2)) {
    console.log(`31-SIGUSR Received, counter = ${i}`);
}
