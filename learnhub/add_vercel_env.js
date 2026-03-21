const fs = require('fs');
const { execSync } = require('child_process');

try {
  const envContent = fs.readFileSync('.env', 'utf8');
  const lines = envContent.split(/\r?\n/);

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('#')) continue;

    const firstEq = line.indexOf('=');
    if (firstEq === -1) continue;

    const key = line.substring(0, firstEq).trim();
    let value = line.substring(firstEq + 1).trim();

    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.substring(1, value.length - 1);
    }

    console.log(`Adding ${key}...`);
    try {
      // On Windows, we can use echo | vercel env add
      // But we need to handle special characters.
      // A safer way is to use a temp file.
      fs.writeFileSync('temp_val.txt', value);
      execSync(`type temp_val.txt | vercel env add ${key} production`, { stdio: 'inherit' });
      fs.unlinkSync('temp_val.txt');
    } catch (err) {
      console.error(`Failed to add ${key}: ${err.message}`);
    }
  }
} catch (err) {
  console.error(`Error reading .env.local: ${err.message}`);
}
