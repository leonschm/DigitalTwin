"use client"

import { useState } from "react"
import Link from "next/link"
import FormInput from "../../components/FormInputs"

import { useRouter } from "next/navigation"
import { useAuth } from "../contexto/AuthContext"

export default function Login() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const { setUser } = useAuth()
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		const url = `http://localhost:4000/digitalTwin/${encodeURIComponent(email)}/${encodeURIComponent(password)}/user`

		try {
			const response = await fetch(url, {
				method: "GET",
			})

			if (!response.ok) {
				alert("Usuário ou senha inválidos!")
				return
			}

			const user = await response.json()
			console.log("Usuario do Login: " + JSON.stringify(user))
			setUser(user) // Salva no contexto
			router.push("/dashboard") // Redireciona
		} catch (error) {
			alert("Erro ao conectar com o servidor!")
			console.error(error)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="bg-dark-card p-8 rounded-lg shadow-lg w-full max-w-md">
				<h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
				<form onSubmit={handleSubmit}>
					<FormInput label="Email" type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required />
					<FormInput label="Senha" type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required />
					<button type="submit" className="w-full bg-neon-blue text-white p-3 rounded-lg cursor-pointer hover:bg-neon-blue-hover  transition duration-200">
						Entrar
					</button>
				</form>
				<p className="mt-4 text-center text-sm">
					Primeiro acesso?{" "}
					<Link href="/register" className="text-neon-blue hover:underline">
						Cadastre-se
					</Link>
				</p>
			</div>
		</div>
	)
}
