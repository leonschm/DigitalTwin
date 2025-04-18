"use client"

import { useState } from "react"
import Link from "next/link"
import { FormInput, FormSelect, FormTextarea } from "../../components/FormInputs"
import { useAuth } from "../contexto/AuthContext"

export default function Dashboard() {
	const { user } = useAuth()
	//   const [formData, setFormData] = useState({
	//     name: user?.email || '',
	//     bio: user?. || '',
	//   })

	console.log("Usuario do Dashborad: " + JSON.stringify(user))

	const [formData, setFormData] = useState({
		name: "Ana Silva",
		bio: "Analista de marketing",
		language: "pt-BR",
		timezone: "America/Sao_Paulo",
		interactionStyle: "formal",
		maxInteractionsPerDay: "10",
		preferredTopics: "marketing,tecnologia",
		tone: "profissional",
		responseLength: "detalhada",
		sourceType: "social_media",
		sourceName: "X",
		sourceStatus: "active",
	})

	const [chatMessages, setChatMessages] = useState([{ sender: "Gêmeo Digital", text: "Olá! Como posso te ajudar hoje?", timestamp: new Date() }])
	const [chatInput, setChatInput] = useState("")
	const [error, setError] = useState("")
	const [success, setSuccess] = useState("")

	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError("")
		setSuccess("")

		try {
			const response = await fetch("/api/users/8", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					profile: {
						name: formData.name,
						bio: formData.bio || undefined,
						language: formData.language || undefined,
						timezone: formData.timezone || undefined,
					},
					aiConfiguration: {
						interactionStyle: formData.interactionStyle || undefined,
						maxInteractionsPerDay: formData.maxInteractionsPerDay ? parseInt(formData.maxInteractionsPerDay) : undefined,
						preferredTopics: formData.preferredTopics ? formData.preferredTopics.split(",").map((t) => t.trim()) : undefined,
						tone: formData.tone || undefined,
						responseLength: formData.responseLength || undefined,
					},
					dataSources: [
						{
							sourceType: formData.sourceType || undefined,
							sourceName: formData.sourceName || undefined,
							status: formData.sourceStatus || undefined,
						},
					],
				}),
			})

			if (!response.ok) {
				throw new Error("Erro ao atualizar dados")
			}

			setSuccess("Dados atualizados com sucesso!")
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erro ao atualizar dados")
		}
	}

	const handleChatSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (!chatInput.trim()) return

		const newMessage = {
			sender: "Você",
			text: chatInput,
			timestamp: new Date(),
		}
		setChatMessages([...chatMessages, newMessage])
		setChatInput("")

		// Simular resposta do Gêmeo Digital
		setTimeout(() => {
			setChatMessages((prev) => [
				...prev,
				{
					sender: "Gêmeo Digital",
					text: `Entendido! Você disse: "${newMessage.text}". Como posso ajudar mais?`,
					timestamp: new Date(),
				},
			])
		}, 1000)
	}

	const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	return (
		<div className="min-h-screen flex p-4">
			{/* Lado Esquerdo: Formulário */}
			<div className="w-full md:w-1/2 p-4 bg-dark-card rounded-lg shadow-lg mr-4">
				<h2 className="text-2xl font-bold mb-6">Configurações do Usuário</h2>
				{error && <p className="text-red-500 mb-4">{error}</p>}
				{success && <p className="text-green-500 mb-4">{success}</p>}
				<form onSubmit={handleFormSubmit}>
					<h3 className="text-lg font-semibold mb-2">Perfil</h3>
					<FormInput label="Nome" name="name" value={formData.name} onChange={handleFormChange} required />
					<FormTextarea label="Bio" name="bio" value={formData.bio} onChange={handleFormChange} />
					<FormSelect label="Idioma" name="language" value={formData.language} onChange={handleFormChange} options={["pt-BR", "en-US", "es-ES"]} />
					<FormSelect label="Fuso Horário" name="timezone" value={formData.timezone} onChange={handleFormChange} options={["America/Sao_Paulo", "America/New_York", "Europe/London"]} />

					<h3 className="text-lg font-semibold mb-2 mt-6">Configuração do AI</h3>
					<FormSelect label="Estilo de Interação" name="interactionStyle" value={formData.interactionStyle} onChange={handleFormChange} options={["formal", "casual", "reflexivo"]} />
					<FormInput label="Máximo de Interações por Dia" type="number" name="maxInteractionsPerDay" value={formData.maxInteractionsPerDay} onChange={handleFormChange} />
					<FormInput
						label="Tópicos Preferidos (separados por vírgula)"
						name="preferredTopics"
						value={formData.preferredTopics}
						onChange={handleFormChange}
						placeholder="Ex.: marketing, tecnologia"
					/>
					<FormSelect label="Tom" name="tone" value={formData.tone} onChange={handleFormChange} options={["profissional", "amigável", "empático"]} />
					<FormSelect label="Comprimento da Resposta" name="responseLength" value={formData.responseLength} onChange={handleFormChange} options={["curta", "detalhada"]} />

					<h3 className="text-lg font-semibold mb-2 mt-6">Fontes de Dados</h3>
					<FormSelect label="Tipo de Fonte" name="sourceType" value={formData.sourceType} onChange={handleFormChange} options={["social_media", "manual"]} />
					<FormInput label="Nome da Fonte" name="sourceName" value={formData.sourceName} onChange={handleFormChange} placeholder="Ex.: X, Instagram" />
					<FormSelect label="Status" name="sourceStatus" value={formData.sourceStatus} onChange={handleFormChange} options={["active", "inactive"]} />

					<button type="submit" className="w-full bg-neon-blue text-white p-3 rounded-lg hover:bg-neon-blue-hover transition duration-200 mt-6">
						Salvar Alterações
					</button>
				</form>
			</div>

			{/* Lado Direito: Chat */}
			<div className="w-full md:w-1/2 p-4 bg-dark-card rounded-lg shadow-lg">
				<h2 className="text-2xl font-bold mb-6">Gêmeo Digital</h2>
				<div className="flex-1 h-[calc(100vh-200px)] overflow-y-auto mb-4 p-4 bg-dark-bg rounded-lg">
					{chatMessages.map((msg, index) => (
						<div key={index} className={`mb-4 flex ${msg.sender === "Você" ? "justify-end" : "justify-start"}`}>
							<div className={`max-w-xs p-3 rounded-lg ${msg.sender === "Você" ? "bg-neon-blue text-white" : "bg-gray-700 text-white"}`}>
								<p className="text-sm font-semibold">{msg.sender}</p>
								<p>{msg.text}</p>
								<p className="text-xs text-gray-400 mt-1">{msg.timestamp.toLocaleTimeString()}</p>
							</div>
						</div>
					))}
				</div>
				<form onSubmit={handleChatSubmit} className="flex">
					<input
						type="text"
						value={chatInput}
						onChange={(e) => setChatInput(e.target.value)}
						placeholder="Digite sua mensagem..."
						className="flex-1 p-3 bg-dark-card border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-neon-blue text-white"
					/>
					<button type="submit" className="bg-neon-blue text-white p-3 rounded-r-lg hover:bg-neon-blue-hover transition duration-200">
						Enviar
					</button>
				</form>
			</div>
		</div>
	)
}
