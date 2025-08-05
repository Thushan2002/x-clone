import Post from "./Post";
import PostSkeleton from "../skeleton/PostSkeleton";
import { POSTS } from "../../utils/db/dummy";
import baseUrl from "../../constatant/url";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({ feedType }) => {
  const getPostEndpoint = () => {
    switch (feedType) {
      case "forYou":
        return `${baseUrl}/api/post/allPosts`;
      case "following":
        return `${baseUrl}/api/post/FollowingPosts`;
      default:
        return `${baseUrl}/api/post/allPosts`;
    }
  };

  const POST_ENDPOINT = getPostEndpoint();

  const {
    data: posts = [],
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["posts", feedType], // include feedType so it changes when switching tabs
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT, {
          method: "GET",
          credentials: "include", // include cookies
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.error || "Something went wrong");
        }
        console.log("posts date:", data.posts[0].createdAt);

        if (Array.isArray(data)) {
          return data;
        } else if (Array.isArray(data.posts)) {
          return data.posts;
        } else {
          return []; // fallback
        }
      } catch (error) {
        console.log("Fetch error:", error.message);
        return []; // Return empty array to prevent crash
      }
    },
    retry: false,
  });

  useEffect(() => {
    refetch();
  }, [feedType, refetch]);

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && posts?.length === 0 ? (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      ) : (
        <div>
          {posts?.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
