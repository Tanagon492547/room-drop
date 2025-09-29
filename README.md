# **RoomDrop 🏨**

แอปพลิเคชันสำหรับจองและปล่อยเช่าห้องพัก ที่สร้างขึ้นด้วย React Native (Expo) และเชื่อมต่อกับ Firebase สำหรับการจัดการข้อมูลและผู้ใช้

## **✨ Screenshots**

*เร็วๆ นี้\! เพิ่มรูปภาพตัวอย่างสวยๆ ของแอปพลิเคชันคุณที่นี่ได้เลย*

<div align="center">

| **หน้า Login** | **หน้า Home** | **หน้ารายละเอียด** |
| :---: | :---: | :---: |
| <img src="./screenshots/login-screen.jpg" width="200"> | <img src="./screenshots/home-screen.jpg" width="200"> | <img src="./screenshots/detail-screen.jpg" width="200"> |

</div>

## **🚀 คุณสมบัติ (Features)**

* **Authentication**: สมัครสมาชิกและเข้าสู่ระบบด้วย Firebase Authentication
* **Room Listings**: ดูรายการห้องพักทั้งหมด
* **Search & Filter**: ค้นหาและกรองห้องพักตามเงื่อนไขที่ต้องการ
* **Booking System**: ระบบการจองห้องพัก
* **Room Management**: เพิ่ม, แก้ไข และลบข้อมูลห้องพักของตัวเอง
* **User Profiles**: จัดการข้อมูลส่วนตัวของผู้ใช้งาน

---

## **🛠️ เทคโนโลยีที่ใช้ (Tech Stack)**

* **Framework**: React Native (Expo)
* **Routing**: Expo Router
* **Backend & Database**: Firebase (Authentication, Firestore)
* **UI Library**: React Native Paper
* **State Management**: Zustand
* **Language**: TypeScript

---

## **🏁 การติดตั้งและเริ่มต้นใช้งาน (Getting Started)**

### **สิ่งที่ต้องมี (Prerequisites)**

* **Node.js** (เวอร์ชัน 18 ขึ้นไป)
* **Git**
* แอป **Expo Go** บนมือถือ iOS หรือ Android ของคุณ

### **ขั้นตอนการติดตั้ง (Installation Steps)**

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Tanagon492547/room-drop.git](https://github.com/Tanagon492547/room-drop.git)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd room-drop
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Setup Environment Variables:**
    * สร้างไฟล์ชื่อ **.env** ที่ root ของโปรเจกต์
    * คัดลอก "กุญแจ" ต่างๆ จากโปรเจกต์ Firebase ของคุณมาใส่ในไฟล์ **.env** ตามรูปแบบด้านล่าง:
        ```env
        EXPO_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
        EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
        EXPO_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
        EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
        EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
        EXPO_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"
        ```
5.  **Run the application:**
    ```bash
    npx expo start
    ```
    หลังจากนั้นให้สแกน **QR Code** ที่ปรากฏขึ้นบนหน้าจอด้วยแอป **Expo Go** บนมือถือของคุณได้