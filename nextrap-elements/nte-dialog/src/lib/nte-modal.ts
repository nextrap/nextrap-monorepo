import { ka_create_element } from '@kasimirjs/core';
import { LitElement } from 'lit';
import { NteDialog } from '../index';

export abstract class NteModalElement<
  Input,
  Output = unknown,
> extends LitElement {
  static open<I, O>(input: I) {
    return new (this as any)().open({ data: input });
  }

  private dialog = new NteDialog();
  private input?: Input;

  private resolveFn?: (value: Output) => void;
  private rejectFn?: (reason?: any) => void;

  protected constructor(private readonly dialogTitle: string) {
    super();
  }

  async open(config?: { data?: Input }) {
    const d = this.dialog;
    d.mode = 'modal';

    d.appendChild(this);
    document.body.appendChild(d);

    if (this.dialogTitle) {
      const titleEl = ka_create_element(
        'h3',
        {
          slot: 'title',
        },
        this.dialogTitle,
      );
      this.dialog.appendChild(titleEl);
    }

    this.input = config?.data;

    d.showModal();

    return new Promise((resolve, reject) => {
      this.resolveFn = resolve;
      this.rejectFn = reject;
    });
  }

  close(data?: Output) {
    this.resolveFn?.(data as Output);
    this.dialog.close();
  }
}
