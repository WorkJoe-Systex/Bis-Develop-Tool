import { exec } from 'child_process';

// 封裝 exec 成 Promise
export async function execPromise(command: string, cwd?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        console.error('Command failed:', command);
        console.error(`執行錯誤: ${error.message}`);
        return reject(error);
      }
      resolve();
    });
  });
}