import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../Esquema/Header';
import Footer from '../../Esquema/Footer';
import Swal from 'sweetalert2';
import { baseURL } from '../../api.js';

import { GoHeart } from "react-icons/go";

const ProductDetails = () => {
  const { id } = useParams();
  const [ID_carrito, setID_carrito] = useState("");
  const [product, setProduct] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [maxQuantity, setMaxQuantity] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    // Definir la función de solicitud fetch
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${baseURL}/products-with-imagens/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
          setMaxQuantity(data[0].existencias);
        } else {
          console.error('Error al cargar los datos del producto');
        }
      } catch (error) {
        console.error('Error de red:', error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= maxQuantity) {
      setQuantity(value);
    }
  };

  const addToCart = async () => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (loggedIn) {
      const user = JSON.parse(localStorage.getItem('user'));
      try {
        const response = await fetch(`${baseURL}/carrito-compras-existe-prod/${user.ID_usuario}/${product[0].ID_producto}`);
        if (response.ok) {
          const data = await response.json();
          // console.log(data.ID_carrito)
          if (data.existeRegistro) {
            const response = await fetch(`${baseURL}/carrito-compras/${data.ID_carrito}`);
            if (!response.ok) {
              throw new Error('Error al obtener los elementos del carrito');
            }
            const datos = await response.json();
            // console.log("datos", datos)
            const cantidad = quantity + datos.cantidad;
            if (cantidad > maxQuantity) {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "¡La cantidad de productos seleccionados accede el maximo en stock!",
                footer: '<a href="/carrito">Ir al carrito</L>'
              });
            } else {
              updateItemQuantity(data.ID_carrito, cantidad);
            }
          } else {
            try {
              const response = await fetch(`${baseURL}/carrito-compras`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  ID_usuario: user.ID_usuario,
                  ID_producto: product[0].ID_producto,
                  cantidad: quantity
                })
              });
              if (response.ok) {
                Swal.fire({
                  title: "Producto agregado al carrito",
                  icon: "success",
                  showDenyButton: true,
                  // showCancelButton: true,
                  confirmButtonText: "Ver carrito",
                  denyButtonText: "Seguir comprando",
                }).then((result) => {
                  if (result.isConfirmed) {
                    window.location.href = "/carrito";
                  } else if (result.isDenied) {
                    window.location.href = "/tienda";
                  }
                });
              } else {
                console.error('Error al agregar el producto al carrito');
              }
            } catch (error) {
              console.error('Error de red:', error);
            }
          }
        } else {
          throw new Error('Error al verificar la existencia del producto en el carrito');
        }
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }

    } else {
      navigate('/login');
    }
  };

  const updateItemQuantity = async (ID_carrito, cantidad) => {
    try {
      const response = await fetch(`${baseURL}/carrito-compras/${ID_carrito}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cantidad })
      });
      if (response.ok) {
        Swal.fire({
          title: "Producto agregado al carrito",
          icon: "success",
          showDenyButton: true,
          confirmButtonText: "Ver carrito",
          denyButtonText: "Seguir comprando",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/carrito";
          } else if (result.isDenied) {
          }
        });
      } else {
        console.error('Error en la solicitud:', response.status);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };



  return (
    <>
      <Header />
      {/* <!-- Product Details Section Begin --> */}
      <section className="product-details spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6">
              <div className="product__details__pic">
                <div className="product__details__pic__item">
                  {product && product.length > 0 && product[0].imagenUrl && (
                    <img
                      className="product__details__pic__item--large"
                      src={product[0].imagenUrl}
                      alt={product[0].nombre || ""}
                      style={{ width: '540px', height: '560px' }}
                    />
                  )}
                </div>
                <div className="product__details__pic__slider owl-carousel">
                  <img data-imgbigurl="img/product/details/product-details-2.jpg"
                    src="/img/product/details/thumb-1.jpg" alt="" />
                  <img data-imgbigurl="img/product/details/product-details-3.jpg"
                    src="/img/product/details/thumb-2.jpg" alt="" />
                  <img data-imgbigurl="img/product/details/product-details-5.jpg"
                    src="/img/product/details/thumb-3.jpg" alt="" />
                  <img data-imgbigurl="img/product/details/product-details-4.jpg"
                    src="/img/product/details/thumb-4.jpg" alt="" />
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="product__details__text">
                <h3>{product && product.length > 0 ? product[0].nombre : "Nombre del Producto"}</h3>
                <div className="product__details__rating">
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star-half-o"></i>
                  <span>(18 reseñas)</span>
                </div>
                {product && product.length > 0 && product[0].existencias > 0 ? (
                  <>
                    <div className="product__details__price mb-0">${product[0].precio}</div>
                    <p>IVA incluido</p>
                    <div className="product__details__quantity">
                      <div className="quantity">
                        <div className="pro-qty">
                          <input type="number" value={quantity} min="1" max={maxQuantity} onChange={handleQuantityChange} />
                        </div>
                      </div>
                    </div>
                    <button className="primary-btn" onClick={addToCart} style={{ border: 'none' }}>
                      AGREGAR AL CARRITO
                    </button>
                  </>
                ) : (
                  <p>El producto no está disponible por falta de stock</p>
                )}
                <a href="#" className="heart-icon"><GoHeart size={18} /></a>
                <ul>
                  <li><b>Disponibilidad</b> <span> ({product && product.length > 0 ? product[0].existencias : "NULL"}) En stock</span></li>
                  <li><b>Envío</b> <span>01 day shipping. <samp>Free pickup today</samp></span></li>
                  <li><b>Peso</b> <span>0.5 kg</span></li>
                  <li><b>Compartir en</b>
                    <div className="share">
                      <a href="#"><i className="fa fa-facebook"></i></a>
                      <a href="#"><i className="fa fa-twitter"></i></a>
                      <a href="#"><i className="fa fa-instagram"></i></a>
                      <a href="#"><i className="fa fa-pinterest"></i></a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-lg-12">
              <div class="product__details__tab">
                <ul class="nav nav-tabs" role="tablist">
                  <li class="nav-item">
                    <a class="nav-link active" data-toggle="tab" href="#tabs-1" role="tab"
                      aria-selected="true">Descripción</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" data-toggle="tab" href="#tabs-2" role="tab"
                      aria-selected="false">Información</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" data-toggle="tab" href="#tabs-3" role="tab"
                      aria-selected="false">Reseñas <span>(1)</span></a>
                  </li>
                </ul>
                <div class="tab-content">
                  <div class="tab-pane active" id="tabs-1" role="tabpanel">
                    <div class="product__details__tab__desc">
                      <h6>Información del producto</h6>
                      <p>{product && product.length > 0 ? product[0].descripcion : "Descripción del Producto"}</p>
                    </div>
                  </div>
                  <div class="tab-pane" id="tabs-2" role="tabpanel">
                    <div class="product__details__tab__desc">
                      <h6>Products Infomation</h6>
                      <p>Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui.</p>
                    </div>
                  </div>
                  <div class="tab-pane" id="tabs-3" role="tabpanel">
                    <div class="product__details__tab__desc">
                      <h6>Products Infomation</h6>
                      <p>Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui.</p>
                    </div>
                  </div>
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

export default ProductDetails;
