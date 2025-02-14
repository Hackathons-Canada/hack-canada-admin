import readline from "readline";

// Setup readline interface
export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
};
