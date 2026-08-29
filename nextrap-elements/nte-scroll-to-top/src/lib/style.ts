import { css } from 'lit';

export const style = css`
  :host {
    position: fixed;
    inset-block-end: var(--nte-scroll-to-top-offset-block, 2rem);
    inset-inline-end: var(--nte-scroll-to-top-offset-inline, 2rem);
    z-index: var(--nte-scroll-to-top-z-index, 99);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transform: translateY(0.5rem);
    transition:
      opacity var(--nte-scroll-to-top-transition-duration, 200ms) ease,
      transform var(--nte-scroll-to-top-transition-duration, 200ms) ease,
      visibility 0s linear var(--nte-scroll-to-top-transition-duration, 200ms);
  }

  :host([visible]) {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateY(0);
    transition-delay: 0s;
  }

  button {
    display: grid;
    place-items: center;
    border: 0;
    font: inherit;
    cursor: pointer;
  }

  svg {
    display: block;
    inline-size: 1.5em;
    block-size: 1.5em;
  }

  @media (prefers-reduced-motion: reduce) {
    :host {
      transform: none;
      transition-duration: 0s;
    }
  }
`;
