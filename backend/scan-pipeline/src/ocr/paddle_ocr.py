import sys
from paddleocr import PaddleOCR

ocr = PaddleOCR(lang="en")


def extract_text(image_path):
    results = ocr.predict(image_path)

    extracted_text = []

    for result in results:
        data = result.json

        if isinstance(data, str):
            import json
            data = json.loads(data)

        texts = data["res"].get("rec_texts", [])
        scores = data["res"].get("rec_scores", [])

        for text, score in zip(texts, scores):
            if text.strip() and score >= 0.5:
                extracted_text.append(text.strip())

    return "\n".join(extracted_text)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python paddle_ocr.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]

    print(extract_text(image_path))