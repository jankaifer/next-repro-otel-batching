import Link from "next/link";

/** Add your relevant code here for the issue to reproduce */
export default function Home() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Link href="/simple">Simple</Link>
      <Link href="/batched">Batched</Link>
    </div>
  );
}
