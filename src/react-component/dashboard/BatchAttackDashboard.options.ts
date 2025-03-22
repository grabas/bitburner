export const getBatchOrderOptions = (categories: number[], colors: string[]) => ({
    chart: {
        type: "bar",
        height: 250,
        toolbar: {
            show: false,
        },
    },
    plotOptions: {
        bar: {
            distributed: true,
        },
    },
    dataLabels: {
        enabled: false,
    },
    xaxis: {
        categories: categories,
        labels: {
            show: false,
            style: {
                colors: "#fff",
            },
        },
    },
    yaxis: {
        labels: {
            style: {
                colors: "#fff",
            },
        },
    },
    title: {
        text: "Batch Order Desync",
        style: {
            color: "#fff",
        },
    },
    colors: colors,
    legend: {
        show: false,
    },
    responsive: [
        {
            breakpoint: 1000,
            options: {
                plotOptions: {
                    bar: {
                        horizontal: false,
                    },
                },
                legend: {
                    position: "bottom",
                    labels: {
                        colors: "#fff",
                    },
                },
            },
        },
    ],
});

export const getMoneyAndSecurityOptions = () => ({
    chart: {
        type: "line",
        height: 250,
        toolbar: {
            show: false,
        },
    },
    xaxis: {
        labels: {
            show: false,
            style: {
                colors: "#fff",
            },
        },
    },
    yaxis: {
        labels: {
            style: {
                colors: "#fff",
            },
        },
    },
    title: {
        text: "Money (%) and Security",
        style: {
            color: "#fff",
        },
    },
    legend: {
        position: "bottom",
        labels: {
            colors: ["#fff", "#fff"],
        },
    },
    responsive: [
        {
            breakpoint: 1000,
            options: {
                plotOptions: {
                    bar: {
                        horizontal: false,
                    },
                },
                legend: {
                    position: "bottom",
                    labels: {
                        colors: "#fff",
                    },
                },
            },
        },
    ],
});

export const desyncChartOptions = () => ({
    chart: {
        type: "line",
        height: 250,
        toolbar: {
            show: false,
        },
    },
    xaxis: {
        labels: {
            style: {
                colors: "#fff",
            },
        },
    },
    yaxis: {
        labels: {
            style: {
                colors: "#fff",
            },
        },
    },
    title: {
        text: "Script Desync (ms)",
        style: {
            color: "#fff",
        },
    },
    legend: {
        position: "bottom",
        labels: {
            colors: ["#fff", "#fff", "#fff"],
        },
    },
    responsive: [
        {
            breakpoint: 1000,
            options: {
                plotOptions: {
                    bar: {
                        horizontal: false,
                    },
                },
                legend: {
                    position: "bottom",
                    labels: {
                        colors: "#fff",
                    },
                },
            },
        },
    ],
});