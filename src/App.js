import React from 'react';
import logo from './logo.svg';
import "./Paginacion/utilidades/utilidades_css.css";
import Rutas from './Paginacion/Rutas';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
const stripePromise = loadStripe("pk_test_51PdbM8Hh07ihkU0MkAP9xASNG4k5d4iqbTroQL4D7q4nmrzZyMqb1R7vUYVGdBEc2MCw8PNGM6JscC7oJRiILvDU00g7ZpMGFR");

function App() {

  return (
    <Elements stripe={stripePromise}>
    <Rutas />
  </Elements>
  );
}

export default App;