const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export const colors = {
  // Primary Colors (สีหลัก) - ใช้สำหรับ Branding, ปุ่มหลัก, Navigation Bars 
     primary: '#314071', // ตัวอย่าง: สีน้ำเงินสดใส (Vibrant Blue) - สื่อถึงความน่าเชื่อถือและทันสมัย 
     primaryDark: '#1C5CB7',  // เข้มขึ้นสำหรับสถานะ Hover/Active  Active opacity 70%
     primaryLight:' #1568C0', // สว่างขึ้นสำหรับพื้นหลังหรือองค์ประกอบเสริม  
     primaryPlus: '#1c5db78e',
// Secondary Colors (สีรอง) - ใช้สำหรับองค์ประกอบเสริม, ปุ่มรอง, Icon ที่ไม่เน้นมาก 
     secondary: '#6607DB', // ตัวอย่าง: สีเทาเข้ม (Muted Gray) - เสริมความเรียบร้อยและไม่แย่งซีน Primary 
     secondaryDark: '# 455A64', 
     secondaryLight: '#FFFFFF',  // Background Colors (สีพื้นหลัง) - พื้นหลังของหน้าจอ, Cards, Modals 
     background: '#ffffffff', // ตัวอย่าง: สีเทาอ่อนมาก (Light Gray/Off-white) - สบายตา ไม่สว่างจ้าเกินไป 
     surface: '#xxxx',    // สำหรับ Card, Dialogs หรือองค์ประกอบที่อยู่บน Background  

// Text Colors (สีข้อความ) - ข้อความหลัก, รอง, Placeholder
     text: '#000000',        // ตัวอย่าง: สีเทาเข้มเกือบดำ (Dark Gray) - อ่านง่ายบนพื้นหลังสว่าง 
     textSecondary: '#828282', // ข้อความรอง, Label, Placeholder 
     textLight: '#2b2b2bea',   // ข้อความที่จางลง, ไม่ใช่ข้อความหลัก 
     textWhite: '#FFFFFF',   // สำหรับข้อความบนพื้นหลังเข้ม  

// Status Colors (สีสถานะ) - ใช้สำหรับการแจ้งเตือนสถานะต่างๆ 
     success: '#00B536',     // ตัวอย่าง: สีเขียว (Success Green) - สำหรับการดำเนินการสำเร็จ, ยืนยัน 
     info: '#1C5CB7',        // ตัวอย่าง: สีฟ้า (Info Blue) - สำหรับข้อมูลทั่วไป, การแจ้งเตือนinfo for something important ‘D81600’ : ราคา รหัสผ่าน
     warning: '#FF0000',  
   
// ตัวอย่าง: สีส้มเหลือง (Warning Yellow) - สำหรับคำเตือน, ต้องระมัดระวัง 
     error: '#xxxx',       // ตัวอย่าง: สีแดง (Error Red) - สำหรับข้อผิดพลาด, การแจ้งเตือนที่สำคัญ  

// Border & Divider Colors (สีเส้นขอบและเส้นแบ่ง) 
    borderColor: '#xxxx', // สีสำหรับเส้นขอบ Input, Divider 
     divider: '#xxxx',     // สีสำหรับเส้นแบ่งองค์ประกอบ  
// Accent Colors (สีเน้น) - ถ้าต้องการสีพิเศษสำหรับ Icon, Highlight, หรือ Call to Action 
// accent: '#xxxx',
};

export default {
  light: {
    text: '#000',
    background: '#ebe9e9ff',
    tint: tintColorLight,
    tabIconDefault: '#d0d0d0ff',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
};
