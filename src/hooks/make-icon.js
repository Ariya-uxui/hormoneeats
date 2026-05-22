const fs = require("fs")
const path = require("path")
 
function makePNG(size, outPath) {
  // สร้าง PNG header + IHDR + IDAT + IEND แบบ manual
  // background #3D2E2A พร้อม circle สีอ่อน
  
  const width = size, height = size
  
  // Raw pixel data (RGBA)
  const pixels = Buffer.alloc(width * height * 4)
  
  const bg  = { r: 0x3D, g: 0x2E, b: 0x2A, a: 255 }
  const cir = { r: 0xBB, g: 0xA8, b: 0xC4, a: 255 }
  const cx = width / 2, cy = height / 2
  const r1 = size * 0.38  // outer circle
  const r2 = size * 0.28  // inner circle
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const dx = x - cx, dy = y - cy
      const dist = Math.sqrt(dx*dx + dy*dy)
      
      let col
      if (dist < r2) {
        col = cir
      } else if (dist < r1) {
        col = { r: 0x7A, g: 0x68, b: 0x90, a: 255 }
      } else {
        col = bg
      }
      pixels[idx]   = col.r
      pixels[idx+1] = col.g
      pixels[idx+2] = col.b
      pixels[idx+3] = col.a
    }
  }
 
  // Use canvas if available, otherwise write SVG as fallback
  try {
    const { createCanvas } = require("canvas")
    const canvas = createCanvas(size, size)
    const ctx = canvas.getContext("2d")
    
    // rounded rect background
    const radius = size * 0.22
    ctx.fillStyle = "#3D2E2A"
    ctx.beginPath()
    ctx.moveTo(radius, 0)
    ctx.lineTo(size - radius, 0)
    ctx.quadraticCurveTo(size, 0, size, radius)
    ctx.lineTo(size, size - radius)
    ctx.quadraticCurveTo(size, size, size - radius, size)
    ctx.lineTo(radius, size)
    ctx.quadraticCurveTo(0, size, 0, size - radius)
    ctx.lineTo(0, radius)
    ctx.quadraticCurveTo(0, 0, radius, 0)
    ctx.closePath()
    ctx.fill()
    
    // emoji
    ctx.font = `${size * 0.55}px serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("🌿", size/2, size/2 + size*0.04)
    
    fs.writeFileSync(outPath, canvas.toBuffer("image/png"))
    console.log(`✅ Created ${outPath} (${size}x${size}) with canvas`)
  } catch(e) {
    // canvas not available — write minimal valid PNG using zlib
    writePNG(pixels, width, height, outPath)
  }
}
 
function writePNG(pixels, width, height, outPath) {
  const zlib = require("zlib")
  
  // Build raw image data with filter bytes
  const raw = Buffer.alloc(height * (1 + width * 4))
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width * 4)] = 0 // filter type None
    pixels.copy(raw, y * (1 + width * 4) + 1, y * width * 4, (y+1) * width * 4)
  }
  
  const compressed = zlib.deflateSync(raw)
  
  function chunk(type, data) {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length)
    const typeB = Buffer.from(type, "ascii")
    const crc = crc32(Buffer.concat([typeB, data]))
    const crcB = Buffer.alloc(4); crcB.writeUInt32BE(crc >>> 0)
    return Buffer.concat([len, typeB, data, crcB])
  }
  
  function crc32(buf) {
    const table = crc32.table || (crc32.table = (() => {
      const t = new Uint32Array(256)
      for (let i = 0; i < 256; i++) {
        let c = i
        for (let j = 0; j < 8; j++) c = (c & 1) ? 0xEDB88320 ^ (c >>> 1) : c >>> 1
        t[i] = c
      }
      return t
    })())
    let c = 0xFFFFFFFF
    for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xFF] ^ (c >>> 8)
    return (c ^ 0xFFFFFFFF) >>> 0
  }
  
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0 // 8-bit RGB... wait need RGBA
  // Actually use 8-bit RGBA (color type 6)
  ihdr[9] = 6
  
  const sig = Buffer.from([137,80,78,71,13,10,26,10])
  const png = Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", compressed), chunk("IEND", Buffer.alloc(0))])
  fs.writeFileSync(outPath, png)
  console.log(`✅ Created ${outPath} (${size}x${size}) with raw PNG`)
}
 
// create public dir if needed
if (!fs.existsSync("public")) fs.mkdirSync("public")
 
makePNG(192, "public/icon-192.png")
makePNG(512, "public/icon-512.png")