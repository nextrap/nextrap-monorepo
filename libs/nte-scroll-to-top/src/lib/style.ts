import { css } from 'lit';

export const style = css`
  :host {
  }

  :host(.show) {
    div {
      opacity: 1;
    }
  }

  div {
    opacity: 0;
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 99;
    border: none;
    outline: none;
    background-color: rgba(0, 0, 0, 0.1);
    box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 5px;
    color: white;
    cursor: pointer;
    padding: 10px;
    border-radius: 4px;

    display: flex;
    align-content: center;
    align-items: center;
    text-align: center;

    justify-content: center;
    width: 2.8rem;
    height: 2.8rem;
    transition: opacity 0.5s ease-in-out, background-color 0.2s ease-in-out;
    &:hover {
      background-color: rgba(0, 0, 0, 0.2);
    }

    svg {
      width: 40px;
      height: 40px;
      color: white;
    }
  }
`;
