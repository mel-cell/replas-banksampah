#include <Arduino.h>
#include <ESP32Servo.h>
#include <WiFi.h>
#include <PubSubClient.h>

// Hardware pins
#define SERVO_PIN 23      // Servo MG996R
#define SENSOR_PIN 2      // Sensor di D2
#define BUZZER_PIN 13     // Buzzer di D13

// WiFi credentials
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// MQTT settings
const char* MQTT_BROKER = "103.144.209.103";
const int MQTT_PORT = 1883;
const char* MQTT_USERNAME = "replas_device";
const char* MQTT_PASSWORD = "replas_secure_2024";

// Machine configuration
const char* MACHINE_CODE = "banksampah01";

// MQTT topics
String TOPIC_START = "machines/" + String(MACHINE_CODE) + "/start";
String TOPIC_END = "machines/" + String(MACHINE_CODE) + "/end";
String TOPIC_BOTTLE_DETECTED = "machines/" + String(MACHINE_CODE) + "/bottle_detected";
String TOPIC_TIMEOUT = "machines/" + String(MACHINE_CODE) + "/timeout";
String TOPIC_STATUS_ONLINE = "machines/" + String(MACHINE_CODE) + "/status/online";

WiFiClient espClient;
PubSubClient mqttClient(espClient);
Servo myServo;

bool isMoving = false;          // Flag: motor sedang bergerak
bool sensorTriggered = false;   // Flag: sensor sudah trigger
bool sessionActive = false;     // Flag: sesi aktif dari server
int triggerCount = 0;
unsigned long lastActivityTime = 0; // Timestamp aktivitas terakhir
const unsigned long INACTIVITY_TIMEOUT = 10000; // 10 detik timeout

// WiFi connection function
void connectWiFi() {
  Serial.println("Connecting to WiFi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nWiFi connection failed!");
  }
}

// MQTT connection function
void connectMQTT() {
  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
  mqttClient.setCallback(mqttCallback);

  Serial.println("Connecting to MQTT...");
  // Set Last Will and Testament (LWT) - will publish "offline" to status topic if connection lost
  if (mqttClient.connect(MACHINE_CODE, MQTT_USERNAME, MQTT_PASSWORD,
                        TOPIC_STATUS_ONLINE.c_str(), 1, true, "offline")) {
    Serial.println("MQTT connected!");

    // Subscribe to command topics
    mqttClient.subscribe(TOPIC_START.c_str());
    mqttClient.subscribe(TOPIC_END.c_str());

    Serial.println("Subscribed to topics:");
    Serial.println(TOPIC_START);
    Serial.println(TOPIC_END);

    // Publish online status (this will override any LWT "offline" message)
    mqttClient.publish(TOPIC_STATUS_ONLINE.c_str(), "online", true);
    Serial.println("Published online status");
  } else {
    Serial.print("MQTT connection failed, rc=");
    Serial.println(mqttClient.state());
  }
}

// MQTT message callback
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  Serial.print("MQTT Message arrived [");
  Serial.print(topic);
  Serial.print("]: ");
  Serial.println(message);

  if (String(topic) == TOPIC_START) {
    // Start session command from server
    sessionActive = true;
    lastActivityTime = millis();
    triggerCount = 0;
    Serial.println("Session started by server command");
  } else if (String(topic) == TOPIC_END) {
    // End session command from server
    sessionActive = false;
    isMoving = false;
    sensorTriggered = false;
    Serial.println("Session ended by server command");
  }
}

void setup() {
  Serial.begin(115200);

  pinMode(SENSOR_PIN, INPUT_PULLUP);
  pinMode(BUZZER_PIN, OUTPUT);

  myServo.attach(SERVO_PIN, 500, 2500);
  myServo.write(0); // Posisi awal

  delay(1000);

  Serial.println("=========================================");
  Serial.println("REPLAS BANK SAMPah - ESP32 IoT");
  Serial.println("=========================================");
  Serial.println("Servo: GPIO 23");
  Serial.println("Sensor: GPIO 2");
  Serial.println("Buzzer: GPIO 13");
  Serial.println("=========================================");

  // Connect to WiFi
  connectWiFi();

  // Connect to MQTT
  connectMQTT();

  Serial.println("Siap menerima perintah dari server...\n");
}

void loop() {
  // Maintain MQTT connection
  if (!mqttClient.connected()) {
    connectMQTT();
  }
  mqttClient.loop();

  // Maintain WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
    connectMQTT();
  }

  // Check for inactivity timeout
  if (sessionActive && (millis() - lastActivityTime > INACTIVITY_TIMEOUT)) {
    Serial.println("Inactivity timeout detected - ending session");
    sessionActive = false;
    mqttClient.publish(TOPIC_TIMEOUT.c_str(), "timeout");
    lastActivityTime = millis(); // Reset to prevent repeated timeouts
  }

  int sensorValue = digitalRead(SENSOR_PIN);
  
  // Only process sensor if session is active
  if (sessionActive) {
    // Deteksi trigger sensor (hanya sekali per siklus)
    if (sensorValue == LOW && !isMoving && !sensorTriggered) {
      sensorTriggered = true;
      isMoving = true;
      triggerCount++;
      lastActivityTime = millis(); // Update activity time
      
      Serial.println("\n=== BOTOL TERDETEKSI ===");
      Serial.print("Botol ke-");
      Serial.println(triggerCount);
      
      // Publish bottle detection to MQTT
      String payload = "{\"timestamp\":\"" + String(millis()) + "\",\"bottleCount\":" + String(triggerCount) + "}";
      mqttClient.publish(TOPIC_BOTTLE_DETECTED.c_str(), payload.c_str());
      Serial.println("Published bottle detection to MQTT");
      
      Serial.println("Motor mulai bergerak...\n");
      
      // BUZZER PERTAMA: Saat deteksi awal
      Serial.println("🔊 Buzzer: BIP! (deteksi)");
      tone(BUZZER_PIN, 1000, 200); // 1000Hz, 200ms
      delay(250); // Tunggu buzzer selesai
    }
    
    // Eksekusi gerakan motor jika sudah trigger
    if (isMoving) {
      // Ke 90°
      Serial.println("→ Motor ke 90°");
      myServo.write(90);
      delay(2000); // Tunggu servo sampai posisi
      
      // Kembali ke 0°
      Serial.println("→ Motor kembali ke 0°");
      myServo.write(0);
      delay(500); // Tunggu servo sampai posisi
      
      Serial.println("✓ Motor kembali ke 0°");
      
      // BUZZER KEDUA: Saat servo kembali ke 0° (proses selesai)
      Serial.println("🔊 Buzzer: BIP! (selesai)");
      tone(BUZZER_PIN, 1500, 300); // 1500Hz, 300ms (nada lebih tinggi)
      
      Serial.println("\n=== PROSES BOTOL SELESAI ===");
      
      isMoving = false;
      sensorTriggered = false;
      
      // Tunggu sensor tidak mendeteksi (anti-bounce)
      while (digitalRead(SENSOR_PIN) == LOW) {
        delay(50);
      }
    }
  } else {
    // If no active session, reset flags
    if (sensorValue == LOW && !isMoving && !sensorTriggered) {
      Serial.println("Sensor triggered but no active session");
      sensorTriggered = true;
      delay(100); // Debounce
      sensorTriggered = false;
    }
  }
  
  delay(50);
}
