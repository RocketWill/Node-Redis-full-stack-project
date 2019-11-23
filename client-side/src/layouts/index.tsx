import React from 'react';
import styles from './index.css';
import pokemonLogo from '../assets/pokemon-logo.png';

const BasicLayout: React.FC = props => {
  return (
    <div className={styles.normal}>
      
      <h1 className={styles.title}><img src={ pokemonLogo } alt="pokemon logo" style={{ width: 200 }} /> <span style={{ fontSize: 20, letterSpacing: 1 }}>with Redis</span></h1>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
};

export default BasicLayout;
