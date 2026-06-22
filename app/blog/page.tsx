import { getAllArticles } from "@/lib/articles";
import { PostList } from "@/components/post-list";
import { BackLink } from "@/components/back-link";

export const metadata = { title: "Blog" };

export default async function Page() {
  const articles = await getAllArticles();
  return (
    <div>
      <BackLink href="/" label="← Home" />
      <div className="mt-6">
        <PostList articles={articles} />
      </div>
    </div>
  );
}
