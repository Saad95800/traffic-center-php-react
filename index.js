import React from 'react';
import { hydrate } from 'react-dom';
import App from './components/App';
import ConnexionSystem from './components/ConnexionSystem';

// hydrate(
//     <App/>,
//     document.getElementById('app_root')
// );

hydrate(
    <ConnexionSystem/>,
    document.getElementById('popup-connexion')
);