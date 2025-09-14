import React from "react";
import {
  Code2,
  Users,
  Trophy,
  Clock,
  Target,
  Brain,
  Database,
  Shield,
  Layers,
  GitBranch,
  Zap,
} from "lucide-react";
import Head from "next/head";
import GeometricBackground from "@/components/common/GeometricBackground";
import CategoryCard from "./components/CategoryCard";
import FeaturePoint from "./components/FeaturePoint";
import StatCard from "./components/StatCard";
import NavigationButtons from "./components/NavigationButtons";


export default function InterviewPrepLanding() {


  return (
    <>
      <Head>
        <title>LogicHub - Ace Your Technical Interviews</title>
        <meta
          name="description"
          content="Practice coding problems, mock interviews, and system design with LogicHub — your all-in-one interview prep hub"
        />
        <meta
          name="keywords"
          content="coding interview, leetcode, system design, algorithms, next js seo , oding interview, logic hub, system design, mock interviews, algorithms, data structures"
        />

        <meta
          property="og:title"
          content="LogicHub - Master Technical Interviews"
        />
        <meta
          property="og:description"
          content="Sharpen your coding interview skills with 600+ problems and mock interviews."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://your-domain.com" />
        <meta
          property="og:image"
          content="https://your-domain.com/preview.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="CodePrep - Interview Prep Platform"
        />
        <meta
          name="twitter:description"
          content="Coding interview practice for engineers."
        />
        <meta
          name="twitter:image"
          content="https://your-domain.com/preview.png"
        />
      </Head>
      <div className="min-h-screen bg-slate-950 text-white">
        <section className="relative overflow-hidden">
          <GeometricBackground />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center max-w-4xl mx-auto">
              <div className="mb-6">
                <div className="inline-flex items-center space-x-2 bg-slate-900/50 border border-slate-800/50 rounded-full px-4 py-2 text-sm text-slate-300">
                  <span>Practice. Learn. Succeed.</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-white">Ace Your Technical </span>
                <br />
                <span className="text-slate-300">Interviews</span>
              </h1>

              <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                LogicHub is a complete preparation platform built by engineers.
                Practice coding challenges, master system design, and get ready
                for real interviews with confidence.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <NavigationButtons/>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
        </section>

        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">
                Problem Categories
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Structured curriculum covering all essential topics for
                technical interviews
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CategoryCard
                title="Arrays & Strings"
                description="Master fundamental data manipulation and string processing algorithms"
                icon={<Layers className="text-slate-300" size={20} />}
                count={145}
                difficulty="Easy - Hard"
              />
              <CategoryCard
                title="Dynamic Programming"
                description="Solve complex optimization problems with systematic approaches"
                icon={<GitBranch className="text-slate-300" size={20} />}
                count={89}
                difficulty="Medium - Hard"
              />
              <CategoryCard
                title="Trees & Graphs"
                description="Navigate complex data structures and traversal algorithms"
                icon={<Code2 className="text-slate-300" size={20} />}
                count={112}
                difficulty="Easy - Hard"
              />
              <CategoryCard
                title="System Design"
                description="Architect scalable systems and discuss trade-offs"
                icon={<Database className="text-slate-300" size={20} />}
                count={34}
                difficulty="Medium - Hard"
              />
              <CategoryCard
                title="Algorithms"
                description="Core algorithmic concepts and optimization techniques"
                icon={<Target className="text-slate-300" size={20} />}
                count={156}
                difficulty="Easy - Hard"
              />
              <CategoryCard
                title="Concurrency"
                description="Threading, synchronization, and parallel processing"
                icon={<Zap className="text-slate-300" size={20} />}
                count={67}
                difficulty="Medium - Hard"
              />
            </div>
          </div>
        </section>

        <section className="py-20 relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">
                  Why Choose Our Platform?
                </h2>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  Built by engineers who've been through the interview process
                  at top companies. Our platform focuses on the skills that
                  matter most.
                </p>

                <div className="space-y-6">
                  <FeaturePoint
                    icon={<Brain className="text-slate-300" size={20} />}
                    title="Detailed Explanations"
                    description="Comprehensive solutions with multiple approaches and complexity analysis"
                  />
                  <FeaturePoint
                    icon={<Shield className="text-slate-300" size={20} />}
                    title="Company-Specific Prep"
                    description="Curated problem sets based on actual interview experiences"
                  />
                  <FeaturePoint
                    icon={<Users className="text-slate-300" size={20} />}
                    title="Mock Interviews"
                    description="Practice with experienced engineers in realistic interview settings"
                  />
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/20 to-transparent rounded-lg"></div>
                <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-lg p-8">
                  <div className="grid grid-cols-2 gap-8">
                    <StatCard
                      icon={<Users size={24} />}
                      value="50K+"
                      label="Active Users"
                    />
                    <StatCard
                      icon={<Trophy size={24} />}
                      value="1M+"
                      label="Problems Solved"
                    />
                    <StatCard
                      icon={<Clock size={24} />}
                      value="89%"
                      label="Success Rate"
                    />
                    <StatCard
                      icon={<Target size={24} />}
                      value="600+"
                      label="Total Problems"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of engineers who have successfully prepared for and
              aced their technical interviews.
            </p>
          </div>
        </section>

        <footer className="border-t border-slate-800/50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">LogicHub</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  Professional interview preparation platform trusted by
                  engineers worldwide.
                </p>
                <div className="flex space-x-4">
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">Platform</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      Problems
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      Mock Interviews
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      Study Plans
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      Discuss
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-800/50 mt-12 pt-8 text-center">
              <p className="text-slate-500 text-sm">
                © 2025 LogicHub. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
