import React from 'react';
import { 
    TrendingUp, 
    ShoppingBag, 
    Users, 
    DollarSign, 
    Package,
    MoreHorizontal
} from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart, 
    Bar,
    PieChart, 
    Pie, 
    Cell 
} from 'recharts';

// --- MOCK DATA ---
const monthlyRevenue = [
    { name: 'Jan', earnings: 30, expense: 15 },
    { name: 'Feb', earnings: 40, expense: 20 },
    { name: 'Mar', earnings: 35, expense: 18 },
    { name: 'Apr', earnings: 50, expense: 25 },
    { name: 'May', earnings: 45, expense: 22 },
    { name: 'Jun', earnings: 60, expense: 30 },
    { name: 'Jul', earnings: 65, expense: 35 },
    { name: 'Aug', earnings: 55, expense: 28 },
    { name: 'Sep', earnings: 48, expense: 24 },
];

const productSales = [
    { name: 'Burgers', value: 45 },
    { name: 'Pizza', value: 25 },
    { name: 'Drinks', value: 20 },
    { name: 'Others', value: 10 },
];
const PIE_COLORS = ['#9e1c20', '#3b82f6', '#f59e0b', '#10b981'];

const recentOrders = [
    { id: '#1001', item: 'Spicy Beef Burger', date: '2 mins ago', price: 15.00, status: 'Cooking', statusColor: 'bg-yellow-100 text-yellow-700' },
    { id: '#1002', item: 'Seafood Pizza XL', date: '15 mins ago', price: 28.50, status: 'Delivering', statusColor: 'bg-blue-100 text-blue-700' },
    { id: '#1003', item: 'Coca Cola x2', date: '32 mins ago', price: 5.00, status: 'Completed', statusColor: 'bg-green-100 text-green-700' },
    { id: '#1004', item: 'Fried Chicken Set', date: '1 hour ago', price: 12.00, status: 'Cancelled', statusColor: 'bg-red-100 text-red-700' },
];

const Dashboard = () => {
    return (
        <div className="p-6 bg-[#f4f7fe] min-h-screen ml-64 font-['Poppins'] text-gray-800">
            
            {/* TOP CARDS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                
                {/* Card 1: Revenue (Style Modernize: Icon bên trái, Số to) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-transparent hover:shadow-lg transition-shadow relative overflow-hidden">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Earnings</p>
                            <h4 className="text-2xl font-bold text-gray-800">$24,500</h4>
                        </div>
                    </div>
                    {/* Decorative Circle */}
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-50 rounded-full opacity-50 blur-xl"></div>
                </div>

                {/* Card 2: Orders */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-transparent hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600">
                            <ShoppingBag size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Orders</p>
                            <h4 className="text-2xl font-bold text-gray-800">1,245</h4>
                        </div>
                    </div>
                </div>

                {/* Card 3: Customers */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-transparent hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">New Customers</p>
                            <h4 className="text-2xl font-bold text-gray-800">342</h4>
                        </div>
                    </div>
                </div>

                {/* Card 4: Total Menu Items */}
                <div className="bg-[#9e1c20] p-6 rounded-2xl shadow-sm border border-transparent hover:shadow-lg transition-shadow text-white relative overflow-hidden">
                    <div className="flex items-center gap-4 z-10 relative">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white">
                            <Package size={24} />
                        </div>
                        <div>
                            <p className="text-white/80 text-sm font-medium">Menu Items</p>
                            <h4 className="text-2xl font-bold">56</h4>
                        </div>
                    </div>
                    {/* Decoration */}
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full"></div>
                </div>
            </div>

            {/* MIDDLE SECTION: CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                
                {/* 1. Revenue Updates (Chart lớn bên trái - chiếm 2/3) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Revenue Updates</h3>
                            <p className="text-sm text-gray-500">Monthly earnings overview</p>
                        </div>
                        <select className="border border-gray-200 rounded-lg text-sm p-1.5 text-gray-600 bg-gray-50 outline-none">
                            <option>This Year</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    
                    <div className="h-87.5 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyRevenue}>
                                <defs>
                                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#9e1c20" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#9e1c20" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} 
                                    cursor={{fill: 'transparent'}}
                                />
                                <Area type="monotone" dataKey="earnings" stroke="#9e1c20" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
                                <Area type="monotone" dataKey="expense" stroke="#3b82f6" strokeWidth={3} fillOpacity={0} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Sales Breakdown (Chart tròn bên phải - chiếm 1/3) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Sales by Category</h3>
                    <div className="flex-1 flex items-center justify-center relative">
                        <div className="h-62.5 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={productSales}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {productSales.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center Text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-black text-gray-800">$24k</span>
                                <span className="text-xs text-gray-500">Sales</span>
                            </div>
                        </div>
                    </div>
                    {/* Legend */}
                    <div className="space-y-3 mt-4">
                        {productSales.map((item, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index] }}></div>
                                    <span className="text-gray-600">{item.name}</span>
                                </div>
                                <span className="font-bold text-gray-800">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* BOTTOM SECTION: RECENT TRANSACTIONS & TOP PRODUCTS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Recent Transactions Table */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Recent Transactions</h3>
                        <button className="text-[#9e1c20] text-sm font-bold hover:bg-red-50 px-3 py-1 rounded-lg transition-colors">
                            View All
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-xs text-gray-400 uppercase font-semibold border-b border-gray-100">
                                <tr>
                                    <th className="pb-3 pl-2">Order ID</th>
                                    <th className="pb-3">Product Name</th>
                                    <th className="pb-3">Time</th>
                                    <th className="pb-3">Price</th>
                                    <th className="pb-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                                        <td className="py-4 pl-2 font-bold text-gray-800">{order.id}</td>
                                        <td className="py-4 font-medium text-gray-700">{order.item}</td>
                                        <td className="py-4 text-gray-500">{order.date}</td>
                                        <td className="py-4 font-bold text-[#9e1c20]">${order.price.toFixed(2)}</td>
                                        <td className="py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.statusColor}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Monthly Earnings Bar Chart (Thêm cái này cho giống theme eCommerce) */}
                <div className="bg-[#9e1c20] p-6 rounded-2xl shadow-sm text-white flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold">Monthly Earnings</h3>
                        <p className="text-white/70 text-sm mb-6">Total earnings this month</p>
                        <h2 className="text-4xl font-black mb-2">$6,820</h2>
                        <span className="bg-white/20 text-xs px-2 py-1 rounded-lg">+12% last month</span>
                    </div>

                    <div className="h-40 w-full mt-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyRevenue.slice(0, 5)}>
                                <Bar dataKey="earnings" fill="rgba(255,255,255,0.8)" radius={[4, 4, 4, 4]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;