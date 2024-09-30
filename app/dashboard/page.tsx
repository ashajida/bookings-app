"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react"
import { ChartContainer, type ChartConfig, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, Line, LineChart, } from "recharts";
import { validateRequest } from "@/lib/validateRequest";
import { findAllBookings, findAllBookingsWithoutFilter } from "@/lib/utils/services/booking/booking-services";

const Dashboard = () => {

  type BookingsData = {
    date: Date,
    count: number
  }
  
  const [bookingsData, setBookingsData] = useState<BookingsData[]>([]);

  const chartData = [
    { month: "January", desktop: 0 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
  ]
  
    useEffect(() => {
      const getData = async () => {
        const grouped = [] as {}[];
        const appointmentData = await findAllBookingsWithoutFilter('lashesbykelly');
        if(!appointmentData) return;
  
        const groupedByDateCount = appointmentData.reduce((acc, item) => {
          // Convert date to YYYY-MM-DD format
          const dateString = item.date.toISOString().split('T')[0];
        
          // Check if the date already exists in the accumulator
          if (!acc[dateString]) {
            acc[dateString] = { date: item.date.toDateString(), count: 0 }; // Initialize count object if it doesn't exist
          }
        
          // Increment the count for that date
          acc[dateString].count++;
        
          return acc; // Return the accumulator for the next iteration
        }, {});
        
        // Convert the grouped result to an array of objects
        const resultArray = Object.values(groupedByDateCount) as BookingsData[];
  
        setBookingsData(resultArray);
        
        console.log(resultArray);
      }
  
      getData();
  
  
    }, [])


  const chartConfig = {
    count: {
      label: "Appointments",
      color: "hsl(var(--chart-1))",
    }
  } satisfies ChartConfig;

  const lineChartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  return (
    <div className="grid grid-cols-3">
      <div className="col-span-1">
      <ChartContainer config={chartConfig} className="min-h-[200px]">
          <BarChart accessibilityLayer data={bookingsData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" fill="var(--color-count)" radius={8} />
          </BarChart>
        </ChartContainer>
      </div>
      <div className="col-span-1">
             <ChartContainer config={lineChartConfig} className="min-h-[200px]">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="desktop"
              type="linear"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default Dashboard;
