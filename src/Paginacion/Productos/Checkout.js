import React, { useState, useEffect } from "react";
import { Card, Form } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import { useLocalStorage } from 'react-use';
import Header from "../../Esquema/Header";
import Footer from "../../Esquema/Footer";
import { useLocation, Link } from 'react-router-dom';
import { baseURL } from '../../api.js';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './Checkout.css';

const StripeForm = ({ total, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.error(error);
    } else {
      const { id } = paymentMethod;

      try {
        const response = await fetch(`${baseURL}/payment_stripe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id, amount: total * 100 }), // Ajusta el monto según sea necesario
        });

        const paymentResult = await response.json();

        if (paymentResult.success) {
          onPaymentSuccess();
          console.log('Payment successful', paymentResult.payment);
        } else {
          console.error('Payment failed', paymentResult.error);
        }
      } catch (error) {
        console.error('Error sending payment request', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-form">
      <div className="card-element-container">
        <CardElement />
      </div>
      <button type="submit" disabled={!stripe}>Pagar con tarjeta</button>
    </form>
  );
};

const Checkout = () => {
  const [user] = useLocalStorage('user');
  const [productos, setProductos] = useState([]);
  const [direccion, setDireccion] = useState(null);
  const location = useLocation();
  const [direccionSeleccionada, setDireccionSeleccionada] = useState(null);
  const [codigoDescuento, setCodigoDescuento] = useState('');
  const [descuentoAplicado, setDescuentoAplicado] = useState(false);
  const [mercadoPagoSelected, setMercadoPagoSelected] = useState(false);
  const [paypalSelected, setPaypalSelected] = useState(false);
  const [stripeSelected, setStripeSelected] = useState(false);
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
            setProductos(Array.isArray(data) ? data : []);
          } else {
            console.error("Error al cargar los productos del carrito");
          }
        } catch (error) {
          console.error("Error de red:", error);
        }
      }
    };

    const fetchDirecciones = async () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (loggedIn) {
        try {
          const response = await fetch(`${baseURL}/direccion-envio-predeterminada-user/${user.ID_usuario}`);
          if (response.ok) {
            const data = await response.json();
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
  }, [user.ID_usuario]);

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
    if (stripeSelected) {
      setStripeSelected(false);
    }
  };

  const handlePaypalChange = () => {
    setPaypalSelected(!paypalSelected);
    if (mercadoPagoSelected) {
      setMercadoPagoSelected(false);
    }
    if (stripeSelected) {
      setStripeSelected(false);
    }
  };

  const handleStripeChange = () => {
    setStripeSelected(!stripeSelected);
    if (mercadoPagoSelected) {
      setMercadoPagoSelected(false);
    }
    if (paypalSelected) {
      setPaypalSelected(false);
    }
  };

  function esURLSegura(url) {
    const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    return regex.test(url);
  }

  const handleRealizarPedido = async () => {
    if (!direccionSeleccionada) {
      alert('Debe seleccionar una dirección de envío');
      return;
    }

    if (!mercadoPagoSelected && !paypalSelected && !stripeSelected) {
      alert('Debe seleccionar un método de pago');
      return;
    }

    if (paypalSelected) {
      const createOrderResponse = await fetch(`${baseURL}/paypal/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ID_usuario: user.ID_usuario,
          total,
          currentURL: window.location.origin,
          ID_direccion: direccionSeleccionada,
        }),
      });

      if (createOrderResponse.ok) {
        const data = await createOrderResponse.json();
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
    }
  };

  return (
    <>
      <Header />
      <section className="checkout spad">
        <div className="container">
          <div className="checkout__form">
            <h4>Detalles de facturación</h4>
            <div className="row">
              <div className="col-lg-8 col-md-6">
                <div className="row">
                  <div className="checkout__order">
                    <h4>Mis direcciones</h4>
                    <div>
                      {direccion ? (
                        <>
                          <div key={direccion.ID_direccion} onClick={() => handleCardClick(direccion.ID_direccion)}>
                            <Card className="my-2 hover-card">
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
                                  to={{
                                    pathname: '/seleccionar-direccion-envio',
                                    state: {
                                      subtotal,
                                      descuentoAplicado,
                                      total,
                                      ID_usuario: user.ID_usuario
                                    }
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
                          <li>No existe ninguna dirección, agregue una
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
              <div className="col-lg-4 col-md-6">
                <div className="checkout__order">
                  <h4>Su pedido</h4>
                  <div className="checkout_order_products">Productos <span>Total</span></div>
                  <ul>
                    {Array.isArray(productos) && productos.map(producto => (
                      <li key={producto.ID_producto}>{producto.nombre.slice(0, 15)}...(x{producto.cantidad}) <span>${(producto.precioFinal * producto.cantidad).toFixed(2)}</span></li>
                    ))}
                  </ul>
                  <div className="checkout_order_subtotal">Subtotal <span>${subtotal.toFixed(2)}</span></div>
                  {descuentoAplicado && <div className="checkout_order_total">Descuento aplicado (SPORT100): <span>-$100.00</span></div>}
                  <div className="checkout_order_total">Total <span>${total.toFixed(2)}</span></div>
                  <div className="checkout_input_checkbox">
                    <label htmlFor="mercadopago">
                      Mercado Pago
                      <input type="checkbox" id="mercadopago" checked={mercadoPagoSelected} onChange={handleMercadoPagoChange} />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                  <div className="checkout_input_checkbox">
                    <label htmlFor="paypal">
                      PayPal
                      <input type="checkbox" id="paypal" checked={paypalSelected} onChange={handlePaypalChange} />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                  <div className="checkout_input_checkbox">
                    <label htmlFor="stripe">
                      Stripe
                      <input type="checkbox" id="stripe" checked={stripeSelected} onChange={handleStripeChange} />
                      <span className="checkmark"></span>
                    </label>
                    {stripeSelected && <StripeForm total={total} onPaymentSuccess={handleRealizarPedido} />}
                  </div>
                  <button type="button" className="site-btn" onClick={handleRealizarPedido}>REALIZAR PEDIDO</button>
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
