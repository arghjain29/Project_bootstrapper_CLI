import { spawn } from "child_process";

export function runCommand(
  command: string,
  args: string[],
  cwd: string,
  timeoutMs = 2 * 60 * 1000 
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: "inherit",
      shell: true,
    });

    let isResolved = false;

    const timeout = setTimeout(() => {
      if (isResolved) return;
      isResolved = true;
      
      // Kill the entire process tree
      if (process.platform === 'win32') {
        // Windows: kill the entire process tree
        spawn('taskkill', ['/pid', child.pid!.toString(), '/f', '/t'], {
          shell: true
        });
      } else {
        // Unix: kill process group
        child.kill('SIGKILL');
      }
      
      reject(new Error(`${command} timed out after ${timeoutMs / 1000}s`));
    }, timeoutMs);

    child.on("error", (err) => {
      if (isResolved) return;
      isResolved = true;
      clearTimeout(timeout);
      
      // Kill child process on error
      if (child.pid) {
        if (process.platform === 'win32') {
          spawn('taskkill', ['/pid', child.pid.toString(), '/f', '/t'], {
            shell: true
          });
        } else {
          child.kill('SIGKILL');
        }
      }
      
      reject(err);
    });

    child.on("close", (code) => {
      if (isResolved) return;
      isResolved = true;
      clearTimeout(timeout);
      
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} exited with code ${code}`));
      }
    });
    
    // Handle Ctrl+C
    process.once('SIGINT', () => {
      if (child.pid) {
        if (process.platform === 'win32') {
          spawn('taskkill', ['/pid', child.pid.toString(), '/f', '/t'], {
            shell: true
          });
        } else {
          child.kill('SIGKILL');
        }
      }
    });
  });
}