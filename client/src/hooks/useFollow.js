import toast from "react-hot-toast";
import baseUrl from "../constatant/url";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { data } from "react-router-dom";

const useFollow = () => {
    const queryClient = useQueryClient()
    const { mutate: follow, isPending } = useMutation({
        mutationFn: async (userId) => {
            try {
                const res = await fetch(`${baseUrl}/api/user/follow/${userId}`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                const data = await res.json();

                if (!res.ok || data.error) {
                    throw new Error(data.error || "Failed to delete post");
                }
                return data;
            } catch (error) {

            }
        }, onSuccess: () => {
            toast.success(data.message);
            Promise.all([
                queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
                queryClient.invalidateQueries({ queryKey: ["authUser"] })
            ])
        },
        onError: () => {
            toast.error(error.message)
        }
    })
    return { follow, isPending }
}

export default useFollow