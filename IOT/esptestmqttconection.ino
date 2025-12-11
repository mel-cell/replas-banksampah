#include <WiFi.h>
#include <PubSubClient.h>

// WiFi credentials
const char* WIFI_SSID = "Kunci Meja";
const char* WIFI_PASSWORD = "Melvino07";

// MQTT credentials
const char* MQTT_BROKER = "103.144.209.103";
const int MQTT_PORT = 1883;
const char* MQTT_USERNAME = "replas_device";
const char* MQTT_PASSWORD = "replas_secure_2024";
const char* MACHINE_CODE = "banksampah01";

// MQTT topics
const char* STATUS_TOPIC = "machines/banksampah01/status/online";

// WiFi and MQTT clients
WiFiClient espClient;
PubSubClient client(espClient);

// Function to connect to WiFi
void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(WIFI_SSID);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

// Function to connect to MQTT
void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);

    if (client.connect(clientId.c_str(), MQTT_USERNAME, MQTT_PASSWORD)) {
      Serial.println("connected");
      // Publish online status
      client.publish(STATUS_TOPIC, "online");
      Serial.println("Published online status");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(MQTT_BROKER, MQTT_PORT);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Publish a test message every 10 seconds
  static unsigned long lastMsg = 0;
  unsigned long now = millis();
  if (now - lastMsg > 10000) {
    lastMsg = now;
    String testMsg = "Test connection from " + String(MACHINE_CODE) + " at " + String(now);
    client.publish("machines/banksampah01/test", testMsg.c_str());
    Serial.println("Published test message: " + testMsg);
  }
}
