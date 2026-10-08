import Link from "next/link";

export default function Footer() {
  return (
    <footer className="shrink-0 border-t px-5 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
      <p>Siegfried — development control plane for every satellite project.</p>
      <div className="flex items-center gap-4">
        <a
          href="https://github.com/joshrubio/Siegfried"
          target="_blank"
          rel="noreferrer"
          className="hover:text-foreground transition-colors"
        >
          Source
        </a>
        <Link href="/vault/docs/vault-conventions" className="hover:text-foreground transition-colors">
          Vault conventions
        </Link>
      </div>
    </footer>
  );
}
