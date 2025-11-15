#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ESP32Servo.h>

// WiFi credentials - UPDATE THESE
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// MQTT Broker settings
const char* mqtt_server = "103.144.209.103";
const int mqtt_port = 1883;
const char* mqtt_client_id = "ESP32_Banksampah01";
const char* machine_topic = "machines/banksampah01";  // Update with your room code

// Pins
#define SERVO_PIN 23      // Servo MG996R
#define SENSOR_PIN 2      // Sensor di D2
#define BUZZER_PIN 13     // Buzzer di D13

// MQTT Client
WiFiClient espClient;
PubSubClient mqttClient(espClient);
Servo myServo;

// State variables
bool isSessionActive = false;     // Session aktif dari server
bool isMoving = false;            // Flag: motor sedang bergerak
int triggerCount = 0;
unsigned long lastDetectionTime = 0;  // Untuk debounce
unsigned long sessionStartTime = 0;   // Waktu mulai session
unsigned long lastActivityTime = 0;   // Waktu aktivitas terakhir
const unsigned long SESSION_TIMEOUT = 15 * 60 * 1000; // 15 menit timeout
int triggerCount = 0;
unsigned long lastDetectionTime = 0;  // Untuk debounce

void setup() {
  Serial.begin(115200);
  
  // Initialize pins
  pinMode(SENSOR_PIN, INPUT_PULLUP);
  pinMode(BUZZER_PIN, OUTPUT);
  myServo.attach(SERVO_PIN, 500, 2500);
  myServo.write(0); // Posisi awal
  delay(1000);

  // Connect WiFi
  setup_wifi();
  
  // Setup MQTT
  mqttClient.setServer(mqtt_server, mqtt_port);
  mqttClient.setCallback(mqtt_callback);
  
  Serial.println("=========================================");
  Serial.println("ESP32 BANKSAMPAH MQTT SYSTEM");
  Serial.println("=========================================");
  Serial.print("WiFi SSID: ");
  Serial.println(ssid);
  Serial.print("Machine Topic: ");
  Serial.println(machine_topic);
  Serial.print("MQTT Server: ");
  Serial.print(mqtt_server);
  Serial.print(":");
  Serial.println(mqtt_port);
  Serial.println("=========================================");
  Serial.println("Menunggu koneksi MQTT dan perintah start_session...\n");
}

void loop() {
  // Maintain MQTT connection
  if (!mqttClient.connected()) {
    reconnect_mqtt();
  }
  mqttClient.loop();

  // Only process sensor if session is active
  if (isSessionActive && !isMoving) {
    int sensorValue = digitalRead(SENSOR_PIN);
    
    // Deteksi trigger sensor (dengan debounce)
    if (sensorValue == LOW && !sensorTriggered && (millis() - lastDetectionTime > 1000)) {
      sensorTriggered = true;
      isMoving = true;
      triggerCount++;
      lastDetectionTime = millis();
      lastActivityTime = millis();  // Update waktu aktivitas terakhir
      
      Serial.println("\n=== BOTOL TERDETEKSI ===");
      Serial.print("Deteksi ke-");
      Serial.println(triggerCount);
      Serial.println("Mengirim data ke server via MQTT...\n");
      
      // BUZZER PERTAMA: Saat deteksi awal
      Serial.println("🔊 Buzzer: BIP! (deteksi)");
      tone(BUZZER_PIN, 1000, 200); // 1000Hz, 200ms
      delay(250); // Tunggu buzzer selesai
      
      // Publish detection to MQTT
      publish_detection();
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
      
      Serial.println("\n=== DETEKSI SELESAI ===");
      Serial.println("Siap deteksi berikutnya\n");
      
      isMoving = false;
      sensorTriggered = false;
      
      // Tunggu sensor tidak mendeteksi (anti-bounce)
      while (digitalRead(SENSOR_PIN) == LOW) {
        delay(50);
      }
    }
  }
  
  delay(50);
}

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect_mqtt() {
  while (!mqttClient.connected()) {
    Serial.print("Attempting MQTT connection...");
    
    // Attempt to connect
    if (mqttClient.connect(mqtt_client_id)) {
      Serial.println("connected");
      
      // Subscribe to command topic
      String commandTopic = String(machine_topic) + "/command";
      mqttClient.subscribe(commandTopic.c_str());
      Serial.print("Subscribed to: ");
      Serial.println(commandTopic);
      
    } else {
      Serial.print("failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void mqtt_callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.println(message);
  
  // Parse JSON command
  if (message.indexOf("start_session") != -1) {
    isSessionActive = true;
    triggerCount = 0;  // Reset counter for new session
    Serial.println("✅ Session diaktifkan oleh server!");
    Serial.println("Sistem siap mendeteksi botol...\n");
    
    // Buzzer konfirmasi session start
    tone(BUZZER_PIN, 800, 500);
    
  } else if (message.indexOf("end_session") != -1) {
    isSessionActive = false;
    Serial.println("❌ Session diakhiri oleh server!");
    Serial.println("Sistem tidak aktif\n");
    
    // Buzzer konfirmasi session end
    tone(BUZZER_PIN, 1200, 400);
  }
}

void publish_detection() {
  String detectionTopic = String(machine_topic) + "/bottle_detected";
  String payload = "{\"timestamp\":\"" + String(millis()) + "\",\"count\":" + String(triggerCount) + ",\"userId\":\"session_active\"}";
  
  if (mqttClient.publish(detectionTopic.c_str(), payload.c_str())) {
    Serial.println("✅ Data deteksi terkirim ke server!");
  } else {
    Serial.println("❌ Gagal kirim data ke server!");
  }
}
