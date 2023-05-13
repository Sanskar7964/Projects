import React from "react";
import { useTheme} from "@mui/material";
import regression from"regression";
import { useGetKpisQuery } from "@/state/api";
import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";
import {Typography, Box, Button} from "@mui/material";
import {useMemo, useState } from "react";
import {
    ResponsiveContainer,
    CartesianGrid,
    AreaChart,
    BarChart,
    Bar,
    LineChart,
    XAxis,
    YAxis,
    Legend,
    Line,
    Tooltip,
    Area,
    Label,
  } from "recharts";
  import { DataPoint } from "regression";

type Props = object;

const Predictions  = (props: Props)=>
{const {palette}= useTheme();
const [isPredictions, setIsPredictions] = useState(false);
const {data: kpiData} = useGetKpisQuery();
   
const formattedData = useMemo(() => {
    if (!kpiData) return [];
    const monthData = kpiData[0].monthlyData;

    const formatted: Array<DataPoint> = monthData.map(
      ({ revenue }, i: number) => {
        return [i, revenue];
      }
    );
    const regressionLine = regression.linear(formatted);

    return monthData.map(({ month, revenue }, i: number) => {
      return {
        name: month,
        "Actual Revenue": revenue,
        "Regression Line": regressionLine.points[i][1],
        "Predicted Revenue": regressionLine.predict(i + 12)[1],
      };
    });
  }, [kpiData]);


return (<DashboardBox
    width="100%"
    height = "100%"
    p = "1rem"
    overflow = "hidden"
    >
<FlexBetween
m = "1rem 2.5rem"
>
<Box>  
    <Typography variant = "h3">
        Revenue and predictions 
    </Typography>
    <Typography variant = "h6">
        charted revenue and predicted revenue based on a simple linear regression model </Typography>
</Box>

<Button onClick={()=> setIsPredictions(!isPredictions)
}  sx={{
    color: palette.grey[900] ,
    bgcolor: palette.grey[700],
    boxShadow: "0.1rem 0.1rem 0.1rem 0.1rem  rgba(0,0,0,0.4"
}}
> </Button>
</FlexBetween>
        
<ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={400}
              data={formattedData}
              margin={{
                top: 20,
                right: 0,
                left: -10,
                bottom: 55,
              }}
            >
              <CartesianGrid  strokeDasharray="3 3" stroke={palette.grey[800]} />
              <XAxis
                dataKey="name"
                tickLine={false}
                style={{ fontSize: "10px" }}
              >
                <Label value="Month" offset = {-5} position="insideBottom"/>
              </XAxis>
              
              <YAxis
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                style={{ fontSize: "10px" }}
                tickFormatter = {(v)=>`$${v}`}> 
                <Label value="Revenue in USD" angle={-90} offset = {-5} position="insideBottom"/>
                </YAxis>
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                style={{ fontSize: "10px" }}
              />
              <Tooltip />
              <Legend
              verticalAlign = "top"
              />
              <Line
             
                type="monotone"
                dataKey="Actual Revenue"
                stroke={palette.primary.main}
                strokeWidth = {0}
                dot ={{strokeWidth: 5}}
              />
              <Line
              
                type="monotone"
                dataKey="revenue"
                stroke="#8884d9"
                dot ={false}
              />
                {isPredictions &&( 
                <Line
              type="monotone"
              dataKey="predictedRevenue"
              stroke={palette.secondary[500]}
            />

                )}
                
            </LineChart>
          </ResponsiveContainer>
    </DashboardBox>
   
   )
};

export default Predictions;