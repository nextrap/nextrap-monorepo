import { html } from 'lit';

// Nutzt dieselbe Formular-, Boolean- und Sperrlogik wie die Checkbox, aber mit Switch-Markup.
import { DefaultCheckboxPlugin } from './default-checkbox';
import { NTE_INPUT_CONTROL_ID, NTE_INPUT_VALIDATION_ID, type NteInputRenderContext } from '../lib/types';
import style from './default-switch.scss?inline';

// Der Switch verwendet ausschließlich die Basisdarstellung von @nextrap/style-switch.
export class DefaultSwitchPlugin extends DefaultCheckboxPlugin {
  static override readonly types = ['switch'];

  override getStyleSheet() {
    return style;
  }

  override isLabelHidden() {
    return false;
  }

  override render(context: NteInputRenderContext) {
    const { element } = context;

    // Das äußere nte-input-Label beschriftet den nativen Checkbox-Schalter.
    return html`
      <label class="switch" part="switch">
        <input
          id=${NTE_INPUT_CONTROL_ID}
          class="switch-input"
          part="switch-input"
          type="checkbox"
          role="switch"
          aria-label=${element.getAttribute('aria-label') ?? element.label.trim()}
          aria-describedby=${NTE_INPUT_VALIDATION_ID}
          name=${element.getAttribute('name') ?? ''}
          value=${element.getAttribute('value') ?? 'on'}
          ?checked=${element.value === true}
          ?disabled=${element.hasAttribute('disabled') || element.hasAttribute('readonly')}
          ?required=${element.hasAttribute('required')}
        />
        <span class="switch-control" part="switch-control" aria-hidden="true"></span>
        <!-- Der optionale Status-Text wechselt mit dem Boolean-Wert, ohne das Formular-Label zu verändern. -->
        ${element.value === true
          ? element.onText
            ? html`<span class="switch-label" part="switch-label">${element.onText}</span>`
            : null
          : element.offText
            ? html`<span class="switch-label" part="switch-label">${element.offText}</span>`
            : null}
      </label>
    `;
  }
}

export const defaultSwitchPlugin = DefaultSwitchPlugin;
