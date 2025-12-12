import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const volumeData = [
    { name: "06h", camions: 12 },
    { name: "08h", camions: 45 },
    { name: "10h", camions: 68 },
    { name: "12h", camions: 55 },
    { name: "14h", camions: 40 },
    { name: "16h", camions: 72 },
    { name: "18h", camions: 38 },
];

const productData = [
    { name: "Ciment", value: 400, color: "#0097e6" },
    { name: "Gravier", value: 300, color: "#fbc531" },
    { name: "Sable", value: 300, color: "#4cd137" },
    { name: "Clinker", value: 200, color: "#e84118" },
];

export function VolumeChart() {
    return (
        <Card className="h-[400px]">
            <CardHeader>
                <CardTitle>Volume de Camions par Heure</CardTitle>
            </CardHeader>
            <CardContent className="h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={volumeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorCamions" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0097e6" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#0097e6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#718093" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#718093" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dcdde1" />
                        <Tooltip
                            contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #dcdde1" }}
                            itemStyle={{ color: "#2f3640" }}
                        />
                        <Area type="monotone" dataKey="camions" stroke="#0097e6" strokeWidth={2} fillOpacity={1} fill="url(#colorCamions)" />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export function ProductDistributionChart() {
    return (
        <Card className="h-[400px]">
            <CardHeader>
                <CardTitle>Répartition par Produit</CardTitle>
            </CardHeader>
            <CardContent className="h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={productData}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {productData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export function WaitTimeChart() {
    return (
        <Card className="h-[400px]">
            <CardHeader>
                <CardTitle>Temps d'Attente Moyen</CardTitle>
            </CardHeader>
            <CardContent className="h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={volumeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{ fill: 'transparent' }} />
                        <Bar dataKey="camions" fill="#2f3640" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
