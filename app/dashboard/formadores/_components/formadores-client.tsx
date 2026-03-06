'use client'

import { useState } from 'react'
import { Plus, Search, Star, Users, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import type { FormadorItem } from '@/app/dashboard/_data/coordenador'

// ─── Subcomponentes ───────────────────────────────────────────────────────────

function AdicionarFormadorDialog({ onFormadorAdicionado }: { onFormadorAdicionado: () => void }) {
  const [open, setOpen] = useState(false)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const [senhaTemp, setSenhaTemp] = useState<string | null>(null)

  async function handleSubmit() {
    setErro('')
    if (!nome || !email) { setErro('Preenche todos os campos.'); return }
    setLoading(true)

    const res = await fetch('/api/formadores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email }),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) { setErro(data.error ?? 'Erro ao criar formador'); return }

    setSenhaTemp(data.formador.senhaTemporaria)
    onFormadorAdicionado()
  }

  function handleClose() {
    setOpen(false); setNome(''); setEmail(''); setErro(''); setSenhaTemp(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
          <Plus className="h-4 w-4" /> Adicionar Formador
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Formador</DialogTitle>
          <DialogDescription>Cria um novo perfil de formador na plataforma.</DialogDescription>
        </DialogHeader>

        {senhaTemp ? (
          <div className="flex flex-col gap-4 py-2">
            <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3">
              <p className="text-sm font-semibold text-green-700">Formador criado com sucesso!</p>
              <p className="text-xs text-green-600 mt-1">Partilha as credenciais com o formador para o primeiro acesso.</p>
            </div>
            <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 flex flex-col gap-1">
              <p className="text-xs text-gray-500">Email: <span className="font-semibold text-gray-800">{email}</span></p>
              <p className="text-xs text-gray-500">Senha temporária: <span className="font-semibold text-gray-800">{senhaTemp}</span></p>
            </div>
            <DialogFooter>
              <Button onClick={handleClose} className="bg-indigo-600 hover:bg-indigo-700 text-white">Fechar</Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label>Nome completo</Label>
              <Input placeholder="Ex: João Alves" value={nome} onChange={(e) => setNome(e.target.value)} disabled={loading} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Email</Label>
              <Input type="email" placeholder="formador@email.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
            </div>
            {erro && <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600">{erro}</p>}
            <DialogFooter>
              <Button variant="outline" onClick={handleClose} disabled={loading}>Cancelar</Button>
              <Button onClick={handleSubmit} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                {loading ? 'A criar...' : 'Criar Formador'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ─── Formador Card ────────────────────────────────────────────────────────────

type FormadorComFavorito = FormadorItem & { favorito: boolean }

function FormadorCard({
  formador,
  onToggleFavorito,
}: {
  formador: FormadorComFavorito
  onToggleFavorito: (id: string) => void
}) {
  const initials = formador.nome.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 hover:border-indigo-200 hover:shadow-sm transition-all">
      <div className="flex items-start gap-4">
        <Avatar className="h-14 w-14 border-2 border-gray-100 shrink-0">
          <AvatarFallback className="bg-indigo-100 text-indigo-600 font-semibold text-sm">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col gap-0.5 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold text-gray-900 leading-tight">{formador.nome}</h3>
            <button onClick={() => onToggleFavorito(formador.id)} className="shrink-0 transition-transform hover:scale-110">
              <Star className={cn('h-5 w-5 transition-colors', formador.favorito ? 'fill-amber-400 text-amber-400' : 'text-gray-300 hover:text-amber-300')} />
            </button>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Mail className="h-3 w-3 shrink-0" />
            <span className="truncate">{formador.email}</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {formador.tags.length === 0 && (
          <span className="text-xs text-gray-400">Sem módulos atribuídos</span>
        )}
        {formador.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600">
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
        <span className="rounded-full border border-green-200 bg-green-50 px-4 py-1 text-sm font-medium text-green-600">
          Aceite
        </span>
        <Button variant="outline" size="sm" className="rounded-full border-gray-200 text-gray-700 hover:border-indigo-300 hover:text-indigo-600 text-sm">
          Ver Perfil
        </Button>
      </div>
    </div>
  )
}

// ─── Componente Principal ─────────────────────────────────────────────────────

interface FormadoresClientProps {
  formadores: FormadorItem[]
}

export function FormadoresClient({ formadores: formadoresIniciais }: FormadoresClientProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [apenasFavoritos, setApenasFavoritos] = useState(false)
  const [formadores, setFormadores] = useState<FormadorComFavorito[]>(
    formadoresIniciais.map((f) => ({ ...f, favorito: false }))
  )

  const toggleFavorito = (id: string) => {
    setFormadores((prev) => prev.map((f) => (f.id === id ? { ...f, favorito: !f.favorito } : f)))
  }

  const formadoresFiltrados = formadores.filter((f) => {
    const matchSearch =
      f.nome.toLowerCase().includes(search.toLowerCase()) ||
      f.email.toLowerCase().includes(search.toLowerCase()) ||
      f.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    const matchFavorito = apenasFavoritos ? f.favorito : true
    return matchSearch && matchFavorito
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[26px] font-bold text-gray-900">Formadores</h1>
          <p className="mt-0.5 text-sm text-gray-500">{formadores.length} formadores registados</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Pesquisar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white border-gray-200 text-sm"
            />
          </div>
          <button
            onClick={() => setApenasFavoritos(!apenasFavoritos)}
            className={cn(
              'flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all',
              apenasFavoritos ? 'border-amber-300 bg-amber-50 text-amber-600' : 'border-gray-200 bg-white text-gray-600 hover:border-amber-200 hover:text-amber-500'
            )}
          >
            <Star className={cn('h-4 w-4', apenasFavoritos ? 'fill-amber-400 text-amber-400' : 'text-gray-400')} />
            Favoritos
          </button>
          <AdicionarFormadorDialog onFormadorAdicionado={() => router.refresh()} />
        </div>
      </div>

      {/* Grid */}
      {formadoresFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {formadoresFiltrados.map((formador) => (
            <FormadorCard key={formador.id} formador={formador} onToggleFavorito={toggleFavorito} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <Users className="h-10 w-10 text-gray-300 mb-3" />
          <p className="text-sm font-medium text-gray-500">Nenhum formador encontrado</p>
          <p className="text-xs text-gray-400 mt-1">Tenta ajustar a pesquisa ou os filtros</p>
        </div>
      )}
    </div>
  )
}