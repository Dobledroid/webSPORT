import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { baseURL } from '../../api.js';
import { obtenerFechaHoraActual } from "../utilidades/dateUtils.js";

import Header from '../../Esquema/Header.js';
import Footer from '../../Esquema/Footer';

const Suscripcion = () => {
  const [pagando, setPagando] = useState(false);

  const location = useLocation();
  const [data, setData] = useState(location.state);

  const [user, setUser] = useState('');

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (loggedIn) {
      const user = JSON.parse(localStorage.getItem('user'));
      setUser(user);
      setIsLoggedIn(loggedIn);
    }
  }, []);




  const handlePagarSuscripcion = async () => {
    console.log(data);

    const id = user.ID_usuario;
    try {
      // Realizar fetch para obtener la información del usuario
      const response = await fetch(`${baseURL}/membresia-usuario/${id}`);

      if (!response.ok) {
        throw new Error('Error al obtener la información del usuario');
      }

      const datosMembresiaUsuario = await response.json();
      console.log("datosMembresiaUsuario", datosMembresiaUsuario);

      if (datosMembresiaUsuario.length > 0) {
        console.log('Existe');
        const datosMembresia = datosMembresiaUsuario[0];
        const fechaVencimiento = datosMembresia.fechaVencimiento;

        const fechaHoraActual = await obtenerFechaHoraActual();

        if (fechaHoraActual > fechaVencimiento) {
          console.log('La membresía está vencida.');
          const createOrderResponse = await fetch(`${baseURL}/create-order`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...data,
              ID_usuario: id,
              correo: user.correo
            }),
          });

          if (!createOrderResponse.ok) {
            throw new Error('Error al procesar el pago');
          }

          const dataMercado = await createOrderResponse.json();
          console.log("mercado", dataMercado);
          window.location.href = dataMercado.init_point;
        } else {
          alert('NO puedes comprar otra membresia porque tienes activada una --- agregar un swetter2alert mensaje--- cuidar ortografia lptm');
          console.log('La membresía está activa.');
        }

      } else {
        console.log('No existe');
        // Si no existe un registro, realizar la solicitud de pago
        const createOrderResponse = await fetch(`${baseURL}/create-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            ID_usuario: id,
            correo: user.correo
          }),
        });

        if (!createOrderResponse.ok) {
          throw new Error('Error al procesar el pago');
        }

        const dataMercado = await createOrderResponse.json();
        console.log("mercado", dataMercado);
        window.location.href = dataMercado.init_point;

        // // Manejar la respuesta del servidor según sea necesario
        // alert('¡Pago exitoso!');
      }

    } catch (error) {
      console.error(error);
      alert('Hubo un error al procesar el pago. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setPagando(false);
    }
  };


  return (
    <>
    <Header />
    <div className="suscripcion-container">
      <h2>Detalles de la suscripción</h2>
      <div className="card">
        <h3>{data.title}</h3>
        <p>Precio: ${data.costo} por {data.duration}</p>
        <button onClick={handlePagarSuscripcion} disabled={pagando}>
          {pagando ? 'Procesando pago...' : 'Pagar Suscripción'}
        </button>
      </div>
    </div>
    <Footer />
    </>

  );
};

export default Suscripcion;
