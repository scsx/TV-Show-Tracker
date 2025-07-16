// Dev script to get the image file names from /public/images/posters.
// Run adding to package.json the script: "generate-posters": "node src/lib/dev/generate-poster-list.js"
const fs = require('fs')
const path = require('path')

const frontendRoot = path.join(__dirname, '..', '..', '..')
const postersDir = path.join(frontendRoot, 'public', 'images', 'posters')
const outputFile = path.join(postersDir, 'posters.json')

fs.readdir(postersDir, (err, files) => {
  if (err) {
    console.error('Error reading posters directory:', err)
    return
  }

  const imageFiles = files.filter((file) => {
    const ext = path.extname(file).toLowerCase()
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)
  })

  fs.writeFile(outputFile, JSON.stringify(imageFiles, null, 2), (err) => {
    if (err) {
      console.error('Error writing posters.json:', err)
      return
    }
    console.log('posters.json generated successfully!')
  })
})
