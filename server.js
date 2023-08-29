const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));  // Serve static files from the current directory

app.post('/execute', (req, res) => {
    const code = req.body.code;

    // Save the code in a temporary file
    const filename = `temp_${Date.now()}.js`;
    fs.writeFileSync(filename, code);

    // Docker container limits:
    const cpuLimit = "0.5";      // Limit to 0.5 CPU
    const memoryLimit = "100m";  // Limit to 100 megabytes
    const timeout = 10000;      // Timeout in 10 seconds

    // Run Docker to execute the code
    exec(`docker run --rm --cpus=${cpuLimit} --memory=${memoryLimit} -v ${__dirname}:/app node:18 node /app/${filename}`,
         { timeout: timeout },
         (error, stdout, stderr) => {

        // Remove the temporary file after execution
        fs.unlinkSync(filename);

        if (error) {
            console.log(error);
            return res.json({ error: error.message });
        }
        if (stderr) {
            console.log(stderr);
            return res.json({ error: stderr });
        }
        return res.json({ result: stdout.trim() });
    });
});

console.log('Pulling node:18 image...');
// Download Docker image node:18
exec('docker pull node:18', (error, stdout, stderr) => {
    if (error) {
        console.error('Error pulling node:18 image:', error);
    } else {
        console.log('Node:18 image pulled successfully');

        // Start the server after the image is successfully pulled
        app.listen(port, () => {
            console.log(`Server started on http://localhost:${port}`);
        });
    }
});
