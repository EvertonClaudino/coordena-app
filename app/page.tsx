import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { GraduationCap } from "lucide-react";
import { BookOpen, Users, FileUp, UserPlus } from "lucide-react";
import Footer from "./footer/Footer";

export default function Home() {
    return (
        <div className="bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
            <Header />
            <main className="w-full bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex flex-col items-center px-4 py-16">
                {/* Hero Section */}
                <section
                    id="hero"
                    className="w-full max-w-4xl text-center min-h-screen flex flex-col justify-start items-center pt-24 mb-16 scroll-mt-20"
                >
                    <h1 className="text-5xl md:text-6xl font-extrabold text-primary mb-6 leading-tight drop-shadow-sm">
                        CoordenaApp
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        Plataforma moderna para gestão de formação.
                        <br />
                        Organize cursos, módulos, assiduidade, documentos e
                        equipas de forma simples e eficiente.
                    </p>
                </section>
                {/* Secção Sobre Nós */}
                <section
                    id="sobre"
                    className="w-full max-w-4xl min-h-screen flex flex-col justify-start items-center pt-24 mb-16 scroll-mt-20"
                >
                    <h2 className="text-3xl font-bold text-primary mb-4 p-6">
                        Sobre Nós
                    </h2>
                    <p className="text-lg text-foreground/80 mb-6">
                        O CoordenaApp é uma plataforma inovadora para gestão de
                        formação, criada para facilitar o trabalho de
                        coordenadores, formadores e formandos. Permite organizar
                        cursos, gerir módulos, acompanhar assiduidade, partilhar
                        documentos e gerir equipas de forma eficiente e
                        intuitiva.
                    </p>
                </section>
                {/* Secção Funcionalidades */}
                <section
                    id="funcionalidades"
                    className="w-full max-w-4xl min-h-screen flex flex-col justify-start items-center pt-24 mb-16 scroll-mt-20"
                >
                    <h2 className="text-3xl font-bold text-primary mb-4 p-6">
                        Funcionalidades
                    </h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-lg text-foreground/90 font-medium">
                        <li className="bg-white dark:bg-background rounded-xl shadow p-6 border border-border flex flex-col items-center">
                            <BookOpen className="h-10 w-10 text-indigo-400 mb-2" />
                            <span className="text-xl font-semibold text-primary">
                                Gestão de cursos, módulos e participantes
                            </span>
                            <p className="mt-2 text-foreground/80 text-base text-center">
                                Organize e atribua cursos, módulos e
                                participantes de forma intuitiva.
                            </p>
                        </li>
                        <li className="bg-white dark:bg-background rounded-xl shadow p-6 border border-border flex flex-col items-center">
                            <Users className="h-10 w-10 text-indigo-400 mb-2" />
                            <span className="text-xl font-semibold text-primary">
                                Acompanhamento de assiduidade e notas
                            </span>
                            <p className="mt-2 text-foreground/80 text-base text-center">
                                Registe presenças e avalie o desempenho dos
                                formandos.
                            </p>
                        </li>
                        <li className="bg-white dark:bg-background rounded-xl shadow p-6 border border-border flex flex-col items-center">
                            <FileUp className="h-10 w-10 text-indigo-400 mb-2" />
                            <span className="text-xl font-semibold text-primary">
                                Upload e partilha de documentos
                            </span>
                            <p className="mt-2 text-foreground/80 text-base text-center">
                                Carregue e partilhe documentos relevantes entre
                                todos os intervenientes.
                            </p>
                        </li>
                        <li className="bg-white dark:bg-background rounded-xl shadow p-6 border border-border flex flex-col items-center">
                            <UserPlus className="h-10 w-10 text-indigo-400 mb-2" />
                            <span className="text-xl font-semibold text-primary">
                                Convites e gestão de equipas
                            </span>
                            <p className="mt-2 text-foreground/80 text-base text-center">
                                Convide novos membros e organize as equipas de
                                trabalho.
                            </p>
                        </li>
                    </ul>
                </section>
                {/* Secção Criadores */}
                <section
                    id="criadores"
                    className="w-full max-w-4xl min-h-screen flex flex-col justify-start items-center pt-24 mb-16 scroll-mt-20"
                >
                    <h2 className="text-3xl font-bold text-primary mb-4 p-6">
                        Criadores
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                        {/* Card Everton */}

                        <div
                            style={{
                                boxShadow: "0 8px 24px 0 rgba(0,0,0,0.18)",
                            }}
                            className="bg-white dark:bg-background rounded-xl p-4 border border-border flex flex-col items-center w-96 mx-auto"
                        >
                            <div className="flex flex-col items-center gap-4 mb-4 w-full">
                                <img
                                    src="https://ui-avatars.com/api/?name=Criador+1&background=0D8ABC&color=fff"
                                    alt="Foto Criador 1"
                                    className="w-35 h-35 rounded-md object-cover border-2 border-primary"
                                />
                                <span className="text-lg font-semibold text-primary line-clamp-2">
                                    Everton Santos
                                </span>
                                <div className="flex gap-3 mt-2">
                                    <a
                                        href="https://github.com/placeholder1"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary underline"
                                    >
                                        GitHub
                                    </a>
                                    <a
                                        href="https://linkedin.com/in/placeholder1"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary underline"
                                    >
                                        LinkedIn
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Card Ana */}
                        <div
                            style={{
                                boxShadow: "0 8px 24px 0 rgba(0,0,0,0.18)",
                            }}
                            className="bg-white dark:bg-background rounded-xl p-4 border border-border flex flex-col items-center w-96 mx-auto"
                        >
                            <div className="flex flex-col items-center gap-4 mb-4 w-full">
                                <img
                                    src="https://ui-avatars.com/api/?name=Criador+1&background=0D8ABC&color=fff"
                                    alt="Foto Criador 1"
                                    className="w-35 h-35 rounded-md object-cover border-2 border-primary"
                                />
                                <span className="text-lg font-semibold text-primary line-clamp-2">
                                    Ana Moura
                                </span>
                                <div className="flex gap-3 mt-2">
                                    <a
                                        href="https://github.com/placeholder1"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary underline"
                                    >
                                        GitHub
                                    </a>
                                    <a
                                        href="https://linkedin.com/in/placeholder1"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary underline"
                                    >
                                        LinkedIn
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Card João */}
                        <div
                            style={{
                                boxShadow: "0 8px 24px 0 rgba(0,0,0,0.18)",
                            }}
                            className="bg-white dark:bg-background rounded-xl p-4 border border-border flex flex-col items-center w-96 mx-auto"
                        >
                            <div className="flex flex-col items-center gap-4 mb-4 w-full">
                                <img
                                    src="https://ui-avatars.com/api/?name=Joao+Silva&background=0D8ABC&color=fff"
                                    alt="Foto Criador 3"
                                    className="w-35 h-35 rounded-md object-cover border-2 border-primary"
                                />
                                <span className="text-lg font-semibold text-primary line-clamp-2">
                                    João Silva
                                </span>
                                <div className="flex gap-3 mt-2">
                                    <a
                                        href="https://github.com/placeholder3"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary underline"
                                    >
                                        GitHub
                                    </a>
                                    <a
                                        href="https://linkedin.com/in/placeholder3"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary underline"
                                    >
                                        LinkedIn
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Card Maria */}
                        <div
                            style={{
                                boxShadow: "0 8px 24px 0 rgba(0,0,0,0.18)",
                            }}
                            className="bg-white dark:bg-background rounded-xl p-4 border border-border flex flex-col items-center w-96 mx-auto"
                        >
                            <div className="flex flex-col items-center gap-4 mb-4 w-full">
                                <img
                                    src="https://ui-avatars.com/api/?name=Maria+Fernandes&background=0D8ABC&color=fff"
                                    alt="Foto Criador 4"
                                    className="w-35 h-35 rounded-md object-cover border-2 border-primary"
                                />
                                <span className="text-lg font-semibold text-primary line-clamp-2">
                                    Maria Fernandes
                                </span>
                                <div className="flex gap-3 mt-2">
                                    <a
                                        href="https://github.com/placeholder4"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary underline"
                                    >
                                        GitHub
                                    </a>
                                    <a
                                        href="https://linkedin.com/in/placeholder4"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary underline"
                                    >
                                        LinkedIn
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
