interface Props {
  title: string;
  id?: string;
}

/** Título de seção no padrão do site de referência: centralizado + separador turquesa. */
export default function SectionHeading({ title, id }: Props) {
  return (
    <div className="text-center mb-10 md:mb-14">
      <h2
        id={id}
        className="text-[30px] md:text-[40px] font-light text-foreground leading-tight break-words"
      >
        {title}
      </h2>
      <hr className="w-14 h-[3px] bg-primary border-0 mx-auto mt-4 rounded-full" />
    </div>
  );
}