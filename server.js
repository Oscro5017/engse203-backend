// server.js
const express = require('express');
require('dotenv').config(); // << เพิ่มบรรทัดนี้ที่ด้านบน

const app = express();
const PORT = process.env.PORT || 3000; // << อ่านค่า PORT จาก .env
const APP_NAME = process.env.APP_NAME;

app.get('/', (req, res) => {
  res.send(`<h1>Hello from ${APP_NAME}!</h1>`);
});

app.listen(PORT, () => {
  console.log(`🚀 ${APP_NAME} is running on http://localhost:${PORT}`);
});

//... (ส่วนบนเหมือนเดิม)
const cors = require('cors'); // << Import cors

require('dotenv').config();

app.use(cors()); // << เพิ่มบรรทัดนี้: ใช้ cors กับทุก request
//... (ส่วนที่เหลือ)

// เพิ่ม Route ใหม่สำหรับทดสอบ
app.get('/api/data', (req, res) => {
    res.json({ message: 'This data is open for everyone!' });
});

//... (ส่วนบนเหมือนเดิม)
const helmet = require('helmet'); // << Import helmet

//...
app.use(helmet()); // << เพิ่มบรรทัดนี้: ใส่เกราะป้องกัน!
app.use(cors());
//...

//... (ส่วนบนเหมือนเดิม)
const Joi = require('joi'); // << Import Joi

//...
app.use(helmet());
app.use(cors());
app.use(express.json()); // << สำคัญ! ต้องมี middleware นี้เพื่ออ่าน JSON body

// สร้าง Schema สำหรับตรวจสอบข้อมูล user
const userSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    birth_year: Joi.number().integer().min(1900).max(new Date().getFullYear())
});

// Route สำหรับสร้าง user
app.post('/api/users', (req, res) => {
    const { error, value } = userSchema.validate(req.body);

    if (error) {
        // ถ้าข้อมูลไม่ถูกต้อง ส่ง 400 Bad Request กลับไปพร้อมรายละเอียด
        return res.status(400).json({ message: 'Invalid data', details: error.details });
    }

    // ถ้าข้อมูลถูกต้อง
    console.log('Validated data:', value);
    res.status(201).json({ message: 'User created successfully!', data: value });
});
//...