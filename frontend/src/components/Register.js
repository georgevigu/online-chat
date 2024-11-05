import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
	const navigate = useNavigate();
	const [token, setToken] = useState("");
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleRegister = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				"http://localhost:8080/api/v1/auth/register",
				{
					firstname,
					lastname,
					email,
					password,
				}
			);
			setToken(response.data.token);
			localStorage.setItem("token", response.data.token);
			navigate("/");
		} catch (error) {
			console.log("Register failed. Please check your credentials.");
		}
	};

	return (
		<div className="container">
			<div className="login">
				<button onClick={() => navigate(-1)}>Go back</button>
				<form onSubmit={handleRegister}>
					<h2>Create your account</h2>
					<input
						type="firstname"
						placeholder="First Name"
						value={firstname}
						onChange={(e) => setFirstname(e.target.value)}
						required
					/>
					<input
						type="lastname"
						placeholder="Last Name"
						value={lastname}
						onChange={(e) => setLastname(e.target.value)}
						required
					/>
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					<button type="submit">Register</button>
				</form>
			</div>
		</div>
	);
}
