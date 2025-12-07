// ตัวอย่างการใช้งาน Firebase Services

import { 
  registerWithEmail, 
  loginWithEmail, 
  loginWithGoogle,
  resetPassword 
} from './services/authService';

import { 
  getAllProducts, 
  getProductById,
  getProductsByCategory 
} from './services/productService';

import { 
  createOrder, 
  getUserOrders 
} from './services/orderService';

import { uploadImage } from './services/storageService';

// ==========================================
// 1. AUTHENTICATION EXAMPLES
// ==========================================

// สมัครสมาชิก
async function exampleRegister() {
  const result = await registerWithEmail(
    'user@example.com',
    'password123',
    'John Doe'
  );
  
  if (result.success) {
    console.log('สมัครสำเร็จ!', result.user);
  } else {
    console.error('Error:', result.error);
  }
}

// Login
async function exampleLogin() {
  const result = await loginWithEmail(
    'user@example.com',
    'password123'
  );
  
  if (result.success) {
    console.log('Login สำเร็จ!', result.user);
  } else {
    console.error('Error:', result.error);
  }
}

// Login with Google
async function exampleGoogleLogin() {
  const result = await loginWithGoogle();
  
  if (result.success) {
    console.log('Login ด้วย Google สำเร็จ!', result.user);
  } else {
    console.error('Error:', result.error);
  }
}

// Reset Password
async function exampleResetPassword() {
  const result = await resetPassword('user@example.com');
  
  if (result.success) {
    console.log('ส่งอีเมลรีเซ็ตรหัสผ่านแล้ว');
  } else {
    console.error('Error:', result.error);
  }
}

// ==========================================
// 2. PRODUCT MANAGEMENT EXAMPLES
// ==========================================

// ดึงสินค้าทั้งหมด
async function exampleGetAllProducts() {
  const products = await getAllProducts();
  console.log(`พบสินค้า ${products.length} รายการ`, products);
}

// ดึงสินค้าตาม ID
async function exampleGetProduct() {
  const product = await getProductById('prod-001');
  if (product) {
    console.log('รายละเอียดสินค้า:', product);
  } else {
    console.log('ไม่พบสินค้า');
  }
}

// ดึงสินค้าตามหมวดหมู่
async function exampleGetProductsByCategory() {
  const products = await getProductsByCategory('electronics');
  console.log(`Electronics: ${products.length} รายการ`);
}

// ดึงสินค้า Flash Sale
async function exampleGetFlashSale() {
  const { getFlashSaleProducts } = await import('./services/productService');
  const products = await getFlashSaleProducts();
  console.log(`Flash Sale: ${products.length} รายการ`);
}

// ==========================================
// 3. ORDER MANAGEMENT EXAMPLES
// ==========================================

// สร้างคำสั่งซื้อ
async function exampleCreateOrder() {
  const orderData = {
    date: new Date().toISOString(),
    items: [
      {
        id: 'prod-001',
        title: 'iPhone 15 Pro',
        priceUSD: 999,
        priceTHB: 35000,
        quantity: 1,
        image: 'https://...',
        rating: 4.9,
        sold: 100,
        category: 'electronics'
      }
    ],
    total: 35000,
    status: 'pending',
    type: 'marketplace',
    paymentMethod: 'credit_card'
  };
  
  const result = await createOrder('user_uid_here', orderData);
  
  if (result.success) {
    console.log('สร้างคำสั่งซื้อสำเร็จ!', result.orderId);
  } else {
    console.error('Error:', result.error);
  }
}

// ดึงคำสั่งซื้อของผู้ใช้
async function exampleGetUserOrders() {
  const orders = await getUserOrders('user_uid_here');
  console.log(`พบคำสั่งซื้อ ${orders.length} รายการ`, orders);
}

// อัปเดตสถานะคำสั่งซื้อ
async function exampleUpdateOrderStatus() {
  const { updateOrderStatus } = await import('./services/orderService');
  const result = await updateOrderStatus('order_id_here', 'shipped');
  
  if (result.success) {
    console.log('อัปเดตสถานะสำเร็จ');
  }
}

// ==========================================
// 4. STORAGE EXAMPLES
// ==========================================

// Upload รูปสินค้า
async function exampleUploadProductImage(file: File) {
  const result = await uploadImage(file, 'products');
  
  if (result.success) {
    console.log('Upload สำเร็จ!', result.url);
    return result.url;
  } else {
    console.error('Error:', result.error);
  }
}

// Upload รูปโปรไฟล์
async function exampleUploadAvatar(file: File) {
  const result = await uploadImage(file, 'avatars');
  
  if (result.success) {
    console.log('อัปเดต Avatar สำเร็จ!', result.url);
  }
}

// Upload หลายรูป
async function exampleUploadMultiple(files: File[]) {
  const { uploadMultipleImages } = await import('./services/storageService');
  const result = await uploadMultipleImages(files, 'products');
  
  if (result.success) {
    console.log('Upload ทั้งหมดสำเร็จ!', result.urls);
  }
}

// ==========================================
// 5. REACT COMPONENT EXAMPLES
// ==========================================

// ใน Component
import React, { useState, useEffect } from 'react';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    const data = await getAllProducts();
    setProducts(data);
    setLoading(false);
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.title}</h3>
          <p>{product.priceTHB} ฿</p>
        </div>
      ))}
    </div>
  );
}

// Login Component Example
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    const result = await loginWithEmail(email, password);
    
    if (result.success) {
      alert('Login สำเร็จ!');
      // redirect to profile
    } else {
      alert('Error: ' + result.error);
    }
    
    setLoading(false);
  }

  return (
    <form onSubmit={handleLogin}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="อีเมล"
        required
      />
      <input 
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="รหัสผ่าน"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'กำลัง Login...' : 'เข้าสู่ระบบ'}
      </button>
    </form>
  );
}

// ==========================================
// 6. ERROR HANDLING EXAMPLES
// ==========================================

// ตัวอย่างการจัดการ Error
async function exampleErrorHandling() {
  try {
    const result = await loginWithEmail('invalid@example.com', 'wrong');
    
    if (!result.success) {
      // แสดง error ตาม type
      switch (result.error) {
        case 'auth/user-not-found':
          alert('ไม่พบผู้ใช้นี้ในระบบ');
          break;
        case 'auth/wrong-password':
          alert('รหัสผ่านไม่ถูกต้อง');
          break;
        case 'auth/invalid-email':
          alert('รูปแบบอีเมลไม่ถูกต้อง');
          break;
        default:
          alert('เกิดข้อผิดพลาด: ' + result.error);
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// ==========================================
// 7. REALTIME UPDATES (Advanced)
// ==========================================

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';

// ติดตาม Auth State
function setupAuthListener() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('User logged in:', user.email);
    } else {
      console.log('User logged out');
    }
  });
}

// ==========================================
// Export สำหรับใช้งาน
// ==========================================

export {
  exampleRegister,
  exampleLogin,
  exampleGoogleLogin,
  exampleGetAllProducts,
  exampleCreateOrder,
  exampleUploadProductImage,
  ProductList,
  LoginForm
};
