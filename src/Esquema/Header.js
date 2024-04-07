import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import $ from 'jquery';
import Breadcrumbs from "./Breadcrumbs"; // Ajusta la ruta de importación según la ubicación del archivo Breadcrumbs
import { baseURL } from '../api.js';
import { useLocalStorage } from 'react-use';

const Header = () => {

  // const { loggedIn, user, logout } = useContext(SessionContext);
  const [user, setUser] = useLocalStorage('user');
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage('isLoggedIn');
  const [totalProductosEnCarrito, setTotalProductosEnCarrito] = useState(0);

  useEffect(() => {
    $(".humberger__open").on("click", function () {
      $(".humberger__menu__wrapper").addClass("show__humberger__menu__wrapper");
      $(".humberger__menu__overlay").addClass("active");
      $("body").addClass("over_hid");
    });

    $(".humberger__menu__overlay").on("click", function () {
      $(".humberger__menu__wrapper").removeClass("show__humberger__menu__wrapper");
      $(".humberger__menu__overlay").removeClass("active");
      $("body").removeClass("over_hid");
    });
  }, []);

  useEffect(() => {
    fetchTotalProductosEnCarrito();
  }, []);

  const fetchTotalProductosEnCarrito = async () => {
    try {
      const response = await fetch(`${baseURL}/carrito-compras-total-usuario/${user.ID_usuario}`); // Ajusta la ruta de la API según tu configuración
      if (response.ok) {
        const data = await response.json();
        setTotalProductosEnCarrito(data.totalProductosEnCarrito);
      } else {
        console.error("Error al obtener la cantidad total de productos en el carrito");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  return (
    <>
      {/* Para telefonos */}
      <div class="humberger__menu__overlay"></div>
      <div class="humberger__menu__wrapper">
        <div class="humberger__menu__logo">
          <Link to="/"><img src="images/logo_letras.jpeg" alt="" /></Link>
        </div>
        <div class="humberger__menu__cart">
          <ul>
            <li><a href="#"><i class="fa fa-heart"></i> <span>1</span></a></li>
            <li><a href="#"><i class="fa fa-shopping-bag"></i> <span>3</span></a></li>
          </ul>
          <div class="header__cart__price">item: <span>$150.00</span></div>
        </div>
        <div class="humberger__menu__widget">
          <div class="header__top__right__auth__sm">
            <Link to="/login"><i class="fa fa-user"></i> Login</Link>
          </div>
        </div>
        <nav class="humberger__menu__nav">
          <ul>
            <li class="active"><Link to="/">Inicio</Link></li>
            <li><Link to="/tienda">Tienda</Link></li>
            {/* <li><a href="#">Pages</a>
              <ul class="header__menu__dropdown">
                <li><a href="./shop-details.html">Shop Details</a></li>
                <li><a href="./shoping-cart.html">Shoping Cart</a></li>
                <li><a href="./checkout.html">Check Out</a></li>
                <li><a href="./blog-details.html">Blog Details</a></li>
              </ul>
            </li> */}
            <li><Link to="/Nosotros">Nosotros</Link></li>
            <li><Link to="/Contacto">Contacto</Link></li>
          </ul>
        </nav>
        <div id="mobile-menu-wrap"></div>
        <div class="header__top__right__social">
          <a href="#"><i class="fa fa-facebook"></i></a>
          <a href="#"><i class="fa fa-twitter"></i></a>
          <a href="#"><i class="fa fa-linkedin"></i></a>
          <a href="#"><i class="fa fa-pinterest-p"></i></a>
        </div>
        <div class="humberger__menu__contact">
          <ul>
            <li><i class="fa fa-envelope"></i> sportgymcenterinfo@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* para pantallas grandes  */}
      <header class="header sticky-top">
        <div class="container">
          <div class="row">
            <div class="col-lg-3">
              <div class="header__logo">
                <Link to="/"><img src="images/logo_letras.jpeg" alt="" /></Link>
              </div>
            </div>
            <div class="col-lg-6">
              <nav class="header__menu">
                <ul>
                  <li class="active"><Link to="/">Inicio</Link></li>
                  <li><Link to="/tienda">Tienda</Link></li>
                  <li><Link to="/membresias">Membresías</Link></li>
                  {/* <li><a href="#">Pages</a>
                    <ul class="header__menu__dropdown">
                      <li><a href="./shop-details.html">Shop Details</a></li>
                      <li><a href="./shoping-cart.html">Shoping Cart</a></li>
                      <li><a href="./checkout.html">Check Out</a></li>
                      <li><a href="./blog-details.html">Blog Details</a></li>
                    </ul>
                  </li> */}
                  <li><Link to="/nosotros">Nosotros</Link></li>
                  <li><Link to="/contacto">Contacto</Link></li>
                </ul>
              </nav>
            </div>
            <div class="col-lg-3">
              <div class="header__cart">
                <ul>
                  {/* <li><a href="#"><i class="fa fa-heart"></i> <span>1</span></a></li> */}
                  <li><Link to="/carrito"><i class="fa fa-shopping-bag"></i> <span>{totalProductosEnCarrito}</span></Link></li>
                </ul>
                {isLoggedIn ? (
                  <>
                    <div class="header__top__right__auth">
                      <Link to="/perfil"><i class="fa fa-user"></i> Ver mi perfil</Link>
                    </div>
                    <div class="header__cart__price ms-4">Bienvenido, <span>{user.usuario}</span> ...!</div>

                  </>
                ) : (
                  <>
                    <div class="header__top__right__auth">
                      <Link to="/login"><i class="fa fa-user"></i> Login</Link>
                    </div>
                    <div class="header__cart__price ms-4">item: <span>$150.00</span></div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div class="humberger__open">
            <i class="fa fa-bars"></i>
          </div>
        </div>
      </header>
      <div className="container">
        <div className="row">
          <div className="col">
            <Breadcrumbs />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;