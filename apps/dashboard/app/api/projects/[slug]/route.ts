import { NextRequest, NextResponse } from "next/server";
import { updateProject } from "@/lib/projects";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const patch = await req.json();

  try {
    const project = await updateProject(slug, patch);
    return NextResponse.json({ project });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
