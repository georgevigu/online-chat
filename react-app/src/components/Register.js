import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "@mui/material/Button";

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
					<label htmlFor="lastname">First Name</label>
					<input
						type="text"
						value={firstname}
						onChange={(e) => setFirstname(e.target.value)}
						required
					/>
					<label htmlFor="lastname">Last Name</label>
					<input
						type="text"
						value={lastname}
						onChange={(e) => setLastname(e.target.value)}
						required
					/>
					<label htmlFor="email">Email</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<label htmlFor="password">Password</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					<Button variant="contained" type="submit">
						Register
					</Button>
				</form>
			</div>
		</div>
	);
}
