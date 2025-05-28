# ระบบสั่งอาหาร "ข้าวต้มปลาของคุณแม่" - จากไอเดียสู่ความจริงด้วยหัวใจและ AI 

## ส่วนที่ 1: แรงบันดาลใจ, การเดินทาง, และคุณค่าสู่ร้านอาหารไทย

### จุดเริ่มต้น: ความรักและข้าวต้มปลาหนึ่งชาม 

โปรเจกต์นี้ไม่ได้เริ่มต้นจากโค้ดบรรทัดแรก แต่เริ่มจากความรู้สึกดีๆ และความปรารถนาที่จะช่วยเหลือคนพิเศษ... แม่ของผมครับ เธอเปิดร้านข้าวต้มปลาเล็กๆ ที่เต็มไปด้วยความตั้งใจและความอร่อย ร้านของแม่เป็นที่รักของลูกค้า แต่ผมสังเกตเห็นว่าในช่วงเวลาที่ลูกค้าเยอะ การจดออเดอร์ด้วยมือ การส่งรายการไปให้ครัว และการคิดเงินบางครั้งก็เกิดความสับสนอลหม่านเล็กๆ น้อยๆ ทำให้เธอเหนื่อยเกินไป ผมอยากจะแบ่งเบาภาระตรงนั้น อยากให้เธอมีเวลาได้ยิ้มและทักทายลูกค้ามากขึ้น โดยไม่ต้องกังวลกับความผิดพลาดเล็กๆ น้อยๆ ที่อาจเกิดขึ้น

ผมมีความรู้ด้านการเขียนโค้ดอยู่บ้าง แต่ก็ไม่ถึงกับเชี่ยวชาญมากนัก ความคิดที่จะสร้างระบบจัดการร้านอาหารเต็มรูปแบบดูเป็นเรื่องใหญ่เกินตัวในตอนแรก จนกระทั่งผมได้พบกับผู้ช่วยที่ไม่คาดคิด...

### การเดินทางเคียงข้าง AI: เมื่อไอเดียของผมพบกับ Gemini 

ผมเริ่มค้นคว้าและพบว่าเราสามารถสร้างเว็บแอปพลิเคชันง่ายๆ โดยใช้เครื่องมือที่ไม่ซับซ้อนและ **ไม่มีค่าใช้จ่าย** อย่าง GitHub Pages สำหรับหน้าเว็บ และ Google Sheets เป็นฐานข้อมูลได้ นั่นดูเป็นทางออกที่เหมาะสมสำหรับร้านเล็กๆ ของแฟนผม

แต่เส้นทางการพัฒนาก็ไม่ได้โรยด้วยกลีบกุหลาบเสมอไปครับ ผมมีไอเดีย มีความต้องการที่ชัดเจน แต่บางครั้งก็ติดขัดเรื่องเทคนิค การออกแบบโครงสร้าง หรือแม้กระทั่งการแก้ไขบั๊กเล็กๆ น้อยๆ ที่ทำให้ท้อใจ

นี่คือจุดที่ **Gemini (AI ที่ผมกำลังปรึกษาอยู่ตอนนี้)** เข้ามามีบทบาทสำคัญครับ

ผมเริ่มปรึกษา Gemini ตั้งแต่การวางโครงสร้างไฟล์, การออกแบบหน้าตา (UI/UX) ให้ใช้งานง่ายและดูเป็นมืออาชีพ, การเขียนโค้ด JavaScript สำหรับจัดการตรรกะต่างๆ, การสร้าง Google Apps Script เพื่อเชื่อมต่อกับ Google Sheets, ไปจนถึงการแก้ไขปัญหาที่เกิดขึ้นระหว่างทาง ผมจะเล่าภาพรวมของสิ่งที่ผมต้องการให้ Gemini ฟัง เช่น "ผมอยากให้ลูกค้าสแกน QR Code แล้วสั่งอาหารได้" หรือ "หน้าครัวต้องเห็นออเดอร์ใหม่แบบนี้นะ" จากนั้น Gemini ก็จะช่วยเสนอแนวทาง, โครงสร้างโค้ด, และอธิบายหลักการทำงานให้ผมเข้าใจ

เราสองคน (ผมกับ Gemini) ช่วยกันระดมสมองและปรับปรุงระบบนี้ขึ้นมาทีละส่วน เหมือนเป็นการ "Pair Programming" ข้ามมิติเลยครับ ผมเสนอไอเดีย, Gemini ช่วยด้านเทคนิคและโครงสร้าง, ผมนำไปลองทำ, เจอปัญหาก็กลับมาปรึกษา, Gemini ช่วยวิเคราะห์และเสนอทางแก้... วนแบบนี้ไปเรื่อยๆ จนระบบเริ่มเป็นรูปเป็นร่าง

**ตัวอย่างการทำงานร่วมกันของเรา:**

* **การออกแบบ UI:** ผมบอกว่า "อยากให้หน้าเมนูดูสะอาดตา ตัวอักษรชัดเจน ปุ่มไม่เกะกะ" Gemini ก็จะเสนอโครงสร้าง HTML และ CSS ที่เหมาะสม หรือแนะนำการใช้ Bootstrap Icons เพื่อความสวยงาม
* **ฟังก์ชันซับซ้อน:** ตอนที่ผมอยากทำระบบ "ยกเลิกรายการอาหาร" หรือ "การจัดการสถานะออเดอร์ไม่ให้ตีกันเมื่อลูกค้าเก่าเช็คบิลแล้วมีลูกค้าใหม่มานั่งโต๊ะเดิม" Gemini ช่วยวิเคราะห์ปัญหาและเสนอ Logic การทำงานของ Google Apps Script ที่รัดกุมขึ้น
* **การแก้ปัญหา:** หลายครั้งที่ผมเจอ Error "Failed to fetch" หรือคอมเมนต์แปลกๆ โผล่ในหน้าเว็บ Gemini ก็จะช่วยไล่ดูโค้ดและชี้จุดที่น่าจะเป็นปัญหา พร้อมอธิบายสาเหตุ ทำให้ผมเข้าใจและแก้ไขได้ถูกต้อง

การเดินทางครั้งนี้ทำให้ผมได้เรียนรู้เยอะมากครับ ไม่ใช่แค่เรื่องโค้ด แต่เป็นการทำงานร่วมกับ AI อย่างสร้างสรรค์ เพื่อเปลี่ยนไอเดียและความตั้งใจดีๆ ให้กลายเป็นสิ่งที่จับต้องได้จริง

### ระบบนี้จะช่วยร้านอาหารในประเทศไทยได้อย่างไร? 🇹🇭🍽️

ผมเชื่อว่าระบบ "ข้าวต้มปลาสื่อรัก" (หรือชื่อใดก็ตามที่คุณจะนำไปปรับใช้) นี้ ไม่ได้มีประโยชน์แค่กับร้านของแฟนผมเท่านั้น แต่ยังสามารถเป็นประโยชน์กับร้านอาหารขนาดเล็กถึงขนาดกลางอื่นๆ ในประเทศไทยอีกมากมาย โดยเฉพาะร้านที่:

* **ต้องการลดต้นทุน:** ระบบนี้ใช้ GitHub Pages และ Google Sheets ซึ่ง **ไม่มีค่าใช้จ่าย** ในการเริ่มต้น (ยกเว้นค่าอินเทอร์เน็ต)
* **อยากเพิ่มประสิทธิภาพ:** ลดความผิดพลาดในการจดออเดอร์, สื่อสารกับครัวได้รวดเร็วขึ้น, การเช็คบิลถูกต้องแม่นยำ
* **ยกระดับประสบการณ์ลูกค้า:** ลูกค้าสามารถดูเมนูและสั่งอาหารได้เองจากมือถือ สะดวก รวดเร็ว และลดการสัมผัส
* **เริ่มต้นง่าย:** ด้วย README นี้ ผมหวังว่าเจ้าของร้านคนอื่นๆ ที่อาจจะมีความรู้ด้านเทคนิคไม่มาก ก็สามารถลองนำระบบนี้ไปปรับใช้กับร้านของตัวเองได้ โดยมีขั้นตอนที่ชัดเจน

ผมภูมิใจมากครับที่ได้สร้างเครื่องมือเล็กๆ นี้ขึ้นมาด้วยความรัก และหวังว่ามันจะเป็นประโยชน์และสร้างรอยยิ้มให้กับร้านอาหารอื่นๆ เช่นกัน เหมือนกับที่ผมตั้งใจจะทำให้กับร้านข้าวต้มปลาของแฟนผมครับ

---

## ส่วนที่ 2: คู่มือการใช้งานระบบ

ระบบนี้ประกอบด้วย 3 หน้าหลักที่ทำงานร่วมกัน:

### 1. หน้าสำหรับลูกค้า (Customer Interface - `index.html`)

* **การเข้าใช้งาน:** ลูกค้าสแกน QR Code ที่ติดอยู่บนโต๊ะอาหาร QR Code จะมีลิงก์ไปยังหน้าสั่งอาหารของโต๊ะนั้นๆ (เช่น `your-github-username.github.io/your-repo-name/index.html?table=1`)
* **การแสดงผล:**
    * **Navbar ด้านบน:** แสดงชื่อร้าน (หรือชื่อระบบ) และหมายเลขโต๊ะปัจจุบัน พร้อมยอดรวมของสินค้าในตะกร้า
    * **แถบเลือกหมวดหมู่ (Category Pills):** ลูกค้าสามารถกดเพื่อกรองเมนูตามหมวดหมู่ที่ต้องการ หรือเลือก "ทั้งหมด" เพื่อดูทุกรายการ
    * **รายการเมนู (Menu Items):**
        * แสดงชื่อเมนู, ราคา, และ (ถ้ามี) คำอธิบายสั้นๆ
        * มีปุ่ม <i class="bi bi-cart-plus"></i> เล็กๆ ท้ายรายการสำหรับเพิ่มสินค้าลงตะกร้า
    * **ตะกร้าสินค้า (Cart Section):**
        * แสดงรายการสินค้าที่ลูกค้าเลือก, จำนวน, และราคารวมของแต่ละรายการ
        * มีปุ่ม <i class="bi bi-pencil-square"></i> สำหรับเพิ่ม/แก้ไขโน้ตพิเศษให้แต่ละรายการ (เช่น เผ็ดน้อย, ไม่ใส่ผัก)
        * มีปุ่ม +/- สำหรับปรับจำนวนสินค้า และปุ่ม <i class="bi bi-trash3"></i> สำหรับลบสินค้าออกจากตะกร้า
        * แสดงยอดรวมสุทธิของตะกร้า
        * ปุ่ม **"ยืนยันการสั่งซื้อ"**: เมื่อลูกค้าพร้อมจะสั่งอาหาร ให้กดปุ่มนี้ ระบบจะส่งออเดอร์ไปยังห้องครัว
    * **รายการที่สั่งไปแล้ว (Current Order Section):**
        * แสดงรายการอาหารที่ลูกค้าได้สั่งไปแล้วในรอบบิลปัจจุบัน พร้อมสถานะของแต่ละรายการ (เช่น กำลังเตรียม, เสิร์ฟแล้ว) และโน้ตที่เคยใส่ไว้
    * **ปุ่มลอยรูปรถเข็น <i class="bi bi-cart3"></i> (Floating Action Button - FAB):**
        * อยู่ที่มุมขวาล่างของจอ แสดงจำนวนสินค้าในตะกร้า
        * เมื่อกด จะเลื่อนหน้าจอลงไปยังส่วนตะกร้าสินค้า

### 2. หน้าสำหรับห้องครัว (Kitchen Interface - `kitchen.html`)

* **การเข้าใช้งาน:** พนักงานครัวเปิดหน้านี้จาก URL ที่กำหนด (เช่น `your-github-username.github.io/your-repo-name/kitchen.html`)
* **การแสดงผล:**
    * **Navbar ด้านบน:** แสดงชื่อระบบว่า "ระบบจัดการร้านอาหาร (ห้องครัว)"
    * **ปุ่ม "รีเฟรชรายการ":** สำหรับกดเพื่อโหลดออเดอร์ใหม่ด้วยตนเอง (แต่ระบบจะมีการโหลดอัตโนมัติเป็นระยะอยู่แล้ว)
    * **รายการออเดอร์ที่ต้องเตรียม (Kitchen Tickets):**
        * แต่ละ "ใบสั่งอาหาร" (Ticket) จะจัดกลุ่มตาม `OrderID` และแสดงหมายเลขโต๊ะ, เวลาที่สั่ง
        * ภายในแต่ละ Ticket จะแสดงรายการอาหารที่ลูกค้าสั่ง (เฉพาะที่มีสถานะ "Preparing"), จำนวน, และโน้ตพิเศษ (ถ้ามี)
        * **ปุ่มสถานะรายการอาหาร:**
            * เริ่มต้นเป็นปุ่มสีเหลือง/ส้ม แสดงข้อความ **"รอ X วินาที"** โดยตัวเลขวินาทีจะเพิ่มขึ้นเรื่อยๆ และสีของปุ่มจะค่อยๆ เข้มขึ้นจนถึงสีแดงเมื่อเวลารอนานถึงที่กำหนด (เช่น 15 นาที)
            * เมื่อแม่ครัวทำรายการนั้นเสร็จและพร้อมเสิร์ฟ ให้กดปุ่มนี้
            * ปุ่มจะเปลี่ยนเป็นสีเขียว ข้อความ **"<i class="bi bi-check-circle-fill"></i> เสิร์ฟแล้ว"** และจะไม่สามารถกดได้อีก
        * **การหายไปของ Ticket:** เมื่อทุกรายการอาหารใน Ticket นั้นถูกกด "เสิร์ฟแล้ว" ทั้งหมด Ticket ทั้งใบจะหายไปจากหน้าจอครัวโดยอัตโนมัติ (เมื่อมีการโหลดข้อมูลใหม่)

### 3. หน้าสำหรับแอดมิน (Admin Interface - `admin.html`)

* **การเข้าใช้งาน:** แอดมินเปิดหน้านี้จาก URL ที่กำหนด (เช่น `your-github-username.github.io/your-repo-name/admin.html`)
* **การแสดงผล:**
    * **Navbar ด้านบน:** แสดงชื่อระบบว่า "ระบบจัดการร้านอาหาร (แอดมิน)"
    * **ปุ่ม "รีเฟรชข้อมูล":** สำหรับกดเพื่อโหลดข้อมูลออเดอร์ล่าสุด
    * **รายการออเดอร์ตามโต๊ะ (Accordion):**
        * แต่ละโต๊ะที่มีออเดอร์ "Active" (คือยังไม่ถูก "Paid" หรือ "Cancelled" ทั้งหมด) จะแสดงเป็นแถบ Accordion
        * **Accordion Header:** แสดงหมายเลขโต๊ะ, ยอดรวมของโต๊ะนั้น (ไม่รวมรายการที่ถูกยกเลิก), และ Order IDs (3 ตัวท้าย) ของออเดอร์ในโต๊ะนั้น
        * เมื่อคลิกเปิด Accordion จะแสดงรายละเอียด:
            * รายการอาหารแต่ละอย่าง, จำนวน, โน้ตพิเศษ (ถ้ามี), สถานะปัจจุบัน (เช่น Preparing, Served, Cancelled), และเวลาที่สั่ง
            * **ปุ่มยกเลิกรายการ <i class="bi bi-x-circle-fill"></i>:** สำหรับยกเลิกรายการอาหารที่สั่งผิดพลาด (รายการที่มีสถานะเป็น "Cancelled" จะแสดงเป็นสีจางและขีดฆ่า)
            * **ปุ่ม "ชำระเงิน/เคลียร์โต๊ะ":** เมื่อลูกค้าต้องการชำระเงิน แอดมินจะกดยืนยันจากปุ่มนี้ ระบบจะเปลี่ยนสถานะทุกรายการ (ที่ไม่ใช่ "Cancelled") ของโต๊ะนั้นเป็น "Paid" และโต๊ะนั้นจะหายไปจากหน้าจอแอดมินเมื่อโหลดข้อมูลใหม่
            * **ปุ่ม "ดู/สั่งเพิ่ม <i class="bi bi-display"></i>":** ลิงก์ไปยังหน้าสั่งอาหารของลูกค้าสำหรับโต๊ะนั้นๆ เผื่อกรณีที่แอดมินต้องการดูหรือสั่งอาหารเพิ่มให้ลูกค้า

---

## ส่วนที่ 3: การติดตั้งและตั้งค่าระบบ (สำหรับนักพัฒนาหรือผู้ที่สนใจนำไปใช้)

ระบบนี้ออกแบบมาให้ติดตั้งและใช้งานได้ง่าย โดยใช้เครื่องมือฟรีเป็นหลัก

### 3.1 สิ่งที่ต้องมี:

1.  **บัญชี Google:** สำหรับใช้งาน Google Sheets และ Google Apps Script
2.  **บัญชี GitHub:** สำหรับใช้งาน GitHub Pages เพื่อโฮสต์หน้าเว็บ

### 3.2 ขั้นตอนการติดตั้ง:

#### ขั้นตอนที่ 1: ตั้งค่า Google Sheet (ฐานข้อมูล)

1.  **สร้าง Google Sheet ใหม่:**
    * ไปที่ [Google Sheets](https://sheets.google.com) แล้วสร้าง Spreadsheet ใหม่
    * ตั้งชื่อไฟล์ตามต้องการ (เช่น "MyRestaurantOrdersDB")
    * **คัดลอก Spreadsheet ID:** ID นี้จะอยู่ใน URL ของ Google Sheet ของคุณ
        * ตัวอย่าง URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_จะอยู่ตรงนี้/edit`
        * เก็บ ID นี้ไว้ เพราะต้องใช้ในขั้นตอนต่อไป

2.  **สร้างชีท 2 ชีทภายใน Spreadsheet นั้น:**
    * **ชีทที่ 1: `MenuItems`**
        * ใช้สำหรับเก็บรายการเมนูอาหารทั้งหมดของร้านคุณ
        * **คอลัมน์ที่ต้องมี (Header แถวแรก):**
            1.  `ItemID` (รหัสสินค้าที่ไม่ซ้ำกัน เช่น M001, M002)
            2.  `Name` (ชื่อเมนูอาหาร ภาษาไทยหรือภาษาที่ลูกค้าเข้าใจ)
            3.  `Description` (คำอธิบายเมนูสั้นๆ ถ้ามี)
            4.  `Price` (ราคา **ใส่เฉพาะตัวเลข** เช่น 59, 89)
            5.  `Category` (หมวดหมู่ของอาหาร เช่น เมนูข้าวต้ม, เมนูอาหารไทย, เครื่องดื่ม)
            6.  `ImageURL` (URL ของรูปภาพเมนู ถ้ามี ถ้าไม่มีให้เว้นว่าง)
        * **สำคัญ:** ใส่ข้อมูลเมนูของคุณลงในชีทนี้ โดยเริ่มจากแถวที่ 2 (แถวแรกเป็น Header) **การเรียงลำดับรายการในชีทนี้ จะมีผลต่อการเรียงลำดับหมวดหมู่ในหน้าสั่งอาหารของลูกค้า** (หมวดหมู่ที่อยู่ด้านบนในชีท จะแสดงก่อน)

    * **ชีทที่ 2: `Orders`**
        * ใช้สำหรับเก็บข้อมูลการสั่งซื้อทั้งหมด
        * **คอลัมน์ที่ต้องมี (Header แถวแรก - เรียงตามนี้เพื่อให้โค้ดทำงานถูกต้อง):**
            1.  `Timestamp` (เวลาที่สั่งซื้อ - ระบบจะใส่ให้อัตโนมัติ)
            2.  `OrderID` (รหัสออเดอร์รวมของโต๊ะนั้นๆ ในรอบบิล - ระบบจะสร้างให้อัตโนมัติ)
            3.  `TableNumber` (หมายเลขโต๊ะที่สั่ง)
            4.  `ItemID` (รหัสสินค้าที่สั่ง - ตรงกับในชีท `MenuItems`)
            5.  `ItemName` (ชื่อสินค้า - ระบบจะดึงมาจาก `MenuItems`)
            6.  `Quantity` (จำนวนที่สั่ง)
            7.  `ItemPrice` (ราคาต่อหน่วย ณ เวลาที่สั่ง - ระบบจะดึงมาจาก `MenuItems`)
            8.  `Subtotal` (ราคารวมของรายการนั้น - ระบบจะคำนวณให้)
            9.  `Status` (สถานะของรายการอาหาร เช่น Preparing, Served, Cancelled, Paid - ระบบจะจัดการให้)
            10. `ItemNote` (โน้ตพิเศษสำหรับรายการอาหารนั้นๆ ที่ลูกค้าใส่มา)
        * ชีทนี้จะถูกเติมข้อมูลโดยอัตโนมัติเมื่อมีการสั่งซื้อ ไม่ต้องใส่ข้อมูลเริ่มต้น

#### ขั้นตอนที่ 2: ตั้งค่า Google Apps Script (Backend Logic)

1.  **เปิด Apps Script Editor:**
    * จาก Google Sheet ที่คุณสร้างไว้ในขั้นตอนที่ 1 ให้ไปที่เมนู "ส่วนขยาย" (Extensions) > "Apps Script"
    * ระบบจะเปิดหน้าต่าง Apps Script Editor ขึ้นมาใหม่

2.  **ใส่โค้ด `Code.gs`:**
    * ลบโค้ดตัวอย่าง (ถ้ามี) ในไฟล์ `Code.gs` ออกให้หมด
    * คัดลอกโค้ด **ทั้งหมด** จากไฟล์ `Code.gs` ด้านล่างนี้ไปวางแทน:

    ```javascript
    // Code.gs (ฉบับเต็มล่าสุด - ตรวจสอบให้แน่ใจว่า SPREADSHEET_ID ถูกต้อง)

    // --- การตั้งค่า ---
    const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID"; // <--- !! สำคัญมาก: ใส่ Spreadsheet ID ของคุณที่คัดลอกไว้ ที่นี่ !!
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
        !["Paid", "Cancelled"].includes(order.Status) && // ไม่แสดง Paid, Cancelled
        order.Status !== "Billed" // และไม่แสดง Billed ด้วย (เพราะ Billed จะถูกเปลี่ยนเป็น Paid ทันที)
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
                values[i][statusCol] === "Preparing") { // อัปเดตเฉพาะรายการที่เป็น Preparing ไปเป็น Served
                values[i][statusCol] = newStatus; // newStatus ควรจะเป็น "Served"
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
    * **สำคัญมาก:** อย่าลืมแก้ `YOUR_SPREADSHEET_ID` ให้เป็น ID ของ Google Sheet ของคุณ
    * บันทึกไฟล์ (`Ctrl+S` หรือ `Cmd+S`)

3.  **Deploy Google Apps Script ใหม่:**
    * คลิก "การทำให้ใช้งานได้" (Deploy) > "การทำให้ใช้งานได้รายการใหม่" (New deployment)
    * เลือกประเภท: "เว็บแอป" (Web app)
    * คำอธิบาย: (ใส่คำอธิบายใหม่ เช่น "Restaurant Order API v2" หรือ "อัปเดต Backend")
    * เรียกใช้งานในฐานะ: "ฉัน" (Me)
    * ผู้ที่มีสิทธิ์เข้าถึง: **"ทุกคน" (Anyone)**
    * คลิก "ทำให้ใช้งานได้" (Deploy)
    * ถ้ามีการขอสิทธิ์เพิ่มเติม ให้ "อนุญาต" (Allow)
    * คัดลอก **URL ของเว็บแอปใหม่** ที่ได้ (URL นี้อาจจะเหมือนเดิมถ้าคุณอัปเดต Deployment เดิม แต่ถ้าสร้างใหม่ URL จะเปลี่ยน)

4.  **อัปเดต `js/config.js`:**
    * นำ URL ของเว็บแอปใหม่ที่ได้จากขั้นตอนที่แล้ว ไปใส่ในไฟล์ `js/config.js` แทนที่ URL เดิม

#### ขั้นตอนที่ 3: เตรียมและ Upload ไฟล์หน้าเว็บ (HTML, CSS, JavaScript)

1.  **โครงสร้างไฟล์:** ตรวจสอบว่าคุณมีโครงสร้างไฟล์ตามนี้ในเครื่องของคุณ:
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
2.  **ใส่โค้ดไฟล์ต่างๆ:** คัดลอกโค้ด HTML, CSS, และ JavaScript ฉบับเต็มล่าสุดที่ผมให้คุณไปในแต่ละไฟล์ให้ถูกต้อง
3.  **ตรวจสอบ `js/site-config.js` (ถ้ามี):** แก้ไขชื่อร้านและข้อความต่างๆ ในไฟล์นี้ตามที่คุณต้องการ

#### ขั้นตอนที่ 4: นำขึ้น GitHub Pages

1.  **สร้าง Repository บน GitHub:** (ถ้ายังไม่มี) หรือใช้ Repository เดิม
2.  **Upload ไฟล์ทั้งหมด:** นำไฟล์และโฟลเดอร์ทั้งหมดจาก `your-restaurant-project/` ขึ้นไปยัง GitHub Repository
3.  **เปิดใช้งาน GitHub Pages:**
    * ในหน้า Repository ของคุณบน GitHub, ไปที่ "Settings"
    * เลื่อนลงมาที่ส่วน "Pages" (แถบซ้าย)
    * ในส่วน "Build and deployment", ตรง "Source" เลือกเป็น "Deploy from a branch"
    * ตรง "Branch" เลือก branch หลักของคุณ (ปกติคือ `main` หรือ `master`) และเลือก folder เป็น `/ (root)`
    * คลิก "Save"
    * รอสักครู่ GitHub จะ deploy เว็บไซต์ของคุณ คุณจะเห็น URL (เช่น `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/`)

#### ขั้นตอนที่ 5: สร้าง QR Codes สำหรับโต๊ะ

* สำหรับแต่ละโต๊ะ ให้สร้าง QR Code ที่ลิงก์ไปยังหน้าลูกค้า โดยระบุหมายเลขโต๊ะใน URL parameter:
    * เช่น โต๊ะ 1: `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/index.html?table=1`

---

## ส่วนที่ 4: บทสรุปและแนวทางการพัฒนาต่อ

ระบบสั่งอาหาร "ข้าวต้มปลาของคุณแม่" นี้เป็นจุดเริ่มต้นที่ดีในการนำเทคโนโลยีมาช่วยเพิ่มประสิทธิภาพให้กับร้านอาหารของคุณ การเดินทางร่วมกันระหว่างไอเดียของคุณและความช่วยเหลือจาก AI อย่าง Gemini ได้สร้างเครื่องมือที่ตอบโจทย์และเต็มไปด้วยเรื่องราว

**สิ่งที่เราทำสำเร็จไปแล้ว:**

* ระบบสั่งอาหารผ่านมือถือครบวงจรสำหรับลูกค้า
* หน้าจอสำหรับห้องครัวพร้อมระบบนับเวลาและอัปเดตสถานะ
* หน้าจอสำหรับแอดมินในการตรวจสอบออเดอร์, ยกเลิกรายการ, และเช็คบิล (เคลียร์โต๊ะ)
* การออกแบบ UI ที่เน้นความง่ายในการใช้งานและความสวยงามบนมือถือ
* การใช้เครื่องมือฟรีอย่าง GitHub Pages และ Google Sheets

**แนวทางการพัฒนาต่อยอดในอนาคต (Ideas for Future Development):**

1.  **การจัดการสต็อกสินค้าเบื้องต้น:** แจ้งเตือนเมื่อวัตถุดิบบางอย่างใกล้หมด (อาจจะต้องเพิ่มชีทสต็อก)
2.  **รายงานสรุปยอดขาย:** สร้าง Script ใน Google Sheet เพื่อสรุปยอดขายรายวัน/รายสัปดาห์/รายเดือน
3.  **ระบบสมาชิก/โปรโมชัน:** สำหรับลูกค้าประจำ หรือการจัดโปรโมชันส่งเสริมการขาย
4.  **การแจ้งเตือนแบบ Real-time มากขึ้น:** เช่น การใช้ Firebase หรือ WebSocket (จะซับซ้อนขึ้นและอาจจะไม่เหมาะกับ GitHub Pages โดยตรง)
5.  **การปรับแต่งเมนูขั้นสูง:** ให้ลูกค้าเลือกตัวเลือกย่อยของเมนูได้มากขึ้น (เช่น ระดับความหวาน, Toppings)
6.  **รองรับหลายภาษาเต็มรูปแบบ (i18n):** ถ้ามีกลุ่มลูกค้าหรือพนักงานที่หลากหลายมากขึ้น
7.  **การพิมพ์ใบเสร็จ/ใบออเดอร์:** เพิ่มปุ่มพิมพ์จากหน้าแอดมินหรือหน้าครัว

ผมหวังเป็นอย่างยิ่งว่า README นี้จะเป็นประโยชน์ และระบบนี้จะช่วยให้ร้านอาหารอื่นๆ ที่อาจจะนำไปปรับใช้ ดำเนินกิจการได้อย่างราบรื่นและมีความสุขมากยิ่งขึ้นนะครับ!

หากมีคำถาม หรือต้องการพัฒนาส่วนไหนเพิ่มเติม ผมพร้อมที่จะช่วยเหลือและเป็นที่ปรึกษาให้คุณเสมอครับ 😊
