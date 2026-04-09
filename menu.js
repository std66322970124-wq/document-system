// 1. ฟังก์ชันดึงไฟล์ navbar.html มาแสดง
async function loadMenu() {
    try {
        const response = await fetch('navbar.html');
        const html = await response.text();
        
        // เอาโค้ดเมนูไปแทรกในแท็กที่มี id="menu-container"
        document.getElementById('menu-container').innerHTML = html;
        
        // โหลดเมนูเสร็จ ค่อยเช็คว่าล็อกอินอยู่ไหม
        setupNavbarAuth();
    } catch (error) {
        console.error('Error loading the navbar:', error);
    }
}

// 2. ฟังก์ชันตรวจสอบการล็อกอิน
async function setupNavbarAuth() {
    const client = typeof supabaseClient !== 'undefined' ? supabaseClient : supabase;
    const { data: { session } } = await client.auth.getSession();
    
    const userMenu = document.getElementById('userProfileMenu');
    const loginMenu = document.getElementById('loginBtnMenu');
    const displayUsername = document.getElementById('displayUsername');
    
    // ดึงตัวแปรเมนูที่เราใส่ ID ไว้เมื่อกี้
    const menuAddIn = document.getElementById('menu-add-in');
    const menuAddOut = document.getElementById('menu-add-out');

    if (session) {
        // ---- กรณีล็อกอินแล้ว ----
        userMenu.style.setProperty('display', 'flex', 'important');
        loginMenu.style.display = 'none';
        const email = session.user.email;
        displayUsername.innerText = email.split('@')[0]; 
        
        // สั่งให้โชว์เมนูเพิ่มข้อมูล
        if(menuAddIn) menuAddIn.style.display = 'block';
        if(menuAddOut) menuAddOut.style.display = 'block';
        
    } else {
        // ---- กรณียังไม่ล็อกอิน ----
        userMenu.style.setProperty('display', 'none', 'important');
        loginMenu.style.display = 'block';
        
        // สั่งให้ซ่อนเมนูเพิ่มข้อมูล
        if(menuAddIn) menuAddIn.style.display = 'none';
        if(menuAddOut) menuAddOut.style.display = 'none';
    }
}

// 3. ฟังก์ชันออกจากระบบ
async function logout() {
    const client = typeof supabaseClient !== 'undefined' ? supabaseClient : supabase;
    if(confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
        await client.auth.signOut();
        window.location.href = 'index.html'; 
    }
}

// สั่งให้ระบบดึงเมนูทันทีที่โหลดหน้าเว็บเสร็จ
document.addEventListener('DOMContentLoaded', loadMenu);
