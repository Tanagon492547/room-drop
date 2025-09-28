import generatePayload from 'promptpay-qr';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import QRCodeSVG from 'react-native-qrcode-svg';

// --- นี่คือ Component ใหม่ที่รวมโค้ดของเราเข้าไป ---

type Props = {
  promptpay?: string, // พร้อมเพย์คนขาย
  price?: number, //ราคา
}

const PromptPayForm = ({ promptpay, price }: Props) => {
  const [qrPayload, setQrPayload] = useState('');
  
  // useEffect จะทำงานทุกครั้งที่ promptpay หรือ price เปลี่ยนแปลง
  useEffect(() => {
    // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบถ้วนหรือไม่
    if ((promptpay) && price && price > 0) {
      // สร้าง payload string ทันที
      const payload = generatePayload(promptpay, { amount: price });
      setQrPayload(payload);
    } else {
      // ถ้าข้อมูลไม่ครบ ก็ไม่ต้องแสดง QR Code
      setQrPayload('');
    }
  }, [promptpay, price]); // <-- ให้ re-run effect นี้เมื่อ props 2 ตัวนี้เปลี่ยน

  // ถ้าไม่มี QR Code ให้แสดง ก็ไม่ต้อง render อะไรเลย
  if (!qrPayload) {
    return (
      <View style={styles.card}>
        <Text style={styles.errorText}>ข้อมูลไม่ถูกต้องหรือไม่ครบถ้วน</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <QRCodeSVG 
        value={qrPayload} 
        size={250}
        logoBackgroundColor='transparent'
      />
    </View>
  )
}

export default PromptPayForm;


const styles = StyleSheet.create({
  // สไตล์สำหรับ App หลัก
  container: {
    flex: 1,
    backgroundColor: '#f7f8f7',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003b6a',
    marginBottom: 20,
  },
  // สไตล์สำหรับ PromptPayForm Component
  card: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  scanText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#333',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
})

