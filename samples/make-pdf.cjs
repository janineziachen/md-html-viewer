// 生成一个合法的 3 页 PDF，用于测试翻页/缩放。无外部依赖。
const fs = require('fs')

function makePage(num) {
  return `BT /F1 36 Tf 72 700 Td (MobileMD PDF - Page ${num}) Tj ET\nBT /F1 18 Tf 72 650 Td (This is a test PDF generated for MobileMD.) Tj ET\nBT /F1 18 Tf 72 620 Td (Use the toolbar to flip pages and zoom.) Tj ET`
}

const N = 3
const objects = []

// 1: Catalog
objects.push(`<< /Type /Catalog /Pages 2 0 R >>`)

// 2: Pages
const kids = []
for (let i = 0; i < N; i++) kids.push(`${3 + i * 2} 0 R`)
objects.push(`<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${N} >>`)

// pages + content streams
for (let i = 0; i < N; i++) {
  const contentObjNum = 4 + i * 2
  objects.push(
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${3 + N * 2} 0 R >> >> /Contents ${contentObjNum} 0 R >>`,
  )
  const stream = makePage(i + 1)
  objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`)
}

// font object (last)
objects.push(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`)

// 组装
let pdf = '%PDF-1.4\n'
const offsets = []
objects.forEach((body, idx) => {
  offsets.push(pdf.length)
  pdf += `${idx + 1} 0 obj\n${body}\nendobj\n`
})

const xrefStart = pdf.length
pdf += `xref\n0 ${objects.length + 1}\n`
pdf += `0000000000 65535 f \n`
offsets.forEach((off) => {
  pdf += `${String(off).padStart(10, '0')} 00000 n \n`
})
pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`

fs.writeFileSync('samples/test.pdf', pdf, 'latin1')
console.log('wrote samples/test.pdf,', pdf.length, 'bytes,', N, 'pages')
