import { useCallback, useEffect, useState } from "react";
import { BillsItemList } from "../../../interfaces/bill";
import { Order } from "../../../interfaces/order";
import billService from "../../../services/bill.service";
import orderService from "../../../services/order.service";
import { displayMsg } from "../../../utils/toast";

export default function Orders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [bills, setBills] = useState<BillsItemList[]>([]);

    const fetchOrders = useCallback(async () => {
        try {
            const res = await orderService.getOrders();
            setOrders(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    }, []);

    const fetchBills = useCallback(async () => {
        try {
            const res = await billService.getBills();
            setBills(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    }, []);

    useEffect(() => {
        Promise.all([fetchOrders(), fetchBills()]);
    }, []);

    return (
        <div className="container mx-auto flex flex-col p-5 md:p-0 md:py-10 gap-5">
            <div className="flex flex-col gap-5">
                <div>
                    <h1 className="text-2xl">Orders history</h1>
                </div>
                {orders.length === 0 ? (
                    <p>You have no order</p>
                ) : (
                    <>
                        {/* <div className="flex flex-col gap-2">
                            {orders.map((o, idx) => (
                                <OrderItem
                                    key={idx}
                                    order={o}
                                    bill={bills.find((b) => b._id === o.billId)}
                                />
                            ))}
                        </div> */}
                        <div className="overflow-x-auto border border-1 border-slate-300 rounded rounded-md">
                            <table className="table">
                                {/* head */}
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Name</th>
                                        <th>Job</th>
                                        <th>Favorite Color</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* row 1 */}
                                    <tr className="bg-base-200 hover">
                                        <th>1</th>
                                        <td>Cy Ganderton</td>
                                        <td>Quality Control Specialist</td>
                                        <td>Blue</td>
                                    </tr>
                                    {/* row 2 */}
                                    <tr>
                                        <th>2</th>
                                        <td>Hart Hagerty</td>
                                        <td>Desktop Support Technician</td>
                                        <td>Purple</td>
                                    </tr>
                                    {/* row 3 */}
                                    <tr>
                                        <th>3</th>
                                        <td>Brice Swyre</td>
                                        <td>Tax Accountant</td>
                                        <td>Red</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
