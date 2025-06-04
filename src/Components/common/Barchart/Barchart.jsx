import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const statusLevels = ["Not Started", "In progress", "Completed"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        style={{
          width: "180px",
          height: "auto",
          background: "#414141",
          color: "#fff",
          padding: "10px",
          borderRadius: "5px",
          position: "relative",  
        }}
      >
        <p style={{ color: "white", fontSize: "12px" }}>
          <strong>Stage:</strong> {data.taskName}
        </p>
        <p style={{ color: "white", fontSize: "12px" }}>
          <strong>Status:</strong> {data.status}
        </p>
        <p style={{ color: "white", fontSize: "12px" }}>
          <strong>Action Date:</strong> {data.action_date}
        </p>
        <p style={{ color: "white", fontSize: "12px" }}>
          <strong>Study Allocated to</strong> {data.user_name}
        </p>
        <div
          style={{
            position: "absolute",
            left: "-10px",
            top: "50%",
            transform: "translateY(-50%)",
            width: 0,
            height: 0,
            borderTop: "10px solid transparent",
            borderBottom: "10px solid transparent",
            borderRight: "10px solid #414141",
          }}
        />
      </div>
    );
  }
  return null;
};

const Barchart = ({ countvaluesProgress, selectedStudy }) => {
  // console.log({ countvaluesProgress });

  const studyname = countvaluesProgress?.response?.progress_overview;
  const study = studyname ? Object.keys(studyname)[0] : [];
  const bardata = studyname ? studyname[study].tasks : [];
  const allocte_to = studyname ? studyname[study].allocated_users : [];
  const user_name = allocte_to.map((item) => item.username);
  const yaxisdata = Object.keys(bardata);

  const chartData = yaxisdata.map((taskName) => {
    const task = bardata[taskName];
    const progress = task.progress || 0;
    const action_date = task.action_date || "No Date";

    let status = "Not Started";
    if (progress === 100 || task.status === "Completed") {
      status = "Completed";
    } else if (
      (progress > 0 && progress < 100) ||
      task.status === "In progress"
    ) {
      status = "In progress";
    }

    const statusValue = statusLevels.indexOf(status) + 1;

    return {
      stage: taskName.length > 3 ? taskName.slice(0, 3) + "" : taskName,
      statusValue,
      taskName,
      action_date,
      user_name,
      status,
    };
  });

  const [activeIndex, setActiveIndex] = useState(null);

  const handleMouseOver = (index) => setActiveIndex(index);
  const handleMouseLeave = () => setActiveIndex(null);

  return (
    <div style={{ width: "100%", height: 300 }}>
  {chartData && chartData.length > 0 ? (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
      >
        <XAxis
          type="category"
          dataKey="stage"
          tick={{ fill: "#4B5563", fontSize: 14 }}
          axisLine={false}
          tickLine={false}
          label={{
            value: "Stages",
            angle: 0,
            position: "",
            dx: -20,
            dy: 12,
            style: {
              textAnchor: "middle",
              fill: "#4B5563",
              fontSize: 14,
              fontWeight: "700",
              fontFamily: "Open Sans",
            },
          }}
        />
        <YAxis
          type="number"
          domain={[4, 0]}
          ticks={[1, 2, 3]}
          tickFormatter={(tick) => statusLevels[tick - 1]}
          tick={{ fill: "#4B5563", fontSize: 14 }}
          width={85}
          axisLine={false}
          tickLine={false}
          label={{
            value: "Progress",
            angle: -90,
            position: "insideLeft",
            dx: -50,
            style: {
              textAnchor: "middle",
              fill: "#4B5563",
              fontSize: 14,
              fontWeight: "700",
              fontFamily: "Open Sans",
            },
          }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
        <Bar dataKey="statusValue" barSize={35} radius={[5, 5, 5, 5]} minPointSize={12}>
          {chartData.map((entry, index) => (
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
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  ) : (
    <div style={{ textAlign: "center", paddingTop: "100px", fontSize: "16px", color: "#4B5563" }}>
      No data found
    </div>
  )}
</div>

  );
};

export default Barchart;
