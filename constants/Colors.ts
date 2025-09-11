const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export const colors = {
  // Primary Colors (สีหลัก) - ใช้สำหรับ Branding, ปุ่มหลัก, Navigation Bars
  primary: '#314071', // ตัวอย่าง: สีน้ำเงินสดใส (Vibrant Blue) - สื่อถึงความน่าเชื่อถือและทันสมัย
  primaryDark: '#0056b3', // เข้มขึ้นสำหรับสถานะ Hover/Active
  primaryLight: '#cce5ff', // สว่างขึ้นสำหรับพื้นหลังหรือองค์ประกอบเสริม
  primaryTab:'#FFFFFF', //สี Tabs

  // Secondary Colors (สีรอง) - ใช้สำหรับองค์ประกอบเสริม, ปุ่มรอง, Icon ที่ไม่เน้นมาก
  secondary: '#6c757d', // ตัวอย่าง: สีเทาเข้ม (Muted Gray) - เสริมความเรียบร้อยและไม่แย่งซีน Primary
  secondaryDark: '#545b62',
  secondaryLight: '#e2e6ea',

  // Background Colors (สีพื้นหลัง) - พื้นหลังของหน้าจอ, Cards, Modals
  background: '#f8f9fa', // ตัวอย่าง: สีเทาอ่อนมาก (Light Gray/Off-white) - สบายตา ไม่สว่างจ้าเกินไป
  surface: '#ffffff',    // สำหรับ Card, Dialogs หรือองค์ประกอบที่อยู่บน Background

  // Text Colors (สีข้อความ) - ข้อความหลัก, รอง, Placeholder
  text: '#212529',        // ตัวอย่าง: สีเทาเข้มเกือบดำ (Dark Gray) - อ่านง่ายบนพื้นหลังสว่าง
  textSecondary: '#6c757d', // ข้อความรอง, Label, Placeholder
  textLight: '#adb5bd',   // ข้อความที่จางลง, ไม่ใช่ข้อความหลัก
  textWhite: '#ffffff',   // สำหรับข้อความบนพื้นหลังเข้ม

  // Status Colors (สีสถานะ) - ใช้สำหรับการแจ้งเตือนสถานะต่างๆ
  success: '#28a745',     // ตัวอย่าง: สีเขียว (Success Green) - สำหรับการดำเนินการสำเร็จ, ยืนยัน
  info: '#17a2b8',        // ตัวอย่าง: สีฟ้า (Info Blue) - สำหรับข้อมูลทั่วไป, การแจ้งเตือน
  warning: '#ffc107',     // ตัวอย่าง: สีส้มเหลือง (Warning Yellow) - สำหรับคำเตือน, ต้องระมัดระวัง
  error: '#dc3545',       // ตัวอย่าง: สีแดง (Error Red) - สำหรับข้อผิดพลาด, การแจ้งเตือนที่สำคัญ

  // Border & Divider Colors (สีเส้นขอบและเส้นแบ่ง)
  borderColor: '#dee2e6', // สีสำหรับเส้นขอบ Input, Divider
  divider: '#e9ecef',     // สีสำหรับเส้นแบ่งองค์ประกอบ

  // Accent Colors (สีเน้น) - ถ้าต้องการสีพิเศษสำหรับ Icon, Highlight, หรือ Call to Action
  // accent: '#xxxxxx',
};

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};
