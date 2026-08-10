import { useState } from 'react';
import styles from '../../styles/App.module.css';

export function Tooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return <span className={`${styles.tooltip} ${open ? styles.tooltipOpen : ''}`}>
    <button type="button" aria-label={text} aria-expanded={open} onClick={() => setOpen(value => !value)}>?</button>
    {open && <span className={styles.tooltipText} role="status">{text}</span>}
  </span>;
}
