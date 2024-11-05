import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Main from "./components/Main";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Chat from "./components/Chat";
import { isTokenExpired } from "./utils/tokenUtils";

export default function App() {
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const token = localStorage.getItem("token");

		const publicRoutes = ["/login", "/register"];

		if (!publicRoutes.includes(location.pathname)) {
			if (!token || isTokenExpired(token)) {
				localStorage.removeItem("token");
				navigate("/login");
			} else {
				console.log("Token is valid");
			}
		}
	}, [navigate, location.pathname]);

	return (
		<div>
			<Routes>
				<Route path="/" element={<Main />}></Route>
				<Route path="/login" element={<Login />}></Route>
				<Route path="/register" element={<Register />}></Route>
				<Route path="/chat/:userId" element={<Chat />}></Route>
				<Route path="/profile/:userId" element={<Profile />}></Route>
			</Routes>
		</div>
	);
}
