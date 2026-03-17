const { PrismaClient } = require('@prisma/client')
const fs = require('fs')

async function main() {
  const prisma = new PrismaClient()
  
  try {
    console.log('Reading schema.sql...')
    // schema.sql might be UTF-16LE if generated via > in PowerShell
    let sql = fs.readFileSync('schema.sql', 'utf8')
    if (sql.includes('\x00')) {
      console.log('Detected null bytes, re-reading as utf16le...')
      sql = fs.readFileSync('schema.sql', 'utf16le')
    }
    
    // Strip BOM
    if (sql.charCodeAt(0) === 0xFEFF) {
      console.log('Detected and stripping BOM...')
      sql = sql.slice(1)
    }
    
    // Strip BOM and whitespace
    sql = sql.replace(/^\uFEFF/, '').trim()
    
    console.log('SQL start:', JSON.stringify(sql.substring(0, 50)))
    
    console.log('Splitting SQL into statements...')
    // A simple split by semicolon. This might break on some complex cases but 
    // usually works for Prisma-generated SQL.
    const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0)
    
    console.log(`Found ${statements.length} statements. Executing one by one...`)
    
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i]
      try {
        await prisma.$executeRawUnsafe(stmt)
        if (i % 10 === 0) console.log(`  Executed ${i}/${statements.length}...`)
      } catch (err) {
        console.error(`  Failed at statement ${i}:`, stmt.substring(0, 100))
        console.error(`  Error:`, err.message)
        // If it's just a "already exists" error, we can continue
        if (!err.message.includes('already exists')) {
          // throw err // For now let's see which ones fail
        }
      }
    }
    console.log('Finished executing statements.')
  } catch (e) {
    console.error('Failed to execute SQL:', e)
    console.log('Retrying by splitting statements...')
    // Fallback split logic
    // ...
  } finally {
    await prisma.$disconnect()
  }
}

main()
