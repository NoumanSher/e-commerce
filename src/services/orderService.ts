import apiClient from "@/lib/apiClient";

export interface OrderResponse {
    success: boolean;
    message: string;
    data: {
        _id: string;
        orderNo: string;
        totalPrice: number;
        paymentMethod: string;
        status: string;
        address: {
            firstName: string;
            lastName: string;
            streetAddress: string;
            city: string;
            zipCode: string;
            phone: string;
            email: string;
        };
    };
}

export const orderService = {
    getUserAddress: async (userId: string) => {
        const response = await apiClient.get<any>(`/order/userAdress/${userId}`);
        return response.data;
    },

    getSingleOrder: async (orderNumber: string): Promise<OrderResponse> => {
        const response = await apiClient.get<OrderResponse>(`/order/user-single-order/${orderNumber}`);
        return response.data;
    },

    createOrder: async (payload: any) => {
        const response = await apiClient.post<any>("/order", payload);
        return response.data;
    },

    getOrdersByUserId: async (userId: string) => {
        const response = await apiClient.get<any>(`/order/user-all-orders/${userId}`);
        return response.data;
    }
};
