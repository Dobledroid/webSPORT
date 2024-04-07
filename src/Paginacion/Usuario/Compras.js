import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../Esquema/Header.js';
import Footer from '../../Esquema/Footer.js';
import { useLocalStorage } from 'react-use';

import { baseURL } from '../../api.js';

const Compras = () => {
  const [detallesPorPedido, setDetallesPorPedido] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [recuperado, setRecuperado] = useState(false);

  const [user, setUser] = useLocalStorage('user');

  useEffect(() => {
    const id = user.ID_usuario;
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}/detalles-pedido/${id}`);
        if (!response.ok) {
          throw new Error('Error al obtener las compras');
        }
        const data = await response.json();

        // Objeto para almacenar los detalles de pedido agrupados por ID_pedido
        const detallesAgrupados = {};

        // Iterar sobre los detalles de pedido
        data.forEach((detalle) => {
          const { ID_pedido } = detalle;

          // Si el ID_pedido aún no está en el objeto, crear una nueva entrada
          if (!detallesAgrupados[ID_pedido]) {
            detallesAgrupados[ID_pedido] = [];
          }
          // Agregar el detalle de pedido a la lista correspondiente al ID_pedido
          detallesAgrupados[ID_pedido].push(detalle);
        });

        console.log(detallesAgrupados);
        setDetallesPorPedido(detallesAgrupados);
        setCargando(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);


  return (
    <>
      <Header />
      <div className='content'>
        <div className='containerAdm'>
          <div className="pagetitle">
            <h1>Mi compras</h1>
          </div>

          <p>Mi registro de compras</p>

          <section>
            <div className="row">
              <div className="card">

                {cargando ? (
                  <div>Cargando historial de compras...</div>
                ) : (
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-0">
                      <h5 className="card-title">Compras</h5>
                    </div>
                    {Object.keys(detallesPorPedido).map((idPedido) => (
                      <div key={idPedido} className="card mb-3">
                        <div className="card-header">
                          {new Date(idPedido).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        <div className="card-body">
                          {detallesPorPedido[idPedido].map((detalle) => (
                            <div key={detalle.ID_detalle} className="row mb-3">
                              <div className="col-md-3">
                                <img src={detalle.imagenUrl} alt={detalle.nombre} style={{ width: '100px', height: '100px' }} />
                              </div>
                              <div className="col-md-9">
                                <h5 className="card-title">{detalle.nombre.slice(0, 50)}...</h5>
                                <p className="card-text">Cantidad: {detalle.cantidad}</p>
                                <p className="card-text">Total: {detalle.total}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Compras;
