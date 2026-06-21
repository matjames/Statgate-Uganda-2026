import { buttonVariants } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowRight, ShieldCheck, Users, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(#003366_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary"
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            {t("hero.badge")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 text-4xl font-bold tracking-tight text-primary sm:text-6xl font-serif"
          >
            {t("hero.title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-10 max-w-2xl text-lg text-muted-foreground"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
          >
            <Link to="/recruitment" className={`${buttonVariants({ size: "lg" })} bg-primary hover:bg-primary/90 text-white px-8`}>
              {t("hero.cta_agent")} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link to="/dashboard" className={`${buttonVariants({ variant: "outline", size: "lg" })} border-primary text-primary hover:bg-primary/5 px-8`}>
              {t("hero.cta_vendor")}
            </Link>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div className="mt-24 grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              icon: Users,
              title: "Agent Deployment",
              description: "Real-time tracking and reporting for field agents across all regions.",
            },
            {
              icon: ShieldCheck,
              title: "Ethical Compliance",
              description: "Built-in consent tracking and ethical guidelines for every research project.",
            },
            {
              icon: BarChart3,
              title: "Transparent Ledger",
              description: "End-to-end financial tracking for vendor payments and agent reimbursements.",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-primary">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
