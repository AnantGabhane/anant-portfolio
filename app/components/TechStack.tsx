"use client";

import { useState, type ComponentType } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SiOpenai } from "react-icons/si";

type Skill = {
    name: string;
    slug?: string;
    icon?: ComponentType<{ className?: string }>;
};

type SkillCategory = {
    name: string;
    skills: Skill[];
};

function LangSmithIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path
                d="M12 2.5L14.4 9.6L21.5 12L14.4 14.4L12 21.5L9.6 14.4L2.5 12L9.6 9.6L12 2.5Z"
                fill="currentColor"
            />
            <circle cx="12" cy="12" r="2.1" fill="white" />
        </svg>
    );
}

function LangfuseIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path
                d="M12 3C8.2 3 5.3 5.8 5.3 9.3C5.3 12.3 7.4 14.1 9 15.5C10.2 16.5 11 17.2 11 18.3V21H13V18.3C13 17.2 13.8 16.5 15 15.5C16.6 14.1 18.7 12.3 18.7 9.3C18.7 5.8 15.8 3 12 3Z"
                fill="currentColor"
            />
            <path d="M9.5 9.5C10.2 8.4 11 8 12 8C13.1 8 13.8 8.4 14.5 9.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

function LangGraphIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path d="M7 7L12 12L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="7" cy="7" r="2.2" fill="currentColor" />
            <circle cx="7" cy="17" r="2.2" fill="currentColor" />
            <circle cx="18" cy="12" r="2.2" fill="currentColor" />
        </svg>
    );
}

function QdrantIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <ellipse cx="12" cy="6.5" rx="6.5" ry="3.2" fill="currentColor" />
            <path d="M5.5 6.5V12.5C5.5 14.3 8.4 15.7 12 15.7C15.6 15.7 18.5 14.3 18.5 12.5V6.5" fill="currentColor" opacity="0.85" />
            <path d="M5.5 12.5V17.5C5.5 19.3 8.4 20.7 12 20.7C15.6 20.7 18.5 19.3 18.5 17.5V12.5" fill="currentColor" opacity="0.7" />
            <circle cx="18.7" cy="6.5" r="2.1" fill="white" />
        </svg>
    );
}

const categories: SkillCategory[] = [
    {
        name: "Languages",
        skills: [
            { name: "Python", slug: "python" },
            { name: "TypeScript", slug: "typescript" },
            { name: "JavaScript", slug: "javascript" },
        ]
    },
    {
        name: "Frontend",
        skills: [
            { name: "Next.js", slug: "nextdotjs" },
            { name: "Tailwind CSS", slug: "tailwindcss" },
            { name: "Shadcn UI", slug: "shadcnui" },
        ]
    },
    {
        name: "AI/LLMs",
        skills: [
            { name: "Google Gemini", slug: "googlegemini" },
            { name: "OpenAI", icon: SiOpenai },
            { name: "Ollama", slug: "ollama" },
            { name: "Codex", icon: SiOpenai },
            { name: "Hugging Face", slug: "huggingface" },
        ]
    },
    {
        name: "Frameworks",
        skills: [
            { name: "LangGraph", icon: LangGraphIcon },
            { name: "LangChain", slug: "langchain" },
        ]
    },
    {
        name: "Databases",
        skills: [
            { name: "MongoDB", slug: "mongodb" },
            { name: "QdrantDB", icon: QdrantIcon },
            { name: "Neo4j", slug: "neo4j" },
        ]
    },
    {
        name: "Backend & APIs",
        skills: [
            { name: "FastAPI", slug: "fastapi" },
            { name: "Node.js", slug: "nodedotjs" },
            { name: "PostgreSQL", slug: "postgresql" },
            { name: "MongoDB", slug: "mongodb" },
            { name: "Redis", slug: "redis" },
            { name: "Pydantic", slug: "pydantic" },
        ]
    },
    {
        name: "Infra & Tools",
        skills: [
            { name: "Docker", slug: "docker" },
            { name: "dotenv", slug: "dotenv" },
            { name: "Vercel", slug: "vercel" },
            { name: "Git", slug: "git" },
            { name: "GitHub", slug: "github" },
            { name: "GitLub", slug: "gitlab" },
            { name: "Linux", slug: "linux" },
        ]
    },
    {
        name: "Observability",
        skills: [
            { name: "LangSmith", icon: LangSmithIcon },
            { name: "Langfuse", icon: LangfuseIcon },
        ]
    }
];

const marqueeSkills = categories.flatMap(c => c.skills);

function getSkillInitials(name: string) {
    return name
        .split(/[\s/&-]+/)
        .filter(Boolean)
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

function SkillIcon({ skill, variant }: { skill: Skill; variant: "marquee" | "grid" }) {
    const [imageFailed, setImageFailed] = useState(!skill.slug);

    const imageClassName = variant === "marquee"
        ? "h-full w-full object-contain opacity-80 transition-all duration-300 brightness-0 hover:opacity-100 hover:brightness-100 dark:brightness-0 dark:invert dark:hover:invert-0 dark:hover:brightness-100"
        : "h-full w-full object-contain opacity-50 transition-all duration-300 brightness-0 group-hover:opacity-100 group-hover:brightness-100 dark:brightness-0 dark:invert dark:group-hover:invert-0 dark:group-hover:brightness-100";

    const iconClassName = variant === "marquee"
        ? "h-full w-full text-gray-700 opacity-80 transition-all duration-300 hover:opacity-100 hover:text-black dark:text-gray-100 dark:opacity-80 dark:hover:text-white"
        : "h-full w-full text-gray-500 opacity-50 transition-all duration-300 group-hover:text-black group-hover:opacity-100 dark:text-gray-300 dark:opacity-60 dark:group-hover:text-white";

    if (skill.icon) {
        const Icon = skill.icon;
        return <Icon className={iconClassName} />;
    }

    if (imageFailed) {
        return (
            <div className="flex h-full w-full items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-[9px] font-bold uppercase tracking-[0.12em] text-gray-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-400">
                {getSkillInitials(skill.name)}
            </div>
        );
    }

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={`https://cdn.simpleicons.org/${skill.slug}`}
            alt={skill.name}
            className={imageClassName}
            loading="lazy"
            onError={() => setImageFailed(true)}
        />
    );
}

export function TechStack() {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="w-full space-y-4">
            <div className="flex justify-end">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black dark:hover:text-white transition-all duration-300"
                >
                    {isExpanded ? "Show Less" : "View Full Stack"}
                    {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
            </div>

            <AnimatePresence mode="wait">
                {!isExpanded ? (
                    <motion.div
                        key="marquee"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
                    >
                        <div className="flex w-max animate-infinite-scroll">
                            <div className="flex gap-12 py-4 pr-12">
                                {marqueeSkills.map((tech, index) => (
                                    <div key={index} className="flex flex-col items-center justify-center gap-2">
                                        <div className="h-10 w-10 transition-all duration-300">
                                            <SkillIcon
                                                skill={tech}
                                                variant="marquee"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-12 py-4 pr-12">
                                {marqueeSkills.map((tech, index) => (
                                    <div key={index + marqueeSkills.length} className="flex flex-col items-center justify-center gap-2">
                                        <div className="h-10 w-10 transition-all duration-300">
                                            <SkillIcon
                                                skill={tech}
                                                variant="marquee"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                        className="overflow-hidden"
                    >
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 pt-4">
                            {categories.map((category) => (
                                <div key={category.name} className="space-y-4">
                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-zinc-800 pb-2">
                                        {category.name}
                                    </h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {category.skills.map((skill) => (
                                            <div
                                                key={skill.name}
                                                className="group flex items-center gap-3 rounded-lg border border-transparent p-2 transition-all hover:border-gray-100 dark:hover:border-zinc-800 hover:bg-gray-50/50 dark:hover:bg-zinc-900/50"
                                            >
                                                <div className="h-5 w-5 shrink-0 transition-all duration-300">
                                                    <SkillIcon
                                                        skill={skill}
                                                        variant="grid"
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                                                    {skill.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
