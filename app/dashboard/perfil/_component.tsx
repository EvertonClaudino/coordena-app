'use client'

import { useState, useRef } from 'react'
import { Camera, Plus, X, Save, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateFormadorPerfil } from '@/app/dashboard/perfil/actions'

interface FormadorData {
  nome: string
  email: string
  especialidade: string
  competencias: string
  userId: string
}

export function PerfilClient({ formador }: { formador: FormadorData }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [especialidade, setEspecialidade] = useState(formador.especialidade)
  const [newCompetencia, setNewCompetencia] = useState('')
  const [competencias, setCompetencias] = useState<string[]>(
    formador.competencias ? formador.competencias.split(',').map(t => t.trim()) : []
  )
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  function addCompetencia() {
    const c = newCompetencia.trim()
    if (c && !competencias.includes(c)) {
      setCompetencias((prev) => [...prev, c])
    }
    setNewCompetencia('')
  }

  function removeCompetencia(competencia: string) {
    setCompetencias((prev) => prev.filter((t) => t !== competencia))
  }

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    // TODO: Futura implementação
    // 1. Validar tipo de ficheiro (apenas imagens)
    // 2. Validar tamanho (ex: max 5MB)
    // 3. Fazer upload para servidor (criar endpoint POST /api/formador/avatar)
    // 4. Guardar URL da imagem na base de dados (field: avatarUrl)
    // 5. Atualizar estado local com nova imagem
    
    console.log('📸 Ficheiro selecionado:', file.name, file.type, file.size)
  }

  async function handleSave() {
    setLoading(true)
    try {
      const competenciasStr = competencias.join(', ')
      
      const resultado = await updateFormadorPerfil(formador.userId, especialidade, competenciasStr)
      
      if (resultado.sucesso) {
        setSaved(true)
        setIsEditMode(false)
        setTimeout(() => setSaved(false), 2000)
      }
    } finally {
      setLoading(false)
    }
  }

  function handleCancel() {
    // Restaurar valores originais
    setEspecialidade(formador.especialidade)
    setCompetencias(
      formador.competencias ? formador.competencias.split(',').map(t => t.trim()) : []
    )
    setNewCompetencia('')
    setIsEditMode(false)
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-bold text-gray-900">O Meu Perfil</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {isEditMode ? 'Edite as suas informações pessoais' : 'Veja as suas informações pessoais'}
          </p>
        </div>
        {!isEditMode && (
          <Button
            onClick={() => setIsEditMode(true)}
            className="gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Edit2 className="h-4 w-4" />
            Editar
          </Button>
        )}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-8 flex flex-col gap-8">
        {/* Avatar + name */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <Avatar className="h-20 w-20 border-2 border-gray-100">
              <AvatarImage src={`https://i.pravatar.cc/150?u=${formador.email}`} />
              <AvatarFallback className="bg-purple-100 text-purple-600 text-xl font-bold">
                {formador.nome.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {isEditMode && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  aria-label="Selecionar imagem de perfil"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-purple-600 text-white shadow-md hover:bg-purple-700 transition-colors"
                  title="Clique para escolher uma imagem"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-lg font-bold text-gray-900">{formador.nome}</span>
            <span className="text-sm text-gray-400">{formador.email}</span>
          </div>
        </div>

        {isEditMode ? (
          // ===== MODO EDIÇÃO =====
          <>
            {/* Especialidade */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-gray-700">Descrição / Bio</Label>
              <Textarea
                value={especialidade}
                onChange={(e) => setEspecialidade(e.target.value)}
                rows={4}
                className="resize-none rounded-xl border-gray-200 text-sm focus-visible:ring-purple-500"
                placeholder="Ex: Professor a 15 anos, especialista em programação web..."
              />
            </div>

            {/* Competências */}
            <div className="flex flex-col gap-3">
              <Label className="text-sm font-semibold text-gray-700">Competências / Skills</Label>

              {/* Existing competências */}
              <div className="flex flex-wrap gap-2">
                {competencias.map((competencia) => (
                  <span
                    key={competencia}
                    className="flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-sm font-medium text-purple-700"
                  >
                    {competencia}
                    <button
                      onClick={() => removeCompetencia(competencia)}
                      className="text-purple-400 hover:text-purple-700 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add new competência */}
              <div className="flex gap-2">
                <Input
                  value={newCompetencia}
                  onChange={(e) => setNewCompetencia(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCompetencia())}
                  placeholder="Ex: Python, SQL, etc..."
                  className="rounded-xl border-gray-200 text-sm focus-visible:ring-purple-500"
                />
                <button
                  onClick={addCompetencia}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-purple-300 hover:text-purple-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleSave}
                disabled={loading}
                className="gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white px-6 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {loading ? 'A guardar...' : 'Guardar Alterações'}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="gap-2 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </Button>
            </div>
          </>
        ) : (
          // ===== MODO VISUALIZAÇÃO =====
          <>
            {/* Especialidade */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-semibold text-gray-500 uppercase">Descrição / Bio</Label>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {especialidade || <span className="italic text-gray-400">Nenhuma descrição adicionada</span>}
              </p>
            </div>

            {/* Competências */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-semibold text-gray-500 uppercase">Competências / Skills</Label>
              <div className="flex flex-wrap gap-2">
                {competencias.length > 0 ? (
                  competencias.map((competencia) => (
                    <span
                      key={competencia}
                      className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-sm font-medium text-purple-700"
                    >
                      {competencia}
                    </span>
                  ))
                ) : (
                  <span className="italic text-gray-400 text-sm">Nenhuma competência adicionada</span>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {saved && (
        <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">
          ✓ Perfil guardado com sucesso!
        </div>
      )}
    </div>
  )
}
