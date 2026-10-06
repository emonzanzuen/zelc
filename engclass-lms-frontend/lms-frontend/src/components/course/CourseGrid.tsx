import type { Course } from "@/types";
import { CourseCard } from "./CourseCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function CourseGrid({ courses }: { courses: Course[] }) {
  const ref = useScrollReveal<HTMLDivElement>([courses]);
  return (
    <div ref={ref} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
