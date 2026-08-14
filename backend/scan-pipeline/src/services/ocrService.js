const { spawn } = require("child_process");
const path = require("path");

function extractText(imagePath) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(
      __dirname,
      "../ocr/paddle_ocr.py"
    );

    const python = spawn(
path.join(__dirname, "../../../.venv/bin/python"),      [scriptPath, imagePath]
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
        reject(new Error(error || `PaddleOCR exited with code ${code}`));
        return;
      }

      resolve(output.trim());
    });
  });
}

module.exports = {
  extractText,
};