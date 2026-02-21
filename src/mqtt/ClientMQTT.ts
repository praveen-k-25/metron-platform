import mqtt from "mqtt";
import toast from "react-hot-toast";
import { store } from "@/store/store";
import { calculateBearing } from "./haversineDistance";
import { MQTT_PASSWORD, MQTT_USERNAME, WS_URL } from "@/config/env";
import { upsertVehicle } from "@/modules/dashboard/dashboard.slice";

let locationInterval: any = null;
let previousLocation: any = null;
let client: mqtt.MqttClient | null = null;

export default function userTracker(LoggedInUser: any) {
  const ua = navigator.userAgent;
  let limit = 0;
  let isOnline = false; // 🔹 Track connection state

  client = mqtt.connect(WS_URL, {
    clientId: `react_frontend_${Math.random().toString(16).slice(3)}`,
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    clean: true,
    reconnectPeriod: 5000, // auto reconnect every 5s
  });

  if (!client) return;

  client.on("connect", () => {
    isOnline = true;
    LoggedInUser?.vehicles?.map((user: any) => {
      // Subscribe to vehicles

      client?.subscribe(`user/processed/${user.id}`, (err) => {
        if (err) console.error("Subscription error:", err);
      });
    });
  });

  client.on("reconnect", () => {
    isOnline = false;
  });

  client.on("offline", () => {
    isOnline = false;
    toast.error("⚠️ Server offline - network issue detected");
  });

  client.on("error", (err) => console.error("❌ MQTT Error:", err));

  client.on("message", (topic, message) => {
    if (!topic) return;
    let deg = 0;
    let data = JSON.parse(message.toString());
    const revisedData = {
      status: data.status,
      speed: data.speed,
      lat: data.lat,
      lng: data.lng,
      timestamp: data.timestamp,
      user: data.user,
      deg: 0,
    };
    if (!previousLocation) {
      previousLocation = data;
    }
    deg = calculateBearing(
      revisedData.lat,
      revisedData.lng,
      previousLocation.lat,
      previousLocation.lng,
    );
    revisedData.deg = deg;
    store.dispatch(upsertVehicle(revisedData));
  });

  // 🔁 Periodic location publishing
  if (ua.includes("Mobile") && LoggedInUser.id !== "699045977f33120fdb55dabe") {
    if (locationInterval) clearInterval(locationInterval);

    locationInterval = setInterval(() => {
      if (!isOnline) return; // 🚫 Skip if not connected or reconnecting

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const payload = {
            user: LoggedInUser.id,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            speed: pos.coords.speed || -1,
          };

          if (Date.now() - limit > 2500) {
            limit = Date.now();
            client?.publish(
              `user/location/${payload.user}`,
              JSON.stringify(payload),
            );
            /* toast.success("📡 Location Sent", {
              position: "bottom-right",
            }); */
          }
        },
        () => toast.error("Please turn on location services"),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    }, 2000);
  }

  // Cleanup on unmount
  return () => {
    client?.end(true);
  };
}

export function cleanupMqtt() {
  if (locationInterval) {
    clearInterval(locationInterval);
    locationInterval = null;
  }

  if (client) {
    client.end(true);
  }
}
