
var worker = new Worker("./sql-wasm.js");
worker.onerror = error;

// Open a database
worker.postMessage({ action: 'open' });
