const express = require("express");
const multer = require("multer");

const { extractPdfData } = require("../controllers/pdfController");
const { optimizeImage } = require("../controllers/uploadController");
const { downloadFile } = require("../controllers/downloadCompressedPDFController");
const { compressPdf } = require("../controllers/pdfCompressController");
const { analyzeWebsite } = require("../controllers/techSpyController");
const { analyzeTechnologies } = require("../controllers/techSpyWapController");
const { countLinks } = require('../controllers/linkCounterController');
const { extractH1 } = require('../controllers/h1ExtractorController');

const multerConfig = require("../config/multerConfig");
const upload = multer();

const router = express.Router();

//PDF Extractor soft
router.post("/pdf", upload.single("pdf"), extractPdfData);
router.post("/extract", upload.single("pdf"), extractPdfData);

//Image Opimizer soft
router.post("/upload", multerConfig.single("image"), optimizeImage);

//PDF Compressor soft
router.get("/download/:filename", downloadFile);
router.post("/compress", upload.single("pdf"), compressPdf);

// TechSpy soft
router.post("/techspy/analyze", analyzeWebsite);

// TechSpyWap soft
router.get("/analyze", analyzeTechnologies);

//LinkCounter soft
router.get('/count-links', countLinks);

// H1 Extractor soft
router.post('/api/extract-h1', extractH1);

module.exports = router;
