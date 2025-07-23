export const EVENT_NAME_GROUP_OPEN_CLOSE = 'nte-group-open-close';
export function triggerGroupOpenCloseEvent(open: boolean, groupName: string) {
  document.dispatchEvent(
    new CustomEvent(EVENT_NAME_GROUP_OPEN_CLOSE, {
      bubbles: false,
      composed: true,
      detail: { open, groupName },
    }),
  );
}
