import csv from "csv-parser";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { Readable } from "stream";

// Resolve __dirname for ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Parses a CSV file called filename in path (relative to repo root)
 *
 * This function reads the file content and converts it to a readable stream,
 * return it as a promise
 *
 * @param {string} fileName - name of csv file
 * @param {string} filePath - path of csv file relative to the root of the repo
 *
 * @return {Promise<Object[]>} array of objects, each object containing a row of the csv
 */
export const loadCSV = async (fileName, filePath) => {
  const csvPath = path.join(__dirname, filePath, fileName);

  const results = [];

  // Read CSV content
  let fileContent;
  try {
    fileContent = await fs.readFile(csvPath);
  } catch (err) {
    console.log("WOAH", err);

    // Return empty array in failure
    return [];
  }

  // Convert file content to readable stream
  const readableStream = Readable.from(fileContent);

  return new Promise((resolve, reject) => {
    readableStream
      // Use csv-parser to parse the data in the stream
      .pipe(csv())
      // Push rows into the results array
      .on("data", (data) => results.push(data))
      // Resolve promise when we get to the end of CSV
      .on("end", () => resolve(results))
      // Handle any error
      .on("error", (err) => reject(err));
  });
};
