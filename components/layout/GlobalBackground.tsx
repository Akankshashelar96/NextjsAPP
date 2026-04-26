'use client';

import dynamic from 'next/dynamic';

const GlobalScene3D = dynamic(() => import('../three/GlobalScene3D'), {
    ssr: false,
    loading: () => null,
});

export default function GlobalBackground() {
    return <GlobalScene3D />;
}
