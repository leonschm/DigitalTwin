"use client"

import { useState } from "react"
import Link from "next/link"
import FormInput from "../../components/FormInputs"

export default function Register() {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		isActive: true,
		name: "",
		bio: "",
		language: "",
		timezone: "",
	})
	const [error, setError] = useState("")
	const [success, setSuccess] = useState("")

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError("")
		setSuccess("")

		try {
			const response = await fetch("http://localhost:4000/digitalTwin/user", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: formData.email,
					password: formData.password,
					isActive: formData.isActive,
					profile: {
						name: formData.name,
						bio: formData.bio || undefined,
						language: formData.language || "Português",
						timezone: formData.timezone || undefined,
					},
				}),
			})

			if (!response.ok) {
				throw new Error("Erro ao criar usuário")
			}

			//const data = await response.json()
			setSuccess("Usuário criado com sucesso!")
			setFormData({ email: "", password: "", isActive: true, name: "", bio: "", language: "", timezone: "" })
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erro ao criar usuário")
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="bg-dark-card p-8 rounded-lg shadow-lg w-full max-w-md">
				<h2 className="text-2xl font-bold mb-6 text-center">Cadastro</h2>
				{error && <p className="text-red-500 mb-4">{error}</p>}
				{success && <p className="text-green-500 mb-4">{success}</p>}
				<form onSubmit={handleSubmit}>
					<FormInput label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
					<FormInput label="Senha" type="password" name="password" value={formData.password} onChange={handleChange} required />
					<FormInput label="Nome" type="text" name="name" value={formData.name} onChange={handleChange} required />
					<FormInput label="Bio (opcional)" type="text" name="bio" value={formData.bio} onChange={handleChange} />
					<FormInput label="Linguagem de resposta" type="text" name="language" value={formData.language} onChange={handleChange} placeholder="Ex.: Português, Inglês" />
					<FormInput label="Local onde mora" type="text" name="timezone" value={formData.timezone} onChange={handleChange} placeholder="Ex.: Rio de Janeiro, São Paulo" />
					<button type="submit" className="w-full bg-neon-blue text-white p-3 rounded-lg hover:#3282b8 transition duration-200">
						Cadastrar
					</button>
				</form>
				<p className="mt-4 text-center text-sm">
					Já tem conta?{" "}
					<Link href="/login" className="text-neon-blue hover:underline">
						Faça login
					</Link>
				</p>
			</div>
		</div>
	)
}
