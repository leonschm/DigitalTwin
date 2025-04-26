"use client"

import { useState } from "react"
import { FormInput, FormSelect, FormTextarea } from "../../components/FormInputs"
import { useAuth } from "../contexto/AuthContext"
import InteractionStyle from "@core/aiconfiguration/InteractionStyle"
import Tone from "@core/aiconfiguration/Tone"
import IdChat from "@core/shared/Id"
import { useRouter } from "next/navigation"

export default function Dashboard() {
	const { user } = useAuth()
	const { setUser } = useAuth()
	const router = useRouter()

	//console.log("Usuario do Dashboard: " + JSON.stringify(user))

	const [formData, setFormData] = useState({
		name: user?.profile?.name || "",
		bio: user?.profile?.bio || "",
		language: user?.profile?.language || "Português",
		timezone: user?.profile?.timezone || "America/Brasilia",
		interactionStyle: user?.aiConfiguration?.interactionStyle || "formal",
		maxInteractionsPerDay: user?.aiConfiguration?.maxInteractionsPerDay || 10,
		preferredTopics: user?.aiConfiguration?.preferredTopics?.join(", ") || "",
		tone: user?.aiConfiguration?.tone || "profissional",
		responseLength: user?.aiConfiguration?.responseLength || "curta",
		sourceType: user?.dataSources[0]?.sourceType || "social_media",
		sourceName: user?.dataSources[0]?.sourceName || "X",
		sourceStatus: user?.dataSources[0]?.status || "active",
	})

	const [chatMessages, setChatMessages] = useState([{ sender: "Gêmeo Digital", text: `Olá! Sou ${formData.name} ?`, timestamp: new Date() }])
	const [chatInput, setChatInput] = useState("")
	const [error, setError] = useState("")
	const [success, setSuccess] = useState("")

	// Para montar as opções do select: InteractionStyle
	const interactionStyleOptions = [
		{ value: InteractionStyle.Casual, label: "Casual" },
		{ value: InteractionStyle.Profissional, label: "Profissional" },
		{ value: InteractionStyle.Formal, label: "Formal" },
		{ value: InteractionStyle.Reflexivo, label: "Reflexivo" },
		{ value: InteractionStyle.Engajante, label: "Engajante" },
		{ value: InteractionStyle.Didatico, label: "Didático" },
		{ value: InteractionStyle.Humoristico, label: "Humorístico" },
		{ value: InteractionStyle.Minimalista, label: "Minimalista" },
		{ value: InteractionStyle.Inspirador, label: "Inspirador" },
		{ value: InteractionStyle.Empatico, label: "Empático" },
	]

	// Para montar as opções do select: Tom de Resposta
	const toneOptions = [
		{ value: Tone.Amigavel, label: "Amigável" },
		{ value: Tone.Profissional, label: "Profissional" },
		{ value: Tone.Empatico, label: "Empático" },
		{ value: Tone.Serio, label: "Sério" },
		{ value: Tone.Entusiasmado, label: "Entusiasmado" },
		{ value: Tone.Calmo, label: "Calmo" },
		{ value: Tone.Inspirador, label: "Inspirador" },
		{ value: Tone.Humoristico, label: "Humorístico" },
		{ value: Tone.Neutro, label: "Neutro" },
		{ value: Tone.Confiante, label: "Confiante" },
		{ value: Tone.Acolhedor, label: "Acolhedor" },
		{ value: Tone.Curioso, label: "Curioso" },
	]

	const handleLogout = () => {
		setUser(null) // Limpa o usuário do contexto
		router.push("/login") // Redireciona para login
	}

	const handleResetChat = () => {
		setChatMessages([{ sender: "Gêmeo Digital", text: `Olá! Sou ${formData.name} ?`, timestamp: new Date() }])
	}

	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError("")
		setSuccess("")

		try {
			if (!user) {
				throw new Error("Usuário não encontrado")
			}
			const response = await fetch(`http://localhost:4000/digitalTwin/${encodeURIComponent(user.id)}/gemeo`, {
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
						maxInteractionsPerDay: formData.maxInteractionsPerDay ? formData.maxInteractionsPerDay : undefined,
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

	const handleChatSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!chatInput.trim()) return

		const newMessage = {
			sender: "Você Original",
			text: chatInput,
			timestamp: new Date(),
		}
		setChatMessages([...chatMessages, newMessage])
		setChatInput("")

		const corpo = JSON.stringify({
			chatID: IdChat.generate(), // Gerar um novo ID de chat necessário para agente dividir conversa
			userID: user?.id?.toString() || "",
			userName: formData.name,
			bio: formData.bio,
			language: formData.language,
			location: formData.timezone,
			interactionStyle: formData.interactionStyle,
			preferedTopics: formData.preferredTopics.split(",").map((t) => t.trim()),
			tone: formData.tone,
			responseLenght: formData.responseLength,
			message: newMessage.text,
		})

		console.log("Corpo da requisição: " + corpo)
		//http://localhost:5678/webhook-test/gemeo-digital
		try {
			const response = await fetch("https://digitaltwindev.app.n8n.cloud/webhook/gemeo-digital", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					chatID: IdChat.generate, // Gerar um novo ID de chat necessário para agente dividir conversa
					userID: user?.id?.toString() || "",
					userName: formData.name,
					bio: formData.bio,
					language: formData.language,
					location: formData.timezone,
					interactionStyle: formData.interactionStyle,
					preferedTopics: formData.preferredTopics.split(",").map((t) => t.trim()),
					tone: formData.tone,
					responseLenght: formData.responseLength,
					message: newMessage.text,
				}),
			})

			const data = await response.json()

			console.log("Resposta do servidor: ", data)

			setTimeout(() => {
				setChatMessages((prev) => [
					...prev,
					{
						sender: "Gêmeo Digital",
						text: data[0].resposta || "Resposta do Gêmeo Digital não recebida.",
						timestamp: new Date(),
					},
				])
			}, 1000)
		} catch (_error) {
			setTimeout(() => {
				setChatMessages((prev) => [
					...prev,
					{
						sender: "Gêmeo Digital",
						text: "Erro ao conectar com o serviço do Gêmeo Digital.",
						timestamp: new Date(),
					},
				])
			}, 1000)
		}
	}

	const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	return (
		<div className="min-h-screen flex flex-col p-4">
			{/* Cabeçalho */}
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold text-neon-blue">Dashboard</h1>
				<div className="flex gap-2">
					<button onClick={handleResetChat} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition">
						Resetar Chat
					</button>
					<button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
						Sair
					</button>
				</div>
			</div>
			{/* Conteúdo principal */}
			<div className="flex flex-1">
				{/* Lado Esquerdo: Formulário */}
				<div className="w-full md:w-1/2 p-4 bg-dark-card rounded-lg shadow-lg mr-4">
					<h2 className="text-2xl font-bold mb-6">Configurações do Gemêo</h2>
					{error && <p className="text-red-500 mb-4">{error}</p>}
					{success && <p className="text-green-500 mb-4">{success}</p>}
					<form onSubmit={handleFormSubmit}>
						<h3 className="text-lg font-semibold mb-2">Perfil</h3>
						<FormInput label="Nome" name="name" value={formData.name} onChange={handleFormChange} required />
						<FormTextarea label="Bio" name="bio" value={formData.bio} onChange={handleFormChange} required />
						<FormSelect label="Idioma" name="language" value={formData.language} onChange={handleFormChange} options={["Português", "Inglês", "Espanhol"]} />
						<FormInput label="Local onde mora" type="text" name="timezone" value={formData.timezone} onChange={handleFormChange} placeholder="Ex.: Rio de Janeiro, São Paulo" />
						<h3 className="text-lg font-semibold mb-2 mt-6">Configuração do AI</h3>
						<FormSelect
							label="Estilo de Interação"
							name="interactionStyle"
							value={formData.interactionStyle}
							onChange={handleFormChange}
							options={interactionStyleOptions.map((opt) => opt.value)}
						/>
						<FormInput label="Máximo de Interações por Dia" type="number" name="maxInteractionsPerDay" value={formData.maxInteractionsPerDay} onChange={handleFormChange} />
						<FormInput
							label="Tópicos Preferidos (separados por vírgula)"
							name="preferredTopics"
							value={formData.preferredTopics}
							onChange={handleFormChange}
							placeholder="Ex.: marketing, tecnologia"
						/>
						<FormSelect label="Tom" name="tone" value={formData.tone} onChange={handleFormChange} options={toneOptions.map((opt) => opt.value)} />
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
							<div key={index} className={`mb-4 flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
								<div className={`max-w-xs p-3 rounded-lg ${index % 2 === 0 ? "bg-gray-700 text-white" : "bg-neon-blue text-white"}`}>
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
		</div>
	)
}
