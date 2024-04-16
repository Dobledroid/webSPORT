import React, { useState, useEffect } from 'react';
import Header from "../../../Esquema/Header.js";
import Footer from "../../../Esquema/Footer.js";
import { baseURL } from '../../../api.js';
import Sidebar from "../../../Esquema/Sidebar.js";
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import DOMPurify from 'dompurify';

const AdmProductos = () => {
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    descuento: 0,
    existencias: 0,
    categoria: '',
    subcategoria: '',
    marca: '',
    imagen: null
  });

  const [images, setImages] = useState([]);

  const [error, setError] = useState('');

  const modalStyles = {
    modalTransparent: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await fetch(`${baseURL}/list-products-imagenPrincipal-admin`);
      if (!response.ok) {
        throw new Error('Error al obtener los productos');
      }
      const data = await response.json();
      console.log(productos)
      setProductos(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/') && file.size <= 1500000) {
      setFormData({ ...formData, imagen: file });
    } else {
      Swal.fire('Error', 'Archivo no válido. Asegúrate de que sea una imagen y no exceda los 1.5 MB.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${baseURL}/products/${isEditing ? formData.id : ''}`;
    const method = isEditing ? 'PUT' : 'POST';
  
    const form = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== 'imagen') {
        form.append(key, formData[key]);
      } else if (formData.imagen) {
        form.append('imagen', formData.imagen);
      }
    });
  
    try {
      const response = await fetch(url, {
        method: method,
        body: form, // We send the form as FormData, not as JSON
      });
      if (!response.ok) {
        throw new Error('Error al procesar la solicitud');
      }
      fetchProductos();
      setShowModal(false);
      console.log('FormData:', formData); // Aquí se imprime el formData completo
      Swal.fire('¡Completado!', `El producto ha sido ${isEditing ? 'actualizado' : 'agregado'} correctamente.`, 'success');
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Hubo un problema al procesar la solicitud.', 'error');
    }
  };
  

  const precioFinal = formData.precio - formData.descuento;

  const handleDelete = async (id) => {
    const producto = productos.find(p => p.ID_UnicoProducto === id);
    if (!producto) {
      Swal.fire('Error', 'Producto no encontrado.', 'error');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: `Estás a punto de eliminar el producto "${producto.nombre}". ¡No podrás revertir esto!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Eliminando producto con ID:", id);
        fetch(`${baseURL}/products/${id}`, {
          method: 'DELETE'
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Error al eliminar el producto');
            }
            Swal.fire('Eliminado!', 'El producto ha sido eliminado.', 'success');
            fetchProductos();
          })
          .catch(error => {
            console.error('Error al eliminar el producto:', error);
            Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
          });
      }
    });
  };

  const handleEdit = (producto) => {
    setFormData(producto);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveChanges = async () => {
    const url = `${baseURL}/products/${isEditing ? formData.ID_UnicoProducto : ''}`;
    const method = isEditing ? 'PUT' : 'POST';
    const actionWord = isEditing ? 'actualizado' : 'creado';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al procesar la solicitud');
      }

      fetchProductos();
      setShowModal(false);
      Swal.fire('¡Completado!', `El producto ha sido ${actionWord} correctamente.`, 'success');
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Hubo un problema al procesar la solicitud.', 'error');
    }
  };

  const handleAddNew = () => {
    setIsEditing(false);
    setFormData({ nombre: '', costo: '', ID_UnicoProducto: '' });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ nombre: '', costo: '', ID_UnicoProducto: '' });
  };

  const classStyles = {
    contentHeight: {
      minHeight: '450px'
    }
  };

  function esURLSegura(url) {
    const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    return regex.test(url);
  }

  
  const handleImageChange = (event) => {
    const fileList = event.target.files;
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 1.5 * 1024 * 1024; // 1.5 MB

    setError('');
    const newImages = Array.from(fileList).filter(file => {
      if (!validImageTypes.includes(file.type)) {
        setError('Por favor, seleccione solo archivos de imagen (JPEG, PNG, GIF).');
        return false;
      }
      if (file.size > maxSize) {
        setError('El tamaño de la imagen debe ser menor a 1.5 MB.');
        return false;
      }
      return true;
    });

    const imageArray = newImages.map(file => URL.createObjectURL(file));

    setImages(prevImages => [...prevImages, ...imageArray]);
  }

  return (
    <>
      <Header />
      <div className="wrapper">
        <Sidebar />
        <div className='container my-4'>
          <div className={classStyles.contentHeight}>
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Productos</h5>
                <button className="btn btn-primary" onClick={handleAddNew}>Agregar Nuevo</button>
              </div>
              <div className="table-responsive scrollbar">
                <table className="table table-hover table-striped overflow-hidden">
                  <thead>
                    <tr>
                      <th scope="col">Imagen</th>
                      <th scope="col">Producto</th>
                      <th scope="col">Descripción</th>
                      <th scope="col">Precio</th>
                      <th scope="col">Marca</th>
                      <th scope="col">Categoria</th>
                      <th scope="col">Subcategoria</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map((producto) => (
                      <tr key={producto.ID_producto}>
                        {esURLSegura(producto.imagenUrl) ? (
                          <img src={DOMPurify.sanitize(producto.imagenUrl)} alt={producto.nombre} style={{ width: '81px', height: '90px' }} />
                        ) : (
                          <img src="imagen_por_defecto.jpg" alt="Imagen por defecto" style={{ width: '81px', height: '90px' }} />
                        )}
                        <td>{producto.nombre}</td>
                        <td>{producto.descripcion.slice(0, 50)}...</td>
                        <td>{producto.precioFinal}</td>
                        <td>{producto.Marca}</td>
                        <td>{producto.Categoria}</td>
                        <td>{producto.Subcategoria}</td>
                        <td>
                          <button onClick={() => handleEdit(producto)} className="btn btn-primary mb-2">Editar</button>
                          <button onClick={() => handleDelete(producto.ID_producto)} className="btn btn-danger">Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Editar Producto' : 'Agregar Nuevo Producto'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre del Producto</label>
              <textarea className="form-control" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea className="form-control" name="descripcion" value={formData.descripcion} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Precio</label>
              <input type="number" className="form-control" name="precio" value={formData.precio} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Descuento</label>
              <input type="number" className="form-control" name="descuento" value={formData.descuento} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Precio Final</label>
              <input type="number" className="form-control" value={precioFinal} disabled />
            </div>
            <div className="form-group">
              <label>Existencias</label>
              <input type="number" className="form-control" name="existencias" value={formData.existencias} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Categoría</label>
              <input type="text" className="form-control" name="categoria" value={formData.categoria} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Subcategoría</label>
              <input type="text" className="form-control" name="subcategoria" value={formData.subcategoria} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Marca</label>
              <input type="text" className="form-control" name="marca" value={formData.marca} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Imagen del Producto:</label>
              <input type="file" className="form-control-file" id="imagen" name="imagen" accept="image/*" multiple onChange={handleImageChange} />
              {error && <div style={{ color: 'red' }}>{error}</div>}
              {images.map((image, index) => (
                <img key={index} src={image} alt={`imagen-${index}`} style={{ width: '100px', height: '100px', margin: '5px' }} />
              ))}
            </div>

            <Button variant="primary" type="submit">{isEditing ? 'Guardar Cambios' : 'Agregar Producto'}</Button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default AdmProductos;
