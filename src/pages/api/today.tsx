import { retrieveContributionData } from "@/module/github";
import { ImageResponse } from "next/server";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function og(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const userName = searchParams.get("userName");

  if (!userName) {
    return new Response("userName is required", {
      status: 400,
    });
  }

  const contributes = await retrieveContributionData(userName);

  const { weeks } =
    contributes.data.user.contributionsCollection.contributionCalendar;

  const lastWeek = weeks.slice(-1)[0];
  const lastDay = lastWeek.contributionDays.slice(-1)[0];

  const today = new Date(lastDay.date);
  const formatDate = `${today.getFullYear()}年${
    today.getMonth() + 1
  }月${today.getDate()}日`;

  const contributionCount = lastDay.contributionCount;

  const emoji =
    contributionCount <= 0
      ? "🫥"
      : contributionCount <= 10
      ? "💪"
      : contributionCount <= 30
      ? "🎉"
      : "🫠";

  return new ImageResponse(
    (
      <div
        style={{
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {formatDate}
        {emoji} {contributionCount}コントリビュートしました！
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
