import { retrieveContributionData } from "@/module/github";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const userName = searchParams.get("userName");

  if (!userName) {
    return new Response("userName is required", {
      status: 400,
    });
  }

  const contributes = await retrieveContributionData(userName);

  return new Response(JSON.stringify(contributes), {
    headers: {
      "content-type": "application/json",
    },
  });
}
