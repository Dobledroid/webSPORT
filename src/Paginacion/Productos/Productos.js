import React, { useEffect, useState, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../Esquema/Header';
import Footer from '../../Esquema/Footer';
import PriceRangeSlider from './PriceRangeSlider';
import { baseURL } from '../../api.js';

function SidebarItem({ title, items, onFilter }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showMore, setShowMore] = useState(false);

  const handleToggleShowMore = (event) => {
    event.preventDefault();
    setShowMore(!showMore);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowMore(false);
    onFilter(item);
  };

  const clearSelection = () => {
    setSelectedItem(null);
  };

  return (
    <div className="sidebar__item">
      <h4>{title}</h4>
      <ul>
        {/* Mostrar la opción seleccionada si está definida */}
        {selectedItem && (
          <li>
            <span>{selectedItem.nombre}</span>
            <button className='ms-2' onClick={clearSelection}>X</button>
          </li>
        )}
        {/* Mostrar las demás opciones si no hay una seleccionada */}
        {!selectedItem &&
          items.slice(0, showMore ? items.length : 5).map((item, index) => (
            <li key={index}>
              <a href="#" onClick={() => handleItemClick(item)}>
                {item.nombre}
              </a>
            </li>
          ))}
        {/* Mostrar el botón "Ver menos" si hay más elementos para mostrar */}
        {!selectedItem && items.length > 5 && (
          <li>
            <a href="#" onClick={handleToggleShowMore}>
              {showMore ? 'Ver menos' : 'Ver más'}
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}

function ProductItem({ product }) {

  return (
    <div className="col-lg-4 col-md-6 col-sm-6">
      <div className="product__item">
        <div className="product__item__pic set-bg">
          <img src={product.imagenUrl} alt={product.nombre} />
          <ul className="product__item__pic__hover">
            <li><a href="#"><i className="fa fa-heart"></i></a></li>
            <li><a href="#"><i className="fa fa-retweet"></i></a></li>
            <li><a href="#"><i className="fa fa-shopping-cart"></i></a></li>
          </ul>
        </div>
        <Link to={`/product-details/${product.ID_producto}`} className="product__item__text" >
          <h6><a href="#">{product.nombre}</a></h6>
          <h5>${product.precio}</h5>
        </Link>
      </div>
    </div>
  );
}

const Productos = () => {
  const [products, setProducts] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  useEffect(() => {
    const fetchDataProducts = async () => {
      try {
        const response = await fetch(`${baseURL}/list-products-imagenPrincipal`);
        const data = await response.json();
        setProducts(data);

        // Calcular los rangos de precios
        const prices = data.map(product => product.precio);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        setMinPrice(min);
        setMaxPrice(max);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    const fetchData = async (url, setter) => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setter(data);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    fetchDataProducts();
    fetchData(`${baseURL}/categorias-productos`, setCategorias);
    fetchData(`${baseURL}/marcas`, setMarcas);
    fetchData(`${baseURL}/subcategorias`, setSubcategorias);
  }, []);

  const handleFilter = async (selectedItem) => {
    console.log(selectedItem);
    // Filtrar las subcategorías y marcas basadas en el elemento seleccionado
    const filteredSubcategorias = subcategorias.filter(subcategoria => subcategoria.ID_categoria === selectedItem.ID_categoria);
    const filteredMarcas = marcas.filter(marca => marca.ID_categoria === selectedItem.ID_categoria);
    setSubcategorias(filteredSubcategorias);
    setMarcas(filteredMarcas);
  };

  return (
    <>
      <Header />
      <section className="product spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-5">
              <div className="sidebar">
                <>
                  {categorias.length > 0 && <SidebarItem title="Categorías" items={categorias} onFilter={handleFilter} />}
                  {marcas.length > 0 && <SidebarItem title="Marcas" items={marcas} onFilter={handleFilter} />}
                  {subcategorias.length > 0 && <SidebarItem title="SubCategorías" items={subcategorias} onFilter={handleFilter} />}
                </>
                <PriceRangeSlider minPrice={minPrice} maxPrice={maxPrice} />
              </div>
            </div>
            <div className="col-lg-9 col-md-7">
              <div className="filter__item">
                <div className="row">
                  <div className="col-lg-4 col-md-5">
                    <div className="filter__sort">
                      <span>Ordenar por </span>
                      <select>
                        <option value="0">Más relevantes</option>
                        <option value="0">Menor precio</option>
                        <option value="0">Mayor precio</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4">
                    <div className="filter__found">
                      <h6><span>16</span> Productos encontrados</h6>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-3">
                    <div className="filter__option">
                      <span className="icon_grid-2x2"></span>
                      <span className="icon_ul"></span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                {products.map((product, index) => (
                  <ProductItem key={index} product={product} />
                ))}
              </div>
              <div className="product__pagination">
                <a href="#">1</a>
                <a href="#">2</a>
                <a href="#">3</a>
                <a href="#"><i className="fa fa-long-arrow-right"></i></a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Productos;