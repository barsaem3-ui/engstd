const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

async function runExtraction() {
    console.log('Starting slide image and metadata extraction...');
    
    const filesConfig = [
        { level: 1, file: '1_90.xlsx', dirName: 'level1' },
        { level: 2, file: '91_210.xlsx', dirName: 'level2' },
        { level: 3, file: '211_300.xlsx', dirName: 'level3' }
    ];
    
    const metadata = {
        level1: [],
        level2: [],
        level3: []
    };
    
    // Create base directories
    const publicDir = path.join(__dirname, '..', 'public');
    const imagesDir = path.join(publicDir, 'images');
    fs.mkdirSync(imagesDir, { recursive: true });
    
    for (const config of filesConfig) {
        console.log(`\nProcessing Level ${config.level} (${config.file})...`);
        const filePath = path.join(__dirname, '..', config.file);
        
        if (!fs.existsSync(filePath)) {
            console.error(`Error: Excel file not found at ${filePath}`);
            continue;
        }
        
        const targetImagesDir = path.join(imagesDir, config.dirName);
        fs.mkdirSync(targetImagesDir, { recursive: true });
        
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        
        const worksheet = workbook.getWorksheet('영어패턴 단어장');
        if (!worksheet) {
            console.error(`Error: Worksheet "영어패턴 단어장" not found in ${config.file}`);
            continue;
        }
        
        console.log(`Loaded worksheet. Row count: ${worksheet.rowCount}`);
        
        // Step A: Parse worksheet rows to get structure
        const rowsData = {};
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // skip header
            
            const rawPatternNum = row.getCell(1).value;
            const type = row.getCell(2).value;
            
            if (!rawPatternNum || !type) return;
            
            const patternNum = parseInt(rawPatternNum, 10);
            if (isNaN(patternNum)) return;
            
            rowsData[rowNumber] = {
                patternNum,
                type: type.toString().trim()
            };
        });
        
        // Step B: Get all images and match to rows
        const excelImages = worksheet.getImages();
        console.log(`Found ${excelImages.length} images inside excel drawings.`);
        
        const patternMap = {};
        
        let matchedCount = 0;
        for (const img of excelImages) {
            const image = workbook.getImage(img.imageId);
            const rowNumber = img.range.tl.row + 1;
            
            const rowInfo = rowsData[rowNumber];
            if (!rowInfo) {
                // If it doesn't match a row directly, find the closest matching row or ignore
                // Typically drawings are perfectly aligned, but let's check
                continue;
            }
            
            matchedCount++;
            const { patternNum, type } = rowInfo;
            const ext = image.extension || 'jpeg';
            
            // Clean division name for file naming
            let fileTypeSuffix = 'intro';
            if (type !== '패턴 소개') {
                const num = type.replace('예문', '').trim();
                fileTypeSuffix = `ex_${num}`;
            }
            
            const filename = `pattern_${patternNum}_${fileTypeSuffix}.${ext}`;
            const relativePath = `/images/${config.dirName}/${filename}`;
            const absolutePath = path.join(targetImagesDir, filename);
            
            // Write image to disk
            fs.writeFileSync(absolutePath, image.buffer);
            
            if (!patternMap[patternNum]) {
                patternMap[patternNum] = {
                    pattern_num: patternNum,
                    intro_image: null,
                    examples: []
                };
            }
            
            if (type === '패턴 소개') {
                patternMap[patternNum].intro_image = relativePath;
            } else {
                patternMap[patternNum].examples.push({
                    type: type,
                    image: relativePath
                });
            }
        }
        
        console.log(`Successfully extracted and saved ${matchedCount} images for Level ${config.level}.`);
        
        // Sort example images sequentially for each pattern, and push to metadata list
        const sortedPatterns = Object.keys(patternMap)
            .map(k => parseInt(k, 10))
            .sort((a, b) => a - b);
            
        for (const pNum of sortedPatterns) {
            const pData = patternMap[pNum];
            // Sort examples (e.g. 예문 1, 예문 2, etc.)
            pData.examples.sort((a, b) => {
                const aNum = parseInt(a.type.replace('예문', '').trim(), 10) || 0;
                const bNum = parseInt(b.type.replace('예문', '').trim(), 10) || 0;
                return aNum - bNum;
            });
            
            metadata[`level${config.level}`].push(pData);
        }
    }
    
    // Save metadata.json
    const metadataPath = path.join(publicDir, 'metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`\nMetadata written successfully to ${metadataPath}`);
    console.log('Extraction complete!');
}

runExtraction().catch(err => {
    console.error('Fatal error during extraction:', err);
});
