const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function checkRequirements() {
    const projectRoot = path.join(__dirname, '..');
    const results = {
        success: true,
        messages: []
    };

    try {
        // Check Node.js version
        const nodeVersion = execSync('node --version').toString().trim();
        if (nodeVersion.startsWith('v')) {
            results.messages.push(`✓ Node.js ${nodeVersion}`);
        } else {
            results.success = false;
            results.messages.push('✗ Invalid Node.js version');
        }

        // Check npm version
        try {
            const npmVersion = execSync('npm --version').toString().trim();
            results.messages.push(`✓ npm ${npmVersion}`);
        } catch (error) {
            results.success = false;
            results.messages.push('✗ npm not found');
        }

        // Check required directories
        ['backend', 'frontend', 'blockchain', 'scripts'].forEach(dir => {
            const dirPath = path.join(projectRoot, dir);
            if (!fs.existsSync(dirPath)) {
                results.success = false;
                results.messages.push(`✗ Missing directory: ${dir}`);
            } else {
                results.messages.push(`✓ Directory found: ${dir}`);
            }
        });

        // Check package.json files
        ['package.json', 'backend/package.json', 'frontend/package.json'].forEach(file => {
            const filePath = path.join(projectRoot, file);
            if (!fs.existsSync(filePath)) {
                results.success = false;
                results.messages.push(`✗ Missing file: ${file}`);
            } else {
                try {
                    require(filePath);
                    results.messages.push(`✓ Valid ${file}`);
                } catch (error) {
                    results.success = false;
                    results.messages.push(`✗ Invalid JSON in ${file}`);
                }
            }
        });

        return results;
    } catch (error) {
        results.success = false;
        results.messages.push(`✗ Error: ${error.message}`);
        return results;
    }
}

// Run checks and display results
const results = checkRequirements();
console.log('\nEnvironment Check Results:');
console.log('------------------------');
results.messages.forEach(msg => console.log(msg));

if (!results.success) {
    console.error('\n✗ Environment check failed');
    process.exit(1);
} else {
    console.log('\n✓ Environment check passed');
}