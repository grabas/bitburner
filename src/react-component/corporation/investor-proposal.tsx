// InvestorProposalDashboard.tsx
import React, { useState, useCallback, useMemo } from "/react-component/react";
import ApexChart from "../chart/ApexChart";
import { NS } from "@ns";
import usePortListener from "/react-component/hooks/use-port-listener";

// Define the shape of an investor proposal.
export interface InvestorProposal {
    timestamp: string; // We'll add a timestamp when we push data.
    funds: number;
    shares: number;
    round: number;
}

// Set a port number where you'll feed in investor proposals.
const INVESTOR_PROPOSAL_PORT = 6100;

// This is the Dashboard component.
const InvestorProposalDashboard: React.FC<{ ns: NS }> = ({ ns }) => {
    // Store all received investor proposals.
    const [proposalData, setProposalData] = useState<InvestorProposal[]>([]);

    // Message handler: parse incoming JSON messages into InvestorProposal objects.
    const handleMessages = useCallback((newMessages: InvestorProposal[]) => {
        if (newMessages.length === 0) {
            setProposalData([]);
        } else {
            setProposalData((prev) => [...prev, ...newMessages]);
        }
    }, []);

    // Listen on the designated port. The hook parses using JSON.parse.
    usePortListener<InvestorProposal>(ns, INVESTOR_PROPOSAL_PORT, JSON.parse, handleMessages);

    // Split proposals by round (round 1, 2, and 3).
    const proposalsByRound = useMemo(() => {
        // Predefine empty arrays for rounds 1, 2, and 3.
        const rounds: Record<number, InvestorProposal[]> = { 1: [], 2: [], 3: [] };
        proposalData.forEach((proposal) => {
            // Only process rounds 1-3.
            if ([1, 2, 3].includes(proposal.round)) {
                rounds[proposal.round].push(proposal);
            }
        });
        // Sort each round's data by timestamp
        for (const round of [1, 2, 3]) {
            rounds[round] = rounds[round].sort(
                (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );
        }
        return rounds;
    }, [proposalData]);

    // Build chart series for a given round.
    // Here we display investor funds over time. (You can add another series for shares if you like.)
    const buildSeries = (data: InvestorProposal[]): { name: string; data: { x: number; y: number }[] }[] => {
        return [
            {
                name: "Investor Funds",
                data: data.map((item) => ({
                    x: new Date(item.timestamp).getTime(),
                    y: (item.funds / 1e9).toFixed(2)
                })),
            },
        ];
    };

    // Chart options common to all charts – we'll override the title per round.
    const chartOptions = {
        chart: {
            type: "line",
            animations: {
                enabled: true,
                easing: "linear",
                dynamicAnimation: { speed: 1000 },
            },
            toolbar: { show: false },
        },
        xaxis: {
            type: "datetime" as const,
            title: { text: "Time" },
            labels: { style: { colors: "#fff" } },
        },
        yaxis: {
            title: { text: "Funds" },
            labels: { style: { colors: "#fff" } },
        },
        tooltip: { theme: "dark" },
    };

    return (
        <div style={{ padding: "10px" }}>
            {/* Render a chart for each round */}
            {[1, 2, 3].map((round) => (
                <div key={round} style={{ marginBottom: "30px" }}>
                    <ApexChart
                        options={{ ...chartOptions, title: { text: `Investor Proposal - Round ${round}`, style: { color: "#fff" } } }}
                        series={buildSeries(proposalsByRound[round] || [])}
                    />
                </div>
            ))}
        </div>
    );
};

export default InvestorProposalDashboard;