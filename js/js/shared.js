// js/shared.js
// ฟังก์ชันที่ใช้ร่วมกันในหน้าต่างๆ เช่น การเรียก API, แสดงข้อความแจ้งเตือน

/**
 * ฟังก์ชันสำหรับเรียก Google Apps Script Web App
 * @param {string} action - ชื่อ action ที่กำหนดใน Google Apps Script
 * @param {object} params - Parameters ที่จะส่งไปกับ GET request (ถ้ามี)
 * @param {string} method - HTTP method (GET หรือ POST)
 * @param {object} body - ข้อมูลที่จะส่งไปกับ POST request (ถ้ามี)
 * @returns {Promise<object|null>} - ข้อมูล JSON ที่ได้จาก API หรือ null ถ้าเกิดข้อผิดพลาด
 */
async function fetchData(action, params = {}, method = 'GET', body = null) {
    const loadingEl = document.getElementById('loading-spinner');
    if (loadingEl) loadingEl.style.display = 'flex'; // แสดง loading spinner

    let url = GAS_WEB_APP_URL; // GAS_WEB_APP_URL มาจาก js/config.js
    if (action) { // ถ้ามี action ให้เพิ่มเข้าไปใน URL (สำหรับ GET ที่มี action parameter)
        url += `?action=${action}`;
    }

    if (method === 'GET' && params) {
        Object.keys(params).forEach(key => {
            if (url.includes('?')) {
                url += `&${key}=${encodeURIComponent(params[key])}`;
            } else {
                url += `?${key}=${encodeURIComponent(params[key])}`;
            }
        });
    }
     // กรณี POST และมี action ใน body (ตามที่ GAS doPost คาดหวัง)
    if (method === 'POST' && body && !body.action && action) {
        body.action = action;
    }


    try {
        const options = {
            method: method,
            redirect: 'follow', // สำคัญสำหรับ GAS web apps
            headers: {}
        };

        if (method === 'POST' && body) {
            // Google Apps Script doPost จะรับข้อมูลผ่าน e.postData.contents
            // เราต้องส่งข้อมูลเป็น JSON string
            options.body = JSON.stringify(body);
            // GAS มักจะจัดการ Content-Type 'text/plain' ได้ดีสำหรับ JSON string
            options.headers['Content-Type'] = 'text/plain;charset=utf-8';
        }

        console.log(`Fetching URL: ${url}`, options); // Log URL และ options สำหรับ debug

        const response = await fetch(url, options);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`HTTP error! status: ${response.status}, message: ${errorText}, url: ${url}`);
            throw new Error(`เกิดข้อผิดพลาดจากเซิร์ฟเวอร์: ${response.status}. ${errorText}`);
        }

        const result = await response.json();
        console.log("Data fetched successfully:", result); // Log ผลลัพธ์
        if (loadingEl) loadingEl.style.display = 'none'; // ซ่อน loading spinner
        return result;

    } catch (error) {
        console.error("Error fetching data:", error);
        if (loadingEl) loadingEl.style.display = 'none'; // ซ่อน loading spinner
        showUserMessage(error.message || "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง", "danger");
        return null;
    }
}

/**
 * ฟังก์ชันสำหรับแสดงข้อความแจ้งเตือนผู้ใช้
 * @param {string} message - ข้อความที่ต้องการแสดง
 * @param {string} type - ประเภทของข้อความ (success, danger, warning, info - ตาม Bootstrap alert types)
 */
function showUserMessage(message, type = "info") {
    const container = document.getElementById('user-message-container'); // ต้องมี element นี้ใน HTML
    if (container) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        container.appendChild(alertDiv);
        // ลบ alert หลังจาก 5 วินาที
        setTimeout(() => {
            alertDiv.classList.remove('show');
            setTimeout(() => alertDiv.remove(), 150); // รอ transition จบ
        }, 5000);
    } else {
        console.warn("User message container not found. Message:", message);
        // Fallback alert if container not found (ไม่แนะนำให้ใช้ alert() บ่อย)
        // alert(`${type.toUpperCase()}: ${message}`);
    }
}


/**
 * ฟังก์ชันสำหรับดึงค่า URL parameter
 * @param {string} name - ชื่อของ parameter
 * @returns {string} - ค่าของ parameter หรือ '' ถ้าไม่พบ
 */
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}
