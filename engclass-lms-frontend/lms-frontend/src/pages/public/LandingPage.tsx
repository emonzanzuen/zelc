import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";
import { Hero } from "@/components/sections/Hero";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { TrendingCourses } from "@/components/sections/TrendingCourses";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTASection } from "@/components/sections/CTASection";
import { fetchCourses, fetchCategories } from "@/lib/api";
import { testimonials, faqs } from "@/lib/mockData";
import type { Course, Category } from "@/types";

export default function LandingPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCourses({ limit: 12 }).then((res) => setCourses(res.courses));
    fetchCategories().then(setCategories);
  }, []);

  return (
    <Layout>
      <Hero />
      <MarqueeBanner />
      <CategoryGrid categories={categories} />
      <TrendingCourses courses={courses} />
      <FeaturesSection />
      <Testimonials items={testimonials} />
      <FAQSection items={faqs} />
      <CTASection />
    </Layout>
  );
}
