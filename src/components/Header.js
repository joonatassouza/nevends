import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo.png';
import ico from '../assets/ico.svg';
import loadingIco from '../assets/loading.svg';
import camera from '../assets/camera.svg';
import { connect } from 'react-redux';

const Header = ({loading, feed}) => {
  const forceUpdate = () => {
    if (window.location.pathname === '/')
      window.location.reload();
  }

  return (
    <header id='main-header'>
      <div className='header-content'>
        <Link onClick={forceUpdate} to='/'>
          <div>
            <img src={loadingIco} className={(loading ? 'loading' : null) + " logo"} alt='Never Ends' />
            <img src={ico} alt='Never Ends' />
          </div>
        </Link>
        <div>
          <Link onClick={forceUpdate} to='/'>
            <img src={logo} alt='NevEnds' />
          </Link>

          <p className='posts'> ({feed.length} posts)</p>
        </div>
        <Link to='/new'>
          <img src={camera} alt='Enviar Publicação' />
        </Link>
      </div>
    </header>
  );
};

const mapStateToProps = state => ({ ...state });

export default connect(mapStateToProps)(Header);