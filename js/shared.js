// js/shared.js

/**
 * ฟังก์ชันสำหรับเรียก Google Apps Script Web App
 * @param {string} action - ชื่อ action ที่กำหนดใน Google Apps Script
 * @param {object} params - Parameters ที่จะส่งไปกับ GET request (ถ้ามี)
 * @param {string} method - HTTP method (GET หรือ POST)
 * @param {object} body - ข้อมูลที่จะส่งไปกับ POST request (ถ้ามี)
 * @param {boolean} isBackgroundFetch - กำหนดว่าเป็น background fetch หรือไม่ (เพื่อควบคุม spinner)
 * @returns {Promise<object|null>} - ข้อมูล JSON ที่ได้จาก API หรือ null ถ้าเกิดข้อผิดพลาด
 */
async function fetchData(action, params = {}, method = 'GET', body = null, isBackgroundFetch = false) {
    const loadingEl = document.getElementById('loading-spinner');

    // แสดง spinner แบบเต็มหน้าจอต่อเมื่อไม่ใช่ background fetch
    if (loadingEl && !isBackgroundFetch) {
        loadingEl.style.display = 'flex';
    }
    // ถ้าเป็น background fetch อาจจะมี spinner เล็กๆ หรือ icon แสดงสถานะ loading ที่ Navbar แทน (ถ้าต้องการ)
    // เช่น: if (isBackgroundFetch) { document.getElementById('nav-sync-icon').style.display = 'inline-block'; }


    let url = GAS_WEB_APP_URL;
    if (action) {
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

    if (method === 'POST' && body && !body.action && action) {
        body.action = action;
    }

    try {
        const options = {
            method: method,
            redirect: 'follow',
            headers: {}
        };

        if (method === 'POST' && body) {
            options.body = JSON.stringify(body);
            options.headers['Content-Type'] = 'text/plain;charset=utf-8';
        }

        // console.log(`Fetching URL: ${url}`, options); // สามารถเปิด comment นี้เพื่อ debug

        const response = await fetch(url, options);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`HTTP error! status: ${response.status}, message: ${errorText}, url: ${url}`);
            // สำหรับ background fetch อาจจะไม่ต้องแสดง error เต็มหน้าจอทุกครั้ง
            if (!isBackgroundFetch) {
                throw new Error(`เกิดข้อผิดพลาดจากเซิร์ฟเวอร์: ${response.status}. ${errorText}`);
            } else {
                // อาจจะ log error หรือแสดง icon เล็กๆ แทน
                console.warn(`Background fetch failed: ${action}`, errorText);
                return null; // หรือ return โครงสร้าง error ที่เหมาะสม
            }
        }

        const result = await response.json();
        // console.log("Data fetched successfully:", result); // สามารถเปิด comment นี้เพื่อ debug

        // ซ่อน spinner (ถ้าเคยแสดง) และ icon อื่นๆ (ถ้ามี)
        if (loadingEl && !isBackgroundFetch) {
            loadingEl.style.display = 'none';
        }
        // if (isBackgroundFetch) { document.getElementById('nav-sync-icon').style.display = 'none'; }

        return result;

    } catch (error) {
        console.error("Error fetching data:", error);
        if (loadingEl && !isBackgroundFetch) {
            loadingEl.style.display = 'none';
        }
        // if (isBackgroundFetch) { document.getElementById('nav-sync-icon').style.display = 'none'; }

        // แสดง error message เฉพาะเมื่อไม่ใช่ background fetch หรือเป็น error ที่สำคัญจริงๆ
        if (!isBackgroundFetch) {
            showUserMessage(error.message || "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง", "danger");
        }
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
