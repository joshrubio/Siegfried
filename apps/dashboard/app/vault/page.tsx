import SearchBox from "@/components/SearchBox";

export default function VaultIndexPage() {
  return (
    <main className="max-w-2xl px-8 py-10">
      <h1 className="text-xl font-semibold">Vault</h1>
      <p className="text-sm text-muted-foreground mt-1 mb-6">
        Elige una nota en la barra lateral, o pregunta algo en lenguaje natural.
      </p>
      <SearchBox />
    </main>
  );
}
