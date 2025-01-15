import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import blankProfilePicture from "../images/blank-profile-picture.png";
import axios from "axios";

export default function Profile() {
	const { userId } = useParams();
	const [user, setUser] = useState(null);
	const [newImage, setNewImage] = useState(null);
	const [profilePicture, setProfilePicture] = useState(null);
	const [isEditing, setIsEditing] = useState(false); // Track if the user is editing
	const [newFirstName, setNewFirstName] = useState("");
	const [newLastName, setNewLastName] = useState("");

	const handleEditToggle = () => {
		// Toggle edit mode on and off
		setIsEditing((prev) => !prev);
	};

	const handleSave = async () => {
		// Save changes to the user profile
		if (newFirstName && newLastName) {
			const formData = new FormData();
			formData.append("firstName", newFirstName);
			formData.append("lastName", newLastName);

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
				setUser(response.data); // Update user details after saving
				setIsEditing(false); // Exit edit mode
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
				setNewFirstName(response.data.firstname);
				setNewLastName(response.data.lastname);
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

	return (
		<div className="profile">
			<h1>
				Profile of {user.firstname} {user.lastname}
			</h1>
			{!isEditing ? (
				<button onClick={handleEditToggle}>Edit Profile</button>
			) : (
				<div className="edit-form">
					<div>
						<label htmlFor="firstName">First Name:</label>
						<input
							type="text"
							id="firstName"
							value={newFirstName}
							onChange={(e) => setNewFirstName(e.target.value)}
						/>
					</div>
					<div>
						<label htmlFor="lastName">Last Name:</label>
						<input
							type="text"
							id="lastName"
							value={newLastName}
							onChange={(e) => setNewLastName(e.target.value)}
						/>
					</div>
					<button onClick={handleSave}>Save Changes</button>
					<button onClick={handleEditToggle}>Cancel</button>
				</div>
			)}

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
