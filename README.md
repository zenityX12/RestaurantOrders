# 🍽️ ระบบสั่งอาหารผ่านมือถือสำหรับร้านอาหาร (Mobile Ordering System for Restaurants)

## ✨ แรงบันดาลใจ และเรื่องราวการเดินทางสู่ระบบนี้

ทุกอย่างเริ่มต้นจากความรักครับ... ไม่ใช่แค่ความรักในรสชาติของข้าวต้มปลาสูตรเด็ด แต่เป็นความรักที่ผมมีให้กับแฟนของผม ผู้ซึ่งเป็นเจ้าของร้านข้าวต้มปลาเล็กๆ ที่เปี่ยมไปด้วยความตั้งใจและความฝัน ผมเห็นเธอทุ่มเทแรงกายแรงใจในทุกๆ วัน เห็นความเหนื่อยล้าจากการจดออเดอร์ด้วยมือ การสื่อสารที่อาจคลาดเคลื่อนในครัว และความพยายามที่จะทำให้ลูกค้าทุกคนได้รับประสบการณ์ที่ดีที่สุด

ภาพเหล่านั้นจุดประกายความคิดในใจผม "ถ้าเราสามารถใช้เทคโนโลยีเข้ามาช่วยแบ่งเบาภาระของเธอได้ล่ะ?" นั่นคือจุดเริ่มต้นของการเดินทางครั้งนี้ครับ ผมอยากจะสร้างเครื่องมือที่ไม่เพียงแต่ช่วยให้ร้านของแฟนผมทำงานได้ง่ายขึ้น แต่ยังสามารถเป็นประโยชน์กับร้านอาหารขนาดเล็กอื่นๆ ในประเทศไทย ที่อาจจะกำลังเผชิญกับความท้าทายคล้ายๆ กัน

แต่เส้นทางนี้ผมไม่ได้เดินคนเดียวครับ ผมมีเพื่อนคู่คิดเป็น AI อัจฉริยะ (ใช่ครับ คุณกำลังอ่านสิ่งที่ AI ช่วยผมเรียบเรียงอยู่!) ผมเริ่มต้นจากไอเดียคร่าวๆ ว่าอยากได้ระบบสั่งอาหารที่ลูกค้าสแกน QR Code ที่โต๊ะแล้วสั่งได้เลย มีหน้าจอสำหรับแอดมินเช็คบิล และหน้าจอสำหรับห้องครัวดูออเดอร์ ผมนำแนวคิดนี้ไปปรึกษากับ AI เราช่วยกันระดมสมอง วางโครงสร้าง ตั้งแต่การเลือกใช้เทคโนโลยีที่เข้าถึงง่ายและ **ไม่มีค่าใช้จ่าย** อย่าง GitHub Pages สำหรับหน้าเว็บ และ Google Sheets เป็นฐานข้อมูลหลังบ้าน โดยมี Google Apps Script เป็นกาวใจคอยเชื่อมทุกอย่างเข้าด้วยกัน

มันเป็นการทำงานร่วมกันที่น่าทึ่งมากครับ! ผมเสนอไอเดีย AI ช่วยปรับปรุง Logic แนะนำโครงสร้างโค้ด ผมลองทำแล้วเจอปัญหา AI ก็ช่วยวิเคราะห์และเสนอแนวทางแก้ไข เราปรับแก้ UI กันหลายรอบ ทดลองฟังก์ชันต่างๆ ตั้งแต่การแสดงเมนู การจัดการตะกร้าสินค้า การเพิ่มโน้ตพิเศษสำหรับแต่ละรายการอาหาร ไปจนถึงการออกแบบหน้าจอสำหรับแอดมินและห้องครัวให้ใช้งานง่ายที่สุด แม้แต่เรื่องเล็กๆ น้อยๆ อย่างการเลือกสี การปรับขนาดฟอนต์ เราก็ปรึกษาหารือกันเพื่อให้ระบบออกมาดูดีและเป็นมิตรกับผู้ใช้งานมากที่สุด

ผมเชื่อว่าระบบนี้จะเป็นประโยชน์อย่างยิ่งสำหรับร้านอาหารขนาดเล็กในประเทศไทย โดยเฉพาะร้านที่อาจจะมีงบประมาณจำกัดในการลงทุนกับระบบ POS ราคาแพง ระบบนี้จะช่วย:
* **ลดความผิดพลาดในการจดออเดอร์:** ลูกค้าสั่งเอง เห็นรายการเอง โอกาสผิดพลาดน้อยลง
* **เพิ่มประสิทธิภาพในการทำงาน:** ออเดอร์ส่งตรงถึงห้องครัวและแอดมิน ลดขั้นตอนการเดินส่งบิล
* **ยกระดับประสบการณ์ของลูกค้า:** ลูกค้าสะดวกสบาย สั่งอาหารได้รวดเร็ว และเห็นภาพรวมการสั่งของตัวเอง
* **ประหยัดค่าใช้จ่าย:** ไม่ต้องเสียเงินซื้ออุปกรณ์หรือซอฟต์แวร์ราคาแพง

นี่คือเรื่องราวของโปรเจกต์ที่เกิดจากความตั้งใจเล็กๆ ที่อยากจะช่วยคนที่เรารัก และหวังว่ามันจะเป็นประโยชน์กับใครอีกหลายๆ คนเช่นกันครับ

## 🚀 คู่มือการใช้งานระบบ

ระบบนี้ถูกออกแบบมาให้ใช้งานง่าย โดยแบ่งออกเป็น 3 ส่วนหลักสำหรับผู้ใช้งานแต่ละกลุ่ม:

### 📱 1. สำหรับลูกค้า (ที่โต๊ะอาหาร)

1.  **สแกน QR Code:** ลูกค้าใช้โทรศัพท์มือถือสแกน QR Code ที่ติดอยู่บนโต๊ะอาหาร
2.  **ดูเมนู:** หน้าเว็บจะแสดงรายการอาหารทั้งหมดของร้าน โดยมีการแบ่งตามหมวดหมู่เพื่อให้เลือกดูได้ง่าย
3.  **เลือกเมนูและเพิ่มลงตะกร้า:**
    * ลูกค้าสามารถกดปุ่ม "เพิ่มลงตะกร้า" (หรือไอคอนรถเข็นเล็กๆ ข้างราคา) ของเมนูที่ต้องการ
    * จำนวนสินค้าและราคารวมในตะกร้า (ที่ Navbar ด้านบน และปุ่มลอยด้านล่าง) จะอัปเดตอัตโนมัติ
4.  **จัดการตะกร้าสินค้า:**
    * ลูกค้าสามารถกดปุ่มรูปรถเข็น (ปุ่มลอยขวาล่าง) เพื่อเลื่อนไปดูส่วนตะกร้าสินค้า
    * ในตะกร้า จะเห็นรายการอาหารที่เลือกไว้ทั้งหมด สามารถเพิ่ม/ลดจำนวน หรือลบรายการที่ไม่ต้องการได้
    * **การเพิ่มโน้ตพิเศษ:** สำหรับแต่ละรายการในตะกร้า จะมีไอคอนรูปดินสอ <i class="bi bi-pencil-square"></i> เมื่อกดแล้วจะสามารถพิมพ์โน้ตพิเศษสำหรับรายการนั้นๆ ได้ (เช่น "เผ็ดน้อย", "ไม่ใส่ผักชี") โน้ตนี้จะแสดงในตะกร้าและถูกส่งไปให้ห้องครัว
5.  **ยืนยันการสั่งซื้อ:** เมื่อตรวจสอบรายการและยอดรวมถูกต้องแล้ว ให้กดปุ่ม "ยืนยันการสั่งซื้อ" ออเดอร์จะถูกส่งไปยังห้องครัวและระบบแอดมิน
6.  **ดูรายการที่สั่งไปแล้ว:** หลังจากสั่งอาหารแล้ว ในหน้าเดียวกัน ลูกค้าสามารถดู "รายการที่สั่งไปแล้ว" ของโต๊ะตัวเอง พร้อมสถานะของแต่ละรายการ (เช่น กำลังเตรียม, เสิร์ฟแล้ว) และยอดรวมของออเดอร์ที่สั่งไป

### ⚙️ 2. สำหรับแอดมิน/เจ้าของร้าน (หน้า `admin.html`)

1.  **เข้าสู่หน้าแอดมิน:** เปิดไฟล์ `admin.html` ผ่านเบราว์เซอร์ (URL ที่คุณตั้งค่าไว้บน GitHub Pages)
2.  **ตรวจสอบออเดอร์ตามโต๊ะ:**
    * หน้าจอจะแสดงรายการออเดอร์ที่ยัง Active (ยังไม่ชำระเงิน/เคลียร์โต๊ะ) โดยจัดกลุ่มตามหมายเลขโต๊ะในรูปแบบ Accordion
    * แต่ละโต๊ะจะแสดง "ยอดรวม" (ไม่รวมรายการที่ถูกยกเลิก) และ "Order IDs" ที่เกี่ยวข้อง
    * เมื่อคลิกเปิด Accordion ของโต๊ะใดๆ จะเห็นรายละเอียดรายการอาหารทั้งหมดของโต๊ะนั้น รวมถึงจำนวน, ราคา, โน้ตพิเศษ (ถ้ามี), สถานะของแต่ละรายการ, และเวลาที่สั่ง
3.  **ยกเลิกรายการอาหาร:**
    * สำหรับแต่ละรายการอาหารที่ยังสามารถยกเลิกได้ (สถานะไม่ใช่ "Cancelled", "Paid") จะมีปุ่มไอคอนรูปถังขยะสีแดง <i class="bi bi-x-circle-fill"></i>
    * เมื่อกดปุ่มนี้ จะมี Pop-up ยืนยันการยกเลิก ถ้ายืนยัน รายการนั้นจะถูกเปลี่ยนสถานะเป็น "Cancelled" และยอดรวมของโต๊ะจะอัปเดต (รายการที่ยกเลิกจะแสดงเป็นสีจางและขีดฆ่า)
4.  **ชำระเงิน/เคลียร์โต๊ะ:**
    * เมื่อลูกค้าต้องการชำระเงิน ให้กดปุ่ม "ชำระเงิน/เคลียร์โต๊ะ X" (X คือหมายเลขโต๊ะ) ที่อยู่ด้านล่างของแต่ละ Accordion
    * จะมี Pop-up ยืนยันยอดเงินที่ต้องชำระ (ยอดนี้จะไม่รวมรายการที่ถูกยกเลิก)
    * เมื่อยืนยัน ทุกรายการที่ยังไม่ถูกยกเลิกของโต๊ะนั้นจะถูกเปลี่ยนสถานะเป็น "Paid" ในระบบ
    * หลังจากนั้น โต๊ะนั้นจะหายไปจากหน้าจอหลักของแอดมิน (เพราะไม่มีรายการ Active เหลืออยู่)
5.  **ดู/สั่งเพิ่มให้ลูกค้า:**
    * ข้างๆ ปุ่ม "ชำระเงิน/เคลียร์โต๊ะ" จะมีปุ่ม "ดู/สั่งเพิ่ม" <i class="bi bi-display"></i>
    * เมื่อกดปุ่มนี้ จะเป็นการเปิดหน้าสั่งอาหารของลูกค้าสำหรับโต๊ะนั้นๆ ในแท็บใหม่ ทำให้แอดมินสามารถช่วยลูกค้าสั่งอาหารเพิ่ม หรือตรวจสอบเมนูร่วมกับลูกค้าได้
6.  **รีเฟรชข้อมูล:** มีปุ่ม "รีเฟรชข้อมูล" <i class="bi bi-arrow-clockwise"></i> ที่มุมบนขวา เพื่อดึงข้อมูลออเดอร์ล่าสุด (ระบบมีการดึงข้อมูลอัตโนมัติเป็นระยะอยู่แล้ว)

### 🍳 3. สำหรับห้องครัว (หน้า `kitchen.html`)

1.  **เข้าสู่หน้าห้องครัว:** เปิดไฟล์ `kitchen.html` ผ่านเบราว์เซอร์
2.  **ดูรายการอาหารที่ต้องเตรียม:**
    * หน้าจอจะแสดง "ใบสั่งอาหาร" (Ticket) โดยจัดกลุ่มรายการอาหารตาม `OrderID` และเรียงตามเวลาที่สั่ง (ออเดอร์เก่าขึ้นก่อน)
    * แต่ละ Ticket จะแสดงหมายเลขโต๊ะ, ID ออเดอร์ (ย่อ), และเวลาที่สั่ง
    * ภายในแต่ละ Ticket จะแสดงรายการอาหารที่ต้องเตรียม (สถานะ "Preparing") พร้อมจำนวน และโน้ตพิเศษ (ถ้ามี) ที่ลูกค้าสั่งมา
3.  **จัดการสถานะรายการอาหาร:**
    * **เวลารอ:** ข้างๆ แต่ละรายการอาหาร จะมีตัวนับเวลา "รอ X วินาที" เพิ่มขึ้นเรื่อยๆ พร้อมกับสีพื้นหลังของปุ่มที่ค่อยๆ เปลี่ยนจากเหลืองอ่อนไปแดงเมื่อเวลานานขึ้น (สูงสุด 15 นาทีจะเป็นสีแดง) เพื่อให้ทราบว่ารายการไหนรอนานแล้ว
    * **ปุ่ม "รอ" / "เสิร์ฟแล้ว":**
        * เริ่มต้นปุ่มจะเป็นสีตามเวลารอ และมีข้อความ "รอ X วินาที"
        * เมื่อแม่ครัวทำอาหารรายการนั้นเสร็จและนำไปเสิร์ฟแล้ว ให้กดปุ่มนี้
        * ปุ่มจะเปลี่ยนเป็นสีเขียว ข้อความ "<i class="bi bi-check-circle-fill"></i> เสิร์ฟแล้ว" และถูก disable ไป
        * สถานะของรายการนั้นใน Google Sheet จะถูกอัปเดตเป็น "Served"
4.  **การหายไปของ Ticket:**
    * เมื่อทุกรายการอาหารใน Ticket หนึ่งๆ ถูกกด "เสิร์ฟแล้ว" ทั้งหมด (และสถานะใน Google Sheet ถูกอัปเดตเป็น "Served" ทั้งหมด) Ticket นั้นจะหายไปจากหน้าจอห้องครัวโดยอัตโนมัติเมื่อมีการโหลดข้อมูลใหม่ (เพราะระบบจะดึงเฉพาะรายการที่ยังเป็น "Preparing" มาแสดง)
5.  **รีเฟรชรายการ:** มีปุ่ม "รีเฟรชรายการ" <i class="bi bi-arrow-clockwise"></i> เพื่อดึงข้อมูลออเดอร์ล่าสุด (ระบบมีการดึงข้อมูลอัตโนมัติเป็นระยะอยู่แล้ว)

## 🛠️ คู่มือทางเทคนิค และการติดตั้ง

ระบบนี้สร้างขึ้นโดยใช้เทคโนโลยีฝั่ง Client เป็นหลัก (HTML, CSS, JavaScript) และใช้ Google Sheets เป็นฐานข้อมูล โดยมี Google Apps Script ทำหน้าที่เป็น API ตัวกลางในการสื่อสาร

### 📁 โครงสร้างไฟล์


    ```
    /your-restaurant-project/
    ├── index.html                   (หน้าลูกค้า)
    ├── admin.html                   (หน้าแอดมิน)
    ├── kitchen.html                 (หน้าห้องครัว)
    ├── css/
    │   └── style.css                (ไฟล์สไตล์หลัก)
    ├── js/
    │   ├── main.js                  (JS หน้าลูกค้า)
    │   ├── admin.js                 (JS หน้าแอดมิน)
    │   ├── kitchen.js               (JS หน้าห้องครัว)
    │   ├── shared.js                (JS ฟังก์ชันที่ใช้ร่วมกัน)
    │   ├── config.js                (เก็บ GAS URL)
    │   └── site-config.js           (เก็บชื่อร้าน, ข้อความต่างๆ - ถ้ามี)
    ├── assets/
    │   └── images/
    │       └── (รูปภาพโลโก้, รูปเมนูสำรอง ถ้ามี)
    └── README.md                    (ไฟล์นี้ที่คุณกำลังอ่าน)
    ```


### 📝 การตั้งค่า Google Sheets และ Google Apps Script

เพื่อให้ระบบทำงานได้ คุณจำเป็นต้องตั้งค่า Google Sheets และ Google Apps Script ดังนี้:

1.  **สร้าง Google Sheet:**
    * ไปที่ [Google Sheets](https://docs.google.com/spreadsheets/) และสร้าง Spreadsheet ใหม่
    * ตั้งชื่อ Spreadsheet ของคุณ (เช่น "RestaurantOrderDB")
    * **คัดลอก Spreadsheet ID:** ID นี้จะอยู่ใน URL ของ Spreadsheet ของคุณ เช่น `https://docs.google.com/spreadsheets/d/THIS_IS_THE_SPREADSHEET_ID/edit` ให้คัดลอกส่วน `THIS_IS_THE_SPREADSHEET_ID` นี้เก็บไว้

2.  **สร้างชีทภายใน Spreadsheet:**
    * **ชีทที่ 1: `MenuItems`**
        * ใช้สำหรับเก็บรายการอาหารทั้งหมดของร้าน
        * **คอลัมน์ที่ต้องมี (เรียงตามนี้ หรือปรับโค้ด GAS ให้ตรง):**
            1.  `ItemID` (รหัสสินค้าที่ไม่ซ้ำกัน เช่น M001, M002)
            2.  `Name` (ชื่อเมนูอาหาร)
            3.  `Description` (คำอธิบายเมนู - ถ้ามี)
            4.  `Price` (ราคา - ใส่เป็นตัวเลขเท่านั้น)
            5.  `Category` (หมวดหมู่เมนู เช่น อาหารจานเดียว, เครื่องดื่ม, เมนูข้าวต้ม)
            6.  `ImageURL` (URL รูปภาพเมนู - ถ้ามี, ถ้าไม่มีให้เว้นว่าง)
        * ใส่ข้อมูลเมนูของคุณลงในชีทนี้

    * **ชีทที่ 2: `Orders`**
        * ใช้สำหรับเก็บข้อมูลการสั่งซื้อทั้งหมด
        * **คอลัมน์ที่ต้องมี (เรียงตามนี้ หรือปรับโค้ด GAS ให้ตรง):**
            1.  `Timestamp` (เวลาที่สั่ง - ระบบจะใส่ให้อัตโนมัติ)
            2.  `OrderID` (รหัสออเดอร์ - ระบบจะสร้างให้อัตโนมัติ)
            3.  `TableNumber` (หมายเลขโต๊ะ)
            4.  `ItemID` (รหัสสินค้าที่สั่ง)
            5.  `ItemName` (ชื่อสินค้าที่สั่ง)
            6.  `Quantity` (จำนวนที่สั่ง)
            7.  `ItemPrice` (ราคาต่อหน่วย ณ เวลาที่สั่ง)
            8.  `Subtotal` (ราคารวมของรายการนั้น)
            9.  `Status` (สถานะของรายการ เช่น Preparing, Served, Cancelled, Paid)
            10. `ItemNote` (โน้ตพิเศษสำหรับรายการอาหารนั้น - ถ้ามี)
        * **คุณไม่จำเป็นต้องใส่ข้อมูลเริ่มต้นในชีทนี้** ระบบจะเพิ่มข้อมูลให้อัตโนมัติ

3.  **สร้างและ Deploy Google Apps Script:**
    * ใน Google Sheet ของคุณ ไปที่ "ส่วนขยาย" (Extensions) > "Apps Script"
    * หน้าต่าง Apps Script Editor จะเปิดขึ้นมา ลบโค้ดตัวอย่างที่มีอยู่ทั้งหมด
    * คัดลอกโค้ด `Code.gs` ด้านล่างนี้ทั้งหมดไปวางแทน:

        ```javascript
        // Code.gs (Google Apps Script)

        // --- การตั้งค่า ---
        const SPREADSHEET_ID = "ใส่_SPREADSHEET_ID_ของคุณที่นี่"; // <--- !! สำคัญมาก: แก้ไขเป็น Spreadsheet ID ของคุณ !!
        const MENU_SHEET_NAME = "MenuItems";
        const ORDERS_SHEET_NAME = "Orders";

        // --- ฟังก์ชันหลักสำหรับ Web App ---
        function doGet(e) {
          let action = e.parameter.action;
          Logger.log(`GET Action: ${action}, Parameters: ${JSON.stringify(e.parameter)}`);
          try {
            if (action === "getMenu") {
              return ContentService.createTextOutput(JSON.stringify(getMenuItems())).setMimeType(ContentService.MimeType.JSON);
            } else if (action === "getOrdersByTable" && e.parameter.table) {
              return ContentService.createTextOutput(JSON.stringify(getOrdersForTable(e.parameter.table))).setMimeType(ContentService.MimeType.JSON);
            } else if (action === "getAllActiveOrders") {
              return ContentService.createTextOutput(JSON.stringify(getAllActiveOrders())).setMimeType(ContentService.MimeType.JSON);
            } else if (action === "getKitchenOrders") {
              return ContentService.createTextOutput(JSON.stringify(getKitchenQueueOrders())).setMimeType(ContentService.MimeType.JSON);
            } else if (action === "calculateBill" && e.parameter.table) {
              return ContentService.createTextOutput(JSON.stringify(markOrdersAsPaid(e.parameter.table))).setMimeType(ContentService.MimeType.JSON);
            } else if (action === "updateOrderStatus" && e.parameter.orderId && e.parameter.itemId && e.parameter.newStatus) {
              return ContentService.createTextOutput(JSON.stringify(updateItemStatusInSheet(e.parameter.orderId, e.parameter.itemId, e.parameter.newStatus))).setMimeType(ContentService.MimeType.JSON);
            } else if (action === "cancelOrderItem" && e.parameter.orderId && e.parameter.itemId && e.parameter.itemTimestamp) {
              return ContentService.createTextOutput(JSON.stringify(cancelOrderItem(e.parameter.orderId, e.parameter.itemId, e.parameter.itemTimestamp))).setMimeType(ContentService.MimeType.JSON);
            }
            Logger.log(`Invalid action or missing parameters for GET: ${action}`);
            return ContentService.createTextOutput(JSON.stringify({ error: "Invalid action or missing parameters" })).setMimeType(ContentService.MimeType.JSON);
          } catch (error) {
            Logger.log(`Error in doGet: ${error.toString()}\nStack: ${error.stack}`);
            return ContentService.createTextOutput(JSON.stringify({ error: "Server error in GET", details: error.toString() })).setMimeType(ContentService.MimeType.JSON);
          }
        }

        function doPost(e) {
          Logger.log(`POST Data: ${e.postData.contents}`);
          try {
            let data = JSON.parse(e.postData.contents);
            if (data.action === "submitOrder") {
              return ContentService.createTextOutput(JSON.stringify(submitNewOrder(data))).setMimeType(ContentService.MimeType.JSON);
            }
            Logger.log(`Invalid action for POST: ${data.action}`);
            return ContentService.createTextOutput(JSON.stringify({ error: "Invalid POST action", received: data })).setMimeType(ContentService.MimeType.JSON);
          } catch (error) {
            Logger.log(`Error in doPost: ${error.toString()}\nStack: ${error.stack}`);
            return ContentService.createTextOutput(JSON.stringify({ error: "Error processing POST request", details: error.toString() })).setMimeType(ContentService.MimeType.JSON);
          }
        }

        // --- ฟังก์ชันช่วย ---
        function getSheetData(sheetName) {
            const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
            if (!sheet) {
              Logger.log(`Sheet ${sheetName} not found.`);
              return [];
            }
            const data = sheet.getDataRange().getValues();
            if (data.length <= 1) {
              Logger.log(`Sheet ${sheetName} is empty or has only headers.`);
              return [];
            }
            const headers = data.shift();
            return data.map(row => {
                let item = {};
                headers.forEach((header, i) => {
                  const headerString = header ? header.toString().trim() : `column_${i}`;
                  if ((headerString === "Price" || headerString === "Subtotal" || headerString === "ItemPrice") && row[i] !== "" && !isNaN(parseFloat(row[i]))) {
                    item[headerString] = parseFloat(row[i]);
                  } else if (headerString === "Timestamp" && row[i] !== "") {
                    item[headerString] = (row[i] instanceof Date) ? row[i].toISOString() : row[i].toString();
                  } else {
                    item[headerString] = row[i];
                  }
                });
                return item;
            });
        }

        function getMenuItems() {
          return getSheetData(MENU_SHEET_NAME);
        }

        function generateOrderId(tableNumber) {
            return `T${tableNumber}-${new Date().getTime()}`;
        }

        function submitNewOrder(orderData) {
          const ordersSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(ORDERS_SHEET_NAME);
          if (!ordersSheet) {
            Logger.log(`Sheet ${ORDERS_SHEET_NAME} not found for submitting order.`);
            return { success: false, message: `Sheet ${ORDERS_SHEET_NAME} not found.` };
          }
          const menuItems = getMenuItems();
          const timestamp = new Date();
          const orderId = orderData.orderId || generateOrderId(orderData.tableNumber);
          let itemsAdded = 0;
          if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
            Logger.log("No items found in orderData or items is not an array or is empty.");
            return { success: false, message: "No items in order." };
          }
          const headersInSheet = ordersSheet.getRange(1, 1, 1, ordersSheet.getLastColumn()).getValues()[0].map(h => h.toString().trim());
          orderData.items.forEach(itemFromPayload => {
            const menuItem = menuItems.find(m => m.ItemID === itemFromPayload.itemId);
            if (menuItem) {
              let newRowValues = {};
              newRowValues["Timestamp"] = timestamp;
              newRowValues["OrderID"] = orderId;
              newRowValues["TableNumber"] = orderData.tableNumber;
              newRowValues["ItemID"] = itemFromPayload.itemId;
              newRowValues["ItemName"] = menuItem.Name;
              newRowValues["Quantity"] = itemFromPayload.quantity;
              newRowValues["ItemPrice"] = menuItem.Price;
              newRowValues["Subtotal"] = itemFromPayload.quantity * menuItem.Price;
              newRowValues["Status"] = "Preparing"; // สถานะเริ่มต้นเมื่อสั่ง
              newRowValues["ItemNote"] = itemFromPayload.note || "";
              let rowToAppend = headersInSheet.map(header => newRowValues[header] !== undefined ? newRowValues[header] : "");
              ordersSheet.appendRow(rowToAppend);
              itemsAdded++;
            } else {
              Logger.log(`Item ID ${itemFromPayload.itemId} not found in menu.`);
            }
          });
          if (itemsAdded > 0) {
            Logger.log(`Successfully added ${itemsAdded} items for order ${orderId} with status 'Preparing'`);
            return { success: true, orderId: orderId, message: `ออเดอร์ ${itemsAdded} รายการถูกส่งไปที่ห้องครัวแล้ว` };
          } else {
            Logger.log(`Failed to add any items for order.`);
            return { success: false, message: "ไม่สามารถเพิ่มรายการอาหารได้ อาจเนื่องจากไม่มีรายการในเมนู" };
          }
        }

        function getOrdersForTable(tableNumber) {
          const allOrders = getSheetData(ORDERS_SHEET_NAME);
          const filteredOrders = allOrders.filter(order =>
            order.TableNumber == tableNumber &&
            !["Paid", "Cancelled"].includes(order.Status) &&
            order.Status !== "Billed" // Billed ก็ไม่ควรเห็นในหน้านี้แล้ว
          );
          Logger.log(`getOrdersForTable for table ${tableNumber} found ${filteredOrders.length} items.`);
          return filteredOrders;
        }

        function getAllActiveOrders() {
            const allOrders = getSheetData(ORDERS_SHEET_NAME);
            const ordersByTable = {};
            allOrders.forEach(orderItem => {
                if (!ordersByTable[orderItem.TableNumber]) {
                    ordersByTable[orderItem.TableNumber] = {
                        table: orderItem.TableNumber,
                        orders: [],
                        orderIds: new Set()
                    };
                }
                ordersByTable[orderItem.TableNumber].orders.push(orderItem);
                ordersByTable[orderItem.TableNumber].orderIds.add(orderItem.OrderID);
            });
            const activeTablesArray = [];
            for (const tableNum in ordersByTable) {
                const tableData = ordersByTable[tableNum];
                let currentTableTotal = 0;
                let hasAnyActiveItemInThisTable = false;
                let itemsForThisActiveSession = [];
                tableData.orders.forEach(item => {
                    if (item.Status !== "Paid" && item.Status !== "Cancelled") {
                        hasAnyActiveItemInThisTable = true;
                        currentTableTotal += parseFloat(item.Subtotal || 0);
                        itemsForThisActiveSession.push(item);
                    } else if (item.Status === "Cancelled") {
                        const isOrderStillActive = tableData.orders.some(o => o.OrderID === item.OrderID && o.Status !== "Paid" && o.Status !== "Cancelled");
                        if(isOrderStillActive){
                            itemsForThisActiveSession.push(item);
                        }
                    }
                });
                if (hasAnyActiveItemInThisTable) {
                    activeTablesArray.push({
                        table: tableData.table,
                        orders: itemsForThisActiveSession.sort((a,b) => new Date(a.Timestamp) - new Date(b.Timestamp)),
                        totalAmount: currentTableTotal,
                        orderIds: Array.from(new Set(itemsForThisActiveSession.map(o=>o.OrderID)))
                    });
                }
            }
            Logger.log(`getAllActiveOrders returning ${activeTablesArray.length} tables: ${activeTablesArray.map(t=>t.table).join(', ')}`);
            return activeTablesArray;
        }

        function getKitchenQueueOrders() {
          const allOrders = getSheetData(ORDERS_SHEET_NAME);
          const filteredOrders = allOrders.filter(order => order.Status === "Preparing")
                          .sort((a,b) => {
                              const dateA = (a.Timestamp instanceof Date) ? a.Timestamp : new Date(a.Timestamp);
                              const dateB = (b.Timestamp instanceof Date) ? b.Timestamp : new Date(b.Timestamp);
                              if (isNaN(dateA.valueOf()) || isNaN(dateB.valueOf())) return 0;
                              return dateA - dateB;
                          });
          Logger.log(`getKitchenQueueOrders found ${filteredOrders.length} 'Preparing' items.`);
          return filteredOrders;
        }

        function markOrdersAsPaid(tableNumber) {
            const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
            const sheet = ss.getSheetByName(ORDERS_SHEET_NAME);
            if (!sheet) {
              Logger.log(`Sheet ${ORDERS_SHEET_NAME} not found.`);
              return { success: false, message: `Sheet ${ORDERS_SHEET_NAME} not found.`};
            }
            const range = sheet.getDataRange();
            const values = range.getValues();
            if (values.length <= 1) {
              Logger.log("No data in Orders sheet.");
              return { success: false, message: "No data in Orders sheet."};
            }
            const headers = values[0];
            let totalAmountPaid = 0;
            let orderIdsMarkedPaid = new Set();
            const tableCol = headers.indexOf("TableNumber");
            const statusCol = headers.indexOf("Status");
            const subtotalCol = headers.indexOf("Subtotal");
            const orderIdCol = headers.indexOf("OrderID");
            if (tableCol === -1 || statusCol === -1 || subtotalCol === -1 || orderIdCol === -1) {
              Logger.log(`Missing required columns in Orders sheet for marking paid`);
              return { success: false, message: "ไม่พบคอลัมน์ที่จำเป็นในชีท Orders" };
            }
            let itemsUpdated = false;
            for (let i = 1; i < values.length; i++) {
                if (values[i][tableCol] == tableNumber &&
                    values[i][statusCol] !== "Paid" &&
                    values[i][statusCol] !== "Cancelled") {
                    const subtotalValue = parseFloat(values[i][subtotalCol]);
                    if (!isNaN(subtotalValue)) {
                        totalAmountPaid += subtotalValue;
                    }
                    values[i][statusCol] = "Paid";
                    orderIdsMarkedPaid.add(values[i][orderIdCol]);
                    itemsUpdated = true;
                }
            }
            if (itemsUpdated) {
              range.setValues(values);
              Logger.log(`Marked orders as Paid for table ${tableNumber}: Total = ${totalAmountPaid.toFixed(2)}, Orders Affected: ${Array.from(orderIdsMarkedPaid).join(', ')}`);
              return {
                  success: true,
                  tableNumber: tableNumber,
                  totalAmount: totalAmountPaid,
                  message: `โต๊ะ ${tableNumber} ชำระเงินเรียบร้อย ยอดรวม ${totalAmountPaid.toFixed(2)} บาท`,
                  orderIds: Array.from(orderIdsMarkedPaid)
              };
            } else {
              let hasOpenItemsForThisTable = false;
              for (let i = 1; i < values.length; i++) {
                if (values[i][tableCol] == tableNumber &&
                    values[i][statusCol] !== "Paid" &&
                    values[i][statusCol] !== "Cancelled") {
                    hasOpenItemsForThisTable = true;
                    break;
                }
              }
              if (!hasOpenItemsForThisTable) {
                  Logger.log(`No items to mark as paid for table ${tableNumber}. All items might be already paid or cancelled.`);
                  return { success: true, tableNumber: tableNumber, totalAmount: 0, message: `โต๊ะ ${tableNumber} ไม่มีรายการที่ต้องชำระเงินเพิ่มเติม หรือถูกเคลียร์แล้ว`};
              } else {
                  Logger.log(`No items were updated to 'Paid' for table ${tableNumber}, but open items might still exist.`);
                  return { success: false, tableNumber: tableNumber, totalAmount: 0, message: `ไม่สามารถดำเนินการสำหรับโต๊ะ ${tableNumber} ได้ในขณะนี้ เนื่องจากไม่พบรายการที่สามารถอัปเดตได้`};
              }
            }
        }

        function updateItemStatusInSheet(orderId, itemId, newStatus) {
            const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
            const sheet = ss.getSheetByName(ORDERS_SHEET_NAME);
            if (!sheet) return { success: false, message: `Sheet ${ORDERS_SHEET_NAME} not found.`};
            const range = sheet.getDataRange();
            const values = range.getValues();
            if (values.length <= 1) return { success: false, message: "No data in Orders sheet."};
            const headers = values[0];
            let itemUpdated = false;
            const orderIdCol = headers.indexOf("OrderID");
            const itemIdCol = headers.indexOf("ItemID");
            const statusCol = headers.indexOf("Status");
            if (orderIdCol === -1 || itemIdCol === -1 || statusCol === -1) {
              Logger.log(`Missing required columns for status update`);
              return { success: false, message: "ไม่พบคอลัมน์ที่จำเป็นในชีท Orders สำหรับอัปเดตสถานะ" };
            }
            for (let i = 1; i < values.length; i++) {
                if (values[i][orderIdCol] == orderId && 
                    values[i][itemIdCol] == itemId && 
                    values[i][statusCol] === "Preparing") { // อัปเดตเฉพาะรายการที่เป็น Preparing
                    values[i][statusCol] = newStatus; // newStatus ควรเป็น "Served"
                    itemUpdated = true;
                    break; 
                }
            }
            if(itemUpdated) {
                range.setValues(values);
                Logger.log(`Status of item ${itemId} in order ${orderId} updated to ${newStatus}`);
                return { success: true, message: `อัปเดตสถานะของ ${itemId} ในออเดอร์ ${orderId} เป็น ${newStatus} เรียบร้อยแล้ว` };
            } else {
                Logger.log(`Item ${itemId} in order ${orderId} not found with 'Preparing' status or already processed.`);
                return { success: false, message: `ไม่พบรายการ ${itemId} ในออเดอร์ ${orderId} ที่มีสถานะ "กำลังเตรียม" หรืออาจถูกดำเนินการไปแล้ว` };
            }
        }

        function cancelOrderItem(orderId, itemId, itemTimestampStr) {
          try {
            const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(ORDERS_SHEET_NAME);
            if (!sheet) {
              Logger.log(`Sheet ${ORDERS_SHEET_NAME} not found for cancelling item.`);
              return { success: false, message: `Sheet ${ORDERS_SHEET_NAME} not found.` };
            }
            const range = sheet.getDataRange();
            const values = range.getValues();
            const headers = values[0];
            const orderIdCol = headers.indexOf("OrderID");
            const itemIdCol = headers.indexOf("ItemID");
            const timestampCol = headers.indexOf("Timestamp");
            const statusCol = headers.indexOf("Status");
            if (orderIdCol === -1 || itemIdCol === -1 || timestampCol === -1 || statusCol === -1) {
              Logger.log("Required columns (OrderID, ItemID, Timestamp, Status) not found for cancellation.");
              return { success: false, message: "ไม่พบคอลัมน์ที่จำเป็นสำหรับการยกเลิกรายการ" };
            }
            let itemCancelled = false;
            const targetTimestampMs = new Date(itemTimestampStr).getTime();
            if (isNaN(targetTimestampMs)) {
                Logger.log(`Invalid itemTimestampStr received: ${itemTimestampStr}`);
                return { success: false, message: "Timestamp ของรายการไม่ถูกต้อง" };
            }
            for (let i = 1; i < values.length; i++) {
              const rowOrderId = values[i][orderIdCol];
              const rowItemId = values[i][itemIdCol];
              const rowTimestampObj = values[i][timestampCol];
              if (rowTimestampObj instanceof Date && !isNaN(rowTimestampObj.valueOf())) {
                const rowTimestampMs = rowTimestampObj.getTime();
                if (
                  rowOrderId == orderId &&
                  rowItemId == itemId &&
                  rowTimestampMs === targetTimestampMs &&
                  values[i][statusCol] !== "Cancelled" &&
                  values[i][statusCol] !== "Paid"
                ) {
                  values[i][statusCol] = "Cancelled";
                  itemCancelled = true;
                }
              } else {
                Logger.log(`Invalid Date object at row ${i+1}, column ${timestampCol+1}: ${rowTimestampObj}`);
              }
            }
            if (itemCancelled) {
              range.setValues(values);
              Logger.log(`Item ${itemId} in order ${orderId} (Timestamp: ${itemTimestampStr}) cancelled successfully.`);
              return { success: true, message: `รายการ ${itemId} ในออเดอร์ ${orderId} ถูกยกเลิกแล้ว` };
            } else {
              Logger.log(`Item ${itemId} in order ${orderId} (Timestamp: ${itemTimestampStr}) not found or already processed/cancelled.`);
              return { success: false, message: `ไม่พบรายการ ${itemId} ในออเดอร์ ${orderId} ที่สามารถยกเลิกได้ หรือรายการถูกดำเนินการไปแล้ว` };
            }
          } catch (error) {
            Logger.log(`Error in cancelOrderItem: ${error.toString()}\nStack: ${error.stack}`);
            return { success: false, message: `เกิดข้อผิดพลาดบนเซิร์ฟเวอร์: ${error.toString()}` };
          }
        }
        ```
    * **สำคัญมาก:** แก้ไข `YOUR_SPREADSHEET_ID_HERE` ในบรรทัด `const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";` ให้เป็น ID ของ Google Sheet ของคุณ
    * บันทึกโปรเจกต์ (ตั้งชื่อตามต้องการ เช่น "RestaurantOrderAPI")
    * **Deploy Web App:**
        1.  คลิก "การทำให้ใช้งานได้" (Deploy) > "การทำให้ใช้งานได้รายการใหม่" (New deployment)
        2.  คลิกที่รูปเฟือง (Select type) เลือก "เว็บแอป" (Web app)
        3.  **คำอธิบาย:** (ใส่คำอธิบาย เช่น "Restaurant Order API v1.0")
        4.  **เรียกใช้งานในฐานะ:** "ฉัน" (Me (your-email@gmail.com))
        5.  **ผู้ที่มีสิทธิ์เข้าถึง:** **"ทุกคน" (Anyone)** (สำคัญมาก!)
        6.  คลิก "ทำให้ใช้งานได้" (Deploy)
        7.  ระบบจะขอสิทธิ์การเข้าถึง (Authorize access) ให้คลิก "ให้สิทธิ์เข้าถึง" และทำตามขั้นตอน (อาจจะต้องคลิก "ขั้นสูง" (Advanced) > "ไปที่ \[ชื่อโปรเจกต์ของคุณ] (ไม่ปลอดภัย)" (Go to \[Your Project Name] (unsafe)) แล้วกด "อนุญาต" (Allow))
        8.  หลังจาก Deploy สำเร็จ คุณจะได้รับ **URL ของเว็บแอป** ให้คัดลอก URL นี้เก็บไว้

4.  **ตั้งค่าไฟล์ `js/config.js`:**
    * เปิดไฟล์ `js/config.js` ในโปรเจกต์ของคุณ
    * นำ URL ของเว็บแอปที่คุณคัดลอกไว้ในขั้นตอนที่แล้ว มาใส่แทนที่ `"YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL"`
        ```javascript
        const GAS_WEB_APP_URL = "URL_เว็บแอปของคุณที่คัดลอกมา";
        ```

5.  **นำโค้ดทั้งหมดขึ้น GitHub Pages:**
    * Upload โฟลเดอร์โปรเจกต์ทั้งหมดของคุณ (ที่มี `index.html`, `admin.html`, `kitchen.html`, `css/`, `js/`, `assets/`) ขึ้นไปยัง GitHub Repository
    * เปิดใช้งาน GitHub Pages สำหรับ Repository นั้น (Settings > Pages > Deploy from a branch > เลือก branch `main` และ folder `/ (root)`)

6.  **สร้าง QR Codes:**
    * สำหรับแต่ละโต๊ะ สร้าง QR Code ที่ลิงก์ไปยังหน้าลูกค้า โดยระบุหมายเลขโต๊ะใน URL parameter
    * ตัวอย่างสำหรับโต๊ะ 1: `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/index.html?table=1`
    * ตัวอย่างสำหรับโต๊ะ 5: `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/index.html?table=5`

## 🏁 บทสรุป และแนวทางการพัฒนาต่อ

ระบบสั่งอาหารนี้เป็นจุดเริ่มต้นที่ดีในการนำเทคโนโลยีมาช่วยเพิ่มประสิทธิภาพและลดภาระงานให้กับร้านอาหารขนาดเล็ก หวังว่าจะเป็นประโยชน์กับร้านอื่นๆ ด้วยเช่นกัน การเดินทางในการพัฒนาร่วมกับ AI แสดงให้เห็นถึงพลังของการทำงานร่วมกันระหว่างมนุษย์และเทคโนโลยีในการสร้างสรรค์สิ่งใหม่ๆ

**แนวทางการพัฒนาต่อในอนาคต (Ideas for Future Development):**

* **ระบบสมาชิกเบื้องต้น:** เพื่อเก็บประวัติการสั่งซื้อของลูกค้าประจำ หรือให้ส่วนลดพิเศษ
* **เมนูหลายภาษา:** เพิ่มการรองรับภาษาอื่นๆ (เช่น ภาษาพม่า) สำหรับหน้าครัวหรือหน้าลูกค้า
* **การจัดการสต็อกเบื้องต้น:** แจ้งเตือนเมื่อวัตถุดิบบางอย่างใกล้หมด (ซับซ้อนขึ้น)
* **รายงานสรุปยอดขาย:** ดึงข้อมูลจาก Google Sheet มาทำสรุปยอดขายรายวัน/รายเดือน
* **การปรับแต่ง UI/UX เพิ่มเติม:** ทำให้สวยงามและใช้งานง่ายยิ่งขึ้นตาม Feedback ที่ได้รับ
* **การแจ้งเตือนแบบ Real-time มากขึ้น:** อาจจะพิจารณาใช้ Firebase หรือเทคโนโลยีอื่นร่วมด้วยถ้าต้องการการอัปเดตที่ทันทีทันใดกว่า Polling (แต่จะไม่อยู่บน GitHub Pages อย่างเดียวแล้ว)

ขอให้โปรเจกต์นี้เป็นเครื่องมือที่ช่วยให้ร้านข้าวต้มปลาของแฟนคุณเติบโตและประสบความสำเร็จยิ่งๆ ขึ้นไปนะครับ! และขอเป็นกำลังใจให้กับการพัฒนาต่อยอดในอนาคตครับ หากมีไอเดียหรือต้องการคำปรึกษาเพิ่มเติม AI เพื่อนคู่คิดคนนี้ก็พร้อมจะช่วยเสมอครับ 😊

