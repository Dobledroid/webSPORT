import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../Esquema/Header';
import Footer from '../../Esquema/Footer';
import PriceRangeSlider from './PriceRangeSlider';
import { baseURL } from '../../api.js';

function SidebarItem({ title, items, onFilter, type }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showMore, setShowMore] = useState(false);

  const handleToggleShowMore = (event) => {
    event.preventDefault();
    setShowMore(!showMore);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowMore(false);
    onFilter(item, type);
  };

  const clearSelection = () => {
    setSelectedItem(null);
    onFilter(null, type);
  };

  return (
    <div className="sidebar__item">
      <h4>{title}</h4>
      <ul>
        {selectedItem && (
          <li>
            <span>{selectedItem.nombre}</span>
            <button className='ms-2' onClick={clearSelection}>X</button>
          </li>
        )}
        {!selectedItem &&
          items.slice(0, showMore ? items.length : 5).map((item, index) => (
            <li key={index}>
              <a href="#" onClick={() => handleItemClick(item)}>
                {item.nombre}
              </a>
            </li>
          ))}
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
        <Link to={`/product-details/${product.ID_producto}`} className="product__item__text">
          <h6><a href="#">{product.nombre}</a></h6>
          <h5>${product.precioFinal}</h5>
        </Link>
      </div>
    </div>
  );
}

const Productos = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    handleFilter();
  }, []);

  useEffect(() => {
    filterProductsByPrice();
  }, [priceRange, products]);

  const handleFilter = async (selectedItem, type) => {
    const newFilters = { ...filters };
    if (selectedItem) {
      newFilters[type] = selectedItem;
    } else if (type) {
      delete newFilters[type];
    }
    setFilters(newFilters);

    const queryString = Object.keys(newFilters)
      .map(key => {
        const param = key === 'ID_categoria' ? 'ID_categoria' :
          key === 'ID_marca' ? 'ID_marca' :
            key === 'ID_subcategoria' ? 'ID_subcategoria' : '';
        return `${param}=${newFilters[key][param]}`;
      })
      .join('&');

    console.log("queryString", queryString);
    try {
      // Fetch para obtener los filtros actualizados
      const filtersResponse = await fetch(`http://localhost:4000/api/filtrar-filtros?${queryString}`);
      const filtersData = await filtersResponse.json();
      console.log("filtersData", filtersData);

      // Filtrar y agrupar los datos para actualizar categorías, marcas y subcategorías
      const uniqueCategories = [];
      const uniqueBrands = [];
      const uniqueSubcategories = [];

      const categorySet = new Set();
      const brandSet = new Set();
      const subcategorySet = new Set();

      filtersData.forEach(item => {
        if (!categorySet.has(item.ID_categoria)) {
          categorySet.add(item.ID_categoria);
          uniqueCategories.push({ ID_categoria: item.ID_categoria, nombre: item.nombre_categoria });
        }
        if (item.ID_marca && !brandSet.has(item.ID_marca)) {
          brandSet.add(item.ID_marca);
          uniqueBrands.push({ ID_marca: item.ID_marca, nombre: item.nombre_marca });
        }
        if (item.ID_subcategoria && !subcategorySet.has(item.ID_subcategoria)) {
          subcategorySet.add(item.ID_subcategoria);
          uniqueSubcategories.push({ ID_subcategoria: item.ID_subcategoria, nombre: item.nombre_subcategoria });
        }
      });

      setCategorias(uniqueCategories);
      setMarcas(uniqueBrands);
      setSubcategorias(uniqueSubcategories);

      // Fetch para obtener los productos filtrados con imagen principal
      const productsResponse = await fetch(`${baseURL}/listar-productos-imagen-principal?${queryString}`);
      const productsData = await productsResponse.json();
      console.log("productsData", productsData); // Imprimir los datos obtenidos

      // Calcular el precio mínimo y máximo
      if (productsData.length > 0) {
        const prices = productsData.map(product => product.precioFinal);
        setMinPrice(Math.min(...prices));
        setMaxPrice(Math.max(...prices));
        setPriceRange([Math.min(...prices), Math.max(...prices)]);
      } else {
        setMinPrice(0);
        setMaxPrice(1000);
        setPriceRange([0, 1000]);
      }

      setProducts(productsData); // Actualizar los productos con los datos obtenidos
    } catch (error) {
      console.error('Error al obtener datos filtrados:', error);
    }
  };

  const filterProductsByPrice = () => {
    const [min, max] = priceRange;
    const filtered = products.filter(product => product.precioFinal >= min && product.precioFinal <= max);
    setFilteredProducts(filtered);
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
                  {categorias.length > 0 && <SidebarItem title="Categorías" items={categorias} onFilter={handleFilter} type="ID_categoria" />}
                  {marcas.length > 0 && <SidebarItem title="Marcas" items={marcas} onFilter={handleFilter} type="ID_marca" />}
                  {subcategorias.length > 0 && <SidebarItem title="SubCategorías" items={subcategorias} onFilter={handleFilter} type="ID_subcategoria" />}
                </>
                <PriceRangeSlider minPrice={minPrice} maxPrice={maxPrice} priceRange={priceRange} setPriceRange={setPriceRange} />
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
                      <h6><span>{filteredProducts.length}</span> Productos encontrados</h6>
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
                {filteredProducts.map((product, index) => (
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
