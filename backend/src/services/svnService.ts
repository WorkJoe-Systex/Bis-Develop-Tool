import { exec, ExecOptions } from 'child_process';

// 封裝 exec 成 Promise
export async function execPromise(command: string, options?: ExecOptions): Promise<{ stdout: Buffer; stderr: Buffer }> {
  return new Promise((resolve, reject) => {
    exec(command, { ...options, encoding: 'buffer' }, (error, stdout, stderr) => {
      if (error) {
        console.error('Command failed:', command);
        console.error(`執行錯誤: ${error.message}`);
        return reject(error);
      }
      resolve({ stdout, stderr });
    });
  });
}