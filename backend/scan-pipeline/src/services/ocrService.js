const { spawn } = require("child_process");
const path = require("path");

function extractText(imagePath) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(
      __dirname,
      "../ocr/paddle_ocr.py"
    );

    const pythonPath = path.join(
      process.cwd(),
      ".venv/bin/python3"
    );

    console.log("Using Python:", pythonPath);
    console.log("Using OCR script:", scriptPath);

    const python = spawn(
      pythonPath,
      [scriptPath, imagePath]
    );

    let output = "";
    let error = "";

    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.stderr.on("data", (data) => {
      error += data.toString();
    });

    python.on("close", (code) => {
      if (code !== 0) {
        reject(
          new Error(
            error || `PaddleOCR exited with code ${code}`
          )
        );
        return;
      }

      resolve(output.trim());
    });

    python.on("error", (err) => {
      reject(err);
    });
  });
}

module.exports = {
  extractText,
};