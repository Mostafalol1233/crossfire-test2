import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function uploadToCatbox(filePath) {
  try {
    const fileData = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    
    // Create multipart form data manually
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const parts = [];
    
    // Add reqtype field
    parts.push(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="reqtype"\r\n\r\n` +
      `fileupload\r\n`
    );
    
    // Add file field
    parts.push(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="fileToUpload"; filename="${fileName}"\r\n` +
      `Content-Type: application/octet-stream\r\n\r\n`
    );
    
    const payload = Buffer.concat([
      Buffer.from(parts.join(''), 'utf8'),
      fileData,
      Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8')
    ]);
    
    const response = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': payload.length
      },
      body: payload
    });
    
    const url = await response.text();
    return url.trim();
  } catch (error) {
    console.error(`Error uploading ${filePath}:`, error);
    return null;
  }
}

async function getAllImages(dir) {
  const images = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      images.push(...await getAllImages(fullPath));
    } else if (/\.(jpg|jpeg|png|svg)$/i.test(file)) {
      images.push(fullPath);
    }
  }
  
  return images;
}

async function main() {
  const assetsDir = path.join(__dirname, 'katabump-deploy', 'attached_assets');
  console.log('🔍 Scanning for images...');
  
  const images = await getAllImages(assetsDir);
  console.log(`📸 Found ${images.length} images`);
  
  const mapping = {};
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < images.length; i++) {
    const imagePath = images[i];
    const relativePath = path.relative(assetsDir, imagePath);
    const fileName = path.basename(imagePath);
    
    console.log(`\n[${i + 1}/${images.length}] Uploading: ${relativePath}`);
    
    const catboxUrl = await uploadToCatbox(imagePath);
    
    if (catboxUrl) {
      mapping[fileName] = catboxUrl;
      successCount++;
      console.log(`✅ Success: ${catboxUrl}`);
    } else {
      failCount++;
      console.log(`❌ Failed to upload`);
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`\n\n📊 Upload Summary:`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`\n💾 Saving mapping to catbox-mapping.json...`);
  
  fs.writeFileSync(
    path.join(__dirname, 'catbox-mapping.json'),
    JSON.stringify(mapping, null, 2)
  );
  
  console.log('✅ Done!');
}

main().catch(console.error);
