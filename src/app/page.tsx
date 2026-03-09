import ClientRoot from "@/components/ClientRoot";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  return (
    <div>
      <ClientRoot />
    </div>
  );
}
