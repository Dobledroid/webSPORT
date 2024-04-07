import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Esquema/Header';
import Footer from '../../Esquema/Footer';
import { useLocalStorage } from 'react-use';
import { baseURL } from '../../api.js';

const HistorialMembresias = () => {
  const [membresias, setMembresias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  const [user, setUser] = useLocalStorage('user');

  useEffect(() => {
    const id = user.ID_usuario;
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}/mi-historial-membresias/${id}`);
        if (!response.ok) {
          throw new Error('Error al obtener el historial de membresías');
        }
        const data = await response.json();
        console.log(data); 
        setMembresias(data);
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
            <h1>Mi registro de membresias</h1>
          </div>

          <p>Mi registro de membresias</p>

          <section>
            <div className="row">
              <div className="card">

                {cargando ? (
                  <div>Cargando productos...</div>
                ) : (
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-0">
                      <h5 className="card-title">Registros de la tabla Usuarios</h5>

                      <p className="card-title">
                        <button className='btn btn-primary' onClick={() => navigate('/agregarProducto')}>
                          Agregar
                        </button>
                      </p>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-hover table-bordered">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Tipo de membresía</th>
                            <th scope="col">Fecha de inicio</th>
                            <th scope="col">Fecha de vencimiento</th>
                            <th scope="col">Precio</th>
                            <th scope="col">Operación</th>
                            <th scope="col">Estatus</th>
                          </tr>
                        </thead>
                        <tbody>
                          {membresias.map(membresia => (
                            <tr key={membresia.ID_historialMembresia}>
                              <th scope="row">{membresia.ID_historialMembresia}</th>
                              <td>{membresia.nombre}</td>
                              <td>{membresia.fechaInicio}</td>
                              <td>{membresia.fechaVencimiento}</td>
                              <td>{membresia.precio}</td>
                              <td>{membresia.operacion_id}</td>
                              <td>{membresia.operacion_status}</td>
                              {/* <td className="d-flex justify-content-center">
                              <Link to={`/EditarProducto/${producto.ID_producto}`} className="btn btn-primary btn-sm me-2">
                                <i className="bi bi-pencil-fill text-dark"></i>
                              </Link>
                              <span className="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#basicModal">
                                <i className="bi bi-trash-fill text-dark"></i>
                              </span>
                            </td> */}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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

export default HistorialMembresias;
