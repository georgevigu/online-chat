import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import blankProfilePicture from "../images/blank-profile-picture.png";
import axios from "axios";

export default function Profile() {
	const { userId } = useParams();
	const [user, setUser] = useState(null);
	const [newImage, setNewImage] = useState(null);
	const [profilePicture, setProfilePicture] = useState(null);

	const handleEdit = async () => {
		const newFirstName = prompt("Enter new first name:");
		const newLastName = prompt("Enter new last name:");
		const formData = new FormData();
		formData.append("firstName", newFirstName);
		formData.append("lastName", newLastName);

		if (newFirstName && newLastName) {
			try {
				const token = localStorage.getItem("token");

				const response = await axios.put(
					`http://localhost:8080/api/v1/user/${userId}`,
					formData,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "multipart/form-data",
						},
					}
				);

				console.log(response.data);
				// fetchUserDetails();
			} catch (error) {
				console.error("Error updating user:", error);
			}
		} else {
			alert("Please provide both a new first name and last name.");
		}
	};

	const handleImageChange = (e) => {
		setNewImage(e.target.files[0]);
	};

	const handleUpload = async () => {
		const formData = new FormData();
		formData.append("image", newImage);
		formData.append("userId", userId);

		try {
			const response = await axios.post(
				`http://localhost:8080/api/v1/image/upload`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			console.log("Image uploaded successfully:", response.data);
			window.location.reload();
		} catch (error) {
			console.error("Error uploading image:", error);
		}
	};

	useEffect(() => {
		const fetchUserDetails = async () => {
			const token = localStorage.getItem("token");
			try {
				const response = await axios.get(
					`http://localhost:8080/api/v1/user/profile/${userId}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				setUser(response.data);
			} catch (error) {
				console.error("Error fetching user details:", error);
			}
		};
		fetchUserDetails();
	}, [userId]);

	useEffect(() => {
		const downloadProfilePicture = async () => {
			try {
				const response = await axios.get(
					`http://localhost:8080/api/v1/image/${user.imageId}`,
					{
						responseType: "arraybuffer",
					}
				);

				const base64 = btoa(
					new Uint8Array(response.data).reduce(
						(data, byte) => data + String.fromCharCode(byte),
						""
					)
				);

				setProfilePicture(`data:image/png;base64,${base64}`);
			} catch (error) {
				console.error("Error fetching profile picture: ", error);
			}
		};

		if (user && user.imageId) {
			downloadProfilePicture();
		}
	}, [user]);

	if (!user) {
		return <div>Loading user details...</div>;
	}

	console.log(user);

	return (
		<div className="profile">
			<h1>
				Profile of {user.firstname} {user.lastname}
			</h1>
			<button onClick={handleEdit}>Edit</button>

			<p>Email: {user.email}</p>
			<img
				src={profilePicture ? profilePicture : blankProfilePicture}
				alt="Profile"
				width="150"
				height="150"
				className="profile-picture"
			/>
			<input type="file" onChange={handleImageChange} />
			<button onClick={handleUpload}>Upload Profile Image</button>
		</div>
	);
}
