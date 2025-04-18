'use client'

import { useState } from 'react';
import Link from 'next/link';
import FormInput from '../../components/FormInputs';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    bio: '',
    interactionStyle: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          bio: formData.bio || undefined,
          interactionStyle: formData.interactionStyle || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar usuário');
      }

      const data = await response.json();
      setSuccess('Usuário criado com sucesso!');
      setFormData({ email: '', password: '', name: '', bio: '', interactionStyle: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar usuário');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-dark-card p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Cadastro</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Senha"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Nome"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Bio (opcional)"
            type="text"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
          />
          <FormInput
            label="Estilo de Interação (opcional)"
            type="text"
            name="interactionStyle"
            value={formData.interactionStyle}
            onChange={handleChange}
            placeholder="Ex.: formal, casual"
          />
          <button
            type="submit"
            className="w-full bg-neon-blue text-white p-3 rounded-lg hover:bg-neon-blue-hover transition duration-200"
          >
            Cadastrar
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Já tem conta?{' '}
          <Link href="/login" className="text-neon-blue hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}