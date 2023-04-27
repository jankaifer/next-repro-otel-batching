import Link from "next/link";

/** Add your relevant code here for the issue to reproduce */
export default function Home() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Link href="/simple/console">Simple Console</Link>
      <Link href="/simple/http">Simple HTTP</Link>
      <Link href="/simple/grpc">Simple GRPC</Link>
      <Link href="/batched/console">Batched Console</Link>
      <Link href="/batched/http">Batched HTTP</Link>
      <Link href="/batched/grpc">Batched GRPC</Link>
    </div>
  );
}
