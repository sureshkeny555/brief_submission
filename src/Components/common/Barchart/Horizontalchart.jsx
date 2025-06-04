import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { stage: "study 03", progress: 100, status: "Completed" },
  { stage: "study 02", progress: 100, status: "Completed" },
  { stage: "study 01", progress: 80, status: "In Progress" },
];
const datas = [
  { stages: "Br...", progress: 100, status: "Completed" },
  { stages: "Bui...", progress: 100, status: "Completed" },
  { stages: "POC...", progress: 80, status: "In Progress" },
  { stages: "Que...", progress: 50, status: "In Progress" },
  { stages: "Sam...", progress: 40, status: "In Progress" },
  { stages: "Fie...", progress: 30, status: "In Progress" },
  { stages: "Dat...", progress: 20, status: "Not Started" },
  { stages: "Rep...", progress: 10, status: "Not Started" }
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        style={{
          background: "black",
          color: "#fff !important",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <p style={{ color: "#FBFBFF" }}>
          <strong>Stage Name:</strong> {data.stage}
        </p>
        <p style={{ color: "#FBFBFF" }}>
          <strong>Status:</strong> {data.status}
        </p>
        <p style={{ color: "#FBFBFF" }}>
          <strong>Progress:</strong> {data.progress}%
        </p>
        {data.assignedTo && (
          <p>
            <strong>Study Allocated to:</strong> {data.assignedTo}
          </p>
        )}
      </div>
    );
  }
  return null;
};

const BarchartHorizontal = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleMouseOver = (index) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          cursor={{ fill: "transparent" }}
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="1 0" />
          <YAxis dataKey="stage" type="category" width={80} />
          <XAxis type="category" dataKey="stages" />
         <Tooltip cursor={{ fill: "transparent" }} content={<CustomTooltip />} />
          
          <Bar
            dataKey="progress"
            fill="#48ABFF"
            barSize={25}
            radius={[5, 5, 5, 5]}
          />
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={index === activeIndex ? "#48AAFE" : "#D6EBFF"}
              onMouseOver={() => handleMouseOver(index)}
              onMouseLeave={handleMouseLeave}
              style={{
                cursor: "pointer",
                transition: "fill 0.3s ease",
              }}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarchartHorizontal;
