import React, { useState, useEffect } from 'react';
import Header from "../../Esquema/Header.js";
import Footer from "../../Esquema/Footer";
import { useParams } from 'react-router-dom';
import { baseURL } from '../../api.js';
import ConfettiComponent from '../utilidades/ConfetiComponent.js';
import Spinner from '../utilidades/Spinner';
import "./CompraFinalizada.css"

import { FaPlus } from "react-icons/fa";

const CompraFinalizada = () => {
  const [productos, setProductos] = useState([]);
  const { id, tipo } = useParams();
  const [comprado, setComprado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imagenes, setImagenes] = useState([]);

  const fetchValidarCompra = async (id) => {
    try {
      const response = await fetch(`${baseURL}/orden-pedido-existe/${id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.existeRegistro) {
          setComprado(true);
          fetchCompras(id);
        }
      } else {
        console.error("Error al cargar los productos del carrito");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  const fetchValidarMembresia = async (ID_orden) => {
    console.log("validarMembresia")
    // try {
    //   const response = await fetch(`${baseURL}/membresia-usuario-existe/${id}`);
    //   if (response.ok) {
    //     const data = await response.json();
    //     setProductos(data);
    //   } else {
    //     console.error("Error al cargar los productos del carrito");
    //   }
    // } catch (error) {
    //   console.error("Error de red:", error);
    // }
  };


  const fetchCompras = async (ID_pedido) => {
    try {
      const response = await fetch(`${baseURL}/detalles-pedido-items/${ID_pedido}`);
      if (response.ok) {
        const data = await response.json();
        setProductos(data);
        setLoading(false);
        const urls = data.map(producto => producto.imagenUrl);
        setImagenes(urls);
      } else {
        console.error("Error al cargar los productos del carrito");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  useEffect(() => {
    if (tipo == 1) {
      fetchValidarCompra(id)
    } else {
      fetchValidarMembresia(id)
    }
  }, []);

  return (
    <>
      <Header />
      {comprado && <ConfettiComponent />}
      <div className='container'>
        <div className='content-height'>
          
          <Spinner contentReady={!loading} />
          {!loading && (
            <div className="container">
              <div className="contenido">
                {tipo == 1 ? (
                  <>
                    <div className="imagen-container mt-5">
                      {imagenes.map((url, index) => (
                        <div key={index} className={`imagen-item ${index + 1 >= 3 ? "opacidad" : ""}`}>
                          <img src={url} alt={`Imagen ${index + 1}`} />
                        </div>
                      ))}
                      {imagenes.length + 1 > 3 && <div className="icono-mas"><FaPlus size={40} /></div>}
                    </div>
                    <div className="empty-cart-message">
                      <h6>Gracias por tu compra</h6>
                    </div>
                  </>
                ) : (
                  // Si el tipo no es 1, mostrar otro contenido
                  <div>
                    Otra cosa que deseas mostrar para el tipo diferente de 1
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CompraFinalizada;
