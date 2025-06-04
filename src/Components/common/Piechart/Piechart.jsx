import React, { useState } from "react";
import { useSelector } from "react-redux";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#48ABFF", "#FF8F6B", "#847EFA", "#FFCF51","#C37EFB","#FB7EA4","#4CC88E","#7E83FB"];
const COLORSSearch = ["#73E2A7", "#48ABFF"];

const CustomTooltip = ({ active, payload, activeTabDonut, selectedDept }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    console.log({data})
    const isDeptSelected = selectedDept;

    return (
      <div
        style={{
          background: "#414141",
          color: "#fff",
          padding: "10px",
          borderRadius: "5px",
          height: "auto",
        }}
      >
        <p style={{ color: "white", fontSize: "12px" }}>
          <strong>Department:</strong> {data.name}
        </p>

        {isDeptSelected ? (
          <>
            {data.status === "In Progress" ? (
              <p style={{ color: "white", fontSize: "12px" }}>
                <strong>In Progress:</strong> {data.value}
              </p>
            ) : (
              <p style={{ color: "white", fontSize: "12px" }}>
                <strong>Completed:</strong> {data.value}
              </p>
            )}
          </>
        ) : (
          <>
            {activeTabDonut === "study" ? (
              <p style={{ color: "white", fontSize: "12px" }}>
                <strong>Total Study:</strong> {data.budget}
              </p>
            ) : (
              <p style={{ color: "white", fontSize: "12px" }}>
                <strong>Total Budget:</strong> {data.budget}
              </p>
            )}
            <p style={{ color: "white", fontSize: "12px" }}>
              <strong>Percentage:</strong> {data.completedCountPercentage}%
            </p>
          </>
        )}
      </div>
    );
  }
  return null;
};

const renderLegend = (donutData, activeTabDonut, selectedDept, donutDataSearch) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      marginLeft: "20px",
      fontSize: "14px",
      fontFamily: "Open Sans",
    }}
  >
    {selectedDept ? (
      <>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 10,
              height: 10,
              backgroundColor: COLORSSearch[0],
              borderRadius: "30%",
              marginRight: 8,
            }}
          />
          <span style={{ fontSize: "14px", color: "#333", marginRight: 8 }}>
            Completed:
          </span>
          {donutDataSearch?.map((item) => (
            <span
              key={item.name}
              style={{ fontSize: "14px", fontWeight: "400", color: "#000" }}
            >
              {/* ₹&nbsp; */}
              {item.completedCountPercentage}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 10,
              height: 10,
              backgroundColor: COLORSSearch[1],
              borderRadius: "30%",
              marginRight: 8,
            }}
          />
          <span style={{ fontSize: "14px", color: "#333", marginRight: 8 }}>
            In Progress:
          </span>
          {donutDataSearch?.map((item) => (
            <span
              key={item.name}
              style={{ fontSize: "14px", fontWeight: "400", color: "#000" }}
            >
              {/* ₹&nbsp; */}
              {item.inprogress}
            </span>
          ))}
        </div>
      </>
    ) : (
      donutData.map((entry, index) => (
        <div
          key={`legend-${index}`}
          style={{ display: "flex", alignItems: "center" }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              backgroundColor: COLORS[index % COLORS.length],
              borderRadius: "30%",
              marginRight: 8,
            }}
          />
          <span style={{ fontSize: "14px", color: "#333", marginRight: 8 }}>
            {entry.name}
          </span>
          <span style={{ fontSize: "14px", fontWeight: "400", color: "#000" }}>
            {activeTabDonut === "study"
              ? `${entry.completedCountPercentage.toFixed(2)}%`
              : `₹ ${entry.budget.toFixed(2)}`}
          </span>
        </div>
      ))
    )}
  </div>
);

const DonutChart = ({ donutData, activeTabDonut, selectedDept }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const selecteddept = useSelector((state) => state?.briefs?.dashboardDonutchartValues?.stats);

  const donutValues = selecteddept
    ? Object.keys(selecteddept).filter((key) => key !== "all_department")
    : [];

  const donutDataSearch = donutValues.map((department) => ({
    name: department,
    inprogress: selecteddept[department]?.total_inprogress_count || 0,
    completedCountPercentage: selecteddept[department]?.completed_count || 0,
  }));

  const transformedDonutData = donutDataSearch.flatMap((department) => [
    {
      status: "Completed",
      value: department.completedCountPercentage,
      name: department.name,
    },
    {
      status: "In Progress",
      value: department.inprogress,
      name: department.name,
    },
  ]);
  const dataToDisplay = selectedDept ? transformedDonutData : donutData;

  const onPieEnter = (_, index) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(null);

  const RADIAN = Math.PI / 180;

  const getTransform = (cx, cy, midAngle, offset) => {
    const x = cx + offset * Math.cos(-midAngle * RADIAN);
    const y = cy + offset * Math.sin(-midAngle * RADIAN);
    return `translate(${x - cx}px, ${y - cy}px)`;
  };

  return (
    <div
      style={{
        width: "100%",
        height: 300,
        display: "flex",
        alignItems: "center",
      }}
    >
      {dataToDisplay && dataToDisplay.length > 0 && transformedDonutData.some(item => item.value > 0) ? (
  <ResponsiveContainer width="50%" height="100%">
    <PieChart>
      <Pie
        data={dataToDisplay}
        cx="50%"
        cy="50%"
        innerRadius={50}
        outerRadius={90}
        cornerRadius={4}
        paddingAngle={3}
        dataKey={selectedDept ? "value" : "completedCountPercentage"}
        onMouseLeave={onPieLeave}
      >
        {dataToDisplay.map((entry, index) => {
          const isActive = index === activeIndex;
          const midAngle =
            (360 *
              (dataToDisplay
                .slice(0, index)
                .reduce(
                  (acc, item) => acc + item.completedCountPercentage,
                  0
                ) +
                entry.completedCountPercentage / 2)) /
            dataToDisplay.reduce(
              (acc, item) => acc + item.completedCountPercentage,
              0
            );

          return (
            <Cell
              key={`cell-${index}`}
              fill={
                selectedDept
                  ? COLORSSearch[index % COLORSSearch.length]
                  : COLORS[index % COLORS.length]
              }
              onMouseEnter={() => onPieEnter(null, index)}
              style={{
                cursor: "pointer",
                transform: isActive
                  ? getTransform(200, 100, midAngle, 10)
                  : "translate(0, 0)",
                transition: "transform 0.3s ease, filter 0.3s ease",
                filter: isActive
                  ? "brightness(1.2) drop-shadow(0 4px 8px rgba(0,0,0,0.2))"
                  : "none",
              }}
            />
          );
        })}
      </Pie>
      <Tooltip
        content={
          <CustomTooltip
            activeTabDonut={activeTabDonut}
            selectedDept={selectedDept}
          />
        }
      />
    </PieChart>
  </ResponsiveContainer>
) : (
  <div
    style={{
      width: "50%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <span style={{ textAlign: "center", paddingTop: "100px", fontSize: "16px", color: "#4B5563" }}>No Data Found</span>
  </div>
)}

      <div
        style={{
          width:"150px",
          flex: 1,
          height: "100%",
          display: "flex",
          alignItems: "center",
          marginRight:"30px"
        }}
      >
        {transformedDonutData.some(item => item.value > 0) ? renderLegend(donutData, activeTabDonut, selectedDept, donutDataSearch) : ""}
      </div>
    </div>
  );
};

export default DonutChart;
