export type ProcessResultMessage = {
  success: boolean;
  error?: Error;
};

export class ProcessManager {
  private processes: (() => Promise<ProcessResultMessage>)[];

  constructor({
    processes,
  }: {
    processes: (() => Promise<ProcessResultMessage>)[];
  }) {
    this.processes = processes;
  }

  public async execute() {
    new Promise((resolve, reject) => {
      this.processes.forEach(async (process) => {
        try {
          const result = await process();
          if (result.success) {
            resolve(void 0);
          } else {
            reject(result.error);
          }
        } catch (error) {
          reject(error);
        }
      });
      resolve(void 0);
    });
  }
}
