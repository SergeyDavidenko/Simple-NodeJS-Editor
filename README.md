# Simple NodeJS Editor

An online NodeJS editor with code execution inside a Docker container.

![interface](/img/screen.jpg?raw=true "Main interface")

## Installation and Setup

1. Ensure you have [Docker](https://docs.docker.com/engine/install/) and [Node.js](https://nodejs.org/en/download) installed.
2. Clone the repository
3. Install the necessary dependencies:
``` bash
npm install
```
4. Start the server:
``` bash
node server.js
```

Once the server starts, it will automatically pull the node:18 Docker image and begin serving at http://localhost:3000.

## Usage

1. Navigate to http://localhost:3000 in your web browser.
2. Type or paste your NodeJS code into the editor.
3. Click the "Execute Code" button to run the code.
4. Execution results or errors will be displayed in the "Output" section.


## Security
The server executes code inside a Docker container with resource limits:

* CPU Limit: 0.5
* Memory Limit: 100 megabytes
* Timeout: 10 seconds

This ensures that malicious code can't cause significant harm to your system. Nonetheless, it's recommended not to trust the execution of any arbitrary code on your main server or production environment.

## Technologies

* Express.js: Fast, unopinionated, minimalist web framework for Node.js.
* Ace Editor: High-performance code editor written in JavaScript.