import type { FC, SVGProps } from 'react';

const paths = {
    book: 'M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-2H4z M20 4h-4a3 3 0 0 0-3 3v14a4 4 0 0 1 4-2h3z',
    grid: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
    receipt: 'M5 3h14v18l-3-2-4 2-4-2-3 2z M9 8h6 M9 12h6',
    chart: 'M4 3v17h17 M8 15l4-5 4 2 5-7',
    plus: 'M12 5v14 M5 12h14',
    arrow: 'M5 12h14 M13 6l6 6-6 6',
    chevron: 'M9 5l7 7-7 7',
    down: 'M6 9l6 6 6-6',
    calendar: 'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z M16 3v4 M8 3v4 M3 11h18 M8 15h2 M14 15h2',
    wallet: 'M20 8V6a2 2 0 0 0-2-2H6a3 3 0 0 0 0 6h14v10H6a3 3 0 0 1-3-3V7 M20 13h-5v4h5',
    trend: 'M3 17l6-6 4 4 8-10 M15 5h6v6',
    clock: 'M12 8v4l3 2 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
    check: 'M5 12l4 4L19 6',
    save: 'M5 3h12l4 4v14H3V3z M7 3v6h10V3 M7 21v-8h10v8',
    trash: 'M3 6h18 M9 6V3h6v3 M5 6l1 15h12l1-15 M10 10v7 M14 10v7',
    edit: 'M15 5l4 4 M4 20l5-1L21 7l-5-5L4 14z',
    search: 'M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
    close: 'M6 6l12 12 M18 6L6 18',
    user: 'M20 21v-2a7 7 0 0 0-14 0v2 M17 7a5 5 0 1 1-10 0 5 5 0 0 1 10 0',
    lock: 'M5 10h14v11H5z M8 10V6a4 4 0 0 1 8 0v4 M12 14v3',
    eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12 M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
    eyeOff: 'M3 3l18 18 M10 5c7-2 12 7 12 7s-1 2-3 4 M6 6c-3 2-4 6-4 6s4 7 10 7c2 0 4-1 5-2 M10 10a3 3 0 0 0 4 4',
    info: 'M12 11v6 M12 7h.01 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
    exit: 'M9 4H4v16h5 M10 12h11 M17 8l4 4-4 4',
    spark: 'M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z',
} as const;

export type IconName = keyof typeof paths;

interface IconProps extends SVGProps<SVGSVGElement> {
    name: IconName;
    size?: number;
}

const Icon: FC<IconProps> = ({ name, size = 20, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
        <path d={paths[name]} />
    </svg>
);

export default Icon;
