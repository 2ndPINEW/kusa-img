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

  const width = weeks.length * 10;

  const weekItems = weeks.map((week) => {
    return week.contributionDays.map((day) => {
      return (
        <div
          key={day.date}
          style={{
            width: "10px",
            height: "10px",
            backgroundColor: day.color,
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
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {weekItems}
      </div>
    ),
    {
      width: width,
      height: 70,
    }
  );
}
