export default function SectionTitle({
    eyebrow,
    title,
    description,
}: {
    eyebrow: string;
    title: string;
    description: string;
}) {
    return (
        <div>
            <p className="text-xs font-black tracking-[0.18em] text-orange-500 uppercase">
                {eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.035em] sm:text-3xl">
                {title}
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {description}
            </p>
        </div>
    );
}
