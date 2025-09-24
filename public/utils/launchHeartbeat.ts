import { PublicHeartbeat } from "./PublicHeartbeat.js";


declare global {
  interface Window {
    heartbeat?: PublicHeartbeat;
  }
}
export {};


window.heartbeat ??= new PublicHeartbeat({debug: false});
window.heartbeat.start();