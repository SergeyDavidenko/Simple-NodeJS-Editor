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

    // Сохраняем код во временный файл
    const filename = `temp_${Date.now()}.js`;
    fs.writeFileSync(filename, code);

    // Ограничения для Docker контейнера:
    const cpuLimit = "0.5";      // Ограничение в 0.5 CPU
    const memoryLimit = "100m";  // Ограничение в 100 мегабайт
    const timeout = 10000;        // Таймаут в 10 секунд

    // Запускаем Docker с выполнением кода
    exec(`docker run --rm --cpus=${cpuLimit} --memory=${memoryLimit} -v ${__dirname}:/app node:18 node /app/${filename}`,
         { timeout: timeout },
         (error, stdout, stderr) => {

        // Удаляем временный файл после выполнения
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
// Загрузка Docker образа node:18
exec('docker pull node:18', (error, stdout, stderr) => {
    if (error) {
        console.error('Error pulling node:18 image:', error);
    } else {
        console.log('Node:18 image pulled successfully');

        // Старт сервера после успешной загрузки образа
        app.listen(port, () => {
            console.log(`Server started on http://localhost:${port}`);
        });
    }
});
