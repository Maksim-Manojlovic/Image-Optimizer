const http = require('http');
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const express = require('express');

const app = express();


const uploadDir = path.join(__dirname, 'uploads');
const optimizedDir = path.join(__dirname, 'optimized');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(optimizedDir)) fs.mkdirSync(optimizedDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });


app.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const inputPath = req.file.path;
    const outputFilename = `optimized-${Date.now()}.jpg`;
    const outputPath = path.join(__dirname, 'optimized', outputFilename);

    try {
        await sharp(inputPath)
            .resize(800)
            .jpeg({ quality: 70 })
            .toFile(outputPath);

        fs.unlinkSync(inputPath); 

        res.json({ url: `/optimized/${outputFilename}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Processing failed' });
    }
});


app.use('/optimized', express.static(path.join(__dirname, 'optimized')));


app.use(express.static('./public'))
app.use(express.static('./public/pages'))
app.use(express.static('./dist'))
app.use(express.static('./images'))


app.all('*', (req,res) => {
    res.status(404).send('resource not found')
})



app.listen(5000, () => {
    console.log('Server running at http://localhost:5000');
});