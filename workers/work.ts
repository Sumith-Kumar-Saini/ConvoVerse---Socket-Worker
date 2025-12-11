import fs from "fs";

export function randomTxt(): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile("lib/test.txt", (err, data) => {
      if (err) return reject(err);
      resolve(data.toString());
    });
  });
}

export async function* generateStream(
  text: string,
  { rounds = 10, ms = 300 }: { rounds?: number; ms?: number }
) {
  for (let i = 0; i < text.length; i += rounds) {
    const chunk = text.slice(i, i + rounds);
    await delay(ms);
    yield chunk;
  }
}

export async function* generateNumberStream(
  rounds: number = 100,
  ms: number = 100
) {
  for (let i = 0; i < rounds; i++) {
    await delay(ms);
    yield i;
  }
}

export function delay(ms: number = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
