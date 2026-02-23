"use client";

import { useState } from "react";
import { Camera, Plus, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const INITIAL_TAGS = ["Design", "Photoshop", "Redes", "TCP/IP"];

export default function PerfilPage() {
  const [bio, setBio]           = useState("Formadora certificada com 10 anos de experiência em Design e Redes.");
  const [tags, setTags]         = useState<string[]>(INITIAL_TAGS);
  const [newTag, setNewTag]     = useState("");
  const [saved, setSaved]       = useState(false);

  function addTag() {
    const t = newTag.trim();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setNewTag("");
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-[26px] font-bold text-gray-900">O Meu Perfil</h1>
        <p className="mt-0.5 text-sm text-gray-500">Edite as suas informações pessoais</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-8 flex flex-col gap-8">
        {/* Avatar + name */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <Avatar className="h-20 w-20 border-2 border-gray-100">
              <AvatarImage src="https://i.pravatar.cc/150?img=47" />
              <AvatarFallback className="bg-purple-100 text-purple-600 text-xl font-bold">AR</AvatarFallback>
            </Avatar>
            <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-purple-600 text-white shadow-md hover:bg-purple-700 transition-colors">
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-lg font-bold text-gray-900">Ana Rodrigues</span>
            <span className="text-sm text-gray-400">ana.rodrigues@email.com</span>
          </div>
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-semibold text-gray-700">Descrição / Bio</Label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="resize-none rounded-xl border-gray-200 text-sm focus-visible:ring-purple-500"
            placeholder="Descreve a tua experiência e especialização..."
          />
        </div>

        {/* Tags */}
        <div className="flex flex-col gap-3">
          <Label className="text-sm font-semibold text-gray-700">Competências / Tags</Label>

          {/* Existing tags */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-sm font-medium text-purple-700"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="text-purple-400 hover:text-purple-700 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>

          {/* Add new tag */}
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              placeholder="Nova competência..."
              className="rounded-xl border-gray-200 text-sm focus-visible:ring-purple-500"
            />
            <button
              onClick={addTag}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-purple-300 hover:text-purple-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Save */}
        <Button
          onClick={handleSave}
          className="self-start gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white px-6"
        >
          <Save className="h-4 w-4" />
          {saved ? "Guardado!" : "Guardar Alterações"}
        </Button>
      </div>
    </div>
  );
}