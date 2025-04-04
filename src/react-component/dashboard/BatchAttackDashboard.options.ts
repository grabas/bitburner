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
    tooltip: {
        theme: "dark",
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
    tooltip: {
        theme: "dark",
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

export const getDesyncChartOptions = () => ({
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
    tooltip: {
        theme: "dark",
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