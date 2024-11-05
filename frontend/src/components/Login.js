import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [token, setToken] = useState("");

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setToken(token);
		}
	}, []);

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				"http://localhost:8080/api/v1/auth/authenticate",
				{
					email,
					password,
				}
			);
			setToken(response.data.token);
			localStorage.setItem("token", response.data.token);
			navigate("/");
			setError("");
		} catch (error) {
			setError("Login failed. Please check your credentials.");
		}
	};

	return (
		<div className="container">
			<div className="login">
				<h1>Welcome back!</h1>
				<h2>Glad to see you again</h2>
				<form onSubmit={handleLogin}>
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
					<button type="submit">Log In</button>
					{error && <p style={{ color: "red" }}>{error}</p>}
				</form>
				<h2 className="">Don't have an account?</h2>
				<button onClick={() => navigate("/register")}>Register</button>
			</div>
		</div>
	);
}
