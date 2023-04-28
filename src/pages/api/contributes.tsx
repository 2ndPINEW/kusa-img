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

  const { totalContributions, weeks } =
    contributes.data.user.contributionsCollection.contributionCalendar;

  const size = 20;
  const margin = 2;

  const width = weeks.length * (size + margin * 2);
  const height = 7 * (size + margin * 2);

  const weekItems = weeks.map((week) => {
    return week.contributionDays.map((day) => {
      return (
        <div
          key={day.date}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: day.color,
            margin: `${margin}px`,
          }}
        ></div>
      );
    });
  });

  return new ImageResponse(
    (
      <div
        style={{
          background: "white",
          width: `${width}px`,
          height: `${height}px`,
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
        }}
      >
        {weekItems}
      </div>
    ),
    {
      width: width,
      height: height,
    }
  );
}
