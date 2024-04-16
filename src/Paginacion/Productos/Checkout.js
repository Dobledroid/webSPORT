import React, { useState, useEffect } from "react";
import { Card, Form } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import { useLocalStorage } from 'react-use';
import Header from "../../Esquema/Header";
import Footer from "../../Esquema/Footer";
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { baseURL } from '../../api.js';
import './Checkout.css';

const Checkout = () => {
  const [user, setUser] = useLocalStorage('user');
  const [productos, setProductos] = useState([]);
  const [direccion, setDireccion] = useState(null);
  const location = useLocation();
  const [direccionSeleccionada, setDireccionSeleccionada] = useState(null);

  const [codigoDescuento, setCodigoDescuento] = useState('');
  const [descuentoAplicado, setDescuentoAplicado] = useState(false);
  const [mercadoPagoSelected, setMercadoPagoSelected] = useState(false);
  const [paypalSelected, setPaypalSelected] = useState(false);

  const { subtotal, total } = location.state;

  const handleCheckboxChange = (event) => {
    const direccionId = parseInt(event.target.value);
    setDireccionSeleccionada(direccionId);
  };
  const handleCardClick = (direccionId) => {
    setDireccionSeleccionada(direccionId);
  };

  useEffect(() => {
    const fetchProductosPedidos = async () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (loggedIn) {
        try {
          const response = await fetch(`${baseURL}/carrito-compras/${user.ID_usuario}`);
          if (response.ok) {
            const data = await response.json();
            setProductos(data);
          } else {
            console.error("Error al cargar los productos del carrito");
          }
        } catch (error) {
          console.error("Error de red:", error);
        }
      } else {

      }
    };

    const fetchDirecciones = async () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (loggedIn) {
        try {
          const response = await fetch(`${baseURL}/direccion-envio-predeterminada-user/${user.ID_usuario}`);
          if (response.ok) {
            const data = await response.json();
            // console.log(data)
            setDireccion(data);
          } else {
            console.error("Error al cargar las direcciones guardadas");
          }
        } catch (error) {
          console.error("Error de red:", error);
        }
      }
    };

    fetchDirecciones();
    fetchProductosPedidos();
  }, []);

  const handleInputChange = (event) => {
    setCodigoDescuento(event.target.value);
  };

  const handleDescuentoSubmit = (event) => {
    event.preventDefault();
    if (codigoDescuento === 'SPORT100') {
      setDescuentoAplicado(true);
    } else {
      alert('El código de descuento ingresado no es válido.');
    }
  };

  const handleMercadoPagoChange = () => {
    setMercadoPagoSelected(!mercadoPagoSelected);
    if (paypalSelected) {
      setPaypalSelected(false);
    }
  };

  const handlePaypalChange = () => {
    setPaypalSelected(!paypalSelected);
    if (mercadoPagoSelected) {
      setMercadoPagoSelected(false);
    }
  };

  function esURLSegura(url) {
    const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    return regex.test(url);
  }

  const handleRealizarPedido = async () => {
    const currentURL = new URL(window.location.href);
    const host = "http://localhost:3000";
    // const host = currentURL.protocol + '//' + currentURL.hostname;
    // console.log(host); 
    const id = user.ID_usuario;
    if (mercadoPagoSelected || paypalSelected) {
      const createOrderResponse = await fetch(`${baseURL}/paypal/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ID_usuario: id,
          total,
          currentURL: host
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

    } else {
      alert('Debe seleccionar un método de pago');
    }
  };

  return (
    <>
      <Header />
      <section class="checkout spad">
        <div class="container">
          <div class="checkout__form">
            <h4>Detalles de facturación</h4>
            <div class="row">
              <div class="col-lg-8 col-md-6">
                <div class="row">
                  <div class="checkout__order">
                    <h4>Mis direcciones</h4>
                    <div>
                      {direccion ? (
                        <>
                          <div key={direccion.ID_direccion} onClick={() => handleCardClick(direccion.ID_direccion)}>
                            <Card className="my-2 hover-card" >
                              <Card.Body className="d-flex">
                                <Form.Check
                                  type="radio"
                                  id={`direccion-${direccion.ID_direccion}`}
                                  name="direccion"
                                  value={direccion.ID_direccion}
                                  checked={direccionSeleccionada === direccion.ID_direccion}
                                  onChange={handleCheckboxChange}
                                  className="align-self-start"
                                />
                                <div className="ms-4">
                                  <Card.Title>C.P. {direccion.codigoPostal}</Card.Title>
                                  <Card.Text className="m-0">{direccion.direccion}</Card.Text>
                                  <Card.Text>{direccion.nombre} - {direccion.telefono}</Card.Text>
                                </div>
                              </Card.Body>
                              <Card.Footer className="text-muted" style={{ backgroundColor: 'transparent' }}>
                                <Link
                                  to={`/seleccionar-direccion-envio`}
                                  state={{
                                    subtotal: subtotal,
                                    descuentoAplicado: descuentoAplicado,
                                    total: total,
                                    ID_usuario: user.ID_usuario
                                  }}
                                  className="edit-link"
                                >
                                  Editar o elegir otro domicilio
                                </Link>
                              </Card.Footer>
                            </Card>
                          </div>
                        </>
                      ) : (
                        <ul>
                          <li> No existe ninguna dirección, agregue una
                            <Link to={"/agregar-direccion-envio"}> aquí</Link>
                          </li>
                        </ul>
                      )}
                    </div>
                    <div className="col-lg-6">
                      <div className="shoping__continue">
                        <div className="shoping__discount">
                          <h5>Códigos de descuento</h5>
                          <form onSubmit={handleDescuentoSubmit}>
                            <input type="text" placeholder="Ingrese su código de cupón" value={codigoDescuento} onChange={handleInputChange} className="text-dark" />
                            <button type="submit" className="site-btn">APLICAR CUPÓN</button>
                          </form>
                          {descuentoAplicado && <p>Descuento aplicado correctamente.</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-6">
                <div class="checkout__order">
                  <h4>Su pedido</h4>
                  <div class="checkout__order__products">Productos <span>Total</span></div>
                  <ul>
                    {productos.map(producto => (
                      <li key={producto.ID_producto}> {producto.nombre.slice(0, 15)}...(x{producto.cantidad}) <span>${(producto.precioFinal * producto.cantidad).toFixed(2)}</span></li>
                    ))}
                  </ul>
                  <div class="checkout__order__subtotal">Subtotal <span>${subtotal.toFixed(2)}</span></div>
                  {descuentoAplicado && <div class="checkout__order__total">Descuento aplicado (SPORT100): <span>-$100.00</span></div>}
                  <div class="checkout__order__total">Total <span>${total.toFixed(2)}</span></div>
                  <div class="checkout__input__checkbox">
                    <label for="mercadopago">
                      Mercado pago
                      <input type="checkbox" id="mercadopago" checked={mercadoPagoSelected} onChange={handleMercadoPagoChange} />
                      <span class="checkmark"></span>
                    </label>
                  </div>
                  <div class="checkout__input__checkbox">
                    <label for="paypal">
                      Paypal
                      <input type="checkbox" id="paypal" checked={paypalSelected} onChange={handlePaypalChange} />
                      <span class="checkmark"></span>
                    </label>
                  </div>
                  <button type="button" class="site-btn" onClick={handleRealizarPedido}>REALIZAR PEDIDO</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Checkout;
