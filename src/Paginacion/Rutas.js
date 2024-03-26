import React from 'react'
import { Routes, Route } from 'react-router-dom';
import { useLocalStorage } from 'react-use';


import Index from './Index';
import ProtectedRoute from './utilidades/ProtectedRoute';

import Header from '../Esquema/Header';
import Footer from '../Esquema/Footer';

import Productos from './Productos/Productos';
import Example from './Productos/Example';

import Filtros from './Productos/Filtros';
import Productos2 from './Productos/Productos2';
// import Producto from './Productos/Producto';
// import Producto2 from './Productos/Producto2';
// import Carrito from './Productos/Carrito';
import PrivacyPolicy from './Empresa/Privacidad/PrivacyPolicy';
import Terminos from './Empresa/TerminosCondiciones/TerminosCondiciones';
import CookiePolicy from './Empresa/Cookies/CookiePolicy';
import Contacto from './Empresa/Contacto/Contacto';
import Nosotros from './Empresa/Nosotros/Nosotros';

import Registro from './Registro/Registro';
import Login from './Login/Login';
import Login2 from './Login/Login2';
import MFA from './Login/MFA';
import Perfil from './Usuario/Perfil';
// import IndexCargaRapida from './Accesibilidad/CargaRapida/IndexCargaRapida';
// import TerminosCondicionesH from './Accesibilidad/CargaRapida/TerminosCondiciones/TerminosCondicionesH';
// import TextToSpeech from './Accesibilidad/Visual/TextToSpeech';
// import MenuAccessible from './Accesibilidad/Visual/MenuAccesible';
// import CookiePolicyV from './Accesibilidad/Visual/Cookies/CookiePolicyV';
import Recuperacion from './Recuperacion/Recuperacion';
import Token from './Recuperacion/Token';
// import EmailSender from './email/EmailSender';
import ResetPassword from './Recuperacion/ResetPassword';

import Sidebar from './Sidebar/Sidebar';
// import ActiveLastBreadcrumb from "../ActiveLastBreadcrumb";

// import ProductosComponent from './Productos/ProductosComponent';
import AdmProductos from './Administracion/Productos/AdmProductos';
import AgregarProducto from './Administracion/Productos/AgregarProducto';
import EditarProducto from './Administracion/Productos/EditarProducto';
// import Header2 from '../Esquema/Headerq';
// import Bodys from '../Esquema/Bodys';


import ApiDataDisplay from './Administracion/Usuarios/ApiDataDisplay';

import Error404 from './Validaciones/Error404/Error404';
// import Error500 from './Validaciones/Error500/Error500';


import subirImagen from './Administracion/Productos/subirImagen';
import MapComponent from './Validaciones/MapComponent/MapComponent';

import MembershipComponent from './Membresillas/MembershipComponent';
import Suscripcion from './Membresillas/Subcripcion';
import Membresia from './Usuario/Membresia';
import HistorialMembresias from './Usuario/HistorialMembresias';

import Precios from './Membresillas/Precios';
import ProductosList from './Productos/ProductosList';
import ProductDetails from './Productos/product-details';
import ProductGrid from './Productos/product-grid';
import Carrito from './Productos/Carrito';
import Checkout from './Productos/Checkout';
import PruebaAbrirModal from './Productos/PruebaAbrirModal';
import AgregarDireccionesEnvio from './Productos/AgregarDireccionesEnvio';
import Pregunta from './Recuperacion/Pregunta';
import MisDirecciones from './Usuario/Direccion/MisDirecciones';
import Login3 from './Login/Login3';
import EditarDireccionesEnvio from './Productos/EditarDireccionesEnvio';
import CheckoutDirecciones from './Productos/CheckoutDirecciones';
// import Error from './Validaciones/Error404/Error';
const Rutas = () => {
  const [user, setUser] = useLocalStorage('user');
  const [isLoggedInLogin, setIsLoggedInLogin] = useLocalStorage('isLoggedInTemp');
  const [tokenCheckout, setTokenCheckout] = useLocalStorage('tokenCheckout');

  React.useEffect(() => {
    if (tokenCheckout) {
      console.log("Usuario registrado:", tokenCheckout);
    } else {
      console.log("No hay un usuario registrado.");
    }
  }, [tokenCheckout]);
  return (
    <>
      {/* <ActiveLastBreadcrumb /> */}

      <Routes>

        <Route path="/" element={< Index />}></Route>

        <Route element={<ProtectedRoute canActivate={user} redirectPath='/login' />}>
          <Route path="/apiUser" element={<ApiDataDisplay />} />
          <Route path='/perfil' element={<Perfil />}></Route>
          <Route path='/mis-direcciones' element={<MisDirecciones />}></Route>
          <Route path='/agregar-direccion-envio' element={<AgregarDireccionesEnvio />}></Route>
          <Route path='/editar-direccion-envio/:ID_direccion' element={<EditarDireccionesEnvio />}></Route>
          <Route path='/checkout' element={<Checkout />}></Route>
          <Route path='/seleccionar-direccion-envio' element={<CheckoutDirecciones />}></Route>
        </Route>

        <Route path='/header' element={<Header />}></Route>
        <Route path='/footer' element={<Footer />}></Route>

        <Route path='/tienda' element={<Productos />}></Route>
        <Route path='/example' Component={Example}></Route>
        <Route path='/filtros' Component={Filtros}></Route>
        <Route path='/productos2' Component={Productos2}></Route>
        <Route path='/producto-grid' element={<ProductGrid />}></Route>
        <Route path='/product-details/:id' element={<ProductDetails />}></Route>
        <Route path='/carrito' element={<Carrito />}></Route>

        <Route path='/modal' Component={PruebaAbrirModal}></Route>

        <Route path='/privacidad' element={<PrivacyPolicy />}></Route>
        <Route path='/terminos-y-condiciones' element={<Terminos />}></Route>
        <Route path='/cookies' element={<CookiePolicy />}></Route>
        <Route path='/contacto' element={<Contacto />}></Route>
        <Route path='/nosotros' element={<Nosotros />}></Route>

        <Route path='/registro' element={<Registro />}></Route>
        <Route path='/login' element={<Login />}></Route>

        <Route path='/login3' element={<Login3 />}></Route>


        <Route path='/membresia' Component={Membresia}></Route>
        <Route path='/historialMembresias' Component={HistorialMembresias}></Route>

        <Route path='/si' Component={Sidebar}></Route>

        <Route path='/login2' Component={Login2}></Route>
        <Route path='/recuperacion' Component={Recuperacion}></Route>
        <Route path='/validacion' Component={Token}></Route>
        <Route path='/resetPassword' Component={ResetPassword}></Route>

        <Route path='/AdmProductos' Component={AdmProductos}></Route>
        <Route path='/AgregarProducto' Component={AgregarProducto}></Route>
        <Route path='/EditarProducto' Component={EditarProducto}></Route>


        <Route path='/subirImagen' Component={subirImagen}></Route>
        <Route path='/map' Component={MapComponent}></Route>


        {/* <Route path='/menuVisual' Component={ MenuAccessible }></Route> */}

        <Route path='/membresias' Component={MembershipComponent}></Route>
        <Route path='/suscripcion' Component={Suscripcion}></Route>


        {/* COMPONENTES QUE DEBEN SER MODIFICADOS CON ESTILOS  */}
        <Route path='/precios' Component={Precios}></Route>
        <Route path='/list' Component={ProductosList}></Route>
        <Route path='/details' Component={ProductDetails}></Route>


        <Route path='/pregunta' Component={Pregunta}></Route>

        <Route path='*' Component={Error404}></Route>

      </Routes>
    </>
  )
}

export default Rutas