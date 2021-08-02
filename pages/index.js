import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(
    () => import("../components/container"),
    { ssr: false }
);

export default function Home() {
    return (
        <>
            <DynamicComponentWithNoSSR />
        </>
    );
}
