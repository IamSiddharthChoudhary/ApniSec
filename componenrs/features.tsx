"use client";
import { Shield, Lock, Zap, Users, Eye, FileText } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Cloud Security",
      description:
        "Comprehensive cloud infrastructure security assessments and continuous monitoring",
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "VAPT Services",
      description:
        "Vulnerability Assessment and Penetration Testing for complete security coverage",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Detection",
      description:
        "Instant threat detection and automated alerting system for rapid response",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Collaboration",
      description:
        "Centralized platform for security teams to track and resolve issues together",
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Reteam Assessment",
      description:
        "In-depth security assessments with detailed reporting and recommendations",
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Compliance Reports",
      description:
        "Automated compliance documentation and audit-ready security reports",
    },
  ];

  return (
    <section id="features" className="py-20 px-4 bg-black/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Enterprise <span className="text-green-500">Security</span>{" "}
            Solutions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive security services designed to protect your digital
            infrastructure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl bg-gradient-to-br from-green-500/5 to-transparent border border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-green-500/10 text-green-500 group-hover:bg-green-500/20 transition-colors">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
