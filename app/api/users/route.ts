import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "public", "data", "users.json");

export async function GET() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const usersData = JSON.parse(data);
    return NextResponse.json(usersData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to read users data" }, { status: 500 });
  }
}