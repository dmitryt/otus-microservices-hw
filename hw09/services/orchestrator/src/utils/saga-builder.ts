interface IStep {
  readonly name: string;
  readonly channel: string;
  readonly withCompensation: boolean;
}

export enum SagaTypes {
  REQUEST = "REQUEST",
  ROLLBACK = "ROLLBACK",
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
}

export class SagaSender {
  send(channel: string, options: any) {}
}

export class SagaBuilder {
  private steps: IStep[]
  constructor(private sender: SagaSender) {
    this.steps = [];
  }

  private createStep(name: string, channel: string, withCompensation = false) {
    return {
      name: name.toUpperCase().split(' ').join('_'),
      channel,
      withCompensation
    };
  }

  private stepForward(index: number, data: any) {
    if (index === -1) {
      return;
    }
    const step = this.steps[index + 1];
    if (step) {
      this.sender.send(step.channel, {
        name: step.name,
        type: SagaTypes.REQUEST,
        data,
      })
    }
  }

  private stepBackward(index: number, data: any) {
    if (index === -1) {
      return;
    }
    let step;
    for (let i = index - 1; i >= 0; i--) {
      if (this.steps[i]?.withCompensation) {
        step = this.steps[i];
        break;
      }
    }
    if (step) {
      this.sender.send(step.channel, {
        name: step.name,
        type: SagaTypes.ROLLBACK,
        data,
      })
    }
  }

  // {name: "ORDER_CREATE", type: "REQUEST", data: {}}
  execute(name: string, type: SagaTypes, data: any) {
    const step = this.steps.find(s => s.name === name);
    if (!step) {
      return;
    }
    const index = this.steps.indexOf(step);
    if (type === SagaTypes.SUCCESS) {
      this.stepForward(index, data);
    } else if (type === SagaTypes.FAILURE) {
      this.stepBackward(index, data);
    }
  }

  step(name: string, channel: string, withCompensation = false) {
    this.steps.push(this.createStep(name, channel, withCompensation));
    return this;
  }
}