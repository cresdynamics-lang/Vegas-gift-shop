const fs = require('fs');
const https = require('https');
const path = require('path');

fetch('https://riogiftshop.com/')
  .then(r => r.text())
  .then(t => {
    // Extract original image URLs
    const matches = t.match(/https:\/\/riogiftshop\.com\/wp-content\/uploads\/\d{4}\/\d{2}\/[^\s"']+\.(jpg|jpeg|png)/g);
    if (matches) {
      // Filter out small sizes, logos, and get unique base names
      const filtered = matches.filter(url => 
        !url.includes('logo') && 
        !url.includes('cropped') &&
        !url.match(/-\d+x\d+\./) // filter out resized versions like -300x300.jpeg
      );
      
      const urls = [...new Set(filtered)];
      console.log(`Found ${urls.length} unique full-size product images.`);
      
      const downloadDir = path.join(__dirname, 'src', 'assets', 'products');
      if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir, { recursive: true });
      }

      const topUrls = urls.slice(0, 16);
      console.log(topUrls);
      
      topUrls.forEach((url, i) => {
        const ext = path.extname(new URL(url).pathname);
        const filename = `product_${i + 1}${ext}`;
        const filepath = path.join(downloadDir, filename);
        
        https.get(url, (res) => {
          const fileStream = fs.createWriteStream(filepath);
          res.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            console.log(`Downloaded ${filename}`);
          });
        }).on('error', (err) => {
          console.error(`Error downloading ${url}:`, err.message);
        });
      });
    }
  });