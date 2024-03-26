import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useHistory para poder redirigir a otra vista
import { baseURL } from '../../api.js';
import Header from '../../Esquema/Header';
import Footer from '../../Esquema/Footer';

const MembershipCard = ({ id, title, description, price, duration, ID_UnicoMembresilla }) => {
	const navigate = useNavigate();
	const [user, setUser] = useState('');

	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
		if (loggedIn) {
			const user = JSON.parse(localStorage.getItem('user'));
			setUser(user);
			setIsLoggedIn(loggedIn);
		}
	}, []);

	const handleBuy = async () => {
		console.log("ID_UnicoMembresilla", ID_UnicoMembresilla)

		try {
			// Realizamos una solicitud de fetch para obtener la información de la membresía por su ID
			const obtenerInformacionMembresia = await fetch(`${baseURL}/membresillasIdUnico/${ID_UnicoMembresilla}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});


			if (!obtenerInformacionMembresia.ok) {
				throw new Error('Error al obtener la información de la membresía');
			}
			const data = await obtenerInformacionMembresia.json();
			// console.log(data)
			// Redirigimos a otra vista y pasamos la información de la membresía como parámetro
			navigate('/suscripcion', { state: data })
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="card">
			<h2>{title}</h2>
			<p>{description}</p>
			<h3>${price} por {duration}</h3>
			<button onClick={handleBuy}>Comprar</button>
		</div>
	);
};

const MembershipComponent = () => {
	return (
		<>
			<Header />
			<div className="membership-container">
				<MembershipCard
					id={1}
					title="Membresía Mensual"
					description="Acceso completo al gimnasio durante un mes completo."
					price={49.99}
					duration="mes"
					ID_UnicoMembresilla="Membresilla30D"
				/>
				<MembershipCard
					id={2}
					title="Membresía por 2 Semanas"
					description="Acceso completo al gimnasio durante dos semanas consecutivas."
					price={29.99}
					duration="semana"
					ID_UnicoMembresilla="Membresilla15D"
				/>
				<MembershipCard
					id={3}
					title="Membresía Diaria"
					description="Acceso completo al gimnasio durante un día."
					price={9.99}
					duration="día"
					ID_UnicoMembresilla="Membresilla1D"
				/>
			</div>
			<Footer />
		</>

	);
};

export default MembershipComponent;
