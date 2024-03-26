import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from "../../Esquema/Header.js";
import Footer from "../../Esquema/Footer.js";
import { obtenerFechaHoraActual } from "../utilidades/dateUtils.js";
import UsuarioQRCode from './UsuarioQRCode.js';


import { baseURL } from '../../api.js';

const Membresia = () => {
  const [membresiaData, setMembresiaData] = useState(null);
  const [tipoMembresiaData, settipoMembresiaData] = useState(null);

  const location = useLocation();
  const dataUser = location.state;

  useEffect(() => {
    const fetchMembresia = async () => {

      try {
        console.log(dataUser);
        const id = dataUser.ID_usuario;
        console.log("id", id);
        const response = await fetch(`${baseURL}/membresia-usuario/${id}`);

        if (!response.ok) {
          throw new Error('Error al obtener la información del usuario');
        }

        const datosMembresiaUsuario = await response.json();
        console.log("datosMembresiaUsuario", datosMembresiaUsuario);


        if (datosMembresiaUsuario.length > 0) {
          console.log('Existe');
          const datosMembresia = datosMembresiaUsuario[0];
          const id = datosMembresia.ID_tipoMembresia;
          console.log("datosMembresia", datosMembresia)

          try {
            const response = await fetch(`${baseURL}/membershipTypes/${id}`);
            if (!response.ok) {
              throw new Error('Error al obtener el tipo de membresía');
            }
            const membershipType = await response.json();
            settipoMembresiaData(membershipType);
            setMembresiaData(datosMembresia);
            console.log('setMembresiaData:', datosMembresia);
            console.log('Tipo de membresía:', membershipType);

            
          } catch (error) {
            console.error(error);
          }
        } else {
          console.log('No existe');

        }

      } catch (error) {
        console.error(error);
      }

      
    };

    fetchMembresia();
  }, []);


const userData = membresiaData && tipoMembresiaData && {
  ID_usuario: membresiaData.ID_usuario,
  fechaInicio: membresiaData.fechaInicio,
  fechaVencimiento: membresiaData.fechaVencimiento, 
  ID_tipoMembresia: tipoMembresiaData.ID_tipoMembresia,
  ID_UnicoMembresilla: tipoMembresiaData.ID_UnicoMembresilla,
  nombreMembresia: tipoMembresiaData.nombre
};



  return (
    <>
      <Header />
      <div>
        <h2>Membresía</h2>
        {membresiaData ? (
          <>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{tipoMembresiaData.nombre}</h5>
                <p className="card-text">{tipoMembresiaData.descripcion}</p>
                <p className="card-text">Precio: ${tipoMembresiaData.costo}</p>
                <p className="card-text">Fecha inicio de la suscripción: {membresiaData.fechaInicio}</p>
                <p className="card-text">Fecha fin de la suscripción: {membresiaData.fechaVencimiento}</p>
                {/* Agrega más propiedades según la estructura de tu objeto de datos */}
              </div>
            </div>
            <UsuarioQRCode userData={userData} />
          </>

        ) : (
          <p>Cargando...</p>
        )}
      </div>
      <Footer />
    </>

  );
};

export default Membresia;
