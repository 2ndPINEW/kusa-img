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

  const width = weeks.length * 12;
  const height = 7 * 12;

  const weekItems = weeks.map((week) => {
    return week.contributionDays.map((day) => {
      return (
        <div
          key={day.date}
          style={{
            width: "10px",
            height: "10px",
            backgroundColor: day.color,
            margin: "1px",
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
