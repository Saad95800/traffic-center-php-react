import React from 'react';
import { hydrate } from 'react-dom';
import ConnexionSystem from './components/ConnexionSystem';

hydrate(
    <ConnexionSystem/>,
    document.getElementById('popup-connexion')
);