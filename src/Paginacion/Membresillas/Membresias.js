import React from 'react';
import Header from '../../Esquema/Header';
import Footer from '../../Esquema/Footer';
import { useLocalStorage } from 'react-use';
import { baseURL } from '../../api.js';
import './Membresias.css';
import { obtenerFechaHoraActual } from "../utilidades/dateUtils.js";
import Swal from 'sweetalert2';

const Membresias = () => {
  const [user, setUser] = useLocalStorage('user');

  function esURLSegura(url) {
    const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    return regex.test(url);
  }

  const handleRealizarPedido = async (nombre, total, ID_tipoMembresia) => {
    const currentURL = new URL(window.location.href);
    const host = currentURL.protocol + '//' + currentURL.hostname;
    // console.log(host); 
    const id = user.ID_usuario;
    const createOrderResponse = await fetch(`${baseURL}/paypal/create-order-membresia`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ID_usuario: id,
        total,
        currentURL: host,
        nombre,
        tipoMembresiaID: ID_tipoMembresia,
        correo: user.correo
      }),
    });

    if (createOrderResponse.ok) {
      const data = await createOrderResponse.json();
      // console.log(data);
      if (data.links && Array.isArray(data.links) && data.links.length >= 2) {
        const redirectUrl = data.links[1].href;

        if (esURLSegura(redirectUrl)) {
          window.location.href = redirectUrl;
        } else {
          console.error("La URL de redirección no es segura.");
        }
      } else {
        console.error("No se encontraron suficientes enlaces válidos en los datos proporcionados.");
      }
    } else {
      alert(`Hubo un error con la petición: ${createOrderResponse.status} ${createOrderResponse.statusText}`);
    }
  };

  const fetchMembresia = async (planId) => {
    // alert(planId)
    try {
      const response = await fetch(`${baseURL}/membresiasIdUnico/${planId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      // console.log(data);
      // console.log(user)
      const responseExiste = await fetch(`${baseURL}/membresia-usuario/${user.ID_usuario}`);
      if (!responseExiste.ok) {
        throw new Error('Error al obtener la información del usuario');
      }

      const datosMembresiaUsuario = await responseExiste.json();
      console.log("datosMembresiaUsuario", datosMembresiaUsuario);
      if (datosMembresiaUsuario.length > 0) {

        console.log('Existe');
        const datosMembresia = datosMembresiaUsuario[0];
        const fechaVencimiento = datosMembresia.fechaVencimiento;

        const fechaHoraActual = await obtenerFechaHoraActual();
        if (fechaHoraActual > fechaVencimiento) {
          handleRealizarPedido(data.nombre, data.costo, data.ID_tipoMembresia);
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "¡No es posible adquirir una nueva memnbresía debido a que tiene una membresía activa!",
            footer: '<a href="/membresia">Ver mi membresía</L>'
          });
        }
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const handleSubscriptionClick = (planId) => {
    fetchMembresia(planId);
  };


  return (
    <>
      <Header />
      <section id="pricing" className="our_pricing section-padding">
        <div className="container">
          <div className="row">
            <div className="section-title text-center">
              <h1 className="section-title-white">Planes de precios</h1>
              <p className="section-title-white">Explora nuestros planes de membresía diseñados para satisfacer diferentes necesidades y presupuestos. Desbloquea todo el potencial de nuestros servicios y elige el plan que mejor se adapte a tu estilo de vida y objetivos.</p>
            </div>
            {/* Visita por Día */}
            <div className="col-xs-12 col-sm-4 col-lg-4">
              <div className="pricingTable pricingTable-2">
                <div className="pricingTable-header">
                  <h3 className="title">Visita por Día</h3>
                  <h1 className="price-value">$35</h1>
                </div>
                <ul className="pricing-content">
                  <li>Duración: 1 día</li>
                  <li>Acceso total durante 24 horas</li>
                </ul>
                <button onClick={() => handleSubscriptionClick("Membresia1D")} className="btn btn-lg btn-price-bg">Suscribirse</button>
              </div>
            </div>
            {/* Plan de Dos Semanas */}
            <div className="col-xs-12 col-sm-4 col-lg-4">
              <div className="pricingTable pricingTabletop pricingTable-2">
                <div className="pricingTable-header">
                  <h3 className="title">Plan Mensual</h3>
                  <h1 className="price-value">$290</h1>
                </div>
                <ul className="pricing-content">
                  <li>Duración: 1 mes</li>
                  <li>Acceso ilimitado durante el mes</li>
                </ul>
                <button onClick={() => handleSubscriptionClick("Membresia30D")} className="btn btn-lg btn-price-bg">Suscribirse</button>
              </div>
            </div>
            {/* Plan Mensual */}
            <div className="col-xs-12 col-sm-4 col-lg-4">
              <div className="pricingTable pricingTable-2">
                <div className="pricingTable-header">
                  <h3 className="title">Plan Dos Semanas</h3>
                  <h1 className="price-value">$170</h1>
                </div>
                <ul className="pricing-content">
                  <li>Duración: 2 semanas</li>
                  <li>Acceso ilimitado durante el periodo</li>
                </ul>
                <button onClick={() => handleSubscriptionClick("Membresia15D")} className="btn btn-lg btn-price-bg">Suscribirse</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Membresias;
