import os from "os";

export enum PromisePoolTaskStatus {
  inProgress,
  done,
}

export class PromisePool {
  private promiseList: Array<{
    result: any | null;
    status: PromisePoolTaskStatus;
  }> = [];
  private readonly waitTimeInMilli: number;
  private readonly minRequiredMemorySpaceInMb: number;

  constructor(
    readonly size = 200,
    configs?: {
      waitTimeInSeconds?: number;
      minRequiredMemorySpaceInMb?: number;
    },
  ) {
    this.promiseList = new Array(this.size).fill({
      result: null,
      status: PromisePoolTaskStatus.done,
    });
    this.waitTimeInMilli = configs?.waitTimeInSeconds
      ? configs.waitTimeInSeconds * 1000
      : 20_000;
    this.minRequiredMemorySpaceInMb = configs?.minRequiredMemorySpaceInMb ?? 0;
  }

  getFreeSlotsCount() {
    return this.promiseList.reduce((total, item) => {
      if (item.status !== PromisePoolTaskStatus.done) return total;
      return total + 1;
    }, 0);
  }

  isFull() {
    if (this.minRequiredMemorySpaceInMb > 0) {
      const freeMem = os.freemem() / 1024 / 1024;
      console.log(`[PromisePool] free memory: ${freeMem.toFixed(2)} MB`);
      if (
        freeMem <= this.minRequiredMemorySpaceInMb &&
        this.size !== this.getFreeSlotsCount()
      )
        return true;
    }
    return this.getFreeSlotsCount() === 0;
  }

  getFreeSlotIndex() {
    return this.promiseList.findIndex(
      (job) => job.status === PromisePoolTaskStatus.done,
    );
  }

  add(task: (arg: any) => Promise<any>, arg: any) {
    const idx = this.getFreeSlotIndex();
    if (idx < 0) {
      console.error("[PromisePool] The queue is busy.");
      return false;
    }
    this.promiseList[idx] = {
      result: undefined,
      status: PromisePoolTaskStatus.inProgress,
    };
    this.worker(idx, task, arg);
    return true;
  }

  async waitForFreeSlot() {
    console.log(`[PromisePool] Waiting for a free slot...`);
    while (this.getFreeSlotsCount() < 1) {
      await this.sleep();
    }
  }

  async waitTillDone() {
    console.log(`[PromisePool] Waiting for ${this.size} tasks to be done...`);
    while (this.getFreeSlotsCount() !== this.size) {
      await this.sleep();
    }
  }

  private sleep() {
    return new Promise((r) => setTimeout(r, this.waitTimeInMilli));
  }

  private worker(position: number, task: (arg: any) => Promise<any>, arg: any) {
    task(arg)
      .then((res) => {
        this.promiseList[position] = {
          result: res ?? null,
          status: PromisePoolTaskStatus.done,
        };
      })
      .catch((err) => {
        console.error(
          "[PromisePool] A task errored but errors are skipped. Please handle errors within tasks!",
        );
        console.error(err);
        this.promiseList[position] = {
          result: null,
          status: PromisePoolTaskStatus.done,
        };
      });
  }
}
