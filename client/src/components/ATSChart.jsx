import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function ATSChart({ resumes }) {

    const data = {
        labels: resumes.map((_, index) => `Resume ${index + 1}`),
        datasets: [
            {
                label: "ATS Score",
                data: resumes.map((item) => item.atsScore),
                borderColor: "#3b82f6",
                backgroundColor: "#93c5fd",
                tension: 0.4,
            },
        ],
    };

    return <Line data={data} />;
}

export default ATSChart;