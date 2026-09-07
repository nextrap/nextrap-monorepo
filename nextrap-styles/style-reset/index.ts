// Materializes the reset stylesheet and exposes its inline form for Shadow DOM consumers.
import './index.scss';
import style from './src/reset.scss?inline';
export const resetStyle = style;
