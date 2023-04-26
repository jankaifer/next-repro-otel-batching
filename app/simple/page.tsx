import { Component } from "../../component";

export const revalidate = 0;

export default function Page() {
  return <Component batched={false} />;
}
