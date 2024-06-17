import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../Esquema/Header';
import Footer from '../../../Esquema/Footer';
import Swal from "sweetalert2";

import Sidebar from "../../../Esquema/Sidebar";
import { useDropzone } from 'react-dropzone';

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

const dropzoneStyle = {
  border: '2px dashed #007bff',
  borderRadius: '5px',
  padding: '20px',
  textAlign: 'center',
  backgroundColor: '#f9f9f9',
  cursor: 'pointer'
};

const AgregarProducto = () => {
  const [categoriaId, setCategoriaId] = useState('');
  const [subcategoriaId, setSubcategoriaId] = useState('');
  const [marcaId, setMarcaId] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [mostrarSubcategoria, setMostrarSubcategoria] = useState(false);
  const [mostrarMarca, setMostrarMarca] = useState(false);
  const [imagen, setImagen] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function getCategorias() {
      const response = await fetch("http://localhost:4000/api/categorias-productos");
      const data = await response.json();
      setCategorias(data);
      console.log(data)
    }
    getCategorias();
  }, []);

  const handleCategoriaChange = async (event) => {
    const selectedCategoriaId = event.target.value;
    console.log(selectedCategoriaId)
    setCategoriaId(selectedCategoriaId);
    if (selectedCategoriaId !== '') {
      const response = await fetch(`http://localhost:4000/api/subcategoriasByIDCategoria/${selectedCategoriaId}`);
      const data = await response.json();
      setSubcategorias(data);
      setMostrarSubcategoria(true); const responseMarcas = await fetch(`http://localhost:4000/api/marcasByIDCategoria/${selectedCategoriaId}`);
      const dataMarcas = await responseMarcas.json();
      setMarcas(dataMarcas);
      setMostrarMarca(true);
    } else {
      setSubcategorias([]);
      setMostrarSubcategoria(false);
      setMarcas([]);
      setMostrarMarca(false);
    }
  };

  const [precioBase, setPrecioBase] = useState('');
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState('');
  const [precioFinal, setPrecioFinal] = useState('');

  const calcularPrecioFinal = () => {
    // Verificar si ambos campos tienen valores numéricos
    if (!isNaN(precioBase) && !isNaN(descuentoPorcentaje)) {
      const descuentoCantidad = (precioBase * descuentoPorcentaje) / 100;
      const final = precioBase - descuentoCantidad;
      setPrecioFinal(final.toFixed(2)); // Redondear a 2 decimales
    } else {
      // Mostrar mensaje de error si los campos no son numéricos
      alert('Por favor, ingrese valores numéricos válidos');
    }
  };

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    },
    maxSize: 1500000 // 1.5MB
  });

  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
          onLoad={() => { URL.revokeObjectURL(file.preview) }}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const [isLoadingCategorias, setIsLoadingCategorias] = useState(false);
  const [isLoadingSubcategorias, setIsLoadingSubcategorias] = useState(false);
  const [isLoadingMarcas, setIsLoadingMarcas] = useState(false);

  const [estadoInventario, setEstadoInventario] = useState('');
  const [cantidadExistencias, setCantidadExistencias] = useState('');

  const handleStockChange = (event) => {
    setEstadoInventario(event.target.value);
  };

  const [nombreProducto, setNombreProducto] = useState('');
  const [descripcionProducto, setDescripcionProducto] = useState('');

  const handleAgregarProducto = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nombre', nombreProducto);
    formData.append('descripcion', descripcionProducto);
    formData.append('categoria', categoriaId);
    formData.append('subcategoria', subcategoriaId);
    formData.append('marca', marcaId);
    formData.append('precioBase', precioBase);
    formData.append('descuentoPorcentaje', descuentoPorcentaje);
    formData.append('precioFinal', precioFinal);
    formData.append('estadoInventario', estadoInventario);
    formData.append('cantidadExistencias', cantidadExistencias);
    files.forEach(file => {
      formData.append('images', file);
    });
    try {
      const response = await fetch('http://localhost:4000/api/products', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Server Response:', result);
      } else {
        console.error('Server Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="wrapper">
        <Sidebar />
        <div className='content container'>
          <div class="card mb-3">
            <div class="card-body">
              <div class="row flex-between-center">
                <div class="col-md">
                  <h5 class="mb-2 mb-md-0">
                    Añadir un producto</h5>
                </div>
              </div>
            </div>
          </div>
          <div class="row g-0">
            <div class="col-lg-8 pe-lg-2">
              <div class="card mb-3">
                <div class="card-header bg-body-tertiary">
                  <h6 class="mb-0">Información básica</h6>
                </div>
                <div class="card-body">
                  <form>
                    <div class="row gx-2">
                      <div class="col-12 mb-3">
                        <label className="form-label" htmlFor="product-name">Nombre del producto:</label>
                        <input
                          className="form-control"
                          id="product-name"
                          type="text"
                          value={nombreProducto}
                          onChange={(e) => setNombreProducto(e.target.value)}
                        />
                      </div>
                      <div className="col-12 mb-3">
                        <label className="form-label" htmlFor="product-description">Descripción del producto:</label>
                        <textarea
                          className="form-control"
                          id="product-description"
                          rows="5"
                          value={descripcionProducto}
                          onChange={(e) => setDescripcionProducto(e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                  </form>
                </div>
              </div>          <div class="card mb-3">
                <div class="card-header bg-body-tertiary">
                  <h6 class="mb-0">Añadir imágenes</h6>
                </div>
                <div class="card-body">
                  <form class="dropzone dropzone-multiple p-0" id="dropzoneMultipleFileUpload" data-dropzone="data-dropzone" action="#!" data-options='{"acceptedFiles":"image/*"}'>
                    <div {...getRootProps({ className: 'dropzone' })} style={dropzoneStyle}>
                      <input {...getInputProps()} />
                      <p>Arrastra y suelta algunas imágenes aquí, o haz clic para seleccionar archivos (Max. 1.5MB)</p>
                    </div>
                    <aside style={thumbsContainer}>
                      {thumbs}
                    </aside>
                  </form>
                </div>
              </div>
              <div className="card mb-3">
                <div className="card-header bg-body-tertiary">
                  <h6 className="mb-0">Estado del inventario</h6>
                </div>
                <div className="card-body">
                  <div className="form-check">
                    <input
                      className="form-check-input p-2"
                      id="in-stock"
                      type="radio"
                      name="stock-status"
                      value="in-stock"
                      onChange={handleStockChange}
                      checked={estadoInventario === 'in-stock'}
                    />
                    <label className="form-check-label fs-9 fw-normal text-700" htmlFor="in-stock">
                      En stock
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input p-2"
                      id="unavailable"
                      type="radio"
                      name="stock-status"
                      value="unavailable"
                      onChange={handleStockChange}
                      checked={estadoInventario === 'unavailable'}
                    />
                    <label className="form-check-label fs-9 fw-normal text-700" htmlFor="unavailable">
                      Indisponible
                    </label>
                  </div>
                  {estadoInventario === 'in-stock' && (
                    <div className="mt-3">
                      <label className="form-label" htmlFor="stock-quantity">Cantidad de existencias:</label>
                      <input
                        className="form-control"
                        id="stock-quantity"
                        type="number"
                        value={cantidadExistencias}
                        onChange={(e) => setCantidadExistencias(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div class="col-lg-4 ps-lg-2">
              <div class="sticky-sidebar">
                <div class="card mb-3">
                  <div class="card-header bg-body-tertiary">
                    <h6 class="mb-0">Tipo</h6>
                  </div>
                  <div class="card-body">
                    <div class="row gx-2">
                      <div className="col-12 mb-3">
                        <label className="form-label" for="product-category">Selecciona una categoría:</label>
                        <select className="form-select" id="product-category" name="product-category" value={categoriaId} onChange={handleCategoriaChange}>
                          <option value="">Seleccione una categoría</option>
                          {categorias.map((categoria) => (
                            <option key={categoria.ID_categoria} value={categoria.ID_categoria}>{categoria.nombre}</option>
                          ))}
                        </select>
                        {isLoadingSubcategorias && <p>Cargando subcategorías...</p>}
                      </div>
                      <div className="col-12 mb-3">
                        <label className="form-label" for="product-subcategory">Selecciona una subcategoría:</label>
                        <select className="form-select" id="product-subcategory" name="product-subcategory" value={subcategoriaId} onChange={(e) => setSubcategoriaId(e.target.value)}>
                          <option value="">Seleccione una subcategoría</option>
                          {subcategorias.map((subcategoria) => (
                            <option key={subcategoria.id} value={subcategoria.id}>{subcategoria.nombre}</option>
                          ))}
                        </select>
                        {isLoadingMarcas && <p>Cargando marcas...</p>}
                      </div>
                      <div className="col-12 mb-3">
                        <label className="form-label" for="product-brand">Selecciona una marca:</label>
                        <select className="form-select" id="product-brand" name="product-brand" value={marcaId} onChange={(e) => setMarcaId(e.target.value)}>
                          <option value="">Seleccione una marca</option>
                          {marcas.map((marca) => (
                            <option key={marca.id} value={marca.id}>{marca.nombre}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card mb-3">
                  <div className="card-header bg-body-tertiary">
                    <h6 className="mb-0">Precios</h6>
                  </div>
                  <div className="card-body">
                    <div className="row gx-2">
                      <div className="col-12 mb-3">
                        <label className="form-label" htmlFor="base-price">Precio base:</label>
                        <input className="form-control" id="base-price" type="number" value={precioBase} onChange={(e) => setPrecioBase(e.target.value)} />
                      </div>
                      <div className="col-12 mb-4">
                        <label className="form-label" htmlFor="discount-percentage">Descuento en porcentaje:</label>
                        <input className="form-control" id="discount-percentage" type="number" value={descuentoPorcentaje} onChange={(e) => setDescuentoPorcentaje(e.target.value)} />
                      </div>
                      <div className="col-12">
                        <label className="form-label" htmlFor="final-price">Precio final:</label>
                        <input className="form-control" id="final-price" type="text" value={precioFinal} readOnly />
                      </div>
                    </div>
                    <button className="btn btn-primary mt-3" onClick={calcularPrecioFinal}>Calcular Precio Final</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card my-3">
            <div class="card-body">
              <div class="row justify-content-between align-items-center">
                <div class="col-md">
                  <h5 class="mb-2 mb-md-0"></h5>
                </div>
                <div className="col-auto">
                  <button className="btn btn-link text-secondary p-0 me-3 fw-medium" onClick={()=> navigate("/AdmProductos")} role="button">Cancelar</button>
                  <button className="btn btn-primary" onClick={handleAgregarProducto} role="button">Agregar producto</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AgregarProducto;