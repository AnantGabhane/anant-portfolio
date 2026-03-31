"use client";

import Image from "next/image";
import { Github, Linkedin, Youtube, Calendar, Bot, User, QrCode, X, Music, Pause } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { ExperienceItem } from "./components/ExperienceItem";
import { GithubGraph } from "./components/GithubGraph";
import { TechStack } from "./components/TechStack";
import { useState, useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ThemeToggle } from "./components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

import { PomodoroTimer } from "./components/PomodoroTimer";
import { NeuralNetworkSim } from "./components/NeuralNetworkSim";

import { getMarkdownContent } from "./data/content";

type StarPosition = {
  top: string;
  left: string;
  duration: number;
  delay: number;
};

const getSeededValue = (seed: number) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

const STAR_POSITIONS: StarPosition[] = Array.from({ length: 50 }, (_, index) => ({
  top: `${(getSeededValue(index + 1) * 100).toFixed(2)}%`,
  left: `${(getSeededValue(index + 101) * 100).toFixed(2)}%`,
  duration: 2 + getSeededValue(index + 201) * 3,
  delay: getSeededValue(index + 301) * 5,
}));

const GITLAB_IMAGE_SRC = "/Gitlab.png?v=20260327-2003";

export default function Home() {
  const [time, setTime] = useState<string>("");
  const [showQR, setShowQR] = useState(false);
  const [mode, setMode] = useState<"human" | "agent">("human");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  const markdownContent = getMarkdownContent(time);

  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [isLofiPlaying, setIsLofiPlaying] = useState(false);
  const [lofiVolume, setLofiVolume] = useState(1);
  const lofiRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (lofiRef.current) {
      lofiRef.current.volume = lofiVolume;
    }
  }, [lofiVolume]);

  useEffect(() => {
    return () => {
      if (lofiRef.current) {
        lofiRef.current.pause();
        lofiRef.current = null;
      }
    };
  }, []);

  const toggleLofi = () => {
    if (!lofiRef.current) {
      lofiRef.current = new Audio("/lofi.mp3");
      lofiRef.current.loop = true;
      lofiRef.current.volume = lofiVolume;
    }

    if (isLofiPlaying) {
      lofiRef.current.pause();
    } else {
      lofiRef.current.play().catch(e => console.error("Lofi play failed:", e));
    }
    setIsLofiPlaying(!isLofiPlaying);
  };

  return (
    <div className={`relative flex min-h-screen flex-col items-center bg-white dark:bg-black px-3 pt-16 text-black dark:text-white selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black pb-32 sm:px-4 sm:pt-24 sm:pb-40 overflow-x-hidden transition-colors duration-300`}>
      {/* Easter Egg Effects */}
      <AnimatePresence>
        {showEasterEgg && (
          <>
            {/* Bluish Aura Edge Effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] pointer-events-none shadow-[inset_0_0_150px_rgba(29,78,216,0.5)] dark:shadow-[inset_0_0_150px_rgba(59,130,246,0.4)] transition-opacity duration-1000"
            />
            {/* Twinkling Stars Background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
            >
              {STAR_POSITIONS.map((pos, i) => (
                <motion.div
                  key={i}
                  className="absolute h-[2px] w-[2px] bg-blue-500 dark:bg-white rounded-full shadow-[0_0_4px_rgba(59,130,246,0.8)] dark:shadow-[0_0_3px_white]"
                  style={{
                    top: pos.top,
                    left: pos.left,
                  }}
                  animate={{
                    opacity: [0.2, 1, 0.2],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: pos.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: pos.delay,
                  }}
                />
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Theme Toggle in Top Right */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <AnimatePresence mode="wait">
        {mode === "agent" ? (
          /* Agent Mode - Markdown View */
          <motion.main
            key="agent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex w-full max-w-2xl flex-col items-start text-left px-4 sm:px-0"
          >
            <pre
              className="font-agent-mono w-full whitespace-pre-wrap text-sm leading-relaxed text-black antialiased selection:bg-black selection:text-white dark:text-gray-300 dark:selection:bg-white dark:selection:text-black"
            >
              {markdownContent}
            </pre>
          </motion.main>
        ) : (
          /* Human Mode - Original View */
          <motion.main
            key="human"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex w-full max-w-2xl flex-col items-center text-center"
          >
            {/* Profile Image - Easter Egg Trigger */}
            <button
              onClick={() => setShowEasterEgg(!showEasterEgg)}
              className="group relative mb-2 h-40 w-40 grayscale filter sm:h-56 sm:w-56 overflow-hidden cursor-pointer transition-all duration-500 hover:grayscale-0 active:scale-95"
              aria-label="Toggle Aura Mode"
            >
              <Image
                src="/anant.png" // User's photo
                alt="Profile"
                fill
                className={`object-contain transition-all duration-700 ${showEasterEgg ? 'grayscale-0 scale-105' : 'grayscale'}`}
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white via-white/60 to-transparent dark:from-black dark:via-black/60 backdrop-blur-[1px]" />

              {/* Subtle Glow on Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[inset_0_0_20px_rgba(59,130,246,0.3)] rounded-full pointer-events-none" />
            </button>

            {/* Hero Text */}
            <h1 className="mb-4 text-5xl font-bold tracking-tight sm:text-7xl">
              Anant Gabhane
            </h1>

            {/* Phonetic Pronunciation (Aesthetic touch often found in minimal portfolios) */}
            <div className="mb-8 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500 sm:text-sm">
              <span>/əˈnʌnt ɡəˈbʱaːne/</span>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <span>noun</span>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="tabular-nums text-xs sm:text-sm">{time || "00:00:00"}</span>
                  <span className="text-[10px] uppercase tracking-wider sm:text-xs">IST</span>
                </div>

                <span className="text-gray-300 dark:text-gray-700">•</span>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-tight text-gray-400">lofi</span>
                  <button
                    onClick={toggleLofi}
                    className="flex h-5 w-5 items-center justify-center rounded-full transition-all hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 hover:text-black dark:hover:text-white"
                    aria-label={isLofiPlaying ? "Pause Lofi" : "Play Lofi"}
                  >
                    {isLofiPlaying ? <Pause size={10} fill="currentColor" /> : <Music size={10} />}
                  </button>
                  <AnimatePresence>
                    {isLofiPlaying && (
                      <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 40, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="flex h-5 items-center overflow-hidden"
                      >
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={lofiVolume}
                          onChange={(e) => setLofiVolume(parseFloat(e.target.value))}
                          className="h-[2px] w-8 cursor-pointer appearance-none rounded-full bg-gray-200 dark:bg-zinc-800 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-400 dark:[&::-webkit-slider-thumb]:bg-zinc-500 hover:[&::-webkit-slider-thumb]:bg-black dark:hover:[&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:h-2 [&::-moz-range-thumb]:w-2 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gray-400 dark:[&::-moz-range-thumb]:bg-zinc-500 hover:[&::-moz-range-thumb]:bg-black dark:hover:[&::-moz-range-thumb]:bg-white transition-all"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="w-full space-y-4 text-left text-base leading-relaxed text-gray-600 dark:text-gray-400 sm:text-lg md:text-xl">
              <p>
                a Full-stack developer and <a href="https://en.wikipedia.org/wiki/Product_design" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-black dark:hover:text-white transition-colors">product builder</a> with deep experience across engineering, product strategy, and user-centric design.
              </p>
              <p>
                a <a href="https://en.wikipedia.org/wiki/Polymath" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-black dark:hover:text-white transition-colors">polymath</a> who bridges technical architecture with business outcomes to create impactful, scalable solutions.
              </p>
            </div>

            <NeuralNetworkSim />

            {/* Experience Section */}
            <div className="mb-16 w-full text-left">
              <h1 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Experience
              </h1>
              <h2 className="font-bold"><a href="https://www.apexaiq.com/" target="_blank" rel="noopener noreferrer">ApexaiQ Technologies</a></h2>
              <div className="space-y-12">
                <ExperienceItem
                  title="Full Stack Web Developer"
                  role="Nov 2024 – Present"
                  collapsible={true}
                  link="https://www.linkedin.com/in/anantgabhane/details/experience/"
                >
                  <div className="space-y-2">
                    <p>Develop and maintain scalable web application using Vue.js, JavaScript, Node.js, Express, MongoDB, and PostgreSQL.</p>
                    <p>Design and implement new features based on customer requirements, improving usability and performance.</p>
                    <p>Debug and resolve production issues, ensuring system reliability and smooth user experience.</p>
                    <p>Optimize backend and frontend performance to support growing data and user scale.</p>
                  </div>
                </ExperienceItem>

                <ExperienceItem
                  title="AI QA Engineer – Chatbot & NLQ"
                  role="May 2025 – Feb 2026"
                  collapsible={true}
                  link="https://www.linkedin.com/in/anantgabhane/details/experience/"
                >
                  <div className="space-y-2">
                    <p>Built and curated Lucene-based base queries across multiple integrations (AWS, GCP, Azure, CrowdStrike, etc.), enabling accurate asset retrieval via NLQ and Chatbot systems.</p>
                    <p>Led end-to-end testing of AI-powered Chatbot and NLQ systems, validating NLP-to-Lucene query translation, prompt accuracy, and multi-cloud data integrations.</p>
                    <p>Designed and maintained comprehensive prompt libraries and test datasets (training prompts, NLQ tests, chatbot tests, extended data queries) for structured validation.</p>
                    <p>Developed scalable and modular test frameworks, executing regression, chained prompt, and prompt injection testing to ensure system reliability and security.</p>
                    <p>Classified prompts, bugs, and UI issues using structured tagging (pass/fail, categories), improving traceability, debugging, and reporting efficiency.</p>
                    <p>Validated extended data queries and AI-generated responses across environments (staging & production), ensuring correctness, performance, and continuous model improvement.</p>
                  </div>
                </ExperienceItem>

                <ExperienceItem
                  title="Python Developer – API Integrations"
                  role="Nov 2023 – Present"
                  collapsible={true}
                  link="https://www.linkedin.com/in/anantgabhane/details/experience/"
                >
                  <div className="space-y-2">
                    <p>Engineered, build and maintained API integrations for multiple platforms including RiskSense, Microsoft Defender, Tanium, Cycognito, Vectra AI, Automox, Zero Networks, Kubernetes, OpenShift, and more.</p>
                    <p>Built reusable API wrappers to standardize data ingestion and improve integration efficiency.</p>
                    <p>Enhanced multiple existing integrations (e.g., Infoblox) to improve performance and reliability.</p>
                    <p>Mentored and onboarded 4 developers, accelerating team productivity and knowledge transfer.</p>
                  </div>
                </ExperienceItem>

                <ExperienceItem
                  title="Lead Engineer – Audit Ready Project"
                  role="Aug 2024 – Oct 2024"
                  collapsible={true}
                  link="https://www.linkedin.com/in/anantgabhane/details/experience/"
                >
                  <div className="space-y-2">
                    <p>Delivered $20,000+ in value addition through process optimization and automation.</p>
                    <p>Eliminated 600+ duplicate records, significantly improving data integrity.</p>
                    <p>Designed and implemented 23 automation rules for compliance, deduplication, and tagging.</p>
                    <p>Built 21 tag groups, enabling structured tagging of 2,500+ devices for better asset management.</p>
                    <p>Identified 640+ non-compliant devices, strengthening security posture and compliance tracking.</p>
                    <p>Developed pre-processing feed rules to enhance data filtering and ingestion efficiency.</p>
                  </div>
                </ExperienceItem>



                <ExperienceItem
                  title="Customer Support & Success Executive"
                  role="Oct 2023 – Present"
                  collapsible={true}
                  link="https://www.linkedin.com/in/anantgabhane/details/experience/"
                >
                  <div className="space-y-2">
                    <p>Managed 500+ customer support tickets, ensuring timely resolution and high customer satisfaction.</p>
                    <p>Participated in customer calls, capturing insights and translating them into actionable engineering requirements.</p>
                    <p>Managed a team of 4 developers while simultaneously supporting two high-value clients- balancing tight deadlines, client expectations, and resource constraints in a fast-paced environment.</p>
                    <p>Authored comprehensive legal and technical developer handbooks to standardize onboarding, compliance, and best practices for new recruits.</p>
                  </div>
                </ExperienceItem>
              </div>
            </div>


            {/* In Between These Experiences Section */}
            <div className="mb-16 w-full text-left">
              <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                In Between These Experiences
              </h2>
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
                <ExperienceItem
                  title="The AI Learning & Exploration Journey"
                  role=""
                  collapsible={true}
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p>I&apos;ve been consistently exploring, learning, and documenting my journey into AI systems, one concept at a time. What began as curiosity has evolved into a structured effort to understand how real-world AI systems are designed, built, and deployed.</p>

                      <p>
                        It started with diving into{" "}
                        <a
                          href="https://ai-engineering.hashnode.dev/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium underline"
                        >
                          AI Engineering concepts inspired by Chip Huyen
                        </a>
                        , where I explored how modern AI systems go beyond models — covering topics like data pipelines, evaluation, system design, and production challenges. Through writing, I broke down complex ideas into simpler explanations, strengthening both my understanding and communication.
                      </p>

                      <p>
                        Next, I worked through the{" "}
                        <a
                          href="https://ocigenai.hashnode.dev/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium underline"
                        >
                          Oracle Cloud Generative AI Course
                        </a>
                        , gaining hands-on exposure to foundational concepts like LLMs, embeddings, vector databases, and enterprise AI use cases. This phase helped me connect theory with practical implementations in real-world cloud environments.
                      </p>

                      <p>
                        Alongside this, I documented my learning from the{" "}
                        <a
                          href="https://chaiandcodelivenotes.hashnode.dev/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium underline"
                        >
                          Chai &amp; Code Cohort
                        </a>
                        , capturing live insights on AI, backend systems, and engineering fundamentals. These notes reflect my ability to learn in fast-paced environments and translate raw knowledge into structured, usable content.
                      </p>

                      <p>
                        Through these blogs, I&apos;ve built a habit of{" "}
                        <span className="font-medium">learning in public</span>, continuously refining my understanding of AI systems, prompt engineering, and real-world applications. Each article represents a step forward — from beginner concepts to more practical, system-level thinking.
                      </p>

                      <p className="font-medium">
                        This journey is less about finished products and more about building strong fundamentals, consistency, and clarity of thought — preparing myself to contribute meaningfully to real AI-driven systems.
                      </p>
                    </div>
                  </div>
                </ExperienceItem>
              </div>
            </div>


            {/* Education Section */}
            <div className="mb-16 w-full text-left">
              <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Education
              </h2>
              <div className="space-y-12">
                <ExperienceItem
                  title="Shri Sant Gajanan Maharaj College of Engineering, Shegaon"
                  role="Electronics and Telecommunications Engineering"
                >
                  <p>2019 - 2023</p>
                </ExperienceItem>
              </div>
            </div>

            {/* Achievement Section */}
            <div className="mb-16 w-full text-left">
              <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Achievement
              </h2>
              <div className="space-y-5">
                <ExperienceItem
                  title="Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate"
                  link="https://catalog-education.oracle.com/ords/certview/sharebadge?id=A3C639DCD41EDB432BF96B0D8731E64A22EB7875B73C1CA990E989EFA2F570BD"
                >
                </ExperienceItem>

                <ExperienceItem
                  title=" Apexa iQ® Kudos Award Q3 2025"
                  link="https://www.linkedin.com/feed/update/urn:li:activity:7386046384107401216/"
                >
                </ExperienceItem>
                <ExperienceItem
                  title="Product-Led Fundamentals certification by ProductLed "
                  link="https://www.linkedin.com/feed/update/urn:li:activity:7431713190905966592/"
                >
                </ExperienceItem>


                <ExperienceItem
                  title="The Orchestrator by personality assessment from Ray Dalio"
                  link="https://www.linkedin.com/feed/update/urn:li:activity:7416188930313678848/"
                >
                </ExperienceItem>
              </div>
            </div>

            {/* Contributions Section */}
            <div className="mb-16 w-full text-left">
              <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                GitLab Contributions
              </h2>
              <div className="mb-10 overflow-hidden rounded-xl bg-[#171321]">
                <Image
                  src={GITLAB_IMAGE_SRC}
                  alt="GitLab contributions chart"
                  width={851}
                  height={165}
                  className="h-auto w-full"
                />
              </div>
              <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                GitHub Contributions
              </h2>
              <GithubGraph />
            </div>

            {/* Research Publications Section */}
            <div className="mb-16 w-full text-left">
              <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Research Publications
              </h2>
              <div className="space-y-12">
                <ExperienceItem
                  title="Lumpy Diseases detection using Machine Learning"
                  role=""
                  collapsible={true}
                  collapsedHeight="max-h-40"
                >
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">
                        2023 SSGM Journal of Science & Engineering Vol. 1 No. 1 (2023): Proceedings of INSCIRD-2023
                      </p>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                        <p className="text-gray-600 dark:text-gray-400">Authors: Anant Gabhane</p>
                        <a
                          href="https://ssgmjournal.in/index.php/ssgm/article/view/80"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs font-medium text-black dark:text-white underline underline-offset-4 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          View Publication
                        </a>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 font-bold">Abstract</p>
                      <p className="text-gray-600 dark:text-gray-400">Machine learning algorithms for improving animal health monitoring have accelerated the creation of ML applications for behavioral and physiological monitoring systems, including ML-based animal health monitoring systems. Currently, farm animals are raised all over the world, and it is necessary to monitor their physiological processes. It is suggested in this article to use machine learning models to continuously monitor each animal&apos;s vital signs and look for biological changes. In this model, crucial data is gathered via IoT devices, and data analysis is carried out using machine learning techniques to identify potential dangers from changes in an animal&apos;s physiological state. The results of the experiments demonstrate that the suggested model is accurate and efficient enough to identify animal situations. For our purposes, the CNN and YOLO accuracy of more than 90% is a promising outcome.</p>
                    </div>
                  </div>
                </ExperienceItem>
              </div>
            </div>

            {/* Tech Stack Section */}
            <div className="mb-16 w-full text-left">
              <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Tech Stack
              </h2>
              <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
                I&apos;m a generalist at heart who can build with anything, but here&apos;s the core stack I&apos;ve spent the most time with:
              </p>
              <TechStack />
            </div>

            {/* Recommendations by Clients Section */}
            {/* <div className="mb-16 w-full text-left">
              <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Recommendations by Clients
              </h2>
              <div className="space-y-8">
              {/* Roy Feldman Recommendation */}
            {/* <div className="group border-l-2 border-gray-200 dark:border-gray-800 pl-6 transition-all hover:border-black dark:hover:border-white">
                <div className="mb-3">
                <a
                  href="https://www.linkedin.com/in/royhax/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-semibold text-black dark:text-white underline underline-offset-4 decoration-gray-300 dark:decoration-gray-700 hover:decoration-black dark:hover:decoration-white transition-colors"
                >
                  Roy Feldman
                </a>
                </div>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                I&apos;ve had the privilege to work with Aditya on several highly technical cybersecurity R&amp;D projects involving design and implementation of defensive network components in Golang, network protocol research and analysis. He is a bright young engineer, extremely talented in hacking and cybersecurity, with a natural curiosity and passion for hacking, and a gift understanding how systems work, how to design and break them. I am certain that he will succeed in any endeavor he puts his mind to, in the realms of cybersecurity, engineering and beyond! :)
                </p>
              </div> */}

            {/* Tom Granot Recommendation */}
            {/* <div className="group border-l-2 border-gray-200 dark:border-gray-800 pl-6 transition-all hover:border-black dark:hover:border-white">
                <div className="mb-3">
                <a
                  href="https://www.linkedin.com/in/tomgranot/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-semibold text-black dark:text-white underline underline-offset-4 decoration-gray-300 dark:decoration-gray-700 hover:decoration-black dark:hover:decoration-white transition-colors"
                >
                  Tom Granot
                </a>
                </div>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                It&apos;s not often that you get to talk to a person who is not only hungry for mentorship, but comes out of the gate with the attitude that enables him to learn so, so quickly on his feet.
                <br /><br />
                Aditya did research for highly technical content for me and independently navigated difficult situations without a lot of guidance. If you&apos;re looking for someone to research a technical topic for your content work, Aditya is disciplined, thorough and insistent on understanding things in depth before giving a final output.
                <br /><br />
                Keep on keeping on brother!
                </p>
              </div> */}
            {/* </div>
            </div> */}

            {/* Videos Section */}
            {/* <div className="mb-16 w-full text-left">
              <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Explainer Videos
              </h2>
              <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
              Here is how I explain complex systems on my {" "}
              <a
                href="https://www.youtube.com/@theracecondition"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black dark:text-white underline underline-offset-4 hover:text-gray-600 dark:hover:text-gray-300"
              >
                YouTube Channel
              </a>
              </p>
              <div className="aspect-video w-full overflow-hidden rounded-xl border border-gray-100 dark:border-gray-900 bg-gray-50 dark:bg-gray-950 shadow-sm transition-all hover:shadow-md grayscale hover:grayscale-0 duration-500">
              <iframe
                src="https://www.youtube.com/embed/m84tBP_4DWE"
                title="Explaining Complex Systems"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
              />
              </div>
            </div> */}

            {/* Writings & Blogs Section */}
            <div className="mb-16 w-full text-left">
              <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Writings & Blogs
              </h2>
              <p className="w-full text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                I host my thoughts on{" "}
                <a
                  href="https://hashnode.com/@anantgabhanee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black dark:text-white underline underline-offset-4 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                >
                  Hashnode
                </a>{" "}
                rather than building a custom site. Instead of overengineering and reinventing the wheel, I prefer leveraging a mature platform that lets me focus on what matters: sharing insights on AI systems, product strategy, and technical architecture.
              </p>
            </div>

            {/* Library Section */}
            <div className="mb-16 w-full text-left">
              <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Library
              </h2>

              {/* Dev Subsection */}
              <div className="mb-8">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-600">
                  Dev
                </h3>
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                  {[
                    { title: "AI Engineering", author: "Chip Huyen", link: "https://ai-engineering.hashnode.dev/" },
                    { title: "The Instant AI Agency", author: "Dan Wardrope" }
                  ].map((book) => (
                    <div key={book.title} className="group flex flex-col gap-1 transition-all">
                      {book.link ? (
                        <a
                          href={book.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-black dark:text-white group-hover:underline underline-offset-4 decoration-gray-200 dark:decoration-gray-800 transition-all"
                        >
                          {book.title}
                        </a>
                      ) : (
                        <span className="text-sm font-medium text-black dark:text-white group-hover:underline underline-offset-4 decoration-gray-200 dark:decoration-gray-800 transition-all">
                          {book.title}
                        </span>
                      )}
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {book.author}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Casual Reads Subsection */}
              <div className="mb-4">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-600">
                  Casual Reads
                </h3>
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                  {[
                    { title: "The mountain is you", author: "Brianna Wiest" },
                    { title: "You can heal your life", author: "Louise Hey" },
                    { title: "Think Straight", author: "Darius Foroux" },
                    { title: "The Almanack of Naval Ravikant", author: "Eric Jorgenson" },
                    { title: "The Power of One Thought", author: "BK Shivani" },
                    { title: "The One thing", author: "Gary Keller" }

                  ].map((book) => (
                    <div key={book.title} className="group flex flex-col gap-1 transition-all">
                      <span className="text-sm font-medium text-black dark:text-white group-hover:underline underline-offset-4 decoration-gray-200 dark:decoration-gray-800 transition-all">
                        {book.title}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {book.author}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Note */}
              <p className="mt-6 text-xs italic text-gray-400 dark:text-gray-500">
                *and many more, these are just one of my best reads
              </p>
            </div>

            {/* Thing about me Section */}
            <div className="mb-16 w-full text-left">
              <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Thing about me
              </h2>
              <div className="space-y-6">
                <p className="w-full text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                  Beyond engineering and build systems, I find balance in the tactile and the thoughtful. Whether it&apos;s exploring the nuances of complex architectures or spending time in the real world, my approach to life is driven by curiosity and a desire to understand how things work at their core. I&apos;m a <a href="https://en.wikipedia.org/wiki/First_principle" target="_blank" rel="noopener noreferrer" className="text-black dark:text-white underline underline-offset-4 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">first principle</a> thinker.
                </p>

                <div className="flex justify-center">
                  <div className="radial-fade-mask relative h-[250px] w-full max-w-sm grayscale transition-all duration-700 hover:grayscale-0 sm:h-[350px]">
                    <Image
                      src="/myra.jpeg"
                      alt="Casual photo"
                      fill
                      className="object-contain object-center"
                    />
                  </div>
                </div>

                <p className="w-full text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                  I believe that the best products are built by people who have a diverse range of interests. It&apos;s the unique combination of technical depth and human perspective that allows us to create technology that actually resonates.
                </p>
              </div>
            </div>

            {/* Get in Touch Section */}
            <div className="mb-16 w-full text-left">
              <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">
                Get in Touch
              </h2>
              <div className="space-y-4">
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Connect with me on{" "}
                  <a
                    href="https://www.linkedin.com/in/anantgabhane/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black dark:text-white underline underline-offset-4 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    LinkedIn
                  </a>{" "}
                  or{" "} shoot an {" "}
                  <a
                    href="mailto:anantgabhane.dev@gmail.com"
                    className="text-black dark:text-white underline underline-offset-4 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    email
                  </a>
                </p>
              </div>
            </div>

            {/* Pomodoro Timer Section */}
            <PomodoroTimer />



          </motion.main>
        )}
      </AnimatePresence>

      {/* Glass Island Navbar */}
      <nav className="fixed bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-gray-200 dark:border-zinc-700 bg-white/70 dark:bg-zinc-900/80 px-4 py-3 shadow-sm backdrop-blur-md transition-all hover:bg-white/90 dark:hover:bg-zinc-900 sm:gap-6 sm:px-6">
        {/* Mode Toggle Switch */}
        <div className="flex items-center">
          <button
            onClick={() => setMode(mode === "human" ? "agent" : "human")}
            className="group relative flex h-7 w-12 cursor-pointer rounded-full bg-gray-200 dark:bg-zinc-700 p-1 transition-colors duration-200 ease-in-out hover:bg-gray-300 dark:hover:bg-zinc-600 focus:outline-none"
            role="switch"
            aria-checked={mode === "agent"}
            title={`Switch to ${mode === "human" ? "agent" : "human"} mode`}
          >
            <div
              className={`flex h-5 w-5 transform items-center justify-center rounded-full bg-white dark:bg-white shadow-sm transition duration-200 ease-in-out ${mode === "agent" ? "translate-x-5" : "translate-x-0"
                }`}
            >
              {mode === "human" ? (
                <User className="h-3 w-3 text-black" />
              ) : (
                <Bot className="h-3 w-3 text-black" />
              )}
            </div>
          </button>
        </div>
        <button
          onClick={() => setShowQR(true)}
          className="text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors hover:scale-110"
          aria-label="Show QR Code"
        >
          <QrCode className="h-5 w-5" />
        </button>
        <div className="h-6 w-px bg-gray-200 dark:bg-zinc-700" />
        <a
          href="https://github.com/AnantGabhane"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors hover:scale-110"
        >
          <Github className="h-5 w-5" />
        </a>
        <a
          href="https://www.linkedin.com/in/anantgabhane/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors hover:scale-110"
        >
          <Linkedin className="h-5 w-5" />
        </a>
        <a
          href="https://x.com/AnantGabhane"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors hover:scale-110"
        >
          <FaXTwitter className="h-5 w-5" />
        </a>
        <a
          href="https://www.youtube.com/@AnantGabhane-h7j"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors hover:scale-110"
        >
          <Youtube className="h-5 w-5" />
        </a>
        <a
          href="https://cal.com/anant-gabhane-h5ru7z/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors hover:scale-110"
        >
          <Calendar className="h-5 w-5" />
        </a>
      </nav>

      {/* QR Code Modal */}
      {
        showQR && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 dark:bg-white/5 backdrop-blur-sm"
            onClick={() => setShowQR(false)}
          >
            <div
              className="relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowQR(false)}
                className="absolute -right-3 -top-3 rounded-full bg-black dark:bg-white p-2 text-white dark:text-black transition-transform hover:scale-110"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="rounded-lg bg-white p-2">
                <QRCodeSVG
                  value="https://anantgabhane.com/"
                  size={200}
                  level="H"
                  includeMargin={false}
                />
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}
