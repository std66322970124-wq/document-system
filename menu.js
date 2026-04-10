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

// 2. ฟังก์ชันตรวจสอบการล็อกอินและสิทธิ์
async function setupNavbarAuth() {
    const client = typeof supabaseClient !== 'undefined' ? supabaseClient : supabase;
    const { data: { session } } = await client.auth.getSession();
    
    const userMenu = document.getElementById('userProfileMenu');
    const loginMenu = document.getElementById('loginBtnMenu');
    const displayUsername = document.getElementById('displayUsername');
    
    // ดึงตัวแปรเมนูที่เราใส่ ID ไว้
    const menuAddIn = document.getElementById('menu-add-in');
    const menuAddOut = document.getElementById('menu-add-out');
    const menuAdmin = document.getElementById('menu-admin'); // ตัวแปรสำหรับเมนูแอดมิน

    if (session) {
        // ---- กรณีล็อกอินแล้ว ----
        userMenu.style.setProperty('display', 'flex', 'important');
        loginMenu.style.display = 'none';
        const email = session.user.email;
        displayUsername.innerText = email.split('@')[0]; 
        
        // สั่งให้โชว์เมนูเพิ่มข้อมูล
        if(menuAddIn) menuAddIn.style.display = 'block';
        if(menuAddOut) menuAddOut.style.display = 'block';

        // --- เพิ่มการตรวจสอบสิทธิ์ Admin ---
        try {
            // ไปเช็กในตาราง Person ว่า user นี้มี Permission เป็น admin หรือไม่
            const { data: userData } = await client
                .from('Person')
                .select('Permission')
                .eq('auth_user_id', session.user.id)
                .single();
                
            if (userData && userData.Permission === 'admin') {
                if(menuAdmin) menuAdmin.style.display = 'block'; // ถ้าเป็นแอดมิน ให้โชว์ปุ่ม
            } else {
                if(menuAdmin) menuAdmin.style.display = 'none'; // ถ้าไม่ใช่ ให้ซ่อนไว้
            }
        } catch(err) {
            console.error('Error checking admin permission:', err);
            if(menuAdmin) menuAdmin.style.display = 'none';
        }
        // ----------------------------------
        
    } else {
        // ---- กรณียังไม่ล็อกอิน ----
        userMenu.style.setProperty('display', 'none', 'important');
        loginMenu.style.display = 'block';
        
        // สั่งให้ซ่อนเมนูทั้งหมด
        if(menuAddIn) menuAddIn.style.display = 'none';
        if(menuAddOut) menuAddOut.style.display = 'none';
        if(menuAdmin) menuAdmin.style.display = 'none';
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

// โหลดเมนูทันทีเมื่อเรียกใช้ไฟล์นี้
loadMenu();
