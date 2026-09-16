import { IconMap } from '@/lib/iconMap';

export default function HomeTestimonials() {
  const { star: Star } = IconMap.ui;

  const testimonials = [
    {
      id: 1,
      name: 'Lucía Martínez',
      role: 'Estudiante de desarrollo web',
      initials: 'LM',
      quote:
        'StudySync me ayudó a organizar mis sesiones y avanzar en proyectos que antes siempre dejaba incompletos.',
    },
    {
      id: 2,
      name: 'Andrés Gómez',
      role: 'Estudiante universitario',
      initials: 'AG',
      quote:
        'Las salas colaborativas y el Pomodoro compartido hicieron que estudiar fuera mucho más constante.',
    },
    {
      id: 3,
      name: 'Camila Rodríguez',
      role: 'Profesora de tecnología',
      initials: 'CR',
      quote:
        'Ahora puedo acompañar mejor a mis estudiantes, organizar cursos y revisar su progreso desde una sola plataforma.',
    },
  ];

  return (
    <section
      id="testimonios"
      className="border-border mx-auto w-[calc(100%-10vw)] scroll-mt-22 border-t py-27.5 max-[720px]:w-[calc(100%-40px)] max-[720px]:py-20"
    >
      <div className="mx-auto max-w-170 text-center">
        <span className="border-accent/25 bg-accent/10 text-accent mx-auto inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.75 text-xs font-extrabold tracking-[0.09em] uppercase">
          <Star size={15} fill="currentColor" aria-hidden="true" />
          Historias de progreso
        </span>

        <h2 className="text-foreground mt-4 text-[clamp(2.2rem,4vw,4rem)] leading-[1.06] font-bold tracking-[-0.055em]">
          Personas que ya estudian de otra manera
        </h2>

        <p className="text-foreground-muted mx-auto mt-4 max-w-170 text-sm leading-[1.75]">
          Experiencias de estudiantes y profesores que encontraron una forma más
          organizada de avanzar.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-3 gap-3.75 max-[960px]:grid-cols-1">
        {testimonials.map((testimonial) => (
          <article
            key={testimonial.id}
            className="border-border bg-surface rounded-2xl border p-6.25"
          >
            <div className="text-accent flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={15}
                  fill="currentColor"
                  aria-hidden="true"
                />
              ))}
            </div>

            <blockquote className="text-foreground mt-5.5 min-h-28.75 text-sm leading-[1.8]">
              “{testimonial.quote}”
            </blockquote>

            <footer className="border-border mt-6 flex items-center gap-2.75 border-t pt-4.5">
              <span className="from-primary to-accent text-primary-foreground grid size-10.5 place-items-center rounded-xl bg-linear-to-br text-xs font-extrabold">
                {testimonial.initials}
              </span>

              <div>
                <strong className="text-foreground block text-sm font-semibold">
                  {testimonial.name}
                </strong>

                <small className="text-foreground-muted mt-1 block text-xs">
                  {testimonial.role}
                </small>
              </div>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
