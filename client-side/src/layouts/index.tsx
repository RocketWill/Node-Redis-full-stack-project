import React from 'react';
import styles from './index.css';
import pokemonLogo from '../assets/pokemon-logo.png';
import githubLogo from '../assets/GitHub_Logo_White.png';
import router from 'umi/router';

const handleClick = () => {
  router.push('/pokemons')
}

const BasicLayout: React.FC = props => {
  return (
    <div className={styles.normal}>
      <h1 className={styles.title}>
        <img onClick={handleClick} src={pokemonLogo} alt="pokemon logo" style={{ width: 200, display: "inline-block" }} />{' '}
        <span style={{ fontSize: 20, letterSpacing: 1, display: "inline-block" }}>with Redis</span>
        <a href="https://github.com/RocketWill/Node-Redis-full-stack-project" target="_blank"><img style={{width: 60, display: "inline-block", float: "right", marginRight: 20 }} src={githubLogo} /></a>
      </h1>
      <div className={styles.content}>{props.children}</div>
      
    </div>
  );
};

export default BasicLayout;
