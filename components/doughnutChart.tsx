"use client";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ["#074756", "#2265d8", "#2f91fa", "#4db8ff", "#80ccff"];

const DoughnutChart = ({ accounts }: DoughnutChartProps) => {
	const balances = accounts.map((acc) => acc.currentBalance);
	const labels = accounts.map((acc) => acc.name || "Account");

	const hasData = balances.some((b) => b > 0);

	const data = {
		datasets: [
			{
				label: "Banks",
				data: hasData ? balances : [1],
				backgroundColor: hasData
					? balances.map((_, i) => COLORS[i % COLORS.length])
					: ["#e5e7eb"],
			},
		],
		labels: hasData ? labels : ["No data"],
	};

	return (
		<Doughnut
			data={data}
			options={{
				cutout: "60%",
				plugins: {
					legend: {
						display: false,
					},
				},
			}}
		/>
	);
};

export default DoughnutChart;
