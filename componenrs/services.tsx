"use client";
import { Cloud, Search, Target, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Services() {
  const services = [
    {
      icon: <Cloud className="w-12 h-12" />,
      title: "Cloud Security",
      description:
        "Comprehensive security assessments for your cloud infrastructure. We identify vulnerabilities and provide actionable recommendations.",
      features: [
        "AWS, Azure, GCP security audits",
        "Cloud configuration reviews",
        "Identity and access management",
        "Data encryption compliance",
      ],
      color: "blue",
    },
    {
      icon: <Target className="w-12 h-12" />,
      title: "VAPT Services",
      description:
        "Vulnerability Assessment and Penetration Testing to uncover security weaknesses before attackers do.",
      features: [
        "Network penetration testing",
        "Web application security",
        "Mobile app security testing",
        "API security assessments",
      ],
      color: "purple",
    },
    {
      icon: <Search className="w-12 h-12" />,
      title: "Reteam Assessment",
      description:
        "Detailed security assessments with comprehensive reporting and strategic recommendations for your team.",
      features: [
        "Security posture evaluation",
        "Compliance gap analysis",
        "Risk prioritization",
        "Remediation roadmaps",
      ],
      color: "cyan",
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "from-blue-500/10 border-blue-500/20 hover:border-blue-500/40 text-blue-500";
      case "purple":
        return "from-purple-500/10 border-purple-500/20 hover:border-purple-500/40 text-purple-500";
      case "cyan":
        return "from-cyan-500/10 border-cyan-500/20 hover:border-cyan-500/40 text-cyan-500";
      default:
        return "from-green-500/10 border-green-500/20 hover:border-green-500/40 text-green-500";
    }
  };

  return (
    <section id="services" className="py-20 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-green-500">Security</span> Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive security solutions tailored to protect your enterprise
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`group p-8 rounded-xl bg-gradient-to-br ${getColorClasses(
                service.color
              )} border backdrop-blur-sm transition-all duration-300 hover:scale-105`}
            >
              <div
                className={`inline-block p-4 rounded-lg bg-black/50 mb-6 ${
                  service.color === "blue"
                    ? "text-blue-500"
                    : service.color === "purple"
                    ? "text-purple-500"
                    : "text-cyan-500"
                }`}
              >
                {service.icon}
              </div>

              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-muted-foreground mb-6">
                {service.description}
              </p>

              <ul className="space-y-3 mb-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span
                      className={`mt-1 ${
                        service.color === "blue"
                          ? "text-blue-500"
                          : service.color === "purple"
                          ? "text-purple-500"
                          : "text-cyan-500"
                      }`}
                    >
                      ✓
                    </span>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
