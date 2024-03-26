import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb bg-light">
        <li className="breadcrumb-item">
          <Link to="/">Inicio</Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          return isLast ? (
            <li className="breadcrumb-item active" aria-current="page" key={routeTo}>
              {name}
            </li>
          ) : (
            <li className="breadcrumb-item" key={routeTo}>
              <Link to={routeTo}>{name}</Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
