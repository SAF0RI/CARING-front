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

  public async execute(): Promise<void> {
    for (const process of this.processes) {
      try {
        const result = await process();

        if (!result.success) {
          throw result.error ?? new Error("Process failed without error info");
        }
      } catch (err) {
        // 중단
        throw err;
      }
    }

    // 모두 성공 시 반환
    return;
  }
}
